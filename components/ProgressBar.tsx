import React from 'react';

interface ProgressBarProps {
  isActive: boolean;
  currentStep?: string;
  progress?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isActive, currentStep, progress = 0 }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">
          {isActive ? 'Processing...' : 'Ready'}
        </h3>
        {currentStep && (
          <span className="text-xs text-gray-500">{currentStep}</span>
        )}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          {isActive && (
            <div className="h-full w-full bg-white/30 animate-pulse"></div>
          )}
        </div>
      </div>
      
      {progress > 0 && (
        <div className="mt-2 text-xs text-gray-500 text-right">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
