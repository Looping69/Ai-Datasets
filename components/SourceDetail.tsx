
import React, { useState } from 'react';
import type { DiscoveredLink, AccessMethod, Strategy } from '../types';
import { SchemaEditor } from './SchemaEditor';
import { FirecrawlConfigEditor } from './FirecrawlConfigEditor';
import { CodeSnippet } from './CodeSnippet';
import Tooltip from './Tooltip';
import TooltipWrapper from './TooltipWrapper';
import { LinkIcon } from './icons/LinkIcon';
import { RefineIcon } from './icons/RefineIcon';
import { FileIcon } from './icons/FileIcon';

interface SourceDetailProps {
    source: DiscoveredLink | null;
    isRefining?: boolean;
    onRefine?: (instructions: string) => void;
}

const MarkdownContent: React.FC<{ content: string }> = ({ content }) => (
    <div className="text-[var(--text-normal)] mt-4 space-y-3 text-sm leading-relaxed">
        {content.split('\n').filter(line => line.trim() !== '').map((line, idx) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                return (
                    <div key={idx} className="flex items-start gap-3">
                        <span className="text-[var(--cyan-primary)] mt-1">▸</span>
                        <span>{trimmedLine.substring(2)}</span>
                    </div>
                );
            }
            return <p key={idx}>{trimmedLine}</p>;
        })}
    </div>
);

const StrategyRenderer: React.FC<{ strategy: Strategy; method: AccessMethod }> = ({ strategy, method }) => {
    const { config, schema, snippet } = strategy;

    const SectionHeader: React.FC<{ title: string; code?: string }> = ({ title, code }) => (
        <div className="flex items-center gap-4 mb-4">
            <h4 className="hud-label text-[var(--cyan-primary)]">{title}</h4>
            {code && <span className="hud-label text-[var(--text-muted)]">[{code}]</span>}
            <div className="flex-1 h-px bg-[var(--border-dim)]"></div>
        </div>
    );

    if (method === 'DIRECT_DOWNLOAD') {
        return snippet ? <CodeSnippet language="bash" code={snippet} /> : <p className="text-[var(--text-muted)]">No download command provided.</p>;
    }

    if (method === 'API') {
        return (
            <div className="space-y-8">
                {snippet && (
                    <div>
                        <SectionHeader title="API REQUEST" code="FETCH" />
                        <CodeSnippet language="javascript" code={snippet} />
                    </div>
                )}
                {schema && (
                    <div>
                        <SectionHeader title="SCHEMA DEFINITION" code="JSON" />
                        <SchemaEditor initialJsonString={schema} />
                    </div>
                )}
            </div>
        );
    }

    if (method === 'WEB_CRAWL') {
        return (
            <div className="space-y-8">
                {config && (
                    <div>
                        <SectionHeader title="SPIDER CONFIG" code="FIRECRAWL" />
                        <FirecrawlConfigEditor initialJsonString={config} />
                    </div>
                )}
                {schema && (
                    <div>
                        <SectionHeader title="EXTRACTION SCHEMA" code="JSON" />
                        <SchemaEditor initialJsonString={schema} />
                    </div>
                )}
            </div>
        );
    }

    if (method === 'LOCAL_FILE') {
        return (
            <div className="space-y-8">
                {snippet && (
                    <div>
                        <SectionHeader title="PROCESSOR" code="PYTHON" />
                        <CodeSnippet language="python" code={snippet} />
                    </div>
                )}
                {schema && (
                    <div>
                        <SectionHeader title="INFERRED SCHEMA" code="AUTO" />
                        <SchemaEditor initialJsonString={schema} />
                    </div>
                )}
            </div>
        );
    }

    return <p className="text-[var(--text-muted)]">Could not render strategy.</p>;
};


const RefineStrategyForm: React.FC<{ onRefine?: (instructions: string) => void; isRefining?: boolean; }> = ({ onRefine, isRefining }) => {
    const [cleaningInstructions, setCleaningInstructions] = useState('');

    if (!onRefine) return null;

    const handleRefineClick = () => {
        onRefine(cleaningInstructions);
        setCleaningInstructions('');
    };

    const isRefineDisabled = isRefining || !cleaningInstructions.trim();

    return (
        <div className="mt-10 pt-8 border-t border-[var(--border-dim)]">
            <div className="flex items-center gap-4 mb-6">
                <h3 className="hud-label text-[var(--orange-warn)]">REFINEMENT MODULE</h3>
                <Tooltip text="Post-process the extracted data with custom transformation rules." />
                <div className="flex-1 h-px bg-[var(--border-dim)]"></div>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-dim)] p-6"
                style={{ clipPath: 'var(--clip-panel-sm)' }}>
                <label className="hud-label block mb-3">TRANSFORMATION RULES</label>
                <textarea
                    value={cleaningInstructions}
                    onChange={(e) => setCleaningInstructions(e.target.value)}
                    placeholder="// Enter cleaning instructions: normalize dates, filter null values, rename columns..."
                    className="hud-input h-28 resize-none mb-4"
                    disabled={isRefining}
                />

                <div className="flex justify-end">
                    <TooltipWrapper tooltipText={isRefineDisabled ? 'Enter transformation rules to enable.' : 'Execute refinement pipeline.'}>
                        <button
                            onClick={handleRefineClick}
                            disabled={isRefineDisabled}
                            className="hud-button py-3 px-6"
                        >
                            <span className="flex items-center gap-2">
                                {isRefining ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-[var(--cyan-primary)] border-t-transparent rounded-full animate-spin"></div>
                                        PROCESSING
                                    </>
                                ) : (
                                    <>
                                        <RefineIcon className="h-4 w-4" />
                                        EXECUTE
                                    </>
                                )}
                            </span>
                        </button>
                    </TooltipWrapper>
                </div>
            </div>
        </div>
    );
};

const SourceDetail: React.FC<SourceDetailProps> = ({ source, isRefining, onRefine }) => {
    if (!source) {
        return (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center relative h-full">
                <div className="hud-brackets max-w-md">
                    <div className="w-16 h-16 mx-auto border border-[var(--border-dim)] flex items-center justify-center mb-6"
                        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                        <MagnifyingGlassIcon className="h-6 w-6 text-[var(--text-muted)]" />
                    </div>
                    <h2 className="hud-title text-xl text-[var(--text-normal)] mb-3">
                        AWAITING SELECTION
                    </h2>
                    <p className="text-[var(--text-dim)] text-sm">
                        Select a discovered node from the sidebar to view extraction strategy and schema details.
                    </p>
                </div>
            </div>
        );
    }

    const isLocalFile = source.accessMethod === 'LOCAL_FILE';

    return (
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {/* Main Frame */}
            <div className="hud-frame p-6 lg:p-8 relative">
                {/* Top-right Status */}
                <div className="absolute top-4 right-4 flex items-center gap-3">
                    <span className="hud-label">{source.accessMethod.replace('_', ' ')}</span>
                    <div className="w-2 h-2 bg-[var(--green-status)] shadow-[0_0_8px_var(--green-status)]"></div>
                </div>

                {/* Header */}
                <div className="pb-6 border-b border-[var(--border-dim)]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 border-2 border-[var(--cyan-primary)] flex items-center justify-center"
                            style={{ clipPath: 'var(--clip-panel-sm)' }}>
                            {isLocalFile ? (
                                <FileIcon className="h-5 w-5 text-[var(--cyan-primary)]" />
                            ) : (
                                <LinkIcon className="h-5 w-5 text-[var(--cyan-primary)]" />
                            )}
                        </div>
                        <div>
                            <div className="hud-label mb-1">TARGET NODE</div>
                            {isLocalFile ? (
                                <h1 className="hud-title text-lg text-[var(--text-bright)]">{source.url}</h1>
                            ) : (
                                <a href={source.url} target="_blank" rel="noopener noreferrer"
                                    className="hud-title text-lg text-[var(--cyan-primary)] hover:underline block">
                                    {source.url}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Justification */}
                    <div className="bg-[var(--bg-void)] border-l-2 border-l-[var(--cyan-dim)] p-4 mt-4">
                        <div className="hud-label mb-2 text-[var(--text-muted)]">JUSTIFICATION</div>
                        <p className="text-[var(--text-normal)] text-sm italic leading-relaxed">
                            "{source.justification}"
                        </p>
                    </div>
                </div>

                {/* Strategy Section */}
                <div className="mt-8">
                    <div className="flex items-center gap-4 mb-6">
                        <h3 className="hud-label text-[var(--cyan-primary)]">INGESTION STRATEGY</h3>
                        <div className="flex-1 h-px bg-[var(--border-dim)]"></div>
                        <div className="hud-barcode">
                            {[...Array(6)].map((_, i) => <span key={i}></span>)}
                        </div>
                    </div>

                    <StrategyRenderer strategy={source.strategy} method={source.accessMethod} />
                </div>

                {/* Cleaning Strategy */}
                {source.cleaningStrategy && (
                    <div className="mt-10 pt-8 border-t border-[var(--border-dim)]">
                        <div className="flex items-center gap-4 mb-4">
                            <h4 className="hud-label text-[var(--green-status)]">POST-PROCESSING</h4>
                            <div className="flex-1 h-px bg-[var(--border-dim)]"></div>
                        </div>
                        <div className="bg-[var(--bg-surface)] p-6" style={{ clipPath: 'var(--clip-panel-sm)' }}>
                            <MarkdownContent content={source.cleaningStrategy} />
                        </div>
                    </div>
                )}

                <RefineStrategyForm isRefining={isRefining} onRefine={onRefine} />
            </div>
        </div>
    );
};

// Import for the empty state
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';

export default SourceDetail;
