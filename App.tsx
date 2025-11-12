import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Sidebar from './components/Sidebar';
import SourceDetail from './components/SourceDetail';
import CollapsedSearch from './components/CollapsedSearch';
import ProgressBar from './components/ProgressBar';
import SettingsPage from './components/SettingsPage';
import { createFullIngestionPlan, refineSourceStrategyWithCleaning, createPlanForLocalFile, setMonitorCallback } from './services/ai/planner';
import type { DiscoveredLink } from './types';
import type { AgentActivity } from './components/AgentMonitor';


const App: React.FC = () => {
  const [discoveredSources, setDiscoveredSources] = useState<DiscoveredLink[]>([]);
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchDescription, setSearchDescription] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Set up monitoring callback to track progress
  useEffect(() => {
    setMonitorCallback((activity: AgentActivity) => {
      setCurrentStep(activity.message);
      
      // Calculate progress based on activity details
      if (activity.details?.progress && activity.details?.total) {
        const stepProgress = (activity.details.progress / activity.details.total) * 100;
        setProgress(stepProgress);
      } else if (activity.status === 'success') {
        // Increment progress on successful steps
        setProgress(prev => Math.min(prev + 10, 90));
      }
    });

    return () => {
      setMonitorCallback(null);
    };
  }, []);

  const handleGeneratePlan = useCallback(async (description: string, file?: File) => {
    if (!description.trim() && !file) {
      setError('Please provide a description or upload a file.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setDiscoveredSources([]);
    setSelectedSource(null);
    setHasSearched(true);
    setProgress(0);
    setCurrentStep('Starting...');

    try {
      if (file) {
        setSearchDescription(`Plan for local file: ${file.name}`);
        const source = await createPlanForLocalFile(file);
        setDiscoveredSources([source]);
        setSelectedSource(0);
      } else {
        setSearchDescription(description);
        const sources = await createFullIngestionPlan(description);
        setDiscoveredSources(sources);
        if (sources.length > 0) {
          setSelectedSource(0);
        }
      }
      setProgress(100);
      setCurrentStep('Complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setProgress(0);
      setCurrentStep('Error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefineSource = useCallback(async (sourceIndex: number, cleaningInstructions: string) => {
    if (!cleaningInstructions.trim()) {
        setError('Please provide some cleaning instructions to refine the plan.');
        return;
    }

    setIsRefining(true);
    setError(null);
    setProgress(0);
    setCurrentStep('Refining strategy...');

    try {
        const sourceToRefine = discoveredSources[sourceIndex];
        const refinedSource = await refineSourceStrategyWithCleaning(sourceToRefine, cleaningInstructions);
        
        const newSources = [...discoveredSources];
        newSources[sourceIndex] = refinedSource;
        setDiscoveredSources(newSources);
        setProgress(100);
        setCurrentStep('Refinement complete');
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred during refinement.');
        setProgress(0);
        setCurrentStep('Error');
    } finally {
        setIsRefining(false);
    }
  }, [discoveredSources]);

  const handleNewSearch = () => {
    setHasSearched(false);
    setDiscoveredSources([]);
    setSelectedSource(null);
    setError(null);
    setSearchDescription('');
    setProgress(0);
    setCurrentStep('');
  };

  const currentSource = typeof selectedSource === 'number' ? discoveredSources[selectedSource] : null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col h-screen">
      <Header onOpenSettings={() => setShowSettings(true)} />
      
      {showSettings && <SettingsPage onClose={() => setShowSettings(false)} />}
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
            sources={discoveredSources} 
            selectedSource={selectedSource} 
            onSelectSource={setSelectedSource}
            isLoading={isLoading}
            hasSearched={hasSearched}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
            <div className="p-8 border-b border-gray-200 bg-white">
              { !hasSearched ? (
                <>
                  <p className="text-center text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                      Describe the dataset you're looking for, or upload a local file, and our AI will generate a multi-strategy data sourcing plan for you.
                  </p>
                  <div className="max-w-2xl mx-auto">
                      <SearchForm 
                          onGenerate={handleGeneratePlan} 
                          isLoading={isLoading} 
                      />
                      {error && !isLoading && <div className="mt-4"><ErrorMessage message={error} /></div>}
                  </div>
                </>
              ) : (
                <>
                  <CollapsedSearch 
                    description={searchDescription}
                    onNewSearch={handleNewSearch}
                  />
                  {error && !isLoading && !isRefining && <div className="mt-4 max-w-2xl mx-auto"><ErrorMessage message={error} /></div>}
                </>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Progress Bar */}
              {hasSearched && (isLoading || isRefining || progress > 0) && (
                <ProgressBar 
                  isActive={isLoading || isRefining}
                  currentStep={currentStep}
                  progress={progress}
                />
              )}

              {/* Source Detail */}
              {isLoading ? (
                  <div className="flex items-center justify-center py-12">
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
        </main>
      </div>
      <footer className="text-center py-4 text-gray-500 text-sm border-t border-gray-200 bg-white">
        <p>Powered by a Multi-Agent Gemini System</p>
      </footer>
    </div>
  );
};

export default App;