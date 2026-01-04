
import React from 'react';
import { BrainIcon } from './icons/BrainIcon';

const Header: React.FC = () => {
  return (
    <header className="border-b border-[var(--border-dim)] bg-[var(--bg-panel)] px-6 py-4 flex items-center justify-between relative z-20">
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-10 h-10 border-2 border-[var(--cyan-primary)] flex items-center justify-center bg-[var(--bg-void)]"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
            <BrainIcon className="h-5 w-5 text-[var(--cyan-primary)]" />
          </div>
          {/* Corner Accent */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[var(--cyan-primary)]"></div>
        </div>

        <div>
          <h1 className="hud-title text-lg tracking-widest">
            <span className="text-[var(--cyan-primary)]">AI</span> DATASET
          </h1>
          <div className="hud-label text-[10px] -mt-0.5">DISCOVERY PIPELINE v2.0</div>
        </div>
      </div>

      {/* Center: Decorative Elements */}
      <div className="hidden lg:flex items-center gap-2 opacity-40">
        <div className="w-20 h-px bg-gradient-to-r from-transparent to-[var(--border-bright)]"></div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1 h-3 bg-[var(--text-muted)]" style={{ height: `${8 + Math.random() * 12}px` }}></div>
          ))}
        </div>
        <div className="w-20 h-px bg-gradient-to-l from-transparent to-[var(--border-bright)]"></div>
      </div>

      {/* Right: Status Indicators */}
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 hud-label">
          <span className="w-2 h-2 rounded-full bg-[var(--green-status)] shadow-[0_0_8px_var(--green-status)]"></span>
          CONNECTED
        </div>
        <div className="hud-status text-xs">
          <span className="text-[var(--text-muted)] mr-2">NODE:</span>
          GEMINI-2.5
        </div>
      </div>
    </header>
  );
};

export default Header;