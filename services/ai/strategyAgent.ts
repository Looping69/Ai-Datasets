import { Type } from "@google/genai";
import { ai, GEMINI_MODEL } from './client';
import type { AccessMethod } from './analysisAgent';
import type { Strategy } from '../../types';

const RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        config: { type: Type.STRING, description: "A stringified JSON object for Firecrawl configuration. Only for WEB_CRAWL." },
        schema: { type: Type.STRING, description: "A stringified JSON object representing the proposed data schema." },
        snippet: { type: Type.STRING, description: "A code snippet (e.g., curl, javascript, python)." },
        confidence: { type: Type.NUMBER, description: "0-100 confidence score for this strategy." },
        confidenceReason: { type: Type.STRING, description: "Brief explanation of confidence level." },
    },
};

const STRATEGY_PROMPTS = {
    DIRECT_DOWNLOAD: `
    You are a Data Engineer. A user needs to download a file.
    **Download URL:** {TARGET}
    **Task:** Provide a simple, single-line \`curl\` command to download this file.
    **Confidence:** Rate 0-100 how confident you are this will work. High confidence if URL clearly ends in a file extension.
    **Output:** JSON with keys: "snippet" (curl command), "confidence" (number), "confidenceReason" (brief explanation).
    `,
    API: `
    You are a senior API Developer. A user wants to access data from an API.
    **API Endpoint:** {TARGET}
    **Task:**
    1. Provide a sample JavaScript \`fetch\` request to get data from this endpoint.
    2. Propose a simple, likely JSON schema for the data returned by the API.
    **Confidence:** Rate 0-100 based on whether this looks like a real, accessible API endpoint.
    **Output:** JSON with keys: "snippet", "schema", "confidence", "confidenceReason".
    `,
    WEB_CRAWL: `
    You are a Web Scraping expert. A user needs to crawl a website.
    **Target URL:** {TARGET}
    **Task:**
    1.  Provide a complete, tailored Firecrawl JSON configuration for this URL. The 'url' field must be the target URL. Adjust 'maxDepth', 'waitFor', 'onlyMainContent', etc., based on a reasonable guess for this type of site.
    2.  Propose a JSON schema for the data you expect to extract from this specific source.
    **Confidence:** Rate 0-100 based on how well you understand the site structure.
    **Output:** JSON with keys: "config", "schema", "confidence", "confidenceReason".
    `,
    LOCAL_FILE: `
    You are a Data Engineer. A user has uploaded a local file.
    **File Name:** {FILE_NAME}
    **Content Snippet (first 4KB):**
    ---
    {CONTENT_SNIPPET}
    ---
    **Task:**
    1.  Based on the file name and content, provide a Python script using a suitable library (like Pandas for CSV, \`json\` for JSON) to read the file. The script should demonstrate loading the file and printing the first 5 rows or the basic structure.
    2.  Propose a simple, likely JSON schema for the data based on the content snippet.
    **Confidence:** Rate 0-100 based on how well you understand the file format.
    **Output:** JSON with keys: "snippet", "schema", "confidence", "confidenceReason".
    `
};

async function generate(prompt: string, retries = 2): Promise<Strategy> {
    let lastRawResponse = '';

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: GEMINI_MODEL,
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: RESPONSE_SCHEMA
                }
            });

            lastRawResponse = response.text;

            // Try to parse the response
            const result = JSON.parse(response.text);
            return {
                ...result,
                confidence: result.confidence ?? 50,
                confidenceReason: result.confidenceReason ?? 'No confidence reason provided',
            };
        } catch (error) {
            if (attempt < retries) {
                console.warn(`Strategy generation attempt ${attempt + 1} failed, retrying...`);
                await new Promise(r => setTimeout(r, 1000));
            } else {
                // Last attempt failed - try validator agent to fix the response
                console.warn('All retries failed, attempting validation fix...');
                try {
                    const { validateStrategy } = await import('./validatorAgent');
                    return await validateStrategy(lastRawResponse);
                } catch (validationError) {
                    console.error('Validator agent also failed:', validationError);
                    throw error;
                }
            }
        }
    }
    throw new Error('All retry attempts failed');
}


export async function generateStrategy(
    accessMethod: AccessMethod,
    target: string
): Promise<Strategy> {
    try {
        const promptTemplate = STRATEGY_PROMPTS[accessMethod];
        if (!promptTemplate) {
            throw new Error(`No strategy prompt for access method: ${accessMethod}`);
        }
        const prompt = promptTemplate.replace(/{TARGET}/g, target);
        return await generate(prompt);
    } catch (error) {
        console.error(`Error in Strategy Agent for target ${target}:`, error);
        return {
            snippet: `> An error occurred while generating a strategy for this link.`,
            confidence: 0,
            confidenceReason: 'Error during generation',
        };
    }
}

export async function generateFileStrategy(
    fileName: string,
    contentSnippet: string
): Promise<Strategy> {
    try {
        const prompt = STRATEGY_PROMPTS.LOCAL_FILE
            .replace('{FILE_NAME}', fileName)
            .replace('{CONTENT_SNIPPET}', contentSnippet);
        return await generate(prompt);
    } catch (error) {
        console.error(`Error in File Strategy Agent for file ${fileName}:`, error);
        return {
            snippet: `> An error occurred while generating a strategy for this file.`,
            confidence: 0,
            confidenceReason: 'Error during generation',
        };
    }
}
