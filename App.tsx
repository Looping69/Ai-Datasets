
import React, { useState, useCallback } from 'react';
import { useStreamingDiscovery } from './hooks/useStreamingDiscovery';
import type { DiscoveredLink } from './types';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SearchForm from './components/SearchForm';
import SourceDetail from './components/SourceDetail';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import CollapsedSearch from './components/CollapsedSearch';
import LandingPage from './components/LandingPage';
import DocumentationPage from './components/DocumentationPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProfilePage from './components/ProfilePage';

type ViewState = 'landing' | 'app' | 'docs' | 'login' | 'signup' | 'profile';

const AppContent: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [searchDescription, setSearchDescription] = useState('');

  const {
    sources: discoveredSources,
    isDiscovering,
    isProcessing,
    pendingCount,
    completedCount,
    totalCount,
    currentUrl,
    error,
    discoverDatasets,
    extractLocalFile,
    refineSource,
    updateSource,
    reset,
  } = useStreamingDiscovery();

  const isLoading = isDiscovering || isProcessing;
  const hasSearched = searchDescription !== '' || discoveredSources.length > 0;

  const handleEnterSystem = useCallback(() => {
    setView('app');
  }, []);

  const handleViewDocs = useCallback(() => {
    setView('docs');
  }, []);

  const handleBackToLanding = useCallback(() => {
    setView('landing');
  }, []);

  const handleLogin = useCallback(() => {
    setView('login');
  }, []);

  const handleSignup = useCallback(() => {
    setView('signup');
  }, []);

  const handleProfile = useCallback(() => {
    setView('profile');
  }, []);

  const handleBackFromAuth = useCallback(() => {
    setView('landing');
  }, []);

  const handleGeneratePlan = useCallback(async (description: string, file: File | null) => {
    setSearchDescription(description || file?.name || 'File Analysis');
    setSelectedSource(null);

    try {
      if (file) {
        const localSource = await extractLocalFile(file);
        // For file uploads, we add directly
        updateSource(0, localSource);
      }
      if (description.trim()) {
        // This will stream results progressively
        await discoverDatasets(description);
      }
    } catch (e) {
      console.error('Generation failed:', e);
    }
  }, [discoverDatasets, extractLocalFile, updateSource]);

  const handleRefineSource = useCallback(async (sourceIndex: number, instructions: string) => {
    if (sourceIndex < 0 || sourceIndex >= discoveredSources.length) return;

    setIsRefining(true);
    try {
      const currentSource = discoveredSources[sourceIndex];
      const refined = await refineSource(currentSource, instructions);
      updateSource(sourceIndex, refined);
    } catch (e) {
      console.error('Refinement failed:', e);
    } finally {
      setIsRefining(false);
    }
  }, [discoveredSources, refineSource, updateSource]);

  const handleNewSearch = useCallback(() => {
    reset();
    setSelectedSource(null);
    setSearchDescription('');
  }, [reset]);

  // Auto-select first source when it becomes available
  React.useEffect(() => {
    if (discoveredSources.length > 0 && selectedSource === null) {
      setSelectedSource(0);
    }
  }, [discoveredSources, selectedSource]);

  if (view === 'landing') {
    return <LandingPage onEnter={handleEnterSystem} onViewDocs={handleViewDocs} onLogin={handleLogin} onSignup={handleSignup} />;
  }

  if (view === 'docs') {
    return <DocumentationPage onBack={handleBackToLanding} />;
  }

  if (view === 'login') {
    return <LoginPage onSwitchToSignup={handleSignup} onBack={handleBackFromAuth} />;
  }

  if (view === 'signup') {
    return <SignupPage onSwitchToLogin={handleLogin} onBack={handleBackFromAuth} />;
  }

  if (view === 'profile') {
    return <ProfilePage onBack={() => setView('app')} />;
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

                {/* Streaming Progress Indicator */}
                {isProcessing && (
                  <div className="mt-4 p-3 bg-[var(--bg-surface)] border border-[var(--border-dim)]"
                    style={{ clipPath: 'var(--clip-panel-sm)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="hud-label text-[var(--cyan-primary)]">PROCESSING</span>
                      <span className="hud-label">{completedCount}/{totalCount} COMPLETE</span>
                    </div>
                    <div className="w-full h-1 bg-[var(--bg-void)] overflow-hidden">
                      <div
                        className="h-full bg-[var(--cyan-primary)] transition-all duration-300"
                        style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                      />
                    </div>
                    {currentUrl && (
                      <p className="text-xs text-[var(--text-muted)] mt-2 truncate">
                        Analyzing: {currentUrl}
                      </p>
                    )}
                  </div>
                )}

                {error && !isLoading && !isRefining && <div className="mt-4"><ErrorMessage message={error} /></div>}
              </div>

              <div className="flex-1 overflow-y-auto">
                {isDiscovering ? (
                  <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                    <LoadingSpinner />
                    <p className="mt-4 hud-label text-[var(--text-muted)]">SCANNING FOR DATASETS...</p>
                  </div>
                ) : discoveredSources.length === 0 && !isProcessing ? (
                  <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                    <p className="hud-label text-[var(--text-muted)]">NO SOURCES FOUND</p>
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
          {isProcessing ? `PROCESSING ${pendingCount} REMAINING` : 'SYSTEM ONLINE'}
        </div>
        <div className="flex items-center gap-6">
          <div className="hud-barcode">
            {[...Array(12)].map((_, i) => <span key={i}></span>)}
          </div>
          <span className="hud-label">MULTI-AGENT CORE</span>
        </div>
      </footer>
    </div>
  );
};

// Wrap with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
