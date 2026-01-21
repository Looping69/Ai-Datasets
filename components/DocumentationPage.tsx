import React, { useState } from 'react';

interface DocumentationPageProps {
    onBack: () => void;
}

const DocumentationPage: React.FC<DocumentationPageProps> = ({ onBack }) => {
    const [activeSection, setActiveSection] = useState<string>('overview');

    const sections = [
        { id: 'overview', label: 'Overview' },
        { id: 'architecture', label: 'Architecture' },
        { id: 'agents', label: 'AI Agents' },
        { id: 'workflow', label: 'Workflow' },
        { id: 'api', label: 'API Reference' },
        { id: 'deployment', label: 'Deployment' },
        { id: 'troubleshooting', label: 'Troubleshooting' },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-void)]">
            {/* Header */}
            <header className="w-full px-8 py-6 border-b border-[var(--border-dim)] bg-[var(--bg-panel)] sticky top-0 z-50 hud-frame">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="hud-button text-sm"
                        >
                            ← BACK
                        </button>
                        <div className="hud-title text-xl flex items-center gap-2">
                            <span className="text-[var(--cyan-primary)]">DATASCOUT</span>
                            <span className="text-[var(--text-dim)]">/</span>
                            <span>DOCUMENTATION</span>
                        </div>
                    </div>
                    <div className="hud-status">
                        DOCS v2.0
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-8 py-12 flex gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-64 flex-shrink-0 sticky top-32 h-fit">
                    <nav className="hud-frame p-6">
                        <div className="hud-label mb-4">NAVIGATION</div>
                        <ul className="space-y-2">
                            {sections.map((section) => (
                                <li key={section.id}>
                                    <button
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full text-left px-4 py-2 transition-all ${activeSection === section.id
                                                ? 'bg-[var(--cyan-dim)] text-[var(--cyan-primary)] font-bold border-l-4 border-[var(--cyan-primary)]'
                                                : 'text-[var(--text-normal)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-bright)]'
                                            }`}
                                    >
                                        {section.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {activeSection === 'overview' && (
                        <div className="space-y-8">
                            <div className="hud-frame p-8">
                                <h1 className="hud-title text-4xl mb-4">SYSTEM OVERVIEW</h1>
                                <p className="text-[var(--text-normal)] text-lg leading-relaxed mb-6">
                                    DataScout is an autonomous AI-powered data discovery and ingestion platform that deploys intelligent agents to locate, analyze, and extract datasets from across the web.
                                </p>
                                <div className="hud-divider"></div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                    <div className="hud-brackets p-4">
                                        <div className="hud-label mb-2">AUTONOMOUS</div>
                                        <p className="text-sm text-[var(--text-dim)]">Zero-config AI agents handle discovery</p>
                                    </div>
                                    <div className="hud-brackets p-4">
                                        <div className="hud-label mb-2">INTELLIGENT</div>
                                        <p className="text-sm text-[var(--text-dim)]">Context-aware strategy generation</p>
                                    </div>
                                    <div className="hud-brackets p-4">
                                        <div className="hud-label mb-2">SCALABLE</div>
                                        <p className="text-sm text-[var(--text-dim)]">Parallel processing architecture</p>
                                    </div>
                                </div>
                            </div>

                            <div className="hud-frame hud-frame-glow p-8">
                                <h2 className="hud-title text-2xl mb-4">KEY FEATURES</h2>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[var(--cyan-primary)] font-bold">→</span>
                                        <div>
                                            <strong className="text-[var(--text-bright)]">Multi-Agent Swarm Intelligence</strong>
                                            <p className="text-[var(--text-dim)] text-sm">Four specialized AI agents work in parallel to discover, analyze, strategize, and refine data pipelines.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[var(--cyan-primary)] font-bold">→</span>
                                        <div>
                                            <strong className="text-[var(--text-bright)]">Automatic Code Generation</strong>
                                            <p className="text-[var(--text-dim)] text-sm">Generates production-ready Python, curl, and JavaScript code tailored to each data source.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[var(--cyan-primary)] font-bold">→</span>
                                        <div>
                                            <strong className="text-[var(--text-bright)]">Schema Inference</strong>
                                            <p className="text-[var(--text-dim)] text-sm">Autonomous detection of data types and automatic JSON/SQL schema generation.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[var(--cyan-primary)] font-bold">→</span>
                                        <div>
                                            <strong className="text-[var(--text-bright)]">Natural Language Refinement</strong>
                                            <p className="text-[var(--text-dim)] text-sm">Describe data transformations in plain English; the system generates cleaning pipelines.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeSection === 'architecture' && (
                        <div className="space-y-8">
                            <div className="hud-frame p-8">
                                <h1 className="hud-title text-4xl mb-4">SYSTEM ARCHITECTURE</h1>
                                <p className="text-[var(--text-normal)] leading-relaxed mb-6">
                                    DataScout employs a microservices-inspired architecture where each AI agent operates as an independent service with a specific responsibility.
                                </p>
                            </div>

                            <div className="hud-frame p-8">
                                <h2 className="hud-title text-2xl mb-6">TECHNOLOGY STACK</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="hud-label mb-3">FRONTEND</div>
                                        <ul className="space-y-2 text-[var(--text-normal)]">
                                            <li className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-[var(--cyan-primary)] rounded-full"></span>
                                                React 19 + TypeScript
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-[var(--cyan-primary)] rounded-full"></span>
                                                Vite Build System
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-[var(--cyan-primary)] rounded-full"></span>
                                                HUD Design System (Custom CSS)
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="hud-label mb-3">AI LAYER</div>
                                        <ul className="space-y-2 text-[var(--text-normal)]">
                                            <li className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-[var(--green-status)] rounded-full"></span>
                                                Gemini 3.0 Flash
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-[var(--green-status)] rounded-full"></span>
                                                Google GenAI SDK
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-[var(--green-status)] rounded-full"></span>
                                                Structured Output (JSON Schema)
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="hud-frame hud-frame-glow p-8">
                                <h2 className="hud-title text-2xl mb-6">DATA FLOW</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="hud-label bg-[var(--cyan-dim)] px-4 py-2">INPUT</div>
                                        <div className="flex-1 h-px bg-[var(--border-dim)]"></div>
                                        <span className="text-[var(--text-dim)]">User Query</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hud-label bg-[var(--cyan-dim)] px-4 py-2">STAGE 1</div>
                                        <div className="flex-1 h-px bg-[var(--border-dim)]"></div>
                                        <span className="text-[var(--text-dim)]">Discovery Agent → URL List</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hud-label bg-[var(--cyan-dim)] px-4 py-2">STAGE 2</div>
                                        <div className="flex-1 h-px bg-[var(--border-dim)]"></div>
                                        <span className="text-[var(--text-dim)]">Analysis Agent → Access Method</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hud-label bg-[var(--cyan-dim)] px-4 py-2">STAGE 3</div>
                                        <div className="flex-1 h-px bg-[var(--border-dim)]"></div>
                                        <span className="text-[var(--text-dim)]">Strategy Agent → Code + Schema</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hud-label bg-[var(--green-status)] text-white px-4 py-2">OUTPUT</div>
                                        <div className="flex-1 h-px bg-[var(--border-dim)]"></div>
                                        <span className="text-[var(--text-dim)]">Ready-to-Deploy Pipeline</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'agents' && (
                        <div className="space-y-8">
                            <div className="hud-frame p-8">
                                <h1 className="hud-title text-4xl mb-4">AI AGENT SPECIFICATIONS</h1>
                                <p className="text-[var(--text-normal)] leading-relaxed">
                                    Each agent is a specialized AI module with distinct responsibilities and capabilities.
                                </p>
                            </div>

                            {[
                                {
                                    name: 'DISCOVERY AGENT',
                                    color: 'cyan-primary',
                                    purpose: 'Locate dataset URLs across the web',
                                    input: 'Natural language dataset description',
                                    output: 'Array of 6-8 high-quality dataset URLs',
                                    capabilities: [
                                        'Multi-source search (academic, government, public APIs)',
                                        'Relevance scoring and filtering',
                                        'Duplicate detection',
                                        'URL validation'
                                    ]
                                },
                                {
                                    name: 'ANALYSIS AGENT',
                                    color: 'green-status',
                                    purpose: 'Determine optimal data access method',
                                    input: 'Target URL',
                                    output: 'Access method classification + confidence score',
                                    capabilities: [
                                        'HTTP header inspection',
                                        'Content-Type detection',
                                        'API endpoint identification',
                                        'Download link extraction'
                                    ]
                                },
                                {
                                    name: 'STRATEGY AGENT',
                                    color: 'orange-warn',
                                    purpose: 'Generate executable ingestion code',
                                    input: 'Access method + target URL',
                                    output: 'Code snippet + data schema + confidence',
                                    capabilities: [
                                        'Python script generation (Pandas, requests)',
                                        'curl command synthesis',
                                        'Firecrawl configuration',
                                        'Schema inference from context'
                                    ]
                                },
                                {
                                    name: 'REFINEMENT AGENT',
                                    color: 'cyan-bright',
                                    purpose: 'Transform and clean data',
                                    input: 'Strategy context + cleaning instructions',
                                    output: 'Step-by-step transformation pipeline',
                                    capabilities: [
                                        'Natural language to code translation',
                                        'Data validation rules',
                                        'Type conversion strategies',
                                        'Error handling patterns'
                                    ]
                                }
                            ].map((agent, idx) => (
                                <div key={idx} className="hud-frame hud-frame-glow p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-3 h-3 bg-[var(--${agent.color})] rounded-full`}></div>
                                        <h2 className="hud-title text-2xl">{agent.name}</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <div className="hud-label mb-2">PURPOSE</div>
                                            <p className="text-[var(--text-normal)]">{agent.purpose}</p>
                                        </div>
                                        <div>
                                            <div className="hud-label mb-2">I/O SPECIFICATION</div>
                                            <p className="text-sm text-[var(--text-dim)]">
                                                <strong>Input:</strong> {agent.input}<br />
                                                <strong>Output:</strong> {agent.output}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hud-label mb-3">CAPABILITIES</div>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {agent.capabilities.map((cap, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-normal)]">
                                                <span className="text-[var(--cyan-primary)] mt-1">▸</span>
                                                {cap}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSection === 'workflow' && (
                        <div className="space-y-8">
                            <div className="hud-frame p-8">
                                <h1 className="hud-title text-4xl mb-4">OPERATIONAL WORKFLOW</h1>
                                <p className="text-[var(--text-normal)] leading-relaxed">
                                    Step-by-step guide to using DataScout for dataset discovery and ingestion.
                                </p>
                            </div>

                            {[
                                {
                                    step: '01',
                                    title: 'DESCRIBE YOUR DATA NEED',
                                    description: 'Enter a natural language description of the dataset you\'re looking for.',
                                    example: '"Climate change temperature data for major US cities from 2000-2024"',
                                    tips: ['Be specific about time ranges', 'Mention geographic scope', 'Include data format preferences']
                                },
                                {
                                    step: '02',
                                    title: 'REVIEW DISCOVERED URLS',
                                    description: 'The Discovery Agent returns 6-8 candidate URLs ranked by relevance.',
                                    example: 'URLs from NOAA, NASA, academic repositories, and data.gov',
                                    tips: ['Check confidence scores', 'Verify source credibility', 'Select most promising candidates']
                                },
                                {
                                    step: '03',
                                    title: 'ANALYZE ACCESS METHODS',
                                    description: 'Each URL is analyzed to determine the optimal ingestion strategy.',
                                    example: 'DIRECT_DOWNLOAD for CSV files, API for REST endpoints, WEB_CRAWL for HTML tables',
                                    tips: ['Review justification text', 'Note confidence levels', 'Understand access complexity']
                                },
                                {
                                    step: '04',
                                    title: 'GENERATE INGESTION CODE',
                                    description: 'Receive production-ready code snippets and data schemas.',
                                    example: 'Python script with Pandas, curl command, or Firecrawl config',
                                    tips: ['Copy code to clipboard', 'Review schema structure', 'Test in local environment']
                                },
                                {
                                    step: '05',
                                    title: 'REFINE & TRANSFORM (OPTIONAL)',
                                    description: 'Describe data cleaning needs in natural language.',
                                    example: '"Remove rows with missing temperature values and convert Fahrenheit to Celsius"',
                                    tips: ['Use clear transformation language', 'Specify validation rules', 'Request error handling']
                                }
                            ].map((workflow, idx) => (
                                <div key={idx} className="hud-frame p-8">
                                    <div className="flex items-start gap-6">
                                        <div className="hud-label bg-[var(--cyan-primary)] text-white px-6 py-3 text-2xl font-black">
                                            {workflow.step}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="hud-title text-xl mb-3">{workflow.title}</h2>
                                            <p className="text-[var(--text-normal)] mb-4">{workflow.description}</p>
                                            <div className="bg-[var(--bg-surface)] p-4 border-l-4 border-[var(--cyan-primary)] mb-4">
                                                <div className="hud-label text-xs mb-2">EXAMPLE</div>
                                                <code className="text-sm text-[var(--text-dim)]">{workflow.example}</code>
                                            </div>
                                            <div className="hud-label text-xs mb-2">PRO TIPS</div>
                                            <ul className="space-y-1">
                                                {workflow.tips.map((tip, i) => (
                                                    <li key={i} className="text-sm text-[var(--text-dim)] flex items-start gap-2">
                                                        <span className="text-[var(--cyan-primary)]">•</span>
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSection === 'api' && (
                        <div className="space-y-8">
                            <div className="hud-frame p-8">
                                <h1 className="hud-title text-4xl mb-4">API REFERENCE</h1>
                                <p className="text-[var(--text-normal)] leading-relaxed">
                                    Internal service interfaces for each AI agent module.
                                </p>
                            </div>

                            <div className="hud-frame hud-frame-glow p-8">
                                <h2 className="hud-title text-2xl mb-6">DISCOVERY AGENT</h2>
                                <div className="bg-[var(--bg-surface)] p-6 font-mono text-sm mb-4">
                                    <div className="text-[var(--cyan-primary)]">async function</div>
                                    <div className="text-[var(--text-bright)] ml-4">findDatasetUrls(datasetDescription: string)</div>
                                    <div className="text-[var(--text-dim)] ml-4">: Promise&lt;DiscoveryResult&gt;</div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="hud-label mb-2">PARAMETERS</div>
                                        <code className="text-sm text-[var(--text-normal)]">datasetDescription: string</code>
                                        <p className="text-sm text-[var(--text-dim)] mt-1">Natural language description of desired dataset</p>
                                    </div>
                                    <div>
                                        <div className="hud-label mb-2">RETURNS</div>
                                        <code className="text-sm text-[var(--text-normal)]">{'{ urls: string[] }'}</code>
                                        <p className="text-sm text-[var(--text-dim)] mt-1">Array of 6-8 discovered dataset URLs</p>
                                    </div>
                                </div>
                            </div>

                            <div className="hud-frame hud-frame-glow p-8">
                                <h2 className="hud-title text-2xl mb-6">ANALYSIS AGENT</h2>
                                <div className="bg-[var(--bg-surface)] p-6 font-mono text-sm mb-4">
                                    <div className="text-[var(--cyan-primary)]">async function</div>
                                    <div className="text-[var(--text-bright)] ml-4">analyzeUrlForAccessMethod(url: string)</div>
                                    <div className="text-[var(--text-dim)] ml-4">: Promise&lt;AnalysisResult&gt;</div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="hud-label mb-2">PARAMETERS</div>
                                        <code className="text-sm text-[var(--text-normal)]">url: string</code>
                                        <p className="text-sm text-[var(--text-dim)] mt-1">Target URL to analyze</p>
                                    </div>
                                    <div>
                                        <div className="hud-label mb-2">RETURNS</div>
                                        <code className="text-sm text-[var(--text-normal)]">
                                            {'{ accessMethod, target, justification, confidence }'}
                                        </code>
                                        <p className="text-sm text-[var(--text-dim)] mt-1">Access method classification with confidence score (0-100)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="hud-frame hud-frame-glow p-8">
                                <h2 className="hud-title text-2xl mb-6">STRATEGY AGENT</h2>
                                <div className="bg-[var(--bg-surface)] p-6 font-mono text-sm mb-4">
                                    <div className="text-[var(--cyan-primary)]">async function</div>
                                    <div className="text-[var(--text-bright)] ml-4">generateStrategy(accessMethod, target)</div>
                                    <div className="text-[var(--text-dim)] ml-4">: Promise&lt;Strategy&gt;</div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="hud-label mb-2">PARAMETERS</div>
                                        <code className="text-sm text-[var(--text-normal)]">accessMethod: AccessMethod, target: string</code>
                                        <p className="text-sm text-[var(--text-dim)] mt-1">Access method and target URL from Analysis Agent</p>
                                    </div>
                                    <div>
                                        <div className="hud-label mb-2">RETURNS</div>
                                        <code className="text-sm text-[var(--text-normal)]">
                                            {'{ snippet, schema?, config?, confidence, confidenceReason }'}
                                        </code>
                                        <p className="text-sm text-[var(--text-dim)] mt-1">Code snippet, optional schema/config, and confidence metrics</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'deployment' && (
                        <div className="space-y-8">
                            <div className="hud-frame p-8">
                                <h1 className="hud-title text-4xl mb-4">DEPLOYMENT GUIDE</h1>
                                <p className="text-[var(--text-normal)] leading-relaxed">
                                    Instructions for deploying DataScout in development and production environments.
                                </p>
                            </div>

                            <div className="hud-frame hud-frame-glow p-8">
                                <h2 className="hud-title text-2xl mb-6">ENVIRONMENT SETUP</h2>
                                <div className="space-y-4">
                                    <div>
                                        <div className="hud-label mb-3">STEP 1: CLONE REPOSITORY</div>
                                        <div className="bg-[var(--bg-surface)] p-4 font-mono text-sm">
                                            git clone https://github.com/your-org/datascout.git<br />
                                            cd datascout
                                        </div>
                                    </div>
                                    <div>
                                        <div className="hud-label mb-3">STEP 2: INSTALL DEPENDENCIES</div>
                                        <div className="bg-[var(--bg-surface)] p-4 font-mono text-sm">
                                            npm install
                                        </div>
                                    </div>
                                    <div>
                                        <div className="hud-label mb-3">STEP 3: CONFIGURE API KEY</div>
                                        <div className="bg-[var(--bg-surface)] p-4 font-mono text-sm mb-2">
                                            # Create .env file<br />
                                            VITE_API_KEY=your_gemini_api_key_here
                                        </div>
                                        <p className="text-sm text-[var(--text-dim)]">
                                            Obtain API key from <a href="https://ai.google.dev" className="text-[var(--cyan-primary)] underline">Google AI Studio</a>
                                        </p>
                                    </div>
                                    <div>
                                        <div className="hud-label mb-3">STEP 4: START DEVELOPMENT SERVER</div>
                                        <div className="bg-[var(--bg-surface)] p-4 font-mono text-sm">
                                            npm run dev
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="hud-frame p-8">
                                <h2 className="hud-title text-2xl mb-6">PRODUCTION BUILD</h2>
                                <div className="space-y-4">
                                    <div>
                                        <div className="hud-label mb-3">BUILD COMMAND</div>
                                        <div className="bg-[var(--bg-surface)] p-4 font-mono text-sm">
                                            npm run build
                                        </div>
                                    </div>
                                    <div>
                                        <div className="hud-label mb-3">OUTPUT DIRECTORY</div>
                                        <code className="text-sm">./dist</code>
                                        <p className="text-sm text-[var(--text-dim)] mt-2">
                                            Static files ready for deployment to any hosting platform (Vercel, Netlify, Cloudflare Pages, etc.)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="hud-frame p-8 bg-[var(--cyan-dim)] border-[var(--cyan-primary)]">
                                <h3 className="hud-title text-xl mb-4">⚡ PERFORMANCE OPTIMIZATION</h3>
                                <ul className="space-y-2 text-sm text-[var(--text-normal)]">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--cyan-primary)]">→</span>
                                        Enable HTTP/2 on your hosting platform
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--cyan-primary)]">→</span>
                                        Configure CDN caching for static assets
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--cyan-primary)]">→</span>
                                        Set appropriate cache headers (1 year for immutable assets)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--cyan-primary)]">→</span>
                                        Enable gzip/brotli compression
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeSection === 'troubleshooting' && (
                        <div className="space-y-8">
                            <div className="hud-frame p-8">
                                <h1 className="hud-title text-4xl mb-4">TROUBLESHOOTING</h1>
                                <p className="text-[var(--text-normal)] leading-relaxed">
                                    Common issues and their solutions.
                                </p>
                            </div>

                            {[
                                {
                                    issue: 'API Connection Failures',
                                    severity: 'high',
                                    symptoms: ['Error: "Type is not defined"', 'Network request failures', '401 Unauthorized errors'],
                                    solutions: [
                                        'Verify VITE_API_KEY is set in .env file',
                                        'Restart development server after changing .env',
                                        'Check API key validity at ai.google.dev',
                                        'Ensure API key has Gemini API access enabled'
                                    ]
                                },
                                {
                                    issue: 'Rate Limiting',
                                    severity: 'medium',
                                    symptoms: ['429 Too Many Requests', 'Slow response times', 'Intermittent failures'],
                                    solutions: [
                                        'System implements automatic exponential backoff',
                                        'Reduce concurrent agent calls if needed',
                                        'Upgrade to higher API tier for production use',
                                        'Implement request queuing for batch operations'
                                    ]
                                },
                                {
                                    issue: 'Invalid JSON Responses',
                                    severity: 'medium',
                                    symptoms: ['Parse errors', 'Malformed agent output', 'Missing required fields'],
                                    solutions: [
                                        'Validator Agent automatically attempts fixes',
                                        'Check model version (should be gemini-3.0-flash)',
                                        'Review response schema definitions',
                                        'Enable debug logging to inspect raw responses'
                                    ]
                                },
                                {
                                    issue: 'Build Errors',
                                    severity: 'low',
                                    symptoms: ['TypeScript compilation errors', 'Module not found', 'Vite build failures'],
                                    solutions: [
                                        'Clear node_modules and reinstall: rm -rf node_modules && npm install',
                                        'Clear Vite cache: rm -rf .vite',
                                        'Verify TypeScript version matches package.json (~5.8.2)',
                                        'Check for conflicting global packages'
                                    ]
                                }
                            ].map((item, idx) => (
                                <div key={idx} className={`hud-frame p-8 ${item.severity === 'high' ? 'border-[var(--red-error)]' : item.severity === 'medium' ? 'border-[var(--orange-warn)]' : ''}`}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`hud-label px-4 py-2 ${item.severity === 'high' ? 'bg-[var(--red-error)] text-white' :
                                                item.severity === 'medium' ? 'bg-[var(--orange-warn)] text-white' :
                                                    'bg-[var(--green-status)] text-white'
                                            }`}>
                                            {item.severity.toUpperCase()}
                                        </div>
                                        <h2 className="hud-title text-2xl">{item.issue}</h2>
                                    </div>
                                    <div className="mb-4">
                                        <div className="hud-label mb-2">SYMPTOMS</div>
                                        <ul className="space-y-1">
                                            {item.symptoms.map((symptom, i) => (
                                                <li key={i} className="text-sm text-[var(--text-dim)] flex items-start gap-2">
                                                    <span className="text-[var(--red-error)]">✗</span>
                                                    {symptom}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="hud-label mb-2">SOLUTIONS</div>
                                        <ul className="space-y-2">
                                            {item.solutions.map((solution, i) => (
                                                <li key={i} className="text-sm text-[var(--text-normal)] flex items-start gap-2">
                                                    <span className="text-[var(--green-status)] font-bold">→</span>
                                                    {solution}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}

                            <div className="hud-frame hud-frame-glow p-8">
                                <h2 className="hud-title text-2xl mb-4">NEED MORE HELP?</h2>
                                <p className="text-[var(--text-normal)] mb-4">
                                    If you're experiencing issues not covered here, please:
                                </p>
                                <ul className="space-y-2 text-sm text-[var(--text-dim)]">
                                    <li className="flex items-center gap-2">
                                        <span className="text-[var(--cyan-primary)]">→</span>
                                        Check the GitHub Issues page for known bugs
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[var(--cyan-primary)]">→</span>
                                        Review the system logs in browser DevTools console
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[var(--cyan-primary)]">→</span>
                                        Open a new issue with detailed reproduction steps
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DocumentationPage;
