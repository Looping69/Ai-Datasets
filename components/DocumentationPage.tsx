
import React from 'react';
import { ShareIcon } from './icons/ShareIcon'; // Using Share as a placeholder or maybe just text
import { ChevronDownIcon } from './icons/ChevronDownIcon'; // Using Chevron for back

interface DocumentationPageProps {
    onBack: () => void;
}

const DocumentationPage: React.FC<DocumentationPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-[var(--bg-void)] text-[var(--text-normal)] font-sans flex flex-col">

            {/* Header */}
            <header className="w-full px-8 py-6 flex items-center justify-between border-b border-[var(--border-dim)] bg-[var(--bg-panel)] sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-[var(--bg-surface)] rounded-lg transition-colors text-[var(--text-dim)] hover:text-[var(--text-bright)]"
                    >
                        <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div className="font-bold text-[var(--text-bright)] flex items-center gap-2">
                        <span className="text-[var(--cyan-primary)]">DataScout</span>
                        <span>/</span>
                        <span>Documentation</span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-12">

                <article className="prose prose-slate max-w-none">
                    <h1 className="text-4xl font-bold text-[var(--text-bright)] mb-4">System Documentation</h1>
                    <p className="text-xl text-[var(--text-dim)] mb-12">
                        Deployment controls, architecture overview, and operational protocols for the Gemini-2.0 DataScout swarm.
                    </p>

                    <hr className="border-[var(--border-dim)] my-8" />

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-[var(--text-bright)] mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-[var(--cyan-primary)] rounded-full"></span>
                            Core Architecture
                        </h2>
                        <p className="mb-4 leading-relaxed">
                            The system operates on a <strong>Multi-Agent Swarm</strong> architecture powered by Google's Gemini 2.0 Flash-Exp model. It decouples the discovery process into four distinct concurrent phases:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                            <div className="p-4 border border-[var(--border-dim)] rounded-xl bg-[var(--bg-panel)]">
                                <strong className="text-[var(--cyan-primary)] block mb-1">01. Discovery Agent</strong>
                                <span className="text-sm">Scans 15+ search parameters to locate raw data endpoints.</span>
                            </div>
                            <div className="p-4 border border-[var(--border-dim)] rounded-xl bg-[var(--bg-panel)]">
                                <strong className="text-[var(--cyan-primary)] block mb-1">02. Analysis Agent</strong>
                                <span className="text-sm">Determines Access Method (API vs Crawl vs Download) via header inspection.</span>
                            </div>
                            <div className="p-4 border border-[var(--border-dim)] rounded-xl bg-[var(--bg-panel)]">
                                <strong className="text-[var(--cyan-primary)] block mb-1">03. Strategy Agent</strong>
                                <span className="text-sm">Synthesizes executable Python/Spider code for ingestion.</span>
                            </div>
                            <div className="p-4 border border-[var(--border-dim)] rounded-xl bg-[var(--bg-panel)]">
                                <strong className="text-[var(--cyan-primary)] block mb-1">04. Refinement Agent</strong>
                                <span className="text-sm">Iteratively cleans data based on natural language constraints.</span>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-[var(--text-bright)] mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-[var(--cyan-primary)] rounded-full"></span>
                            Tactical Lab Interface
                        </h2>
                        <p className="mb-4 leading-relaxed">
                            The UI implements a "Light Mode Tactical" design system designed for high-contrast visibility in bright laboratory environments.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-[var(--text-normal)]">
                            <li><strong>Strict Geometry:</strong> 45-degree chamfered corners on all interactive elements.</li>
                            <li><strong>Color Semantics:</strong> Teal (#0891B2) indicates active/safe state; Orange indicates heuristic uncertainty.</li>
                            <li><strong>Responsive Grid:</strong> The background mesh serves as a alignment guide for data visualization.</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-[var(--text-bright)] mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-[var(--cyan-primary)] rounded-full"></span>
                            Troubleshooting
                        </h2>
                        <div className="bg-slate-50 border-l-4 border-[var(--orange-warn)] p-4 rounded-r-xl">
                            <h4 className="font-bold text-[var(--text-bright)] mb-2">API Connection Failures</h4>
                            <p className="text-sm">
                                Ensure your <code>VITE_API_KEY</code> is set in the <code>.env</code> file. The system requires access to <code>gemini-2.0-flash-exp</code>. If rate limits are hit, the system will auto-retry with exponential backoff.
                            </p>
                        </div>
                    </section>

                </article>

            </main>
        </div>
    );
};

export default DocumentationPage;
