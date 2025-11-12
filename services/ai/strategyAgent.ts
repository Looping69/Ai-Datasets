import { generateContent } from './client';
import type { AccessMethod } from './analysisAgent';
import type { Strategy } from '../../types';

// Minimal prompts - only essential instructions
const STRATEGY_PROMPTS = {
    DIRECT_DOWNLOAD: `Download file from: {TARGET}
Provide curl command only.
JSON: {"snippet": "curl command"}`,
    
    API: `API endpoint: {TARGET}
Provide fetch request + likely schema.
JSON: {"snippet": "fetch code", "schema": "json schema"}`,
    
    WEB_CRAWL: `Crawl: {TARGET}
Provide Firecrawl config + expected schema.
JSON: {"config": "firecrawl json", "schema": "data schema"}`,
    
    LOCAL_FILE: `File: {FILE_NAME}
Snippet:
{CONTENT_SNIPPET}

Provide Python read script + schema.
JSON: {"snippet": "python code", "schema": "data schema"}`
};

async function generate(prompt: string, maxTokens: number = 1000): Promise<Strategy> {
    const response = await generateContent({
        prompt,
        temperature: 0.3, // Low temp for consistent code generation
        maxTokens,
    });

    // Extract JSON from response
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

    return JSON.parse(jsonText) as Strategy;
}

export async function generateStrategy(
    accessMethod: AccessMethod,
    target: string
): Promise<Strategy> {
    try {
        const promptTemplate = STRATEGY_PROMPTS[accessMethod];
        if (!promptTemplate) {
            throw new Error(`No strategy prompt for: ${accessMethod}`);
        }
        const prompt = promptTemplate.replace(/{TARGET}/g, target);
        
        // Token optimization: DIRECT_DOWNLOAD needs minimal tokens
        const maxTokens = accessMethod === 'DIRECT_DOWNLOAD' ? 300 : 1000;
        
        return await generate(prompt, maxTokens);
    } catch (error) {
        console.error(`Error in Strategy Agent for ${target}:`, error);
        return { 
            method: accessMethod,
            url: target,
            snippet: `> Error generating strategy for this link.` 
        };
    }
}

export async function generateFileStrategy(
    fileName: string,
    contentSnippet: string
): Promise<Strategy> {
    try {
        // Truncate snippet if too long to save tokens
        const truncatedSnippet = contentSnippet.length > 1500 
            ? contentSnippet.substring(0, 1500) + '\n... (truncated)'
            : contentSnippet;
            
        const prompt = STRATEGY_PROMPTS.LOCAL_FILE
            .replace('{FILE_NAME}', fileName)
            .replace('{CONTENT_SNIPPET}', truncatedSnippet);
            
        return await generate(prompt, 1200);
    } catch (error) {
        console.error(`Error in File Strategy Agent for ${fileName}:`, error);
        return { 
            method: 'LOCAL_FILE',
            url: fileName,
            snippet: `> Error generating strategy for this file.` 
        };
    }
}