import { generateContent } from './client';

// Minimal prompt - only essential context
const REFINEMENT_PROMPT = `Context: {STRATEGY_CONTEXT}

User wants: "{CLEANING_INSTRUCTIONS}"

Provide cleaning steps in markdown. Be concise.`;

export async function getCleaningSteps(strategyContext: string, cleaningInstructions: string): Promise<string> {
    try {
        // Truncate context if too long to save tokens
        const truncatedContext = strategyContext.length > 800 
            ? strategyContext.substring(0, 800) + '\n... (truncated)'
            : strategyContext;
            
        const prompt = REFINEMENT_PROMPT
            .replace('{STRATEGY_CONTEXT}', truncatedContext)
            .replace('{CLEANING_INSTRUCTIONS}', cleaningInstructions);

        const response = await generateContent({
            prompt,
            temperature: 0.4,
            maxTokens: 800, // Reduced from unlimited
        });

        return response;

    } catch (error) {
        console.error("Error in Refinement Agent:", error);
        throw new Error("Failed to generate cleaning steps. Please try again.");
    }
}