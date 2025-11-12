import React from 'react';
import { setLLMProvider, getLLMProvider } from '../services/ai/client';
import type { LLMProvider } from '../types';
import { BrainIcon } from './icons/BrainIcon';

const LLMSelector: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = React.useState<LLMProvider>(getLLMProvider());

  const providers: Array<{ value: LLMProvider; label: string; color: string }> = [
    { value: 'gemini', label: 'Gemini', color: 'bg-blue-500' },
    { value: 'openai', label: 'ChatGPT', color: 'bg-green-500' },
    { value: 'claude', label: 'Claude', color: 'bg-purple-500' },
    { value: 'deepseek', label: 'DeepSeek', color: 'bg-orange-500' },
    { value: 'qwen', label: 'Qwen', color: 'bg-red-500' },
  ];

  const handleProviderChange = (provider: LLMProvider) => {
    setSelectedProvider(provider);
    setLLMProvider(provider);
  };

  return (
    <div className="flex items-center gap-2">
      <BrainIcon className="h-5 w-5 text-gray-600" />
      <select
        value={selectedProvider}
        onChange={(e) => handleProviderChange(e.target.value as LLMProvider)}
        className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
      >
        {providers.map((provider) => (
          <option key={provider.value} value={provider.value}>
            {provider.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LLMSelector;
