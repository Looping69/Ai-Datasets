
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      {/* HUD Loading Frame */}
      <div className="relative w-24 h-24">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-2 border-[var(--border-dim)] animate-spin"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            animationDuration: '3s'
          }}></div>

        {/* Inner Ring */}
        <div className="absolute inset-3 border-2 border-[var(--cyan-primary)] animate-spin"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            animationDuration: '2s',
            animationDirection: 'reverse'
          }}></div>

        {/* Center Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-[var(--cyan-primary)] shadow-[0_0_15px_var(--cyan-primary)] animate-pulse"></div>
        </div>

        {/* Corner Markers */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 border-t-2 border-l-2 border-r-2 border-[var(--cyan-primary)]"></div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-l-2 border-r-2 border-[var(--cyan-primary)]"></div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <div className="hud-title text-lg text-[var(--cyan-primary)] glow-text mb-2 animate-flicker">
          SCANNING
        </div>
        <div className="hud-label">MULTI-AGENT PIPELINE ACTIVE</div>
      </div>

      {/* Progress Indicators */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-8 h-1 bg-[var(--bg-surface)]"
            style={{
              animation: `loading-bar 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          >
            <div
              className="h-full bg-[var(--cyan-primary)]"
              style={{
                animation: `loading-fill 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes loading-fill {
          0%, 100% { width: 0%; }
          50% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;