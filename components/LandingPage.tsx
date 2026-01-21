import React from 'react';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { ApiIcon } from './icons/ApiIcon';
import { RefineIcon } from './icons/RefineIcon';

interface LandingPageProps {
    onEnter: () => void;
    onViewDocs: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onViewDocs }) => {
    return (
        <div className="min-h-screen relative overflow-x-hidden">
            {/* Top Bar */}
            <header className="relative z-10 w-full px-8 py-6 border-b border-[var(--border-dim)] bg-[var(--bg-panel)] flex items-center justify-between hud-frame">
                <div className="flex items-center gap-4">
                    <div className="bg-[var(--cyan-primary)] p-2 clip-path-[var(--clip-panel-sm)]">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <h1 className="hud-title text-2xl">
                        DATASCOUT
                    </h1>
                </div>
                <div className="hidden md:block">
                    <span className="hud-status">
                        SYSTEM ACTIVE
                    </span>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-block mb-6">
                            <span className="hud-label text-[var(--cyan-primary)] bg-[var(--cyan-dim)] px-4 py-2">
                                AI-POWERED DATA DISCOVERY
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black leading-tight mb-8 hud-title text-[var(--text-bright)]">
                            INTELLIGENT <span className="text-[var(--cyan-primary)]">DATASET</span><br />
                            DISCOVERY
                        </h2>
                        <p className="text-xl md:text-2xl text-[var(--text-normal)] mb-12 max-w-xl border-l-4 border-[var(--cyan-primary)] pl-6 py-4">
                            Deploy autonomous AI agents to discover, analyze, and extract datasets from across the web. Generate ready-to-use ingestion strategies instantly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <button
                                onClick={onEnter}
                                className="hud-button-primary group"
                            >
                                <span className="flex items-center gap-3">
                                    START DISCOVERY
                                    <MagnifyingGlassIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </span>
                            </button>
                            <button
                                onClick={onViewDocs}
                                className="hud-button"
                            >
                                VIEW DOCUMENTATION
                            </button>
                        </div>
                    </div>

                    {/* Decorative Data Visualizer */}
                    <div className="hidden lg:block relative h-[500px] hud-frame hud-frame-glow overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="h-px bg-[var(--cyan-primary)] w-full my-4 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-4 font-mono text-xs text-[var(--text-dim)] p-6">
                            <div className="hud-status">SCANNING WEB LAYERS</div>
                            <div className="hud-label">AGENTS DEPLOYED: 04</div>
                            <div className="text-[var(--orange-warn)] font-bold">⚠ DATA DENSITY: HIGH</div>
                            <div className="hud-label">EXTRACTING METADATA</div>
                            <div className="hud-loading-bar mt-4"></div>
                            <div className="mt-8 bg-[var(--cyan-primary)] text-white p-3 font-bold w-full clip-path-[var(--clip-panel-sm)]">
                                ANALYSIS COMPLETE: 99.8%
                            </div>
                            <div className="grid grid-cols-5 gap-2 mt-4">
                                {[...Array(25)].map((_, i) => (
                                    <div key={i} className={`h-8 border border-[var(--border-dim)] ${Math.random() > 0.5 ? 'bg-[var(--cyan-dim)]' : 'bg-transparent'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hud-divider my-20"></div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                    <div className="hud-frame p-8 hover:hud-frame-glow transition-all">
                        <div className="w-16 h-16 bg-[var(--cyan-primary)] text-white mb-6 flex items-center justify-center clip-path-[var(--clip-panel-sm)]">
                            <MagnifyingGlassIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 hud-title text-[var(--text-bright)]">DEEP DISCOVERY</h3>
                        <p className="text-[var(--text-normal)] leading-relaxed">
                            Locate datasets across academic repositories, government portals, and public APIs using intelligent search algorithms.
                        </p>
                    </div>

                    <div className="hud-frame p-8 hover:hud-frame-glow transition-all">
                        <div className="w-16 h-16 bg-[var(--green-status)] text-white mb-6 flex items-center justify-center clip-path-[var(--clip-panel-sm)]">
                            <ApiIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 hud-title text-[var(--text-bright)]">AUTO STRATEGY</h3>
                        <p className="text-[var(--text-normal)] leading-relaxed">
                            Generate Python scripts, curl commands, and API integration code tailored to each data source automatically.
                        </p>
                    </div>

                    <div className="hud-frame p-8 hover:hud-frame-glow transition-all">
                        <div className="w-16 h-16 bg-[var(--orange-warn)] text-white mb-6 flex items-center justify-center clip-path-[var(--clip-panel-sm)]">
                            <RefineIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 hud-title text-[var(--text-bright)]">SCHEMA INFERENCE</h3>
                        <p className="text-[var(--text-normal)] leading-relaxed">
                            Autonomous data type detection and schema generation. Export as JSON or SQL schemas ready for production.
                        </p>
                    </div>
                </div>

                <div className="mt-32 text-center hud-brackets py-8">
                    <h3 className="text-3xl md:text-5xl font-black hud-title text-[var(--text-bright)]">
                        STOP SEARCHING. <span className="text-[var(--cyan-primary)]">START EXTRACTING.</span>
                    </h3>
                </div>

            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full py-12 border-t border-[var(--border-dim)] bg-[var(--bg-panel)] flex flex-col items-center">
                <div className="flex gap-8 mb-6 text-[var(--text-dim)] font-mono text-sm">
                    <span className="hud-label">VERSION 2.0.42</span>
                    <span className="hud-label">POWERED BY AI</span>
                    <span className="hud-label">OPEN SOURCE</span>
                </div>
                <div className="text-[var(--text-muted)] text-sm font-mono">
                    © 2026 DataScout AI. Autonomous Agent Core.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
