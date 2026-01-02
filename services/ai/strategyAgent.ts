
import { Type } from "@google/genai";
import { ai } from './client';
import type { AccessMethod } from './analysisAgent';
import type { Strategy } from '../../types';

const RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        config: { type: Type.STRING, description: "A stringified JSON object for Firecrawl configuration. Only for WEB_CRAWL." },
        schema: { type: Type.STRING, description: "A stringified JSON object representing the proposed data schema." },
        snippet: { type: Type.STRING, description: "A code snippet (e.g., curl, javascript, python)." },
    },
};

const STRATEGY_PROMPTS = {
    DIRECT_DOWNLOAD: `
    You are a Data Engineer. A user needs to download a file.
    **Download URL:** {TARGET}
    **Task:** Provide a simple, single-line \`curl\` command to download this file.
    **Output:** Respond with a single JSON object with one key: "snippet", containing the curl command as a string.
    `,
    API: `
    You are a senior API Developer. A user wants to access data from an API.
    **API Endpoint:** {TARGET}
    **Task:**
    1. Provide a sample JavaScript \`fetch\` request to get data from this endpoint.
    2. Propose a simple, likely JSON schema for the data returned by the API.
    **Output:** Respond with a single JSON object with two keys: "snippet" (a string containing the JavaScript fetch request) and "schema" (a string containing the proposed JSON schema).
    `,
    WEB_CRAWL: `
    You are a Web Scraping expert. A user needs to crawl a website.
    **Target URL:** {TARGET}
    **Task:**
    1.  Provide a complete, tailored Firecrawl JSON configuration for this URL. The 'url' field must be the target URL. Adjust 'maxDepth', 'waitFor', 'onlyMainContent', etc., based on a reasonable guess for this type of site.
    2.  Propose a JSON schema for the data you expect to extract from this specific source.
    **Output:** Respond with a single JSON object with two keys: "config" (a string containing the Firecrawl JSON config) and "schema" (a string containing the proposed JSON schema).
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
    **Output:** Respond with a single JSON object with two keys: "snippet" (a string containing the Python script) and "schema" (a string containing the proposed JSON schema).
    `
};

async function generate(prompt: string): Promise<Strategy> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA
        }
    });
    return JSON.parse(response.text) as Strategy;
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
        return { snippet: `> An error occurred while generating a strategy for this link.` };
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
        return { snippet: `> An error occurred while generating a strategy for this file.` };
    }
}
