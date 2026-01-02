
import { ai } from './client';

const REFINEMENT_PROMPT = `
You are an expert Data Pipeline Architect. Your task is to create a set of data cleaning and transformation steps based on user instructions, using an existing data ingestion strategy as context.

**CRITICAL INSTRUCTIONS:**
1.  **Generate Steps:** Read the user's cleaning instructions and generate a clear, step-by-step process for cleaning the data.
2.  **Suggest Tools:** Suggest appropriate tools or libraries (e.g., Pandas in Python, shell commands like \`sed\`/\`awk\`).
3.  **Use Markdown:** Format your response using markdown for clarity (e.g., bullet points).
4.  **Output ONLY the Steps:** Your response should ONLY be the markdown content for the cleaning steps. Do not add any other titles, introductory text, or pleasantries.

---
**Context (The Original Ingestion Strategy):**
\`\`\`json
{STRATEGY_CONTEXT}
\`\`\`
---

**User's Cleaning & Transformation Instructions:**
"{CLEANING_INSTRUCTIONS}"
`;

export async function getCleaningSteps(strategyContext: string, cleaningInstructions: string): Promise<string> {
    try {
        const prompt = REFINEMENT_PROMPT
            .replace('{STRATEGY_CONTEXT}', strategyContext)
            .replace('{CLEANING_INSTRUCTIONS}', cleaningInstructions);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt
        });

        return response.text;

    } catch (error) {
        console.error("Error in Refinement Agent:", error);
        throw new Error("The AI failed to generate cleaning steps. Please try again.");
    }
}
