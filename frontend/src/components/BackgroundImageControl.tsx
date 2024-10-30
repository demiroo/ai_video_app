import React from 'react';

interface BackgroundImageControlProps {
  imageUrl: string;
  onGenerate: () => void;
  label: string;
  isLoading: boolean;
}

const BackgroundImageControl: React.FC<BackgroundImageControlProps> = ({
  imageUrl,
  onGenerate,
  label,
  isLoading,
}) => {
  return (
    <div className="mb-4 relative">
      {isLoading ? (
        <div className="w-full h-48 bg-gray-300 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-gray-600">Generating image...</div>
        </div>
      ) : imageUrl ? (
        <>
          <img 
            src={imageUrl} 
            alt={`${label} background`} 
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={onGenerate}
            className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition duration-300"
            aria-label={`Regenerate ${label} background image`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </>
      ) : (
        <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
          <button
            onClick={onGenerate}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Generate Background Image
          </button>
        </div>
      )}
    </div>
  );
};

export default BackgroundImageControl;