import { Type } from "@google/genai";
import { ai, GEMINI_MODEL } from './client';

const ANALYSIS_PROMPT = `
You are an expert AI Web Analyst. Your task is to analyze a given URL and determine the most efficient, programmatic way to access the primary dataset it contains.

**URL to Analyze:** {URL}

**DECISION RULES (apply in order):**
1. DIRECT_DOWNLOAD (confidence 90-100): URL ends in .csv, .json, .xlsx, .zip, .parquet, .xml, or page has explicit download button/link
2. DIRECT_DOWNLOAD (confidence 70-89): Page mentions "download" prominently with file format references
3. API (confidence 90-100): URL contains /api/ or is a known API provider (api.github.com, data.gov API, etc.)
4. API (confidence 70-89): Page documents REST/GraphQL endpoints or shows API responses
5. WEB_CRAWL (confidence 50-69): Data is embedded in HTML and must be scraped
6. WEB_CRAWL (confidence below 50): Fallback when unclear

**Output Format:**
Respond with a JSON object containing:
- **accessMethod**: One of "DIRECT_DOWNLOAD", "API", or "WEB_CRAWL"
- **target**: The download URL, API endpoint, or crawl target URL
- **justification**: One-sentence explanation for your choice
- **confidence**: Number 0-100 indicating how confident you are in this assessment
`;

export type AccessMethod = "DIRECT_DOWNLOAD" | "API" | "WEB_CRAWL";

export interface AnalysisResult {
    accessMethod: AccessMethod;
    target: string;
    justification: string;
    confidence: number;
}

export async function analyzeUrlForAccessMethod(url: string): Promise<AnalysisResult> {
    let lastRawResponse = '';

    try {
        const prompt = ANALYSIS_PROMPT.replace('{URL}', url);
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        accessMethod: { type: Type.STRING },
                        target: { type: Type.STRING },
                        justification: { type: Type.STRING },
                        confidence: { type: Type.NUMBER },
                    },
                    required: ["accessMethod", "target", "justification", "confidence"],
                }
            }
        });

        lastRawResponse = response.text;
        const resultJson = JSON.parse(response.text);

        // Validate the accessMethod value
        const validMethods: AccessMethod[] = ["DIRECT_DOWNLOAD", "API", "WEB_CRAWL"];
        if (resultJson && validMethods.includes(resultJson.accessMethod)) {
            return {
                accessMethod: resultJson.accessMethod,
                target: resultJson.target,
                justification: resultJson.justification,
                confidence: resultJson.confidence ?? 50,
            };
        } else {
            // Fallback if the model hallucinates a method
            console.warn(`Analysis agent returned invalid accessMethod: ${resultJson.accessMethod}. Defaulting to WEB_CRAWL.`);
            return {
                accessMethod: "WEB_CRAWL",
                target: url,
                justification: "The access method could not be determined, defaulting to web crawl.",
                confidence: 30,
            };
        }
    } catch (error) {
        console.warn(`Analysis Agent failed for URL ${url}, attempting validation fix...`, error);

        try {
            if (lastRawResponse) {
                const { validateAnalysis } = await import('./validatorAgent');
                const fixed = await validateAnalysis(lastRawResponse, url);
                return {
                    accessMethod: fixed.accessMethod as AccessMethod,
                    target: fixed.target,
                    justification: fixed.justification,
                    confidence: fixed.confidence
                };
            }
            throw new Error('No raw response available for validation');
        } catch (validationError) {
            return {
                accessMethod: "WEB_CRAWL",
                target: url,
                justification: "Critical error during analysis and validation. Defaulting to crawl.",
                confidence: 0,
            };
        }
    }
}
