export type AccessMethod = "DIRECT_DOWNLOAD" | "API" | "WEB_CRAWL" | "LOCAL_FILE";

export type LLMProvider = "gemini" | "deepseek" | "qwen" | "openai" | "claude";

export interface PlanSection {
  title: string;
  content: string;
}

export interface Strategy {
    config?: string;
    schema?: string;
    snippet?: string;
    method: AccessMethod;
    url: string;
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export interface DiscoveredLink {
    url: string;
    accessMethod: AccessMethod;
    justification: string;
    strategy: Strategy;
    cleaningStrategy?: string;
    validationStatus?: 'pending' | 'validating' | 'valid' | 'invalid';
    crawlId?: string;
    linkId?: string;
}

export interface ValidatedLink {
    id: string;
    url: string;
    status: string;
    metadata: any;
    crawl_id?: string;
    created_at: string;
}

export interface AIPlan {
    id: string;
    link_id: string;
    plan_data: any;
    created_at: string;
}