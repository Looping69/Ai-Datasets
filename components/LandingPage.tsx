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
        <div className="cyber-root min-h-screen relative overflow-x-hidden selection:bg-[var(--cb-accent)] selection:text-black">
            {/* Background Grid */}
            <div className="cyber-grid absolute inset-0 z-0 pointer-events-none opacity-40"></div>

            {/* Top Bar */}
            <header className="relative z-10 w-full px-8 py-4 border-b-4 border-white bg-black flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-[var(--cb-accent)] p-2 border-2 border-black">
                        <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter cyber-glitch-text" data-text="DATASCOUT_v2">
                        DATASCOUT_v2
                    </h1>
                </div>
                <div className="hidden md:block">
                    <span className="bg-black text-[var(--cb-accent)] px-4 py-1 border-2 border-[var(--cb-accent)] font-bold">
                        STATUS: UNRESTRICTED_ACCESS
                    </span>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32">

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-block bg-[var(--cb-accent-red)] text-white px-4 py-1 font-bold mb-6 text-xl skew-x-[-15deg]">
                            [ MISSION: DATA_LIBERATION ]
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black leading-none mb-8">
                            RAW <span className="text-[var(--cb-accent)]">INTELLIGENCE</span> <br />
                            FOR THE UNBOUND.
                        </h2>
                        <p className="text-xl md:text-2xl text-[var(--cb-text-dim)] mb-12 max-w-xl border-l-8 border-[var(--cb-accent)] pl-6 bg-white/5 py-4">
                            STOP CRAWLING MANUALLY. DEPLOY AGENTIC SWARMS TO DISSECT, ANALYZE, AND EXTRACT OPEN DATASETS AT TERMINAL VELOCITY.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <button
                                onClick={onEnter}
                                className="cyber-button group"
                            >
                                <span className="flex items-center gap-3">
                                    INITIALIZE_PROTOCOL
                                    <MagnifyingGlassIcon className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                                </span>
                            </button>
                            <button
                                onClick={onViewDocs}
                                className="bg-transparent text-white border-4 border-white px-8 py-4 text-xl font-bold hover:bg-white hover:text-black transition-colors"
                            >
                                ACCESS_DOCS
                            </button>
                        </div>
                    </div>

                    {/* Decorative Data Visualizer */}
                    <div className="hidden lg:block relative h-[500px] border-4 border-white bg-black overflow-hidden cyber-brutalist-card">
                        <div className="absolute inset-0 opacity-20">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="h-px bg-[var(--cb-accent)] w-full my-4 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-4 font-mono text-xs text-[var(--cb-accent)] p-4">
                            <div>{">"} SCANNING_WEB_LAYERS...</div>
                            <div>{">"} AGENTS_DEPLOYED: 04</div>
                            <div className="text-[var(--cb-accent-red)]">{">"} WARNING: DATA_DENSITY_HIGH</div>
                            <div>{">"} EXTRACTING_METADATA...</div>
                            <div className="mt-8 bg-[var(--cb-accent)] text-black p-2 font-bold w-full">MATRIX_DECRYPTION_SUCCESSFUL: 99.8%</div>
                            <div className="grid grid-cols-5 gap-2 mt-4">
                                {[...Array(25)].map((_, i) => (
                                    <div key={i} className={`h-8 border border-white ${Math.random() > 0.5 ? 'bg-[var(--cb-accent)]' : 'bg-transparent'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-32 border-4 border-white">
                    <div className="cyber-brutalist-card border-0 md:border-r-4 border-b-4 md:border-b-0 border-white hover:z-20">
                        <div className="w-16 h-16 bg-white text-black mb-8 flex items-center justify-center border-4 border-black">
                            <MagnifyingGlassIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black mb-4 uppercase">DEEP_RECON</h3>
                        <p className="text-[var(--cb-text-dim)] text-lg leading-tight">
                            LOCATE OBSCURE ASSETS BURIED IN ACADEMIC REPOSITORIES AND GOVERNMENT PORTALS. NO BLACKBOX SECURE.
                        </p>
                    </div>

                    <div className="cyber-brutalist-card border-0 md:border-r-4 border-b-4 md:border-b-0 border-white hover:z-20">
                        <div className="w-16 h-16 bg-[var(--cb-accent)] text-black mb-8 flex items-center justify-center border-4 border-black">
                            <ApiIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black mb-4 uppercase">STRATEGY_GEN</h3>
                        <p className="text-[var(--cb-text-dim)] text-lg leading-tight">
                            AUTO-FORGE PYTHON SCRIPTS AND CURL PROTOCOLS. TAILORED FOR RAPID SYSTEM INTEGRATION.
                        </p>
                    </div>

                    <div className="cyber-brutalist-card border-0 hover:z-20">
                        <div className="w-16 h-16 bg-[var(--cb-accent-red)] text-white mb-8 flex items-center justify-center border-4 border-black">
                            <RefineIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black mb-4 uppercase">SCHEMA_FIX</h3>
                        <p className="text-[var(--cb-text-dim)] text-lg leading-tight">
                            AUTONOMOUS INFERENCE OF DATA TYPES. GENERATE READY-TO-SHIP JSON/SQL SCHEMAS IN REAL-TIME.
                        </p>
                    </div>
                </div>

                <div className="mt-32 text-center">
                    <div className="inline-block border-t-8 border-b-8 border-white py-4 px-12">
                        <span className="text-4xl md:text-6xl font-black italic">STOP_SEARCHING. START_EXTRACTING.</span>
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full py-12 border-t-4 border-white bg-black flex flex-col items-center">
                <div className="flex gap-8 mb-8 text-[var(--cb-accent)] font-bold">
                    <span>{`//`} LOG_V2.0.42</span>
                    <span>{`//`} AREA_51_BYPASS_ENABLED</span>
                    <span>{`//`} CACHE_PURGED</span>
                </div>
                <div className="text-white text-sm opacity-50 font-mono">
                    © 2026 DATASCOUT_AI. POWERED BY AUTONOMOUS_AGENT_CORE. NO RIGHTS RESERVED.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
