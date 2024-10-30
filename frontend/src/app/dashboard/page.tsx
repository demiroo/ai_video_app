'use client';

import React, { useRef, ChangeEvent, useEffect, useState } from 'react';
import HookSelector from '../../components/HookSelector';
import QuizQuestions from '../../components/QuizQuestions';
import Header from '../../components/Header';
import QuizControls from '../../components/QuizControls';
import BackgroundStyleSelector from '../../components/BackgroundStyleSelector';
import QuizPreview from '../../components/QuizPreview';
import TopicInput from '../../components/TopicInput';
import TabSelector from '../../components/TabSelector';
import { useQuizData } from '../../hooks/useQuizData';
import { calculateCurrentTime } from '../../utils/quizUtils';
import ContentSettings from '../../components/ContentSettings';
import { defaultContentSettings } from '../../hooks/useQuizData';
import Link from 'next/link';
import { generateQuiz } from '../../utils/quizGenerator';
import IntroOutroSectionWrapper from '../../components/IntroOutroSectionWrapper';

export default function QuizVideoGenerator() {
  const {
    quizData,
    setQuizData,
    backgroundStyle,
    setBackgroundStyle,
    hookVideo,
    setHookVideo,
    loadingAction,
    setLoadingAction,
    useSampleData,
    setUseSampleData,
    handleQuizChange,
    handleIntroOutroChange,
    fetchQuizData,
    isPolling,
    progress,
  } = useQuizData();

  const [currentSection, setCurrentSection] = useState<{ type: 'intro' | 'outro' | 'quiz', index?: number, subSection?: 'question' | 'options' | 'answer' }>({ type: 'intro' });
  const [currentTime, setCurrentTime] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(1);

  const introAudioRef = useRef<HTMLInputElement>(null);
  const introImageRef = useRef<HTMLInputElement>(null);
  const outroAudioRef = useRef<HTMLInputElement>(null);
  const outroImageRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (type: 'intro' | 'outro', field: 'audioUrl' | 'backgroundImage', event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleIntroOutroChange(type, field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateBackgroundImage = async (type: 'intro' | 'outro') => {
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: quizData.quiz[type].text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate background image');
      }

      const data = await response.json();
      console.log('Image generated:', data);
      const imageUrl = data.image_url;
      setQuizData(prevData => ({
        ...prevData,
        quiz: {
          ...prevData.quiz,
          [type]: {
            ...prevData.quiz[type],
            backgroundImage: imageUrl,
          },
        },
      }));
    } catch (error) {
      console.error('Error generating background image:', error);
      alert('Failed to generate background image. Please try again.');
    }
  };

  const handleGenerateAudio = async (type: 'intro' | 'outro') => {
    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: quizData.quiz[type].text, type }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const data = await response.json();
      const audioUrl = data.audioUrl;

      setQuizData(prevData => ({
        ...prevData,
        quiz: {
          ...prevData.quiz,
          [type]: {
            ...prevData.quiz[type],
            audioUrl: audioUrl,
          },
        },
      }));
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Failed to generate audio. Please try again.');
    }
  };

  const handleRegenerateAudio = async (type: 'intro' | 'outro') => {
    // This function is similar to handleGenerateAudio, but you might want to add some logic
    // to indicate that it's regenerating rather than generating for the first time
    await handleGenerateAudio(type);
  };

  const [activeTab, setActiveTab] = useState<'contents' | 'settings'>('contents');
  const [selectedSection, setSelectedSection] = useState<'topic' | 'intro' | 'outro' | 'question' | 'options' | 'answer'>('topic');
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(0);

  const handleContentSettingsChange = (newSettings: ContentSettings) => {
    setQuizData(prevData => {
      const newData = { ...prevData };
      if (selectedSection === 'topic') {
        newData.quiz.topic.contentSettings = newSettings;
      } else if (selectedSection === 'intro' || selectedSection === 'outro') {
        newData.quiz[selectedSection].contentSettings = newSettings;
      } else {
        newData.quiz.quizzes[selectedQuizIndex][selectedSection].contentSettings = newSettings;
      }
      return newData;
    });
  };

  const getContentSettings = (): ContentSettings => {
    if (selectedSection === 'topic') {
      return quizData.quiz.topic.contentSettings || defaultContentSettings;
    } else if (selectedSection === 'intro' || selectedSection === 'outro') {
      return quizData.quiz[selectedSection].contentSettings || defaultContentSettings;
    } else {
      const quiz = quizData.quiz.quizzes[selectedQuizIndex];
      if (quiz) {
        return quiz[selectedSection].contentSettings || defaultContentSettings;
      }
      return defaultContentSettings;
    }
  };

  useEffect(() => {
    setCurrentTime(calculateCurrentTime(quizData, currentSection));
  }, [currentSection, quizData]);

  const handleGenerateQuiz = async () => {
    try {
      setLoadingAction('Generating Quiz');
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic: quizData.quiz.topic.text,
          numberOfQuestions: numberOfQuestions
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const generatedQuizData = await response.json();
      setQuizData(generatedQuizData);
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-6">AI Quiz Video Generator</h1>

        {/* <div className="flex items-center gap-4 mb-4">
          <label className="text-white">Use Sample Data:</label>
          <input
            type="checkbox"
            checked={useSampleData}
            onChange={() => setUseSampleData(!useSampleData)}
            className="w-6 h-6"
          />
        </div> */}

        <div className="flex justify-center items-start gap-8 w-full max-w-7xl">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[70%] overflow-y-auto max-h-[calc(100vh-65px)]">
            <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === 'contents' && (
              <div className="space-y-6">
                <TopicInput 
                  quizData={quizData} 
                  setQuizData={setQuizData} 
                  numberOfQuestions={numberOfQuestions}
                  setNumberOfQuestions={setNumberOfQuestions}
                />
                <IntroOutroSectionWrapper
                  type="intro"
                  data={quizData.quiz.intro}
                  onTextChange={(value) => handleIntroOutroChange('intro', 'text', value)}
                  onAudioChange={(e) => handleFileChange('intro', 'audioUrl', e)}
                  onImageChange={(e) => handleFileChange('intro', 'backgroundImage', e)}
                  audioRef={introAudioRef}
                  imageRef={introImageRef}
                  onGenerateAudio={() => handleGenerateAudio('intro')}
                  onRegenerateAudio={() => handleRegenerateAudio('intro')}
                  onGenerateBackgroundImage={() => handleGenerateBackgroundImage('intro')}
                  onFocus={() => {
                    const newTime = calculateCurrentTime(quizData, { type: 'intro' });
                    setCurrentTime(newTime);
                  }}
                />
                <QuizQuestions 
                  quizzes={quizData.quiz.quizzes} 
                  onChange={handleQuizChange}
                  onFocus={(index: number, subSection?: 'question' | 'options' | 'answer') => {
                    setCurrentSection({ type: 'quiz', index, subSection });
                    setCurrentTime(calculateCurrentTime(quizData, { type: 'quiz', index, subSection }));
                  }}
                />
                <IntroOutroSectionWrapper
                  type="outro"
                  data={quizData.quiz.outro}
                  onTextChange={(value) => handleIntroOutroChange('outro', 'text', value)}
                  onAudioChange={(e) => handleFileChange('outro', 'audioUrl', e)}
                  onImageChange={(e) => handleFileChange('outro', 'backgroundImage', e)}
                  audioRef={outroAudioRef}
                  imageRef={outroImageRef}
                  onGenerateAudio={() => handleGenerateAudio('outro')}
                  onRegenerateAudio={() => handleRegenerateAudio('outro')}
                  onGenerateBackgroundImage={() => handleGenerateBackgroundImage('outro')}
                  onFocus={() => {
                    const newTime = calculateCurrentTime(quizData, { type: 'outro' });
                    setCurrentTime(newTime);
                  }}
                />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <HookSelector />
                <BackgroundStyleSelector backgroundStyle={backgroundStyle} setBackgroundStyle={setBackgroundStyle} />
                <div>
                  <label className="block text-sm font-medium mb-2">Select Section for Content Settings</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md mb-4"
                  >
                    <option value="topic">Topic</option>
                    <option value="intro">Intro</option>
                    <option value="outro">Outro</option>
                    <option value="question">Question</option>
                    <option value="options">Options</option>
                    <option value="answer">Answer</option>
                  </select>
                  {(selectedSection === 'question' || selectedSection === 'options' || selectedSection === 'answer') && (
                    <select
                      value={selectedQuizIndex}
                      onChange={(e) => setSelectedQuizIndex(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 rounded-md mb-4"
                    >
                      {quizData.quiz.quizzes.map((_, index) => (
                        <option key={index} value={index}>Quiz {index + 1}</option>
                      ))}
                    </select>
                  )}
                  <ContentSettings
                    settings={getContentSettings()}
                    onSettingsChange={handleContentSettingsChange}
                    section={selectedSection}
                  />
                </div>
              </div>
            )}

            <QuizControls 
              loadingAction={loadingAction} 
              fetchQuizData={fetchQuizData} 
              onGenerateBackgroundImage={() => handleGenerateBackgroundImage('intro')} 
              onGenerateQuiz={handleGenerateQuiz}
              isPolling={isPolling}
              progress={progress}
            />
          </div>

          <QuizPreview quizData={quizData} currentTime={currentTime} />
        </div>
      </main>
    </div>
  );
}

// function defaultContentSettings(): ContentSettings {
//   return {
//     fontSize: 16,
//     fontColor: '#FFFFFF',
//     fontWeight: 400,
//     fontFamily: 'Arial',
//     textAlign: 'center',
//     borderColor: '#000000',
//     borderWidth: 0,
//     shadowColor: '#000000',
//     shadowBlur: 0,
//   };
// }
