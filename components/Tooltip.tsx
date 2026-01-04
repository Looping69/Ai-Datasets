
import React from 'react';
import { QuestionMarkIcon } from './icons/QuestionMarkIcon';

interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  return (
    <div className="relative flex items-center group ml-2 z-50">
      <div className="cursor-help text-[var(--text-muted)] hover:text-[var(--cyan-primary)] transition-colors">
        <QuestionMarkIcon className="h-4 w-4" />
      </div>

      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-64 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none origin-bottom scale-95 group-hover:scale-100">
        <div className="bg-[var(--bg-elevated)] border border-[var(--cyan-dim)] p-4 shadow-lg relative"
          style={{ clipPath: 'var(--clip-panel-sm)' }}>
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--cyan-primary)]"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--cyan-primary)]"></div>

          <p className="text-[var(--text-normal)] text-xs leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: text
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--cyan-primary)]">$1</strong>')
                .replace(/`(.*?)`/g, '<code class="bg-[var(--bg-void)] text-[var(--cyan-bright)] px-1 py-0.5 text-[10px] font-mono">$1</code>')
            }}
          />
        </div>

        {/* Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="w-2 h-2 bg-[var(--bg-elevated)] border-r border-b border-[var(--cyan-dim)] transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;