
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
    <div className="prose prose-sm max-w-none text-gray-700 mt-4 space-y-3">
        {content.split('\n').filter(line => line.trim() !== '').map((line, idx) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                return (
                    <div key={idx} className="flex items-start">
                        <span className="mr-3 mt-1.5 text-cyan-500 flex-shrink-0">•</span>
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

    if (method === 'DIRECT_DOWNLOAD') {
        return snippet ? <CodeSnippet language="bash" code={snippet} /> : <p className="text-sm text-gray-500">No download command provided.</p>;
    }

    if (method === 'API') {
        return (
            <div className="space-y-6">
                {snippet && (
                    <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-2">API Request Snippet</h4>
                        <CodeSnippet language="javascript" code={snippet} />
                    </div>
                )}
                {schema && (
                    <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Proposed Data Schema</h4>
                        <SchemaEditor initialJsonString={schema} />
                    </div>
                )}
            </div>
        );
    }

    if (method === 'WEB_CRAWL') {
        return (
            <div className="space-y-6">
                {config && (
                    <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Firecrawl Configuration</h4>
                        <FirecrawlConfigEditor initialJsonString={config} />
                    </div>
                )}
                {schema && (
                    <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Proposed Data Schema</h4>
                        <SchemaEditor initialJsonString={schema} />
                    </div>
                )}
            </div>
        );
    }

    if (method === 'LOCAL_FILE') {
        return (
            <div className="space-y-6">
                {snippet && (
                    <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Python Processing Snippet</h4>
                        <CodeSnippet language="python" code={snippet} />
                    </div>
                )}
                {schema && (
                    <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Inferred Data Schema</h4>
                        <SchemaEditor initialJsonString={schema} />
                    </div>
                )}
            </div>
        );
    }
    
    return <p className="text-sm text-gray-500">Could not render strategy.</p>;
};


const RefineStrategyForm: React.FC<{ onRefine?: (instructions: string) => void; isRefining?: boolean; }> = ({ onRefine, isRefining }) => {
    const [cleaningInstructions, setCleaningInstructions] = useState('');
    
    if (!onRefine) return null;

    const handleRefineClick = () => {
        onRefine(cleaningInstructions);
        setCleaningInstructions(''); // Clear input after submission
    };

    const isRefineDisabled = isRefining || !cleaningInstructions.trim();

    return (
        <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-cyan-600 flex items-center mb-4">
                Refine Strategy
                <Tooltip text="Optional: Provide instructions for how the discovered data should be cleaned or transformed. The AI will append a new section to this source's strategy with detailed steps." />
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <textarea
                    value={cleaningInstructions}
                    onChange={(e) => setCleaningInstructions(e.target.value)}
                    placeholder="e.g., 'Remove rows with missing values in the 'price' column. Convert the 'date' column to ISO 8601 format. Anonymize the 'user_id' field.'"
                    className="w-full h-28 p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-500 outline-none transition-all duration-300 resize-y placeholder-gray-400 text-gray-800"
                    disabled={isRefining}
                    aria-label="Data Cleaning Instructions"
                />
                <TooltipWrapper tooltipText={isRefineDisabled ? 'Please enter cleaning instructions to refine the plan.' : 'Generate a new section with detailed cleaning steps based on your instructions.'}>
                    <button
                        onClick={handleRefineClick}
                        disabled={isRefineDisabled}
                        className="mt-3 w-full sm:w-auto sm:float-right flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500 transition-colors duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-md hover:shadow-lg disabled:shadow-none"
                    >
                        {isRefining ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Refining...
                            </>
                        ) : (
                            <>
                                <RefineIcon className="h-5 w-5 mr-2" />
                                Refine Strategy
                            </>
                        )}
                    </button>
                </TooltipWrapper>
            </div>
        </div>
    );
};

const SourceDetail: React.FC<SourceDetailProps> = ({ source, isRefining, onRefine }) => {
  if (!source) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center text-center bg-gray-50">
        <div>
            <h2 className="text-xl font-semibold text-gray-700">Welcome to your Dataset Discovery Dashboard</h2>
            <p className="text-gray-500 mt-2">
                Describe a dataset or upload a file to generate an ingestion plan. <br />
                The plan for the first source will appear here automatically.
            </p>
        </div>
      </div>
    );
  }
  
  const isLocalFile = source.accessMethod === 'LOCAL_FILE';

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 animate-fade-in">
        <div className="pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
                
                {isLocalFile ? (
                     <span className="text-lg font-bold text-gray-800 break-all flex items-start gap-2">
                        <FileIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                        <span>{source.url}</span>
                    </span>
                ) : (
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-gray-800 hover:text-cyan-700 hover:underline break-all flex items-start gap-2 group">
                        <LinkIcon className="h-5 w-5 text-gray-400 group-hover:text-cyan-600 flex-shrink-0 mt-1" />
                        <span>{source.url}</span>
                    </a>
                )}

                 <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full flex-shrink-0 ml-4">
                    {source.accessMethod.replace('_', ' ')}
                </span>
            </div>
            
            <p className="text-gray-600 mt-1 italic">"{source.justification}"</p>
        </div>

        <div className="mt-6">
            <h3 className="text-xl font-semibold text-cyan-600 mb-4">Ingestion Strategy</h3>
            <StrategyRenderer strategy={source.strategy} method={source.accessMethod} />
        </div>

        {source.cleaningStrategy && (
            <div className="mt-8 pt-6 border-t border-dashed border-gray-300">
                <h4 className="text-lg font-semibold text-cyan-600">Data Cleaning & Transformation</h4>
                <MarkdownContent content={source.cleaningStrategy} />
            </div>
        )}

        <RefineStrategyForm isRefining={isRefining} onRefine={onRefine} />
      </div>
    </div>
  );
};

export default SourceDetail;
