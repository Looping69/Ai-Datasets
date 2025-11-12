import { generateContent } from './client';

// Minimal, focused prompt - reduced from verbose instructions
const DISCOVERY_PROMPT = `Find 6-8 direct dataset URLs for: "{DATASET_DESCRIPTION}"

Return ONLY valid JSON:
{"urls": ["url1", "url2", ...]}

Prioritize:
- Direct file links (.csv, .json, .xlsx, .zip)
- Dataset landing pages
- API endpoints
NO generic homepages.`;

export interface DiscoveryResult {
    urls: string[];
}

export async function findDatasetUrls(datasetDescription: string): Promise<DiscoveryResult> {
    try {
        const prompt = DISCOVERY_PROMPT.replace('{DATASET_DESCRIPTION}', datasetDescription);

        const response = await generateContent({
            prompt,
            temperature: 0.5, // Lower temp = more focused
            maxTokens: 800, // Reduced from 2000
        });

        // Clean and extract JSON
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
        
        if (resultJson && Array.isArray(resultJson.urls)) {
            return resultJson;
        } else {
            throw new Error("Invalid format from discovery agent.");
        }

    } catch (error) {
        console.error("Error in Discovery Agent:", error);
        throw new Error("Failed to discover dataset URLs. Try refining your description.");
    }
}