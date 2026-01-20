
# AI DATASET DISCOVERY PIPELINE
### TACTICAL DATA INTERFACE // v2.0 // LATEST-AI-CORE

![Status](https://img.shields.io/badge/SYSTEM-ONLINE-green?style=for-the-badge) ![Core](https://img.shields.io/badge/CORE-MULTI--AGENT-cyan?style=for-the-badge) ![Design](https://img.shields.io/badge/UI-TACTICAL--LAB-white?style=for-the-badge)

<div align="center">
  <h3>RECONNAISSANCE PROTOCOL INITIATED</h3>
  <p>Automated discovery, analysis, and ingestion strategy generation for machine learning datasets.</p>
</div>

---

## [MISSION BRIEFING]

The **AI Dataset Discovery Pipeline** is a specialized tactical interface designed to accelerate the acquisition of machine learning data. Powered by a swarm of advanced autonomous agents, it autonomously scans the web, analyzes target endpoints, and generates precise ingestion strategies—whether for direct downloads, API integration, or complex web crawling.

Now features the **"Tactical Lab"** design system: a high-contrast, light-mode HUD optimized for data visibility and technical precision.

## [SYSTEM ARCHITECTURE]

The pipeline operates via a coordinated four-agent swarm:

1.  **DISCOVERY AGENT**: Scans the open web to identify high-potential dataset sources based on mission parameters.
2.  **ANALYSIS AGENT**: Probes target URLs to determine the optimal access method (`DIRECT_DOWNLOAD`, `API`, or `WEB_CRAWL`).
3.  **STRATEGY AGENT**: Generates executable code snippets (Python/cURL/JavaScript) and infers data schemas (`JSON`) for immediate integration.
4.  **REFINEMENT AGENT**: Accepts natural language commands to generate post-processing cleaning scripts (e.g., "Normalize dates to ISO-8601").

## [OPERATIONAL CAPABILITIES]

*   **Autonomic Web Scanning**: Locate datasets from vague descriptions (e.g., "Satellite imagery of crop yields in diverse climates").
*   **Tactical HUD Interface**: Angular, "Glass & Steel" UI with technical visualizations, barcodes, and status indicators.
*   **Local Asset Analysis**: Drag-and-drop local files (`.csv`, `.json`) for instant schema inference and Python loading scripts.
*   **Spider Configuration**: Auto-generation of **Firecrawl** configurations for scraping complex datasets.
*   **Schema Definition**: Automatic inference of data types and structures.

## [DEPLOYMENT INSTRUCTIONS]

### 1. INITIALIZE ENVIRONMENT
Ensure **Node.js** (v18+) is installed.

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
```

### 2. CONFIGURE CREDENTIALS
Create a `.env` file in the root directory and input your API key:

```env
VITE_API_KEY=your_api_key_here
```

### 3. LAUNCH SYSTEM
Start the development server:

```bash
npm run dev
```
Access the tactical interface at `http://localhost:3000`.

## [DESIGN SYSTEM: TACTICAL LAB]

The v2.0 UI implements a rigorous design language:
*   **Palette**: Slate 100/50 backgrounds, Charcoal text, Teal (`#0891B2`) accents.
*   **Geometry**: Notched corners (`clip-path`), double-line borders, angular buttons.
*   **Typography**: `Orbitron` (Headers), `Rajdhani` (Body), `Share Tech Mono` (Data).

---
**STATUS**: READY FOR DEPLOYMENT // **SECURE CONNECTION ESTABLISHED**
