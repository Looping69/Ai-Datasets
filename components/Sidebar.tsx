
import React from 'react';
import type { DiscoveredLink } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { LinkIcon } from './icons/LinkIcon';
import { FileIcon } from './icons/FileIcon';

interface SidebarProps {
  sources: DiscoveredLink[];
  selectedSource: number | null;
  onSelectSource: (index: number) => void;
  isLoading: boolean;
  hasSearched: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sources, selectedSource, onSelectSource, isLoading, hasSearched }) => {
  return (
    <aside className="w-72 border-r border-[var(--border-dim)] bg-[var(--bg-panel)] flex flex-col relative">
      {/* Header */}
      <div className="p-5 border-b border-[var(--border-dim)]">
        <div className="flex items-center justify-between mb-2">
          <span className="hud-label text-[var(--cyan-primary)]">DISCOVERED NODES</span>
          <span className="hud-title text-lg">{sources.length.toString().padStart(2, '0')}</span>
        </div>
        <div className="hud-loading-bar"></div>
      </div>

      {/* Source List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading && sources.length === 0 && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-[var(--bg-surface)] border border-[var(--border-dim)] animate-pulse"
                style={{ clipPath: 'var(--clip-panel-sm)' }}></div>
            ))}
          </div>
        )}

        {!isLoading && !hasSearched && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 border border-[var(--border-dim)] flex items-center justify-center mb-4"
              style={{ clipPath: 'var(--clip-panel-sm)' }}>
              <MagnifyingGlassIcon className="h-5 w-5 text-[var(--text-muted)]" />
            </div>
            <span className="hud-label">NO ACTIVE SCAN</span>
            <p className="text-[var(--text-muted)] text-sm mt-2">Initialize reconnaissance to discover data nodes.</p>
          </div>
        )}

        {sources.map((source, index) => {
          const isSelected = selectedSource === index;
          const isLocal = source.accessMethod === 'LOCAL_FILE';

          return (
            <button
              key={index}
              onClick={() => onSelectSource(index)}
              className={`w-full text-left p-4 transition-all relative group ${isSelected
                  ? 'bg-[var(--cyan-dim)] border-l-2 border-l-[var(--cyan-primary)]'
                  : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border-l-2 border-l-transparent'
                }`}
              style={{ clipPath: 'var(--clip-panel-sm)' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 ${isSelected ? 'text-[var(--cyan-primary)]' : 'text-[var(--text-muted)]'}`}>
                    {isLocal ? <FileIcon className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm truncate ${isSelected ? 'text-[var(--cyan-primary)]' : 'text-[var(--text-normal)]'}`}>
                      {source.title || (isLocal ? 'LOCAL_ASSET' : 'REMOTE_NODE')}
                    </h3>
                    <div className="hud-label mt-1">
                      {source.accessMethod.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-4 w-4 text-[var(--cyan-primary)]" />
                  </div>
                )}
              </div>

              {/* Index Number */}
              <div className="absolute top-2 right-2 hud-label text-[10px] opacity-50">
                {(index + 1).toString().padStart(2, '0')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Stats */}
      {hasSearched && sources.length > 0 && (
        <div className="p-4 border-t border-[var(--border-dim)] bg-[var(--bg-void)]">
          <div className="flex justify-between items-center">
            <span className="hud-label">SCAN COMPLETE</span>
            <div className="flex gap-1">
              {[...Array(sources.length)].map((_, i) => (
                <div key={i} className={`w-2 h-2 ${selectedSource === i ? 'bg-[var(--cyan-primary)]' : 'bg-[var(--border-dim)]'}`}></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
