
import { ai, GEMINI_MODEL } from './client';
import { searchDatasets } from '../datasetService';

const QUERY_GEN_PROMPT = `
You are a search query optimizer. Given a description of a dataset, generate a single, highly effective Google search query to find direct links to that data (CSV, JSON, data portals).
DO NOT include any commentary, just the query.

Dataset Description: "{DATASET_DESCRIPTION}"
`;

export interface DiscoveryResult {
    urls: string[];
}

export async function findDatasetUrls(datasetDescription: string): Promise<DiscoveryResult> {
    try {
        // 1. Generate an optimized search query using LLM
        const queryResponse = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: QUERY_GEN_PROMPT.replace('{DATASET_DESCRIPTION}', datasetDescription),
        });

        const optimizedQuery = queryResponse.text.trim().replace(/^"|"$/g, '');
        console.log(`Optimized Search Query: ${optimizedQuery}`);

        // 2. Call the real search API via our backend
        const urls = await searchDatasets(optimizedQuery || datasetDescription);

        // 3. (Optional) Filter or rank URLs with LLM if too many
        // For now, we'll return the top 8 results from the real search
        return {
            urls: urls.slice(0, 8)
        };

    } catch (error) {
        console.error("Real Discovery failed, falling back to basic prompt:", error);

        // Fallback to the old method if the search API fails
        const prompt = `Find 5-8 candidate URLs for datasets related to: ${datasetDescription}. Return as JSON { "urls": [] }`;
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        try {
            return JSON.parse(response.text);
        } catch {
            throw new Error("The AI failed to discover dataset URLs. Please try refining your description.");
        }
    }
}
