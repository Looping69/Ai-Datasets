import { useCallback, useState } from 'react';
import type { DiscoveredLink } from '../types';
import { findDatasetUrls } from '../services/ai/discoveryAgent';
import { analyzeUrlForAccessMethod } from '../services/ai/analysisAgent';
import { generateStrategy, generateFileStrategy } from '../services/ai/strategyAgent';
import { getCleaningSteps } from '../services/ai/refinementAgent';

export interface StreamingState {
    sources: DiscoveredLink[];
    pendingCount: number;
    completedCount: number;
    totalCount: number;
    isDiscovering: boolean;
    isProcessing: boolean;
    currentUrl: string | null;
    error: string | null;
}

export const useStreamingDiscovery = () => {
    const [state, setState] = useState<StreamingState>({
        sources: [],
        pendingCount: 0,
        completedCount: 0,
        totalCount: 0,
        isDiscovering: false,
        isProcessing: false,
        currentUrl: null,
        error: null,
    });

    const reset = useCallback(() => {
        setState({
            sources: [],
            pendingCount: 0,
            completedCount: 0,
            totalCount: 0,
            isDiscovering: false,
            isProcessing: false,
            currentUrl: null,
            error: null,
        });
    }, []);

    const discoverDatasets = useCallback(async (description: string) => {
        reset();
        setState(s => ({ ...s, isDiscovering: true, error: null }));

        try {
            // 1. Discovery Agent - find URLs
            const { urls } = await findDatasetUrls(description);

            if (!urls || urls.length === 0) {
                setState(s => ({
                    ...s,
                    isDiscovering: false,
                    error: 'No datasets found. Try refining your description.'
                }));
                return;
            }

            setState(s => ({
                ...s,
                isDiscovering: false,
                isProcessing: true,
                totalCount: urls.length,
                pendingCount: urls.length,
            }));

            // 2. Process each URL sequentially and stream results
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                setState(s => ({ ...s, currentUrl: url }));

                try {
                    // Analyze URL
                    const analysis = await analyzeUrlForAccessMethod(url);

                    // Generate Strategy
                    const strategy = await generateStrategy(analysis.accessMethod, analysis.target);

                    const newSource: DiscoveredLink = {
                        url: analysis.target,
                        accessMethod: analysis.accessMethod,
                        justification: analysis.justification,
                        confidence: analysis.confidence,
                        strategy: strategy,
                        cleaningStrategy: undefined,
                    };

                    // Stream the result immediately
                    setState(s => ({
                        ...s,
                        sources: [...s.sources, newSource],
                        completedCount: s.completedCount + 1,
                        pendingCount: s.pendingCount - 1,
                    }));

                    // Small delay between URLs to avoid rate limiting
                    if (i < urls.length - 1) {
                        await new Promise(r => setTimeout(r, 1500));
                    }
                } catch (e) {
                    console.error(`Failed to process URL ${url}`, e);
                    setState(s => ({
                        ...s,
                        completedCount: s.completedCount + 1,
                        pendingCount: s.pendingCount - 1,
                    }));
                }
            }

            setState(s => ({ ...s, isProcessing: false, currentUrl: null }));

        } catch (e) {
            console.error("Discovery process failed", e);
            setState(s => ({
                ...s,
                isDiscovering: false,
                isProcessing: false,
                error: e instanceof Error ? e.message : 'Discovery failed'
            }));
        }
    }, [reset]);

    const extractLocalFile = useCallback(async (file: File): Promise<DiscoveredLink> => {
        const content = await file.text();
        const snippet = content.slice(0, 4000);

        const strategy = await generateFileStrategy(file.name, snippet);

        return {
            url: file.name,
            accessMethod: 'LOCAL_FILE',
            justification: 'User uploaded local asset for analysis.',
            strategy: strategy,
            cleaningStrategy: undefined,
        };
    }, []);

    const refineSource = useCallback(async (source: DiscoveredLink, instructions: string): Promise<DiscoveredLink> => {
        const strategyContext = JSON.stringify(source.strategy, null, 2);
        const cleaningSteps = await getCleaningSteps(strategyContext, instructions);

        return {
            ...source,
            cleaningStrategy: cleaningSteps,
        };
    }, []);

    const updateSource = useCallback((index: number, updatedSource: DiscoveredLink) => {
        setState(s => ({
            ...s,
            sources: s.sources.map((src, i) => i === index ? updatedSource : src),
        }));
    }, []);

    return {
        ...state,
        discoverDatasets,
        extractLocalFile,
        refineSource,
        updateSource,
        reset,
    };
};
