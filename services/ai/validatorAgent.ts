import { ai, DEFAULT_MODEL } from './client';

const VALIDATOR_PROMPT = `
You are a Quality Assurance AI. Your job is to validate and fix responses from other AI agents in a data pipeline system.

**Original Agent Task:** {TASK_DESCRIPTION}
**Agent Output to Validate:**
\`\`\`json
{AGENT_OUTPUT}
\`\`\`

**Your Tasks:**
1. Check if the JSON is valid and complete
2. Fix any truncated strings or missing brackets
3. Ensure all required fields are present
4. Clean up any hallucinations or obvious errors
5. Return a corrected, valid JSON response

**Required Output Fields:** {REQUIRED_FIELDS}

If the output is unfixable, generate a reasonable fallback response based on the task description.
Return ONLY valid JSON matching the expected schema.
`;

export interface ValidationResult<T> {
    success: boolean;
    data: T;
    wasFixed: boolean;
    fixReason?: string;
}

export async function validateAndFix<T>(
    taskDescription: string,
    agentOutput: string,
    requiredFields: string[],
    fallbackGenerator: () => T
): Promise<ValidationResult<T>> {
    // First, try to parse as-is
    try {
        const parsed = JSON.parse(agentOutput);
        const missingFields = requiredFields.filter(f => !(f in parsed));
        if (missingFields.length === 0) {
            return { success: true, data: parsed as T, wasFixed: false };
        }
    } catch {
        // JSON is invalid, needs fixing
    }

    // Ask the validator AI to fix it
    try {
        const prompt = VALIDATOR_PROMPT
            .replace('{TASK_DESCRIPTION}', taskDescription)
            .replace('{AGENT_OUTPUT}', agentOutput)
            .replace('{REQUIRED_FIELDS}', requiredFields.join(', '));

        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });

        const fixed = JSON.parse(response.text);
        return {
            success: true,
            data: fixed as T,
            wasFixed: true,
            fixReason: 'Validator AI corrected the response'
        };
    } catch (error) {
        console.warn('Validator agent failed, using fallback:', error);
        return {
            success: false,
            data: fallbackGenerator(),
            wasFixed: true,
            fixReason: 'Used fallback due to validation failure'
        };
    }
}

// Specific helper for strategy validation
export async function validateStrategy(rawOutput: string): Promise<{
    config?: string;
    schema?: string;
    snippet?: string;
    confidence: number;
    confidenceReason: string;
}> {
    const result = await validateAndFix(
        'Generate ingestion strategy with code snippets and schemas',
        rawOutput,
        ['confidence'],
        () => ({
            snippet: '# Unable to generate strategy - please try again',
            confidence: 10,
            confidenceReason: 'Validation failed, fallback response used'
        })
    );

    return {
        ...result.data,
        confidence: result.data.confidence ?? 50,
        confidenceReason: result.wasFixed
            ? `[Fixed] ${result.fixReason}`
            : (result.data.confidenceReason ?? 'No reason provided')
    };
}

// Specific helper for analysis validation  
export async function validateAnalysis(rawOutput: string, originalUrl: string): Promise<{
    accessMethod: string;
    target: string;
    justification: string;
    confidence: number;
}> {
    const result = await validateAndFix(
        `Determine access method for URL: ${originalUrl}`,
        rawOutput,
        ['accessMethod', 'target', 'justification', 'confidence'],
        () => ({
            accessMethod: 'WEB_CRAWL',
            target: originalUrl,
            justification: 'Fallback to web crawl due to validation error',
            confidence: 20
        })
    );

    return result.data;
}

// Specific helper for discovery validation
export async function validateDiscovery(rawOutput: string, description: string): Promise<{
    urls: string[];
}> {
    const result = await validateAndFix(
        `Find dataset URLs for: ${description}`,
        rawOutput,
        ['urls'],
        () => ({
            urls: []
        })
    );
    return result.data;
}
