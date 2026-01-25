
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export interface AnalysisResponse {
    url: string;
    statusCode: number;
    contentType: string;
    contentLength: number;
    contentSnippet: string;
    isDownloadable: boolean;
    headers: Record<string, string>;
}

export interface SearchResponse {
    urls: string[];
}

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers as Record<string, string>,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
}

/**
 * Real discovery: Calls search API via backend
 */
export async function searchDatasets(query: string): Promise<string[]> {
    const data = await apiRequest<SearchResponse>(`/datasets/search?query=${encodeURIComponent(query)}`, {
        method: 'GET'
    });
    return data.urls;
}

/**
 * Real analysis: Fetches metadata and snippet via backend
 */
export async function analyzeUrl(url: string): Promise<AnalysisResponse> {
    return apiRequest<AnalysisResponse>(`/datasets/analyze`, {
        method: 'POST',
        body: JSON.stringify({ url }),
    });
}
