
import React from 'react';

export const MainCardFrame: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className, children }) => (
    <div className={`relative ${className}`}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xl" viewBox="0 0 800 800" fill="none" preserveAspectRatio="none">
            <defs>
                <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#F8FAFC" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="15" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Main Body */}
            <path
                d="M 40,0 L 760,0 L 800,40 L 800,760 L 760,800 L 40,800 L 0,760 L 0,40 Z"
                fill="url(#cardGrad)"
                stroke="#E2E8F0"
                strokeWidth="1"
            />

            {/* Inner Technical Lines */}
            <path
                d="M 50,20 L 750,20 M 780,50 L 780,750 M 750,780 L 50,780 M 20,750 L 20,50"
                stroke="#CBD5E1"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
            />

            {/* Corner Accents */}
            <path d="M 10,60 L 10,10 L 60,10" stroke="#94A3B8" strokeWidth="2" fill="none" />
            <path d="M 790,60 L 790,10 L 740,10" stroke="#94A3B8" strokeWidth="2" fill="none" />
            <path d="M 790,740 L 790,790 L 740,790" stroke="#94A3B8" strokeWidth="2" fill="none" />
            <path d="M 10,740 L 10,790 L 60,790" stroke="#94A3B8" strokeWidth="2" fill="none" />

            {/* Decorative Notches */}
            <path d="M 380,785 L 420,785" stroke="#CBD5E1" strokeWidth="3" />
            <path d="M 380,15 L 420,15" stroke="#CBD5E1" strokeWidth="3" />
        </svg>
        <div className="relative z-10 h-full w-full">
            {children}
        </div>
    </div>
);

export const RingSystem: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`${className} animate-pulse-slow`} viewBox="0 0 400 200" fill="none">
        <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0891B2" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#0891B2" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0891B2" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="metalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="50%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
        </defs>

        {/* Outer Rings (Tilted Perspective) */}
        <ellipse cx="200" cy="100" rx="180" ry="60" stroke="url(#metalGrad)" strokeWidth="1" opacity="0.5" />

        <g className="animate-spin-slow origin-center" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <ellipse cx="200" cy="100" rx="160" ry="50" stroke="url(#ringGrad)" strokeWidth="3" strokeDasharray="20 40" strokeLinecap="round" />
        </g>

        <g className="animate-spin-reverse-slow origin-center" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <ellipse cx="200" cy="100" rx="140" ry="40" stroke="#0891B2" strokeWidth="1" strokeDasharray="10 10" opacity="0.6" />
        </g>

        {/* Inner Glow */}
        <ellipse cx="200" cy="100" rx="60" ry="20" fill="#0891B2" opacity="0.1" filter="blur(8px)" />

        {/* Tech Markers */}
        <path d="M 20,100 L 40,100" stroke="#0891B2" strokeWidth="2" />
        <path d="M 360,100 L 380,100" stroke="#0891B2" strokeWidth="2" />
    </svg>
);

export const InitButtonFrame: React.FC<{ className?: string; children?: React.ReactNode; onClick?: () => void }> = ({ className, children, onClick }) => (
    <button onClick={onClick} className={`relative group ${className} transition-transform active:scale-95`}>
        <svg className="absolute inset-0 w-full h-full drop-shadow-md group-hover:drop-shadow-lg transition-all" viewBox="0 0 300 60" fill="none" preserveAspectRatio="none">
            <defs>
                <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0891B2" />
                    <stop offset="100%" stopColor="#0E7490" />
                </linearGradient>
            </defs>

            {/* Main Hex Shape */}
            <path
                d="M 20,0 L 280,0 L 300,30 L 280,60 L 20,60 L 0,30 Z"
                fill="url(#btnGrad)"
                className="group-hover:brightness-110 transition-all"
            />

            {/* High-Tech Insets */}
            <path d="M 30,5 L 270,5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <path d="M 30,55 L 270,55" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

            {/* Arrows */}
            <path d="M 275,25 L 280,30 L 275,35" stroke="white" strokeWidth="2" fill="none" />
            <path d="M 282,25 L 287,30 L 282,35" stroke="white" strokeWidth="2" fill="none" opacity="0.6" />

            {/* Side Grips */}
            <rect x="2" y="24" width="4" height="12" fill="#06B6D4" />
            <rect x="294" y="24" width="4" height="12" fill="#06B6D4" />
        </svg>

        <div className="relative z-10 flex items-center justify-center h-full w-full text-white font-bold tracking-widest text-lg font-[Orbitron]">
            {children}
        </div>
    </button>
);

export const FeatureCardFrame: React.FC<{ icon: React.ReactNode; title: string, className?: string }> = ({ icon, title, className }) => (
    <div className={`relative px-6 py-4 ${className} group`}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 80" fill="none" preserveAspectRatio="none">
            {/* Background */}
            <path d="M 10,0 L 190,0 L 200,10 L 200,70 L 190,80 L 10,80 L 0,70 L 0,10 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />

            {/* Accents */}
            <path d="M 10,75 L 40,75" stroke="#0891B2" strokeWidth="2" />
            <path d="M 160,75 L 190,75" stroke="#94A3B8" strokeWidth="2" />
        </svg>
        <div className="relative z-10 flex flex-col items-start gap-2">
            <span className="font-[Orbitron] text-slate-700 text-sm font-bold tracking-wider">{title}</span>
            <div className="text-[#0891B2] group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
        </div>
    </div>
);
