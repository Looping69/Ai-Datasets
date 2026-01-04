
import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';

interface CodeSnippetProps {
  code: string;
  language: 'bash' | 'javascript' | 'json' | 'python';
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[var(--bg-void)] border border-[var(--border-dim)] relative"
      style={{ clipPath: 'var(--clip-panel-sm)' }}>
      {/* Header Bar */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-[var(--border-dim)] bg-[var(--bg-surface)]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[var(--red-error)] opacity-60"></div>
            <div className="w-2 h-2 rounded-full bg-[var(--orange-warn)] opacity-60"></div>
            <div className="w-2 h-2 rounded-full bg-[var(--green-status)] opacity-60"></div>
          </div>
          <span className="hud-label text-[var(--cyan-primary)]">{language.toUpperCase()}</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--cyan-primary)] transition-colors text-xs font-medium uppercase tracking-wider"
        >
          <CopyIcon className="h-3.5 w-3.5" />
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-[var(--cyan-bright)] text-sm leading-relaxed font-mono">
          <code>{code}</code>
        </pre>
      </div>

      {/* Bottom Decorations */}
      <div className="px-4 py-2 border-t border-[var(--border-dim)] flex items-center justify-between bg-[var(--bg-surface)]">
        <span className="hud-label text-[var(--text-muted)]">{code.split('\n').length} LINES</span>
        <div className="hud-barcode scale-75 origin-right">
          {[...Array(8)].map((_, i) => <span key={i}></span>)}
        </div>
      </div>
    </div>
  );
};
