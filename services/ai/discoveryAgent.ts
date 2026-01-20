import { ai, DEFAULT_MODEL } from './client';

const DISCOVERY_PROMPT = `
You are an expert AI Research Assistant. Your mission is to find specific, direct URLs to dataset pages or download links based on a user's request.

**CRITICAL INSTRUCTIONS:**
1.  Prioritize direct links to dataset landing pages, CSV files, JSON files, or data portals.
2.  AVOID generic links to repository homepages (like the front page of Kaggle or data.gov).
3.  Return a list of 6-8 high-quality URLs.

Here is the user's description of the dataset they need:
"{DATASET_DESCRIPTION}"
`;

export interface DiscoveryResult {
    urls: string[];
}

export async function findDatasetUrls(datasetDescription: string): Promise<DiscoveryResult> {
    let lastRawResponse = '';
    try {
        const prompt = DISCOVERY_PROMPT.replace('{DATASET_DESCRIPTION}', datasetDescription);

        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        urls: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            }
                        }
                    }
                }
            }
        });

        lastRawResponse = response.text;
        const resultJson = JSON.parse(response.text);
        // Basic validation
        if (resultJson && Array.isArray(resultJson.urls)) {
            return resultJson;
        } else {
            throw new Error("Discovery agent returned an invalid format.");
        }

    } catch (error) {
        console.warn("Discovery Agent failed, attempting validation fix...", error);

        try {
            if (lastRawResponse) {
                const { validateDiscovery } = await import('./validatorAgent');
                return await validateDiscovery(lastRawResponse, datasetDescription);
            }
            throw new Error('No raw response for validation');
        } catch (validationError) {
            console.error("Critical failure in discovery:", validationError);
            throw new Error("The AI failed to discover dataset URLs. Please try refining your description.");
        }
    }
}
