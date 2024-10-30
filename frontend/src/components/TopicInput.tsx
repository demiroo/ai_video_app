import React from 'react';
import { QuizData } from '../types/quizTypes';

interface TopicInputProps {
  quizData: QuizData;
  setQuizData: (data: QuizData) => void;
  numberOfQuestions?: number;
  setNumberOfQuestions?: (num: number) => void;
}

const TopicInput: React.FC<TopicInputProps> = ({ 
  quizData, 
  setQuizData,
  numberOfQuestions = 1,
  setNumberOfQuestions
}) => {
  const handleNumberOfQuestionsChange = (num: number) => {
    setNumberOfQuestions?.(num);
    setQuizData({
      ...quizData,
      quiz: {
        ...quizData.quiz,
        topic: {
          ...quizData.quiz.topic,
          numberOfQuestions: num,
        },
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Quiz Topic</label>
        <input
          type="text"
          value={quizData.quiz.topic.text}
          onChange={(e) =>
            setQuizData({
              ...quizData,
              quiz: {
                ...quizData.quiz,
                topic: {
                  ...quizData.quiz.topic,
                  text: e.target.value,
                },
              },
            })
          }
          className="w-full px-3 py-2 bg-gray-700 rounded-md"
          placeholder="Enter quiz topic..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Number of Questions per quiz</label>
        <input
          type="number"
          min="1"
          max="10"
          value={numberOfQuestions}
          onChange={(e) => handleNumberOfQuestionsChange(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
          className="w-full px-3 py-2 bg-gray-700 rounded-md"
        />
        <p className="text-xs text-gray-400 mt-1">Enter a number between 1 and 10</p>
      </div>
    </div>
  );
};

export default TopicInput;
