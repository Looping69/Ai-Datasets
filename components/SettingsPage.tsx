import React, { useState, useEffect } from 'react';
import { XCircleIcon } from './icons/XCircleIcon';

interface SettingsPageProps {
  onClose: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose }) => {
  const [firecrawlApiKey, setFirecrawlApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load saved API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('firecrawl_api_key');
    if (savedKey) {
      setFirecrawlApiKey(savedKey);
    }
  }, []);

  const handleSave = async () => {
    if (!firecrawlApiKey.trim()) {
      setMessage({ type: 'error', text: 'Please enter an API key' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      // Save to localStorage for client-side use
      localStorage.setItem('firecrawl_api_key', firecrawlApiKey);

      setMessage({ type: 'success', text: 'API key saved successfully!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to save API key' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    setFirecrawlApiKey('');
    localStorage.removeItem('firecrawl_api_key');
    setMessage({ type: 'success', text: 'API key cleared' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Firecrawl API Key Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Firecrawl API Key</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your Firecrawl API key to enable web crawling and validation features.
              You can get your API key from the{' '}
              <a 
                href="https://www.firecrawl.dev/app/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Firecrawl dashboard
              </a>.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="firecrawl-key" className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  id="firecrawl-key"
                  type="password"
                  value={firecrawlApiKey}
                  onChange={(e) => setFirecrawlApiKey(e.target.value)}
                  placeholder="fc-..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {message && (
                <div
                  className={`p-3 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save API Key'}
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">About API Keys</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your API key is stored locally in your browser</li>
              <li>• It will be used for all Firecrawl API requests</li>
              <li>• Keep your API key secure and don't share it</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
