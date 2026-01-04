
import React, { useState, useCallback } from 'react';
import { useDiscovery } from './hooks/useDiscovery';
import type { DiscoveredLink } from './types';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SearchForm from './components/SearchForm';
import SourceDetail from './components/SourceDetail';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import CollapsedSearch from './components/CollapsedSearch';
import LandingPage from './components/LandingPage';
import DocumentationPage from './components/DocumentationPage';

type ViewState = 'landing' | 'app' | 'docs';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');

  const [discoveredSources, setDiscoveredSources] = useState<DiscoveredLink[]>([]);
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchDescription, setSearchDescription] = useState('');

  const { discoverDatasets, refineSource, extractLocalFile } = useDiscovery();

  const handleEnterSystem = useCallback(() => {
    setView('app');
  }, []);

  const handleViewDocs = useCallback(() => {
    setView('docs');
  }, []);

  const handleBackToLanding = useCallback(() => {
    setView('landing');
  }, []);

  const handleGeneratePlan = useCallback(async (description: string, file: File | null) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchDescription(description || file?.name || 'File Analysis');
    setDiscoveredSources([]);
    setSelectedSource(null);

    try {
      let sources: DiscoveredLink[] = [];
      if (file) {
        const localSource = await extractLocalFile(file);
        sources.push(localSource);
      }
      if (description.trim()) {
        const webSources = await discoverDatasets(description);
        sources = [...sources, ...webSources];
      }

      if (sources.length === 0 && !file && !description.trim()) {
        setError('Please provide a description or upload a file.');
      } else {
        setDiscoveredSources(sources);
        if (sources.length > 0) {
          setSelectedSource(0);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [discoverDatasets, extractLocalFile]);

  const handleRefineSource = useCallback(async (sourceIndex: number, instructions: string) => {
    if (sourceIndex < 0 || sourceIndex >= discoveredSources.length) return;

    setIsRefining(true);
    setError(null);
    try {
      const currentSource = discoveredSources[sourceIndex];
      const refined = await refineSource(currentSource, instructions);
      setDiscoveredSources(prev =>
        prev.map((src, i) => i === sourceIndex ? refined : src)
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Refinement failed.');
    } finally {
      setIsRefining(false);
    }
  }, [discoveredSources, refineSource]);

  const handleNewSearch = useCallback(() => {
    setHasSearched(false);
    setDiscoveredSources([]);
    setSelectedSource(null);
    setError(null);
    setSearchDescription('');
  }, []);

  if (view === 'landing') {
    return <LandingPage onEnter={handleEnterSystem} onViewDocs={handleViewDocs} />;
  }

  if (view === 'docs') {
    return <DocumentationPage onBack={handleBackToLanding} />;
  }

  const currentSource = typeof selectedSource === 'number' ? discoveredSources[selectedSource] : null;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Ambient Grid Background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <Header />

      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar
          sources={discoveredSources}
          selectedSource={selectedSource}
          onSelectSource={setSelectedSource}
          isLoading={isLoading}
          hasSearched={hasSearched}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {!hasSearched ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16">
              <div className="w-full max-w-3xl">
                {/* Title Section */}


                <SearchForm
                  onGenerate={handleGeneratePlan}
                  isLoading={isLoading}
                />
                {error && !isLoading && <div className="mt-6"><ErrorMessage message={error} /></div>}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-[var(--border-dim)]">
                <CollapsedSearch
                  description={searchDescription}
                  onNewSearch={handleNewSearch}
                />
                {error && !isLoading && !isRefining && <div className="mt-4"><ErrorMessage message={error} /></div>}
              </div>

              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <SourceDetail
                    source={currentSource}
                    isRefining={isRefining}
                    onRefine={
                      typeof selectedSource === 'number'
                        ? (instructions) => handleRefineSource(selectedSource, instructions)
                        : undefined
                    }
                  />
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer Status Bar */}
      <footer className="border-t border-[var(--border-dim)] bg-[var(--bg-panel)] px-6 py-3 flex items-center justify-between relative z-10">
        <div className="hud-status">
          SYSTEM ONLINE
        </div>
        <div className="flex items-center gap-6">
          <div className="hud-barcode">
            {[...Array(12)].map((_, i) => <span key={i}></span>)}
          </div>
          <span className="hud-label">GEMINI MULTI-AGENT CORE</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
