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
        <div className="min-h-screen bg-[var(--bg-void)] text-[var(--text-normal)] font-sans flex flex-col">

            {/* Navbar / Top Bar */}
            <header className="w-full px-8 py-6 flex items-center justify-between border-b border-[var(--border-dim)] bg-[var(--bg-panel)] sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[var(--cyan-primary)] rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-[var(--text-bright)] tracking-tight">DataScout</span>
                </div>
                <div className="text-sm font-medium text-[var(--text-dim)]">
                    v2.0 // TACTICAL LAB
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col items-center text-center">

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold mb-8 uppercase tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-[var(--cyan-primary)] animate-pulse"></span>
                    AI-Powered Reconnaissance
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-[var(--text-bright)] mb-6 tracking-tight leading-tight max-w-4xl">
                    Your Intelligence Layer for <br className="hidden md:block" />
                    <span className="text-[var(--cyan-primary)]">Open Source Data</span>
                </h1>

                <p className="text-lg md:text-xl text-[var(--text-dim)] max-w-2xl mb-12 leading-relaxed">
                    Stop searching manually. Deploy autonomous agents to scan, analyze, and extract machine learning datasets from the open web in seconds.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
                    <button
                        onClick={onEnter}
                        className="px-8 py-4 bg-[var(--cyan-primary)] hover:bg-[var(--cyan-bright)] text-white text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <MagnifyingGlassIcon className="w-5 h-5" />
                        Start Discovery
                    </button>
                    <button
                        onClick={onViewDocs}
                        className="px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-lg font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                        View Documentation
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full text-left">
                    <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                            <MagnifyingGlassIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Deep Web Scanning</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Locate obscure datasets buried in academic repositories, government portals, and raw file directories.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mb-6 text-cyan-600">
                            <ApiIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Strategy Generation</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Instantly generate Python scripts, cURL commands, and Firecrawl configs tailored to each source.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                            <RefineIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Schema Inference</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Automatically detect data types and structures to generate ready-to-use JSON/SQL schemas.
                        </p>
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="w-full py-8 border-t border-[var(--border-dim)] bg-white text-center text-slate-500 text-sm">
                © 2026 DataScout AI. Powered by Multi-Agent AI.
            </footer>
        </div>
    );
};

export default LandingPage;
