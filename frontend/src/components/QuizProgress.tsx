import React from 'react';

interface QuizProgressProps {
  isPolling: boolean;
  progress: number;
  loadingAction: string | null;
}

const QuizProgress: React.FC<QuizProgressProps> = ({ isPolling, progress, loadingAction }) => {
  console.log('QuizProgress props:', { isPolling, progress, loadingAction });
  
  if (!loadingAction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 border border-gray-700 shadow-xl">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-6 text-white">
            Generating Quiz...
          </h3>
          
          {/* Progress bar and percentage */}
          <div className="relative mb-6">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(5, progress)}%` }}
              />
            </div>
            <span className="absolute -right-2 top-6 text-sm font-medium text-blue-400">
              {progress}%
            </span>
          </div>
          
          {/* Progress status */}
          <p className="text-sm text-gray-300 mb-2">
            {progress < 25 && "Generating quiz content..."}
            {progress >= 25 && progress < 50 && "Generating images..."}
            {progress >= 50 && progress < 75 && "Generating audio..."}
            {progress >= 75 && progress < 100 && "Finalizing..."}
            {progress === 100 && "Complete!"}
          </p>
          
          {/* Progress details */}
          <div className="mt-6 grid grid-cols-4 gap-2">
            <div className={`p-2 rounded ${progress >= 25 ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-500'}`}>
              Content
            </div>
            <div className={`p-2 rounded ${progress >= 50 ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-500'}`}>
              Images
            </div>
            <div className={`p-2 rounded ${progress >= 75 ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-500'}`}>
              Audio
            </div>
            <div className={`p-2 rounded ${progress === 100 ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-500'}`}>
              Final
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizProgress;
