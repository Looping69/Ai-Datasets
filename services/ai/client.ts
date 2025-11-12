import type { LLMProvider } from '../types';

// Current provider (can be changed by user)
let currentProvider: LLMProvider = "gemini";

export function setLLMProvider(provider: LLMProvider) {
  currentProvider = provider;
}

export function getLLMProvider(): LLMProvider {
  return currentProvider;
}

interface GenerateContentParams {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function generateContent({
  prompt,
  systemPrompt,
  temperature = 0.7,
  maxTokens = 4000,
}: GenerateContentParams): Promise<string> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/supabase-functions-llm-generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          provider: currentProvider,
          prompt,
          systemPrompt,
          temperature,
          maxTokens,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.text) {
      throw new Error('Invalid response from LLM service');
    }

    return data.text;
  } catch (error) {
    console.error(`Error with ${currentProvider}:`, error);
    throw new Error(`Failed to generate content with ${currentProvider}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Legacy export for backward compatibility
export const ai = {
  models: {
    generateContent: async ({ model, contents, config }: any) => {
      const result = await generateContent({
        prompt: contents,
        temperature: config?.temperature,
      });
      return { text: result };
    },
  },
};