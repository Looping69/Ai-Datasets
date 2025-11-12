import { generateContent } from './client';

// Ultra-minimal prompt - only essential info
const ANALYSIS_PROMPT = `Classify URL: {URL}

Rules:
- DIRECT_DOWNLOAD: ends with .csv/.json/.xlsx/.zip OR contains /download/
- API: contains /api/ OR api.
- WEB_CRAWL: HTML page only

JSON only:
{"accessMethod": "DIRECT_DOWNLOAD|API|WEB_CRAWL", "target": "url", "justification": "brief reason"}`;

export type AccessMethod = "DIRECT_DOWNLOAD" | "API" | "WEB_CRAWL";

export interface AnalysisResult {
    accessMethod: AccessMethod;
    target: string;
    justification: string;
}

// Pattern detection - NO LLM needed for obvious cases
function detectDirectDownload(url: string): boolean {
    const downloadExtensions = ['.csv', '.json', '.xlsx', '.xls', '.zip', '.tar', '.gz', '.parquet', '.xml', '.tsv', '.txt', '.pdf'];
    const downloadPatterns = ['/download/', '/export/', '/file/', '/data/files/', '/static/data/', '/datasets/download'];
    
    const lowerUrl = url.toLowerCase();
    
    if (downloadExtensions.some(ext => lowerUrl.endsWith(ext))) {
        return true;
    }
    
    if (downloadPatterns.some(pattern => lowerUrl.includes(pattern))) {
        return true;
    }
    
    return false;
}

function detectAPI(url: string): boolean {
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes('/api/') || lowerUrl.includes('api.') || lowerUrl.includes('?format=json');
}

export async function analyzeUrlForAccessMethod(url: string): Promise<AnalysisResult> {
    try {
        // OPTIMIZATION: Pattern matching first - saves 100% of tokens for obvious cases
        if (detectDirectDownload(url)) {
            return {
                accessMethod: "DIRECT_DOWNLOAD",
                target: url,
                justification: "Direct file URL detected by pattern."
            };
        }
        
        if (detectAPI(url)) {
            return {
                accessMethod: "API",
                target: url,
                justification: "API endpoint detected by pattern."
            };
        }

        // Only use LLM for ambiguous cases
        const prompt = ANALYSIS_PROMPT.replace('{URL}', url);
        
        const response = await generateContent({
            prompt,
            temperature: 0.2, // Very low for consistent classification
            maxTokens: 200, // Minimal - just need classification
        });

        let jsonText = response.trim();
        
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }
        
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonText = jsonMatch[0];
        }

        const resultJson = JSON.parse(jsonText);

        const validMethods: AccessMethod[] = ["DIRECT_DOWNLOAD", "API", "WEB_CRAWL"];
        if (resultJson && validMethods.includes(resultJson.accessMethod)) {
            return resultJson;
        } else {
            console.warn(`Invalid accessMethod: ${resultJson.accessMethod}. Defaulting to WEB_CRAWL.`);
            return {
                accessMethod: "WEB_CRAWL",
                target: url,
                justification: "Could not determine method, defaulting to crawl."
            };
        }
    } catch (error) {
        console.error(`Error in Analysis Agent for URL ${url}:`, error);
        
        // Fallback with pattern matching
        if (detectDirectDownload(url)) {
            return {
                accessMethod: "DIRECT_DOWNLOAD",
                target: url,
                justification: "Fallback: URL pattern suggests direct download."
            };
        }
        
        return {
            accessMethod: "WEB_CRAWL",
            target: url,
            justification: "Error occurred, defaulting to web crawl."
        };
    }
}