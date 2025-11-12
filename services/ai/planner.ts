import { findDatasetUrls } from './discoveryAgent';
import { analyzeUrlForAccessMethod } from './analysisAgent';
import { generateStrategy, generateFileStrategy } from './strategyAgent';
import { getCleaningSteps } from './refinementAgent';
import { validateLink, checkCrawlStatus, storeAIPlan } from '../validationService';
import type { DiscoveredLink } from '../../types';
import type { AgentActivity } from '../../components/AgentMonitor';

// Smart rate limiting configuration
const RATE_LIMIT_CONFIG = {
    delayBetweenCalls: 500, // 500ms between API calls
    maxRetries: 3,
    backoffMultiplier: 2,
};

// Event emitter for monitoring
type MonitorCallback = (activity: AgentActivity) => void;
let monitorCallback: MonitorCallback | null = null;

export function setMonitorCallback(callback: MonitorCallback | null) {
    monitorCallback = callback;
}

function emitActivity(activity: Omit<AgentActivity, 'timestamp'>) {
    if (monitorCallback) {
        monitorCallback({ ...activity, timestamp: Date.now() });
    }
}

// Exponential backoff retry with rate limiting
async function withRateLimit<T>(
    fn: () => Promise<T>,
    retryCount: number = 0
): Promise<T> {
    try {
        // Add delay between calls to prevent rate limiting
        if (retryCount > 0) {
            const delay = RATE_LIMIT_CONFIG.delayBetweenCalls * 
                Math.pow(RATE_LIMIT_CONFIG.backoffMultiplier, retryCount - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        return await fn();
    } catch (error: any) {
        // Check if it's a rate limit error
        const isRateLimit = error?.message?.includes('429') || 
                           error?.message?.includes('rate limit') ||
                           error?.message?.includes('quota');
        
        if (isRateLimit && retryCount < RATE_LIMIT_CONFIG.maxRetries) {
            console.warn(`Rate limit hit, retrying (${retryCount + 1}/${RATE_LIMIT_CONFIG.maxRetries})...`);
            return withRateLimit(fn, retryCount + 1);
        }
        
        throw error;
    }
}

// Add small delay between sequential operations
async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Web discovery orchestrator with validation and monitoring
export async function createFullIngestionPlan(datasetDescription: string): Promise<DiscoveredLink[]> {
    const startTime = Date.now();
    
    // Step 1: Discover potential URLs
    emitActivity({
        agent: 'discovery',
        status: 'working',
        message: 'Searching for dataset URLs...',
    });

    const discoveryResult = await withRateLimit(() => findDatasetUrls(datasetDescription));
    
    if (!discoveryResult.urls || discoveryResult.urls.length === 0) {
        emitActivity({
            agent: 'discovery',
            status: 'error',
            message: 'No URLs found',
            details: { duration: Date.now() - startTime }
        });
        return [];
    }

    emitActivity({
        agent: 'discovery',
        status: 'success',
        message: `Found ${discoveryResult.urls.length} potential URLs`,
        details: { 
            total: discoveryResult.urls.length,
            duration: Date.now() - startTime 
        }
    });

    // Step 2: Process URLs (validation is optional, continue on failure)
    const sources: DiscoveredLink[] = [];
    
    for (let i = 0; i < discoveryResult.urls.length; i++) {
        const url = discoveryResult.urls[i];
        const urlStartTime = Date.now();
        
        try {
            // Add delay between URLs
            if (i > 0) {
                await delay(RATE_LIMIT_CONFIG.delayBetweenCalls);
            }
            
            // Attempt validation (but don't block on failure)
            let validationStatus: 'valid' | 'unvalidated' | 'failed' = 'unvalidated';
            let crawlId: string | undefined;
            
            emitActivity({
                agent: 'validation',
                status: 'working',
                message: `Validating URL ${i + 1}/${discoveryResult.urls.length}`,
                details: { 
                    url,
                    progress: i + 1,
                    total: discoveryResult.urls.length
                }
            });

            const validationResult = await validateLink(url);
            
            if (!validationResult.success) {
                emitActivity({
                    agent: 'validation',
                    status: 'error',
                    message: `Validation failed: ${validationResult.error} - Continuing anyway`,
                    details: { url, duration: Date.now() - urlStartTime }
                });
                console.warn(`Validation failed for ${url}, but continuing:`, validationResult.error);
                validationStatus = 'failed';
            } else {
                crawlId = validationResult.crawlId;
                
                // Poll for crawl completion (but don't block forever)
                let crawlStatus = 'scraping';
                let attempts = 0;
                const maxAttempts = 10; // Reduced attempts
                
                while (crawlStatus === 'scraping' && attempts < maxAttempts) {
                    await delay(2000);
                    
                    emitActivity({
                        agent: 'validation',
                        status: 'working',
                        message: `Crawling in progress (attempt ${attempts + 1}/${maxAttempts})`,
                        details: { url }
                    });
                    
                    const statusResult = await checkCrawlStatus(crawlId);
                    
                    if (!statusResult.success) {
                        emitActivity({
                            agent: 'validation',
                            status: 'error',
                            message: `Status check failed - Continuing anyway`,
                            details: { url }
                        });
                        console.warn(`Status check failed for ${url}, but continuing`);
                        break;
                    }
                    
                    crawlStatus = statusResult.status!;
                    attempts++;
                }

                if (crawlStatus === 'completed') {
                    validationStatus = 'valid';
                    emitActivity({
                        agent: 'validation',
                        status: 'success',
                        message: 'URL validated successfully',
                        details: { url, duration: Date.now() - urlStartTime }
                    });
                } else {
                    validationStatus = 'unvalidated';
                    emitActivity({
                        agent: 'validation',
                        status: 'error',
                        message: 'Crawl incomplete - Continuing anyway',
                        details: { url, duration: Date.now() - urlStartTime }
                    });
                }
            }
            
            // Analysis with rate limit protection
            const analysisStartTime = Date.now();
            emitActivity({
                agent: 'analysis',
                status: 'working',
                message: 'Analyzing access method...',
                details: { url }
            });

            const analysis = await withRateLimit(() => analyzeUrlForAccessMethod(url));
            
            emitActivity({
                agent: 'analysis',
                status: 'success',
                message: `Detected: ${analysis.accessMethod}`,
                details: { url, duration: Date.now() - analysisStartTime }
            });
            
            await delay(300);
            
            // Strategy generation
            const strategyStartTime = Date.now();
            emitActivity({
                agent: 'strategy',
                status: 'working',
                message: 'Generating ingestion strategy...',
                details: { url }
            });

            const strategyResult = await withRateLimit(() => 
                generateStrategy(analysis.accessMethod, analysis.target)
            );
            
            emitActivity({
                agent: 'strategy',
                status: 'success',
                message: 'Strategy generated',
                details: { url, duration: Date.now() - strategyStartTime }
            });
            
            const source: DiscoveredLink = {
                url,
                accessMethod: analysis.accessMethod,
                justification: analysis.justification,
                strategy: strategyResult,
                validationStatus,
                crawlId,
            };
            
            sources.push(source);
        } catch (error) {
            emitActivity({
                agent: 'validation',
                status: 'error',
                message: `Error: ${error instanceof Error ? error.message : 'Unknown error'} - Attempting to continue`,
                details: { url, duration: Date.now() - urlStartTime }
            });
            console.warn(`Error processing ${url}, attempting to continue:`, error);
            
            // Try to create a basic source entry even on error
            try {
                const analysis = await withRateLimit(() => analyzeUrlForAccessMethod(url));
                const strategyResult = await withRateLimit(() => 
                    generateStrategy(analysis.accessMethod, analysis.target)
                );
                
                sources.push({
                    url,
                    accessMethod: analysis.accessMethod,
                    justification: analysis.justification,
                    strategy: strategyResult,
                    validationStatus: 'failed',
                });
            } catch (fallbackError) {
                console.error(`Could not create fallback source for ${url}:`, fallbackError);
            }
        }
    }
    
    return sources;
}

// Local file plan orchestrator with monitoring
export async function createPlanForLocalFile(file: File): Promise<DiscoveredLink> {
    const startTime = Date.now();
    const CHUNK_SIZE = 2048;

    emitActivity({
        agent: 'strategy',
        status: 'working',
        message: `Analyzing local file: ${file.name}`,
    });

    // Read first chunk for headers
    const headBlob = file.slice(0, CHUNK_SIZE);
    let fileContentSnippet = await headBlob.text();

    // Sample middle if file is large
    if (file.size > CHUNK_SIZE * 2) {
        const middleStart = Math.floor(file.size / 2) - Math.floor(CHUNK_SIZE / 2);
        const middleBlob = file.slice(middleStart, middleStart + CHUNK_SIZE);
        const middleText = await middleBlob.text();
        fileContentSnippet += `\n\n... (sample from middle) ...\n\n` + middleText;
    }

    const strategyResult = await withRateLimit(() => 
        generateFileStrategy(file.name, fileContentSnippet)
    );

    emitActivity({
        agent: 'strategy',
        status: 'success',
        message: `Strategy generated for ${file.name}`,
        details: { duration: Date.now() - startTime }
    });

    return {
        url: file.name,
        accessMethod: 'LOCAL_FILE',
        justification: `Ingestion plan for uploaded file '${file.name}'.`,
        strategy: strategyResult,
    };
}

export async function refineSourceStrategyWithCleaning(
    source: DiscoveredLink, 
    cleaningInstructions: string
): Promise<DiscoveredLink> {
    if (!cleaningInstructions.trim()) {
        return source;
    }

    const startTime = Date.now();
    
    emitActivity({
        agent: 'refinement',
        status: 'working',
        message: 'Generating cleaning steps...',
        details: { url: source.url }
    });

    const strategyContext = JSON.stringify(source.strategy, null, 2);
    
    const cleaningSteps = await withRateLimit(() => 
        getCleaningSteps(strategyContext, cleaningInstructions)
    );
    
    emitActivity({
        agent: 'refinement',
        status: 'success',
        message: 'Cleaning strategy generated',
        details: { url: source.url, duration: Date.now() - startTime }
    });
    
    return {
        ...source,
        cleaningStrategy: cleaningSteps
    };
}