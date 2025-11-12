import React from 'react';
import { BrainIcon } from './icons/BrainIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import LLMSelector from './LLMSelector';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="py-6 border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center justify-center flex-1">
          <BrainIcon className="h-10 w-10 mr-4 text-cyan-500" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
            AI Dataset Discovery Pipeline
          </h1>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <LLMSelector />
          <button
            onClick={onOpenSettings}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;