
import React from 'react';
import { XCircleIcon } from './icons/XCircleIcon';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="relative bg-[var(--bg-surface)] border border-[var(--red-error)] p-4"
      style={{ clipPath: 'var(--clip-panel-sm)' }}>
      {/* Corner Warning Markers */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--red-error)]"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--red-error)]"></div>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-[var(--red-error)]">
          <XCircleIcon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="hud-label text-[var(--red-error)] mb-1">
            [-ERROR-SYSTEM-]
          </div>
          <p className="text-[var(--text-normal)] text-sm font-medium">
            {message}
          </p>
        </div>
      </div>

      {/* Bottom Error Code */}
      <div className="mt-3 pt-3 border-t border-[var(--border-dim)] flex items-center justify-between">
        <span className="hud-label text-[var(--red-error)]">CODE: 0x{Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-[var(--red-error)] animate-pulse"></div>
          <div className="w-2 h-2 bg-[var(--red-error)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-[var(--red-error)] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;