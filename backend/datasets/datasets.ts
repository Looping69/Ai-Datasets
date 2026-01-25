import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";

// We'll use Serper.dev for search. Users should provide this secret.
const serperApiKey = secret("SerperAPIKey");

interface SearchParams {
    query: string;
}

interface SearchResponse {
    urls: string[];
}

interface AnalyzeParams {
    url: string;
}

interface AnalyzeResponse {
    url: string;
    statusCode: number;
    contentType: string;
    contentLength: number;
    contentSnippet: string;
    isDownloadable: boolean;
    headers: Record<string, string>;
}

/**
 * Real discovery: Calls a search API to find candidate URLs
 */
export const search = api(
    { expose: true, method: "GET", path: "/datasets/search" },
    async (params: SearchParams): Promise<SearchResponse> => {
        const apiKey = serperApiKey();
        if (!apiKey || apiKey === "") {
            // Fallback for demo purposes if no key is provided
            console.warn("SerperAPIKey not configured. Returning mock search results.");
            return {
                urls: [
                    `https://catalog.data.gov/dataset?q=${encodeURIComponent(params.query)}`,
                    `https://www.kaggle.com/search?q=${encodeURIComponent(params.query)}`,
                    `https://huggingface.co/datasets?search=${encodeURIComponent(params.query)}`
                ]
            };
        }

        try {
            const resp = await fetch("https://google.serper.dev/search", {
                method: "POST",
                headers: {
                    "X-API-KEY": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ q: params.query, num: 10 }),
            });

            if (!resp.ok) {
                throw APIError.internal(`Search API failed with status ${resp.status}`);
            }

            const data = await resp.json();
            const urls = (data.organic || []).map((item: any) => item.link);
            return { urls };
        } catch (err) {
            console.error("Search failed:", err);
            throw APIError.internal("Failed to perform real search discovery.");
        }
    }
);

/**
 * Real analysis: Fetches content and metadata for a URL
 */
export const analyze = api(
    { expose: true, method: "POST", path: "/datasets/analyze" },
    async (params: AnalyzeParams): Promise<AnalyzeResponse> => {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const resp = await fetch(params.url, {
                method: "GET",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DataScout/1.0",
                },
                signal: controller.signal,
            });

            clearTimeout(id);

            const contentType = resp.headers.get("content-type") || "unknown";
            const contentLength = parseInt(resp.headers.get("content-length") || "0");
            
            // Check if it's a downloadable type
            const downloadableExtensions = ['.csv', '.json', '.xlsx', '.zip', '.parquet', '.xml', '.gz', '.h5', '.parquet'];
            const isDownloadable = downloadableExtensions.some(ext => params.url.toLowerCase().endsWith(ext)) || 
                                   contentType.includes("application/octet-stream") || 
                                   contentType.includes("text/csv") ||
                                   contentType.includes("application/json");

            // Fetch a snippet of content (first 2000 chars) if it's text-based
            let contentSnippet = "";
            if (contentType.includes("text") || contentType.includes("json") || contentType.includes("xml")) {
                const text = await resp.text();
                contentSnippet = text.slice(0, 2000);
            } else {
                contentSnippet = "[Binary Content or Large File]";
            }

            const headers: Record<string, string> = {};
            resp.headers.forEach((value, key) => {
                headers[key] = value;
            });

            return {
                url: params.url,
                statusCode: resp.status,
                contentType,
                contentLength,
                contentSnippet,
                isDownloadable,
                headers
            };
        } catch (err) {
            console.error(`Analysis failed for ${params.url}:`, err);
            throw APIError.unavailable(`Could not fetch or analyze URL: ${params.url}`);
        }
    }
);
