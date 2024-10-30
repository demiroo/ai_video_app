import React, { useState, useEffect, useRef } from 'react';
import AudioControl from './AudioControl';
import BackgroundImageControl from './BackgroundImageControl';
import { QuizItem, ContentSettings } from '../types/quizTypes'; // Import QuizItem and ContentSettings from quizTypes

interface QuizQuestionsProps {
  quizzes: QuizItem[];
  onChange: (updatedQuizzes: QuizItem[]) => void;
  onFocus: (index: number, subSection?: 'question' | 'options' | 'answer') => void;
}

const calculateAudioDuration = (audioUrl: string): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
    });
  });
};

const QuizQuestions: React.FC<QuizQuestionsProps> = ({ quizzes, onChange, onFocus }) => {
  const [quizData, setQuizData] = useState<QuizItem[]>([]);
  const fileInputRefs = useRef<Array<{
    questionAudio: React.RefObject<HTMLInputElement>;
    optionsAudio: React.RefObject<HTMLInputElement>;
    answerAudio: React.RefObject<HTMLInputElement>;
    backgroundImage: React.RefObject<HTMLInputElement>;
  }>>([]);
  const offset = 6; // Constant offset value
  const [loadingImages, setLoadingImages] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const updateQuizzesWithTiming = async () => {
      let previousCurrentTime = 0;
      const updatedQuizzes = await Promise.all(quizzes.map(async (quiz, index) => {
        const questionDuration = await calculateAudioDuration(quiz.question.questionAudioUrl);
        const optionsDuration = await calculateAudioDuration(quiz.options.optionsAudioUrl);
        const answerDuration = await calculateAudioDuration(quiz.answer.answerAudioUrl);

        const questionAudioTime = previousCurrentTime;
        previousCurrentTime += questionDuration;

        const optionsAudioTime = previousCurrentTime;
        previousCurrentTime += optionsDuration;

        const answerAudioTime = previousCurrentTime + offset;
        previousCurrentTime = answerAudioTime + answerDuration;

        return {
          ...quiz,
          questionDuration,
          optionsDuration,
          answerDuration,
          questionAudioTime,
          optionsAudioTime,
          answerAudioTime,
          totalDuration: questionDuration + optionsDuration + answerDuration + offset
        };
      }));
      setQuizData(updatedQuizzes);
    };

    updateQuizzesWithTiming();
    fileInputRefs.current = quizzes.map(() => ({
      questionAudio: React.createRef<HTMLInputElement>(),
      optionsAudio: React.createRef<HTMLInputElement>(),
      answerAudio: React.createRef<HTMLInputElement>(),
      backgroundImage: React.createRef<HTMLInputElement>(),
    }));
  }, [quizzes]);

  const handleQuestionChange = async (index: number, field: string, value: string) => {
    const updatedQuizData = [...quizData];
    const updatedQuiz = { ...updatedQuizData[index] };
  
    if (field === 'question.text') {
      updatedQuiz.question.text = value;
    } else if (field === 'question.questionAudioUrl') {
      updatedQuiz.question.questionAudioUrl = value;
      updatedQuiz.questionDuration = await calculateAudioDuration(value);
    } else if (field === 'options.optionsAudioUrl') {
      updatedQuiz.options.optionsAudioUrl = value;
      updatedQuiz.optionsDuration = await calculateAudioDuration(value);
    } else if (field === 'answer.answerAudioUrl') {
      updatedQuiz.answer.answerAudioUrl = value;
      updatedQuiz.answerDuration = await calculateAudioDuration(value);
    }
  
    updatedQuiz.totalDuration =
      updatedQuiz.questionDuration +
      updatedQuiz.optionsDuration +
      updatedQuiz.answerDuration +
      offset;
  
    updatedQuizData[index] = updatedQuiz;
    setQuizData(updatedQuizData);
    onChange(updatedQuizData);
  };

  const handleOptionChange = (quizIndex: number, optionIndex: number, newOption: string) => {
    const updatedQuizData = [...quizData];
    updatedQuizData[quizIndex].options.optionData[optionIndex] = newOption;
    setQuizData(updatedQuizData);
    onChange(updatedQuizData);
  };

  const handleAnswerSelect = (quizIndex: number, selectedOption: string) => {
    const updatedQuizData = [...quizData];
    updatedQuizData[quizIndex].answer.text = selectedOption;
    setQuizData(updatedQuizData);
    onChange(updatedQuizData);
  };

  const handleFileChange = async (quizIndex: number, field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (field === 'backgroundImage') {
          const updatedQuizData = [...quizData];
          updatedQuizData[quizIndex].backgroundImage = reader.result as string;
          setQuizData(updatedQuizData);
          onChange(updatedQuizData);
        } else {
          await handleQuestionChange(quizIndex, field, reader.result as string);
        }
      };
      reader.onerror = () => {
        alert(`Error reading file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const defaultContentSettings: ContentSettings = {
    fontSize: 16,
    fontColor: "#FFFFFF",
    fontWeight: 400,
    fontFamily: "Arial",
    textAlign: "center",
    borderColor: "#000000",
    borderWidth: 0,
    shadowColor: "#000000",
    shadowBlur: 0,
  };

  const addNewQuestion = async () => {
    const newQuestion: QuizItem = {
      question: {
        text: "",
        questionAudioUrl: "",
        contentSettings: { ...defaultContentSettings }
      },
      options: {
        optionData: ["", "", "", ""],
        optionsAudioUrl: "",
        contentSettings: { ...defaultContentSettings }
      },
      answer: {
        text: "",
        answerAudioUrl: "",
        contentSettings: { ...defaultContentSettings }
      },
      backgroundImage: "",
      questionDuration: 0,
      optionsDuration: 0,
      answerDuration: 0,
      questionAudioTime: 0,
      optionsAudioTime: 0,
      answerAudioTime: 0,
      totalDuration: 0
    };
    const updatedQuizData = [...quizData, newQuestion];
    
    if (updatedQuizData.length > 1) {
      const lastQuestion = updatedQuizData[updatedQuizData.length - 2];
      newQuestion.questionAudioTime = lastQuestion.answerAudioTime + lastQuestion.answerDuration;
      newQuestion.optionsAudioTime = newQuestion.questionAudioTime;
      newQuestion.answerAudioTime = newQuestion.optionsAudioTime + offset;
    }

    setQuizData(updatedQuizData);
    onChange(updatedQuizData);
    fileInputRefs.current.push({
      questionAudio: React.createRef<HTMLInputElement>(),
      optionsAudio: React.createRef<HTMLInputElement>(),
      answerAudio: React.createRef<HTMLInputElement>(),
      backgroundImage: React.createRef<HTMLInputElement>(),
    });
  };

  const removeQuestion = (index: number) => {
    const updatedQuizData = quizData.filter((_, i) => i !== index);
    
    let previousCurrentTime = index > 0 ? updatedQuizData[index - 1].answerAudioTime + updatedQuizData[index - 1].answerDuration : 0;
    for (let i = index; i < updatedQuizData.length; i++) {
      updatedQuizData[i].questionAudioTime = previousCurrentTime;
      previousCurrentTime += updatedQuizData[i].questionDuration;

      updatedQuizData[i].optionsAudioTime = previousCurrentTime;
      previousCurrentTime += updatedQuizData[i].optionsDuration;

      updatedQuizData[i].answerAudioTime = previousCurrentTime + offset;
      previousCurrentTime = updatedQuizData[i].answerAudioTime + updatedQuizData[i].answerDuration;
    }

    setQuizData(updatedQuizData);
    onChange(updatedQuizData);
    fileInputRefs.current.splice(index, 1);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const updatedQuizData = [...quizData];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < updatedQuizData.length) {
      [updatedQuizData[index], updatedQuizData[newIndex]] = [updatedQuizData[newIndex], updatedQuizData[index]];

      let previousCurrentTime = 0;
      updatedQuizData.forEach((quiz, i) => {
        quiz.questionAudioTime = previousCurrentTime;
        previousCurrentTime += quiz.questionDuration;

        quiz.optionsAudioTime = previousCurrentTime;
        previousCurrentTime += quiz.optionsDuration;

        quiz.answerAudioTime = previousCurrentTime + offset;
        previousCurrentTime = quiz.answerAudioTime + quiz.answerDuration;
      });

      setQuizData(updatedQuizData);
      onChange(updatedQuizData);
    }
  };

  const handleGenerateBackgroundImage = async (quizIndex: number) => {
    setLoadingImages(prev => ({ ...prev, [quizIndex]: true }));
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: quizData[quizIndex].question.text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate background image');
      }

      const data = await response.json();
      const imageUrl = data.image_url; // This is now a full URL

      const updatedQuizData = [...quizData];
      updatedQuizData[quizIndex].backgroundImage = imageUrl;
      setQuizData(updatedQuizData);
      onChange(updatedQuizData);
    } catch (error) {
      console.error('Error generating background image:', error);
      alert('Failed to generate background image. Please try again.');
    } finally {
      setLoadingImages(prev => ({ ...prev, [quizIndex]: false }));
    }
  };

  const handleGenerateAudio = async (quizIndex: number, type: 'question' | 'options' | 'answer') => {
    try {
      let text = '';
      switch (type) {
        case 'question':
          text = quizData[quizIndex].question.text;
          break;
        case 'options':
          text = quizData[quizIndex].options.optionData.join(', ');
          break;
        case 'answer':
          text = quizData[quizIndex].answer.text;
          break;
      }

      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, type }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const data = await response.json();
      const audioUrl = data.audioUrl;

      const updatedQuizData = [...quizData];
      switch (type) {
        case 'question':
          updatedQuizData[quizIndex].question.questionAudioUrl = audioUrl;
          break;
        case 'options':
          updatedQuizData[quizIndex].options.optionsAudioUrl = audioUrl;
          break;
        case 'answer':
          updatedQuizData[quizIndex].answer.answerAudioUrl = audioUrl;
          break;
      }

      setQuizData(updatedQuizData);
      onChange(updatedQuizData);

      // Recalculate durations
      const duration = await calculateAudioDuration(audioUrl);
      updatedQuizData[quizIndex][`${type}Duration`] = duration;
      
      // Update audio times
      let previousCurrentTime = quizIndex > 0 ? updatedQuizData[quizIndex - 1].answerAudioTime + updatedQuizData[quizIndex - 1].answerDuration : 0;
      updatedQuizData[quizIndex].questionAudioTime = previousCurrentTime;
      previousCurrentTime += updatedQuizData[quizIndex].questionDuration;
      updatedQuizData[quizIndex].optionsAudioTime = previousCurrentTime;
      previousCurrentTime += updatedQuizData[quizIndex].optionsDuration;
      updatedQuizData[quizIndex].answerAudioTime = previousCurrentTime + offset;

      setQuizData(updatedQuizData);
      onChange(updatedQuizData);
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Failed to generate audio. Please try again.');
    }
  };

  const handleRegenerateAudio = async (quizIndex: number, type: 'question' | 'options' | 'answer') => {
    // For regeneration, we'll just call the generate function again
    await handleGenerateAudio(quizIndex, type);
  };

  return (
    <div className="mt-6 space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-2xl font-bold">Quiz Questions</h2>
      </div>
      <div>
        {quizData.map((quiz, quizIndex) => (
          <div
            key={quizIndex}
            className="bg-gray-900 p-6 rounded-lg shadow-lg mb-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold flex items-center">
                Question {quizIndex + 1}
              </h3>
              <div className="flex items-center space-x-2">
              {quizIndex !== 0 && (
                  <button
                    onClick={() => moveQuestion(quizIndex, 'up')}
                    className="bg-transparent text-white px-2 py-1 rounded hover:bg-gray-600"
                    aria-label={`Move question ${quizIndex + 1} up`}
                  >
                    ▲
                  </button>
                )}
                {quizIndex !== quizData.length - 1 && (
                  <button
                    onClick={() => moveQuestion(quizIndex, 'down')}
                    className="bg-transparent text-white px-2 py-1 rounded hover:bg-gray-600"
                    aria-label={`Move question ${quizIndex + 1} down`}
                  >
                    ▼
                  </button>
                )}
                <button
                  onClick={() => removeQuestion(quizIndex)}
                  className="bg-transparent text-white px-2 py-1 rounded hover:bg-red-700"
                  aria-label={`Remove question ${quizIndex + 1}`}
                >
                  ✖
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <textarea
                  value={quiz.question.text}
                  onChange={(e) => handleQuestionChange(quizIndex, 'question.text', e.target.value)}
                  onFocus={() => onFocus(quizIndex, 'question')}
                  className="w-full bg-gray-700 text-white p-2 rounded-lg mb-2"
                  rows={3}
                  placeholder="Enter Question"
                  aria-label={`Question ${quizIndex + 1}`}
                />

                <div className="space-y-2">
                  <h4 className="text-white font-semibold">Options</h4>
                  {quiz.options.optionData.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(quizIndex, optionIndex, e.target.value)}
                        onFocus={() => onFocus(quizIndex, 'options')}
                        className="flex-grow bg-gray-700 text-white p-2 rounded-lg"
                        placeholder={`Option ${optionIndex + 1}`}
                        aria-label={`Option ${optionIndex + 1} for question ${quizIndex + 1}`}
                      />
                      <button
                        onClick={() => {
                          handleAnswerSelect(quizIndex, option);
                          onFocus(quizIndex, 'answer');
                        }}
                        className={`py-2 px-4 rounded-lg ${
                          quiz.answer.text === option
                            ? 'bg-green-800 text-white hover:bg-green-700'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                        aria-label={`${quiz.answer.text === option ? 'Selected as answer' : 'Select as answer'}: ${option}`}
                      >
                        {quiz.answer.text === option ? 'answer' : 'select'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <BackgroundImageControl
                  imageUrl={quiz.backgroundImage}
                  onGenerate={() => handleGenerateBackgroundImage(quizIndex)}
                  label={`Question ${quizIndex + 1}`}
                  isLoading={loadingImages[quizIndex] || false}
                />

                <div className="space-y-2">
                  <h4 className="text-white font-semibold">Question Audio</h4>
                  <AudioControl 
                    src={quiz.question.questionAudioUrl} 
                    label={`Question ${quizIndex + 1}`} 
                    startTime={quiz.questionAudioTime}
                    duration={quiz.questionDuration}
                    onGenerate={() => handleGenerateAudio(quizIndex, 'question')}
                    onRegenerate={() => handleRegenerateAudio(quizIndex, 'question')}
                    isLoading={false} // Add this line or use a state variable if you're tracking loading state
                  />

                  <h4 className="text-white font-semibold">Options Audio</h4>
                  <AudioControl 
                    src={quiz.options.optionsAudioUrl} 
                    label={`Options for question ${quizIndex + 1}`} 
                    startTime={quiz.optionsAudioTime}
                    duration={quiz.optionsDuration}
                    onGenerate={() => handleGenerateAudio(quizIndex, 'options')}
                    onRegenerate={() => handleRegenerateAudio(quizIndex, 'options')}
                    isLoading={false} // Add this line or use a state variable if you're tracking loading state
                  />

                  <h4 className="text-white font-semibold">Answer Audio</h4>
                  <AudioControl 
                    src={quiz.answer.answerAudioUrl} 
                    label={`Answer for question ${quizIndex + 1}`} 
                    startTime={quiz.answerAudioTime}
                    duration={quiz.answerDuration}
                    onGenerate={() => handleGenerateAudio(quizIndex, 'answer')}
                    onRegenerate={() => handleRegenerateAudio(quizIndex, 'answer')}
                    isLoading={false} // Add this line or use a state variable if you're tracking loading state
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addNewQuestion}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-lg transition duration-300"
        aria-label="Add new question"
      >
        Add New Question
      </button>
    </div>
  );
};

export default QuizQuestions;
