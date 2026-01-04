import { Type } from "@google/genai";
import { ai } from './client';

const ANALYSIS_PROMPT = `
You are an expert AI Web Analyst. Your task is to analyze a given URL and determine the most efficient, programmatic way to access the primary dataset it contains.

**URL to Analyze:** {URL}

**Analysis Steps:**
1.  **Check for Direct Downloads:** Look for prominent links or buttons pointing directly to data files like CSV, JSON, ZIP, XLSX, etc.
2.  **Check for an API:** Look for mentions of an API, API documentation, or network requests that return structured JSON data.
3.  **Fallback to Web Crawling:** If no direct download or obvious API is available, the method must be web crawling.

**Output Format:**
You MUST respond with a JSON object. Do not add any other text or formatting.

-   **accessMethod:** Must be one of three exact strings: "DIRECT_DOWNLOAD", "API", or "WEB_CRAWL".
-   **target:** If method is "DIRECT_DOWNLOAD", this is the full download URL. If "API", this is the base API endpoint URL. If "WEB_CRAWL", this is the original URL.
-   **justification:** A brief, one-sentence explanation for your choice.
`;

export type AccessMethod = "DIRECT_DOWNLOAD" | "API" | "WEB_CRAWL";

export interface AnalysisResult {
    accessMethod: AccessMethod;
    target: string;
    justification: string;
}

export async function analyzeUrlForAccessMethod(url: string): Promise<AnalysisResult> {
    try {
        const prompt = ANALYSIS_PROMPT.replace('{URL}', url);
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        accessMethod: { type: Type.STRING },
                        target: { type: Type.STRING },
                        justification: { type: Type.STRING },
                    },
                    required: ["accessMethod", "target", "justification"],
                }
            }
        });

        const resultJson = JSON.parse(response.text);

        // Validate the accessMethod value
        const validMethods: AccessMethod[] = ["DIRECT_DOWNLOAD", "API", "WEB_CRAWL"];
        if (resultJson && validMethods.includes(resultJson.accessMethod)) {
            return resultJson;
        } else {
             // Fallback if the model hallucinates a method
            console.warn(`Analysis agent returned invalid accessMethod: ${resultJson.accessMethod}. Defaulting to WEB_CRAWL.`);
            return {
                accessMethod: "WEB_CRAWL",
                target: url,
                justification: "The access method could not be determined, defaulting to web crawl."
            };
        }
    } catch (error) {
        console.error(`Error in Analysis Agent for URL ${url}:`, error);
        // Fallback on any error to ensure the pipeline doesn't stop
        return {
            accessMethod: "WEB_CRAWL",
            target: url,
            justification: "An error occurred during analysis, defaulting to web crawl as a fallback."
        };
    }
}
