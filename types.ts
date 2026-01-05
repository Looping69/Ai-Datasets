
export type AccessMethod = "DIRECT_DOWNLOAD" | "API" | "WEB_CRAWL" | "LOCAL_FILE";

export interface PlanSection {
  title: string;
  content: string;
}

/**
 * A structured object representing the AI-generated strategy.
 * This is more robust than parsing a markdown string.
 */
export interface Strategy {
  config?: string;  // Stringified JSON for Firecrawl config
  schema?: string;  // Stringified JSON for data schema
  snippet?: string; // Code snippet (e.g., curl, javascript, python)
  confidence?: number;       // 0-100 score of how reliable this strategy is
  confidenceReason?: string; // Why this confidence level
}

export interface DiscoveredLink {
  url: string;
  accessMethod: AccessMethod;
  justification: string;
  confidence?: number;        // Confidence in the access method detection
  strategy: Strategy;
  cleaningStrategy?: string;
}
