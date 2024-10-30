import React, { useState } from 'react';
import { Player } from '@revideo/player-react';
import { QuizData } from '../types/quizTypes';
import { exportVideo } from '../utils/videoExport';

interface QuizPreviewProps {
  quizData: QuizData;
  currentTime: number;
}

const QuizPreview: React.FC<QuizPreviewProps> = ({ quizData, currentTime }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExportVideo = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setDownloadUrl(null);
    setError(null);

    try {
      const url = await exportVideo(quizData, setExportProgress);
      setDownloadUrl(url);
    } catch (error) {
      console.error('Failed to export video:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-[30%]">
      <div className="bg-black w-full h-full rounded-lg flex items-center justify-center">
        {quizData.quiz.topic.text && quizData.quiz.intro.text && quizData.quiz.outro.text && quizData.quiz.quizzes.length > 0 ? (
          <Player 
            currentTime={currentTime} 
            src="http://localhost:4000/player/" 
            variables={quizData} 
            width={1080} 
          />
        ) : (
          <p className="text-gray-400">Generate a quiz to see the preview</p>
        )}
      </div>
      <button 
        className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        onClick={handleExportVideo}
        disabled={isExporting}
      >
        {isExporting ? `Exporting... ${Math.round(exportProgress * 100)}%` : 'Export Video'}
      </button>
      {downloadUrl && (
        <a 
          href={downloadUrl} 
          download="quiz_video.mp4"
          className="mt-2 block w-full text-center bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Download Video
        </a>
      )}
      {error && (
        <p className="mt-2 text-red-500">{error}</p>
      )}
    </div>
  );
};

export default QuizPreview;