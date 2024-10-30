import React from 'react';

interface AudioControlProps {
  src: string;
  label: string;
  onGenerate: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
  startTime?: number;
  duration?: number;
}

const AudioControl: React.FC<AudioControlProps> = ({
  src,
  label,
  onGenerate,
  onRegenerate,
  isLoading,
  startTime,
  duration,
}) => {
  return (
    <div className="flex items-center space-x-2">
      {src ? (
        <>
          <audio src={src} controls className="w-full" />
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 disabled:bg-gray-600 disabled:text-gray-400 focus:outline-none transition-colors duration-200"
            aria-label="Regenerate audio"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </>
      ) : (
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 disabled:bg-gray-600 disabled:text-gray-400 focus:outline-none transition-colors duration-200"
          aria-label={`Generate ${label} audio`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default AudioControl;