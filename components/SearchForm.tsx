
import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon } from './icons/CloudArrowUpIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';

interface SearchFormProps {
  onGenerate: (description: string, file: File | null) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onGenerate, isLoading }) => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description && !file) return;
    onGenerate(description, file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const isButtonDisabled = isLoading || (!description.trim() && !file);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Main Frame */}
      <div className="hud-frame hud-frame-glow p-8 relative">
        {/* Top Label */}
        <div className="absolute -top-3 left-8 bg-[var(--bg-panel)] px-4">
          <span className="hud-label text-[var(--cyan-primary)]">TARGET PARAMETERS</span>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <label className="hud-label block mb-3">
            MISSION BRIEFING
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe target dataset: structure, source type, domain constraints..."
            className="hud-input h-32 resize-none"
            disabled={isLoading}
          />
        </div>

        {/* File Upload */}
        <div className="mb-8">
          <label className="hud-label block mb-3">
            LOCAL ASSET UPLOAD
          </label>
          <div
            className={`relative border-2 border-dashed p-6 text-center transition-all cursor-pointer group ${file
                ? 'border-[var(--cyan-primary)] bg-[var(--cyan-dim)]'
                : 'border-[var(--border-dim)] hover:border-[var(--cyan-dim)] hover:bg-[var(--bg-surface)]'
              }`}
            style={{ clipPath: 'var(--clip-panel-sm)' }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".csv,.json,.txt"
            />

            <div className="flex flex-col items-center justify-center gap-3">
              <CloudArrowUpIcon className={`h-8 w-8 ${file ? 'text-[var(--cyan-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--cyan-dim)]'}`} />

              {file ? (
                <div>
                  <span className="text-[var(--cyan-primary)] font-semibold">{file.name}</span>
                  <div className="hud-label mt-1">FILE LOADED</div>
                </div>
              ) : (
                <div>
                  <span className="text-[var(--text-normal)]">DROP FILE OR CLICK TO BROWSE</span>
                  <div className="hud-label mt-1">.CSV | .JSON | .TXT</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hud-divider"></div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`w-full hud-button hud-button-primary py-4 text-base ${isButtonDisabled ? '' : 'animate-flicker'}`}
        >
          <span className="flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-[var(--bg-void)] border-t-transparent rounded-full animate-spin"></div>
                SCANNING...
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-5 w-5" />
                INITIATE RECONNAISSANCE
              </>
            )}
          </span>
        </button>

        {/* Bottom Status */}
        <div className="mt-6 flex items-center justify-between">
          <div className="hud-status text-xs">
            {file ? 'ASSET QUEUED' : 'AWAITING INPUT'}
          </div>
          <div className="hud-barcode">
            {[...Array(8)].map((_, i) => <span key={i}></span>)}
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
