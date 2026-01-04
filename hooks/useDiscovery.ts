
import { useCallback } from 'react';
import type { DiscoveredLink, Strategy } from '../types';
import { findDatasetUrls } from '../services/ai/discoveryAgent';
import { analyzeUrlForAccessMethod } from '../services/ai/analysisAgent';
import { generateStrategy, generateFileStrategy } from '../services/ai/strategyAgent';
import { getCleaningSteps } from '../services/ai/refinementAgent';

export const useDiscovery = () => {
    const discoverDatasets = useCallback(async (description: string): Promise<DiscoveredLink[]> => {
        try {
            // 1. Discovery Agent
            const { urls } = await findDatasetUrls(description);

            // 2. Analysis & Strategy Chain (Parallelized)
            const linkPromises = urls.map(async (url) => {
                try {
                    // Analyze URL
                    const analysis = await analyzeUrlForAccessMethod(url);

                    // Generate Strategy
                    const strategy = await generateStrategy(analysis.accessMethod, analysis.target);

                    return {
                        url: analysis.target, // Use the target (e.g. download link or API base)
                        accessMethod: analysis.accessMethod,
                        justification: analysis.justification,
                        strategy: strategy,
                        cleaningStrategy: undefined
                    } as DiscoveredLink;
                } catch (e) {
                    console.error(`Failed to process URL ${url}`, e);
                    return null;
                }
            });

            const results = await Promise.all(linkPromises);
            return results.filter((r): r is DiscoveredLink => r !== null);

        } catch (e) {
            console.error("Discovery process failed", e);
            throw e;
        }
    }, []);

    const extractLocalFile = useCallback(async (file: File): Promise<DiscoveredLink> => {
        try {
            const content = await file.text();
            const snippet = content.slice(0, 4000); // First 4KB for context

            const strategy = await generateFileStrategy(file.name, snippet);

            return {
                url: file.name, // Use filename as "url"
                accessMethod: 'LOCAL_FILE',
                justification: 'User uploaded local asset for analysis.',
                strategy: strategy,
                cleaningStrategy: undefined
            };
        } catch (e) {
            console.error("Local file extraction failed", e);
            throw e;
        }

    }, []);

    const refineSource = useCallback(async (source: DiscoveredLink, instructions: string): Promise<DiscoveredLink> => {
        try {
            const strategyContext = JSON.stringify(source.strategy, null, 2);
            const cleaningSteps = await getCleaningSteps(strategyContext, instructions);

            return {
                ...source,
                cleaningStrategy: cleaningSteps
            };
        } catch (e) {
            console.error("Refinement failed", e);
            throw e;
        }
    }, []);

    return { discoverDatasets, refineSource, extractLocalFile };
};
