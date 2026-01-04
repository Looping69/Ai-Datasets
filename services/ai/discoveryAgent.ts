import { Type } from "@google/genai";
import { ai } from './client';

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
    try {
        const prompt = DISCOVERY_PROMPT.replace('{DATASET_DESCRIPTION}', datasetDescription);

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
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

        const resultJson = JSON.parse(response.text);
        // Basic validation
        if (resultJson && Array.isArray(resultJson.urls)) {
            return resultJson;
        } else {
            throw new Error("Discovery agent returned an invalid format.");
        }

    } catch (error) {
        console.error("Error in Discovery Agent:", error);
        throw new Error("The AI failed to discover dataset URLs. Please try refining your description.");
    }
}
