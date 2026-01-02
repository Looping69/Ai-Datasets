
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
}

export interface DiscoveredLink {
    url: string;
    accessMethod: AccessMethod;
    justification: string;
    strategy: Strategy; // Changed from string to a structured object
    cleaningStrategy?: string; // Holds the result of the refinement agent
}
