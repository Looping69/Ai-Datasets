
import { findDatasetUrls } from './discoveryAgent';
import { analyzeUrlForAccessMethod } from './analysisAgent';
import { generateStrategy, generateFileStrategy } from './strategyAgent';
import { getCleaningSteps } from './refinementAgent';
import type { DiscoveredLink } from '../../types';

// Helper to avoid rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Web discovery orchestrator
export async function createFullIngestionPlan(datasetDescription: string): Promise<DiscoveredLink[]> {

    // Step 1: Discover potential URLs
    const discoveryResult = await findDatasetUrls(datasetDescription);
    if (!discoveryResult.urls || discoveryResult.urls.length === 0) {
        return [];
    }

    // Step 2 & 3: Analyze and generate strategies sequentially with delays to avoid rate limiting.
    const sources: DiscoveredLink[] = [];
    for (let i = 0; i < discoveryResult.urls.length; i++) {
        const url = discoveryResult.urls[i];
        try {
            // Add delay between iterations (skip first)
            if (i > 0) await delay(2000);

            const analysis = await analyzeUrlForAccessMethod(url);
            await delay(1000); // Small delay between analysis and strategy
            const strategyResult = await generateStrategy(analysis.accessMethod, analysis.target);
            sources.push({
                url,
                accessMethod: analysis.accessMethod,
                justification: analysis.justification,
                confidence: analysis.confidence,
                strategy: strategyResult,
            });
        } catch (error) {
            console.error(`Skipping source ${url} due to an error during processing:`, error);
            // We'll just skip this source to keep the UI clean if one fails.
        }
    }

    return sources;
}

// Local file plan orchestrator
export async function createPlanForLocalFile(file: File): Promise<DiscoveredLink> {
    const CHUNK_SIZE = 2048; // 2KB
    let fileContentSnippet = '';

    // Read the first chunk to capture headers and initial data
    const headBlob = file.slice(0, CHUNK_SIZE);
    fileContentSnippet += await headBlob.text();

    // If the file is large enough, sample from the middle to get representative data
    if (file.size > CHUNK_SIZE * 2) {
        const middleStart = Math.floor(file.size / 2) - Math.floor(CHUNK_SIZE / 2);
        const middleBlob = file.slice(middleStart, middleStart + CHUNK_SIZE);
        const middleText = await middleBlob.text();
        fileContentSnippet += `\n\n... (sample from middle of file) ...\n\n` + middleText;
    }

    const strategyResult = await generateFileStrategy(file.name, fileContentSnippet);

    return {
        url: file.name,
        accessMethod: 'LOCAL_FILE',
        justification: `An ingestion plan generated for the uploaded file '${file.name}'.`,
        strategy: strategyResult,
    };
}


export async function refineSourceStrategyWithCleaning(source: DiscoveredLink, cleaningInstructions: string): Promise<DiscoveredLink> {
    if (!cleaningInstructions.trim()) {
        return source;
    }

    // Provide the original strategy as context for the refinement agent
    const strategyContext = JSON.stringify(source.strategy, null, 2);
    const cleaningSteps = await getCleaningSteps(strategyContext, cleaningInstructions);

    // Return a new source object with the cleaning steps added
    return {
        ...source,
        cleaningStrategy: cleaningSteps
    };
}
