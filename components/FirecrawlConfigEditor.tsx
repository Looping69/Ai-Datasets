
import React, { useState, useEffect } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import Tooltip from './Tooltip';
import TooltipWrapper from './TooltipWrapper';

interface FirecrawlConfig {
  url: string;
  proxy?: string;
  crawlerOptions?: {
    includes?: string[];
    excludes?: string[];
    maxDepth?: number;
    delay?: number;
    rateLimit?: number;
    pageOptions?: {
      onlyMainContent?: boolean;
      waitFor?: number;
    };
  };
  headers?: {
    'User-Agent'?: string;
  };
}

interface FirecrawlConfigEditorProps {
  initialJsonString: string;
}

const defaultConfig: FirecrawlConfig = {
  url: '',
  proxy: '',
  crawlerOptions: {
    includes: [],
    excludes: [],
    maxDepth: 3,
    delay: 1000,
    rateLimit: 5,
    pageOptions: {
      onlyMainContent: true,
      waitFor: 0,
    }
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  }
};

export const FirecrawlConfigEditor: React.FC<FirecrawlConfigEditorProps> = ({ initialJsonString }) => {
  const [config, setConfig] = useState<FirecrawlConfig>(defaultConfig);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setUrlError(null);
    try {
      if (!initialJsonString || initialJsonString.trim() === '{}') {
        setConfig(defaultConfig);
        setError("Configuration empty. Specify target URL.");
        return;
      }
      const parsedConfig = JSON.parse(initialJsonString);

      const mergedConfig = {
        ...defaultConfig,
        ...parsedConfig,
        crawlerOptions: {
          ...defaultConfig.crawlerOptions,
          ...(parsedConfig.crawlerOptions || {}),
          pageOptions: {
            ...defaultConfig.crawlerOptions?.pageOptions,
            ...(parsedConfig.crawlerOptions?.pageOptions || {}),
          },
        },
        headers: {
          ...defaultConfig.headers,
          ...(parsedConfig.headers || {}),
        }
      };
      setConfig(mergedConfig);
    } catch (e) {
      console.error("Failed to parse Firecrawl config JSON:", e);
      setError("Invalid configuration format.");
      setConfig(defaultConfig);
    }
  }, [initialJsonString]);

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setUrlError('REQUIRED');
      return false;
    }
    try {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(url)) {
        setUrlError('INVALID');
        return false;
      }
    } catch (e) {
      setUrlError('INVALID');
      return false;
    }
    setUrlError(null);
    return true;
  };

  const handleInputChange = (path: string, value: any) => {
    setConfig(prevConfig => {
      const newConfig = JSON.parse(JSON.stringify(prevConfig));
      let current = newConfig;
      const keys = path.split('.');
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = current[keys[i]] || {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    handleInputChange('url', newUrl);
    validateUrl(newUrl);
  };

  const handleArrayChange = (path: string, value: string) => {
    handleInputChange(path, value.split(',').map(s => s.trim()).filter(Boolean));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getNestedValue = (obj: any, path: string, defaultValue: any = '') => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) ?? defaultValue;
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-dim)] p-6"
      style={{ clipPath: 'var(--clip-panel-sm)' }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="hud-label text-[var(--orange-warn)]">SPIDER</span>
          <span className="hud-label text-[var(--text-muted)]">[FIRECRAWL]</span>
        </div>
        <button
          onClick={handleCopy}
          className="hud-button py-1.5 px-4 text-xs"
        >
          <span className="flex items-center gap-2">
            <CopyIcon className="h-3.5 w-3.5" />
            {copied ? 'COPIED' : 'COPY'}
          </span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-[var(--bg-void)] border-l-2 border-l-[var(--red-error)] text-[var(--red-error)] text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Target URL */}
        <div>
          <label className="hud-label block mb-2 flex items-center gap-2">
            TARGET URL
            {urlError && <span className="text-[var(--red-error)]">[{urlError}]</span>}
          </label>
          <input
            type="text"
            value={config.url}
            onChange={handleUrlChange}
            onBlur={(e) => validateUrl(e.target.value)}
            placeholder="https://example.com"
            className={`hud-input ${urlError ? 'border-[var(--red-error)]' : ''}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="hud-label block mb-2">MAX DEPTH</label>
            <input
              type="number"
              value={getNestedValue(config, 'crawlerOptions.maxDepth', 0)}
              onChange={e => handleInputChange('crawlerOptions.maxDepth', parseInt(e.target.value, 10) || 0)}
              className="hud-input"
            />
          </div>
          <div>
            <label className="hud-label block mb-2">WAIT (MS)</label>
            <input
              type="number"
              value={getNestedValue(config, 'crawlerOptions.pageOptions.waitFor', 0)}
              onChange={e => handleInputChange('crawlerOptions.pageOptions.waitFor', parseInt(e.target.value, 10) || 0)}
              className="hud-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="hud-label block mb-2">INCLUDES</label>
            <textarea
              value={getNestedValue(config, 'crawlerOptions.includes', []).join(', ')}
              onChange={e => handleArrayChange('crawlerOptions.includes', e.target.value)}
              rows={2}
              className="hud-input resize-none text-sm"
              placeholder="/products/*, /blog/*"
            />
          </div>
          <div>
            <label className="hud-label block mb-2">EXCLUDES</label>
            <textarea
              value={getNestedValue(config, 'crawlerOptions.excludes', []).join(', ')}
              onChange={e => handleArrayChange('crawlerOptions.excludes', e.target.value)}
              rows={2}
              className="hud-input resize-none text-sm"
              placeholder="/admin, /login"
            />
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-3 pt-2">
          <div
            className={`w-5 h-5 border flex items-center justify-center cursor-pointer transition-colors ${getNestedValue(config, 'crawlerOptions.pageOptions.onlyMainContent', false)
                ? 'bg-[var(--cyan-primary)] border-[var(--cyan-primary)]'
                : 'border-[var(--border-dim)] hover:border-[var(--cyan-primary)]'
              }`}
            style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
            onClick={() => handleInputChange('crawlerOptions.pageOptions.onlyMainContent', !getNestedValue(config, 'crawlerOptions.pageOptions.onlyMainContent', false))}
          >
            {getNestedValue(config, 'crawlerOptions.pageOptions.onlyMainContent', false) && (
              <svg className="w-3 h-3 text-[var(--bg-void)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <label className="hud-label cursor-pointer" onClick={() => handleInputChange('crawlerOptions.pageOptions.onlyMainContent', !getNestedValue(config, 'crawlerOptions.pageOptions.onlyMainContent', false))}>
            EXTRACT MAIN CONTENT ONLY
          </label>
        </div>
      </div>
    </div>
  );
};