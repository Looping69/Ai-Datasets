
import React from 'react';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';

interface CollapsedSearchProps {
  description: string;
  onNewSearch: () => void;
}

const CollapsedSearch: React.FC<CollapsedSearchProps> = ({ description, onNewSearch }) => {
  return (
    <div className="flex items-center justify-between gap-4 bg-[var(--bg-surface)] border border-[var(--border-dim)] p-4"
      style={{ clipPath: 'var(--clip-panel-sm)' }}>
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="flex-shrink-0 w-10 h-10 border border-[var(--cyan-primary)] flex items-center justify-center"
          style={{ clipPath: 'var(--clip-panel-sm)' }}>
          <MagnifyingGlassIcon className="h-4 w-4 text-[var(--cyan-primary)]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="hud-label mb-0.5">ACTIVE MISSION</div>
          <p className="text-[var(--text-bright)] font-semibold truncate">
            {description}
          </p>
        </div>
      </div>

      <button
        onClick={onNewSearch}
        className="hud-button py-2 px-5 text-xs flex-shrink-0"
      >
        NEW SCAN
      </button>
    </div>
  );
};

export default CollapsedSearch;