import React from 'react';
import QuizProgress from './QuizProgress';

interface QuizControlsProps {
  loadingAction: string | null;
  fetchQuizData: (actionType: string) => void;
  onGenerateBackgroundImage: () => void;
  onGenerateQuiz: () => void;
  isPolling: boolean;
  progress: number;
}

const QuizControls: React.FC<QuizControlsProps> = ({
  loadingAction,
  fetchQuizData,
  onGenerateBackgroundImage,
  onGenerateQuiz,
  isPolling,
  progress,
}) => {
  console.log('QuizControls props:', { loadingAction, isPolling, progress }); // Add this log
  return (
    <>
      <div className="flex flex-wrap gap-4 mt-6">
        {/* <button
          onClick={() => fetchQuizData('generate')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={!!loadingAction}
        >
          {loadingAction === 'generate' ? 'Generating...' : 'Generate Video'}
        </button> */}
        {/* <button
          onClick={onGenerateBackgroundImage}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          disabled={!!loadingAction}
        >
          Generate Background Image
        </button> */}
        {/* <button
          onClick={onGenerateQuiz}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          disabled={!!loadingAction}
        >
          Generate Quiz
        </button> */}

        <button
          className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
          onClick={() => fetchQuizData('auto_generate_video')}
          disabled={loadingAction !== null}
        >
         
          {loadingAction === 'generate' ? 'Generating...' : 'Surprise Me!'}
        </button>
      </div>

      {/* Add the progress component */}
      <QuizProgress 
        isPolling={isPolling}
        progress={progress}
        loadingAction={loadingAction}
      />
    </>
  );
};

export default QuizControls;
