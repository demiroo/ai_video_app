import React, { useState, useEffect, useRef } from 'react';

const calculateAudioDuration = (audioUrl) => {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
    });
  });
};

const Questions = ({ quizzes, onChange, onFocus }) => {
  const [quizData, setQuizData] = useState([]);
  const fileInputRefs = useRef([]);
  const offset = 6; // Constant offset value

  useEffect(() => {
    const updateQuizzesWithTiming = async () => {
      let previousCurrentTime = 0;
      const updatedQuizzes = await Promise.all(quizzes.map(async (quiz, index) => {
        const questionDuration = await calculateAudioDuration(quiz.questionAudioUrl);
        const optionsDuration = await calculateAudioDuration(quiz.optionsAudioUrl);
        const answerDuration = await calculateAudioDuration(quiz.answerAudioUrl);

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
      questionAudio: React.createRef(),
      optionsAudio: React.createRef(),
      answerAudio: React.createRef(),
      backgroundImage: React.createRef(),
    }));
  }, [quizzes]);

  const handleQuestionChange = async (index, field, value) => {
    const updatedQuizData = [...quizData];
    updatedQuizData[index][field] = value;
  
    if (field.endsWith('AudioUrl')) {
      const durationField = field.replace('AudioUrl', 'Duration');
      updatedQuizData[index][durationField] = await calculateAudioDuration(value);
    }
  
    updatedQuizData[index].totalDuration =
      updatedQuizData[index].questionDuration +
      updatedQuizData[index].optionsDuration +
      updatedQuizData[index].answerDuration +
      offset;
  
    setQuizData(updatedQuizData);
    onChange(updatedQuizData);
  };

  const handleOptionChange = (quizIndex, optionIndex, newOption) => {
    const updatedQuizData = [...quizData];
    updatedQuizData[quizIndex].options[optionIndex] = newOption;
    setQuizData(updatedQuizData);
    onChange(updatedQuizData);
  };

  const handleAnswerSelect = (quizIndex, selectedOption) => {
    const updatedQuizData = [...quizData];
    updatedQuizData[quizIndex].answer = selectedOption;
    setQuizData(updatedQuizData);
    onChange(updatedQuizData);
  };

  const handleFileChange = async (quizIndex, field, event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await handleQuestionChange(quizIndex, field, reader.result);
      };
      reader.onerror = () => {
        alert(`Error reading file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewQuestion = async () => {
    const newQuestion = {
      question: "",
      questionAudioUrl: "",
      options: ["", "", "", ""],
      optionsAudioUrl: "",
      answer: "",
      answerAudioUrl: "",
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
      questionAudio: React.createRef(),
      optionsAudio: React.createRef(),
      answerAudio: React.createRef(),
      backgroundImage: React.createRef(),
    });
  };

  const removeQuestion = (index) => {
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

  const moveQuestion = (index, direction) => {
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

  const AudioPlayer = ({ src, label, onFocus, startTime, duration, onRefresh, onDelete }) => (
    <div className="flex items-center space-x-2">
      <audio
        controls
        src={src}
        className="w-full"
        aria-label={`${label} audio`}
        onFocus={onFocus}
        data-start={startTime}
        data-duration={duration}
      >
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <button className="bg-gray-700 text-white p-1 rounded hover:bg-gray-600" onClick={onRefresh} aria-label={`Refresh ${label} audio`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      </button>
      <button className="bg-red-800 text-white p-1 rounded hover:bg-red-700" onClick={onDelete} aria-label={`Delete ${label} audio`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="mt-6 space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-2xl font-bold">Quiz Questions</h2>
        
      </div>

      {(
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
                    value={quiz.question}
                    onChange={(e) => handleQuestionChange(quizIndex, 'question', e.target.value)}
                    onFocus={() => onFocus(quizIndex, 'question')}
                    className="w-full bg-gray-700 text-white p-2 rounded-lg mb-2"
                    rows={3}
                    placeholder="Enter Question"
                    aria-label={`Question ${quizIndex + 1}`}
                  />

                  <div className="space-y-2">
                    <h4 className="text-white font-semibold">Options</h4>
                    {quiz.options.map((option, optionIndex) => (
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
                            quiz.answer === option
                              ? 'bg-green-800 text-white hover:bg-green-700'
                              : 'bg-gray-700 text-white hover:bg-gray-600'
                          }`}
                          aria-label={`${quiz.answer === option ? 'Selected as answer' : 'Select as answer'}: ${option}`}
                        >
                          {quiz.answer === option ? 'answer' : 'select'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(quizIndex, 'backgroundImage', e)}
                      onFocus={() => onFocus(quizIndex, 'question')}
                      className="hidden"
                      ref={fileInputRefs.current[quizIndex]?.backgroundImage}
                      aria-label={`Upload background image for question ${quizIndex + 1}`}
                    />
                    {quiz.backgroundImage ? (
                      <img src={quiz.backgroundImage} alt={`Question ${quizIndex + 1} background`} className="w-full h-48 object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                        <button
                          onClick={() => fileInputRefs.current[quizIndex]?.backgroundImage.current?.click()}
                          className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Upload Background Image
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-semibold">Question Audio</h4>
                    <AudioPlayer 
                      src={quiz.questionAudioUrl} 
                      label={`Question ${quizIndex + 1}`} 
                      onFocus={() => onFocus(quizIndex, 'question')}
                      startTime={quiz.questionAudioTime}
                      duration={quiz.questionDuration}
                      onRefresh={() => {/* Implement refresh logic */}}
                      onDelete={() => {/* Implement delete logic */}}
                    />

                    <h4 className="text-white font-semibold">Options Audio</h4>
                    <AudioPlayer 
                      src={quiz.optionsAudioUrl} 
                      label={`Options for question ${quizIndex + 1}`} 
                      onFocus={() => onFocus(quizIndex, 'options')}
                      startTime={quiz.optionsAudioTime}
                      duration={quiz.optionsDuration}
                      onRefresh={() => {/* Implement refresh logic */}}
                      onDelete={() => {/* Implement delete logic */}}
                    />

                    <h4 className="text-white font-semibold">Answer Audio</h4>
                    <AudioPlayer 
                      src={quiz.answerAudioUrl} 
                      label={`Answer for question ${quizIndex + 1}`} 
                      onFocus={() => onFocus(quizIndex, 'answer')}
                      startTime={quiz.answerAudioTime}
                      duration={quiz.answerDuration}
                      onRefresh={() => {/* Implement refresh logic */}}
                      onDelete={() => {/* Implement delete logic */}}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={addNewQuestion}
        className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
        aria-label="Add new question"
      >
        Add New Question
      </button>
    </div>
  );
};

export default Questions;
