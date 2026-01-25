import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client once using the API_KEY from environment variables.
// This single instance will be used by all AI agents.
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY || "NO_API_KEY_PROVIDED";

if (apiKey === "NO_API_KEY_PROVIDED") {
    console.warn("AI Client initialized without an API Key. Real API calls will fail.");
}

export const ai = new GoogleGenAI({ apiKey });
export const GEMINI_MODEL = 'gemini-2.5-flash';
