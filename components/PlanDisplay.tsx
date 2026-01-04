
import React, { useState } from 'react';
import type { PlanSection } from '../types';
import TooltipWrapper from './TooltipWrapper';
import { DiscoveredLinksSection } from './DiscoveredLinksSection';
import { SaveIcon } from './icons/SaveIcon';
import { ExportIcon } from './icons/ExportIcon';
import { RefineIcon } from './icons/RefineIcon';
import Tooltip from './Tooltip';

interface PlanDisplayProps {
  plan: string;
  onRefine: (instructions: string) => void;
  isRefining: boolean;
}

const parsePlan = (text: string): PlanSection[] => {
  if (!text) return [];
  const sections = text.split(/\n###\s\d+\.\s/);
  const relevantSections = sections.filter(s => s.trim() !== '').map((s, i) => {
    if (i === 0 && !s.match(/^\d+\.\s/)) {
      const lines = s.split('\n');
      const firstLine = lines[0];
      if (!firstLine.startsWith('###')) return `1. ${s}`;
      return s;
    }
    return `${i + 1}. ${s.replace(/^###\s/, '')}`;
  });

  return relevantSections.map((sectionText) => {
    const lines = sectionText.trim().split('\n');
    const title = lines[0].replace(/^###\s/, '').trim();
    const content = lines.slice(1).join('\n').trim();
    return { title, content };
  });
};

const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none text-slate-600 mt-4 space-y-4 font-light leading-loose">
      {content.split('\n').filter(line => line.trim() !== '').map((line, idx) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start pl-2">
              <span className="mr-4 mt-2.5 w-1.5 h-1.5 rounded-full bg-indigo-300 flex-shrink-0"></span>
              <span>{trimmedLine.substring(2)}</span>
            </div>
          );
        }
        if (trimmedLine.startsWith('####')) {
          return <h5 key={idx} className="font-bold text-slate-700 mt-6 mb-2 tracking-tight">{trimmedLine.replace(/^####\s/, '')}</h5>;
        }
        return <p key={idx}>{trimmedLine}</p>;
      })}
    </div>
  );
};


const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onRefine, isRefining }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [cleaningInstructions, setCleaningInstructions] = useState('');
  const parsedPlan = parsePlan(plan);

  const handleSaveToLocalStorage = () => {
    localStorage.setItem('ingestionPlan', plan);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportAsMarkdown = () => {
    const markdownText = parsedPlan.map(sec => `### ${sec.title}\n\n${sec.content}`).join('\n\n---\n\n');
    const blob = new Blob([markdownText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-ingestion-plan.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderSection = (section: PlanSection) => {
    if (section.title.includes('Discovered Datasets')) {
      return <DiscoveredLinksSection content={section.content} />;
    }
    return <MarkdownContent content={section.content} />;
  };

  const handleRefineClick = () => {
    onRefine(cleaningInstructions);
  };

  const isRefineDisabled = isRefining || !cleaningInstructions.trim();
  const hasCleaningSection = parsedPlan.some(sec => sec.title.includes('Data Cleaning & Transformation'));

  if (parsedPlan.length === 0) {
    return (
      <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-sm">
        <h2 className="text-xl font-bold text-cyan-600 mb-4">Generated Plan</h2>
        <pre className="text-slate-600 whitespace-pre-wrap font-sans text-sm leading-relaxed">{plan}</pre>
      </div>
    );
  }

  const discoveredSection = parsedPlan.find(sec => sec.title.includes('Discovered Datasets'));
  const cleaningSection = parsedPlan.find(sec => sec.title.includes('Data Cleaning & Transformation'));
  const otherSections = parsedPlan.filter(sec => !sec.title.includes('Discovered Datasets') && !sec.title.includes('Data Cleaning & Transformation'));


  return (
    <div className="ethereal-glass p-8 sm:p-12 animate-fade-in relative z-10">

      <div className="flex flex-col sm:flex-row justify-between items-start mb-10 pb-8 border-b border-white/60">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Ingestion Strategy</h2>
          <p className="text-slate-500 font-light">Comprehensive data sourcing and transformation protocol.</p>
        </div>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          {isSaved && <span className="text-green-600 text-xs font-bold uppercase tracking-widest mr-2 animate-pulse">Saved</span>}
          <TooltipWrapper tooltipText="Save to local storage.">
            <button onClick={handleSaveToLocalStorage} className="p-3 rounded-full bg-white hover:bg-slate-50 text-slate-400 hover:text-cyan-600 transition-all shadow-sm">
              <SaveIcon className="h-5 w-5" />
            </button>
          </TooltipWrapper>
          <TooltipWrapper tooltipText="Export as Markdown.">
            <button onClick={handleExportAsMarkdown} className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all shadow-lg shadow-slate-200">
              <span className="flex items-center gap-2">
                <ExportIcon className="h-4 w-4" />
                Export Plan
              </span>
            </button>
          </TooltipWrapper>
        </div>
      </div>

      <div className="space-y-12 relative">
        {/* Timeline Line */}
        <div className="absolute left-[19px] top-4 bottom-10 w-0.5 bg-gradient-to-b from-cyan-200 via-purple-200 to-transparent -z-10"></div>

        {discoveredSection && (
          <div className="relative pl-12">
            <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border-4 border-cyan-100 flex items-center justify-center shadow-sm text-cyan-500 font-bold text-sm">1</div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{discoveredSection.title}</h3>
            {renderSection(discoveredSection)}
          </div>
        )}

        {cleaningSection && (
          <div className="relative pl-12">
            <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border-4 border-purple-100 flex items-center justify-center shadow-sm text-purple-500 font-bold text-sm">2</div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{cleaningSection.title}</h3>
            {renderSection(cleaningSection)}
          </div>
        )}

        {!hasCleaningSection && parsedPlan.length > 0 && (
          <div className="relative pl-12">
            <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border-4 border-orange-100 flex items-center justify-center shadow-sm text-orange-400 font-bold text-sm">+</div>
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              Refinement
            </h3>

            <div className="bg-white/60 p-1 rounded-3xl border border-white/80 shadow-sm relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-200 to-pink-200 rounded-3xl opacity-0 group-hover:opacity-30 transition duration-500 blur-lg"></div>
              <div className="relative bg-white/50 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Post-Processing Instructions</label>
                  <Tooltip text="Tell the AI how to clean the data." />
                </div>

                <textarea
                  value={cleaningInstructions}
                  onChange={(e) => setCleaningInstructions(e.target.value)}
                  placeholder="// e.g. Normalize currency to USD..."
                  className="w-full h-32 bg-transparent outline-none resize-none text-slate-600 placeholder-slate-400 font-medium"
                  disabled={isRefining}
                />

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleRefineClick}
                    disabled={isRefineDisabled}
                    className="neon-pill py-2.5 px-6 text-sm"
                  >
                    <span className="flex items-center">
                      {isRefining ? 'Processing...' : (
                        <>
                          <RefineIcon className="h-4 w-4 mr-2" />
                          Generate Steps
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {otherSections.map((section, index) => (
          <div key={index} className="relative pl-12">
            <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center shadow-sm text-slate-400 font-bold text-sm">{index + 3}</div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{section.title}</h3>
            {renderSection(section)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanDisplay;