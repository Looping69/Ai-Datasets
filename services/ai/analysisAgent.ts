
import { ai, GEMINI_MODEL } from './client';
import { analyzeUrl, type AnalysisResponse } from '../datasetService';

const ANALYSIS_PROMPT = `
You are an expert AI Web Analyst. Your task is to analyze the metadata and content of a URL and determine the most efficient, programmatic way to access the primary dataset it contains.

**URL:** {URL}
**METADATA:**
- Status Code: {STATUS}
- Content-Type: {CONTENT_TYPE}
- Content-Length: {CONTENT_LENGTH} bytes
- Is Downloadable Link (Detected): {IS_DOWNLOADABLE}

**CONTENT SNIPPET (First 2000 chars):**
\`\`\`
{SNIPPET}
\`\`\`

**DECISION RULES:**
1. DIRECT_DOWNLOAD: If URL ends in data extension, Content-Type is a data format, or snippet shows raw data (CSV, JSON).
2. API: If snippet shows API documentation, JSON objects with data records, or URL is a known API endpoint.
3. WEB_CRAWL: If data is embedded in HTML tables or requires navigating complex JS.

**Output Format:**
Respond with a JSON object containing:
- **accessMethod**: One of "DIRECT_DOWNLOAD", "API", or "WEB_CRAWL"
- **target**: The actual data URL or API endpoint (may be same as original or a derived link)
- **justification**: One-sentence explanation based on the metadata/content
- **confidence**: Number 0-100 indicating assessment confidence
`;

export type AccessMethod = "DIRECT_DOWNLOAD" | "API" | "WEB_CRAWL" | "LOCAL_FILE";

export interface AnalysisResult {
    accessMethod: AccessMethod;
    target: string;
    justification: string;
    confidence: number;
}

export async function analyzeUrlForAccessMethod(url: string): Promise<AnalysisResult> {
    try {
        // 1. Real Analysis & URL Validation: Fetch metadata and content via backend
        const metadata: AnalysisResponse = await analyzeUrl(url);

        // 2. Classify based on real data using LLM
        const prompt = ANALYSIS_PROMPT
            .replace('{URL}', url)
            .replace('{STATUS}', metadata.statusCode.toString())
            .replace('{CONTENT_TYPE}', metadata.contentType)
            .replace('{CONTENT_LENGTH}', metadata.contentLength.toString())
            .replace('{IS_DOWNLOADABLE}', metadata.isDownloadable ? 'YES' : 'NO')
            .replace('{SNIPPET}', metadata.contentSnippet);

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: "OBJECT" as const,
                    properties: {
                        accessMethod: { type: "STRING" as const },
                        target: { type: "STRING" as const },
                        justification: { type: "STRING" as const },
                        confidence: { type: "NUMBER" as const },
                    },
                    required: ["accessMethod", "target", "justification", "confidence"],
                }
            }
        });

        const resultJson = JSON.parse(response.text);

        // Map potential method name differences
        let accessMethod: AccessMethod = "WEB_CRAWL";
        if (resultJson.accessMethod === "DIRECT_DOWNLOAD") accessMethod = "DIRECT_DOWNLOAD";
        else if (resultJson.accessMethod === "API") accessMethod = "API";

        return {
            accessMethod,
            target: resultJson.target || url,
            justification: resultJson.justification,
            confidence: resultJson.confidence || 50,
        };

    } catch (error) {
        console.warn(`Real Analysis failed for URL ${url}, falling back to heuristic:`, error);

        // Final fallback: Basic heuristic if fetching or LLM fails
        return {
            accessMethod: "WEB_CRAWL",
            target: url,
            justification: "Automatic analysis failed. Defaulting to standard crawl.",
            confidence: 20,
        };
    }
}
