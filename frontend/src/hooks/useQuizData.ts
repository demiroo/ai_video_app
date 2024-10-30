import { useState, useEffect, useCallback } from 'react';
import { QuizData, ContentSettings, QuizItem } from '../types/quizTypes';
import { calculateAudioDuration, formatSampleData } from '../utils/quizUtils';
import sampleData from '../quiz.json';

export const defaultContentSettings: ContentSettings = {
  fontFamily: "Mulish",
  fontSize: 80,
  fontWeight: 800,
  fontColor: "yellow",
  textAlign: "center",
  borderColor: "#000000",
  borderWidth: 0,
  shadowColor: "#000000",
  shadowBlur: 0,
};

type JobStatus = {
  state: 'completed' | 'failed' | 'active' | 'waiting';
  progress: number;
  result?: {
    quiz: any;
  };
};

export const useQuizData = () => {
  const [quizData, setQuizData] = useState<QuizData>({
    quiz: {
      topic: {
        text: '',
        contentSettings: { ...defaultContentSettings },
      },
      intro: { 
        text: '', 
        audioUrl: '', 
        backgroundImage: '', 
        duration: 0,
        contentSettings: { ...defaultContentSettings },
      },
      outro: { 
        text: '', 
        audioUrl: '', 
        backgroundImage: '', 
        duration: 0,
        contentSettings: { ...defaultContentSettings },
      },
      quizzes: [],
      totalDuration: 0,
    },
  });

  const [backgroundStyle, setBackgroundStyle] = useState('satisfying_videos');
  const [hookVideo, setHookVideo] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [useSampleData, setUseSampleData] = useState(false);
  const [statusUrl, setStatusUrl] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const handleQuizChange = (updatedQuizzes: QuizItem[]) => {
    const quizzesWithDuration = updatedQuizzes.map((quiz) => ({
      ...quiz,
      question: {
        ...quiz.question,
        contentSettings: quiz.question.contentSettings || { ...defaultContentSettings },
      },
      options: {
        ...quiz.options,
        contentSettings: quiz.options.contentSettings || { ...defaultContentSettings },
      },
      answer: {
        ...quiz.answer,
        contentSettings: quiz.answer.contentSettings || { ...defaultContentSettings },
      },
      questionAudioTime: quiz.questionDuration,
      optionsAudioTime: quiz.optionsDuration,
      answerAudioTime: quiz.answerDuration,
    }));

    const totalDuration =
      quizData.quiz.intro.duration +
      quizData.quiz.outro.duration +
      quizzesWithDuration.reduce((sum, quiz) => sum + quiz.totalDuration, 0);

    setQuizData((prevData) => ({
      quiz: {
        ...prevData.quiz,
        quizzes: quizzesWithDuration,
        totalDuration,
      },
    }));
  };

  const handleIntroOutroChange = async (type: 'intro' | 'outro', field: string, value: string) => {
    let duration = quizData.quiz[type].duration;
    if (field === 'audioUrl') {
      duration = value ? await calculateAudioDuration(value) : 0;
    }

    const updatedSection = { ...quizData.quiz[type], [field]: value, duration };
    const totalDuration =
      quizData.quiz.intro.duration +
      quizData.quiz.outro.duration +
      quizData.quiz.quizzes.reduce((sum, quiz) => sum + quiz.totalDuration, 0);

    setQuizData((prevData) => ({
      quiz: {
        ...prevData.quiz,
        [type]: updatedSection,
        totalDuration,
      },
    }));
  };

  const pollJobStatus = useCallback(async (statusUrl: string) => {
    try {
      const response = await fetch(statusUrl);
      if (!response.ok) throw new Error('Failed to fetch job status');
      
      const status: JobStatus = await response.json();
      console.log('Job status:', status); // Add this log
      setProgress(status.progress);
      
      if (status.state === 'completed' && status.result) {
        const formattedData = await formatSampleData(status.result.quiz);
        setQuizData(formattedData);
        setIsPolling(false);
        setLoadingAction(null);
        setStatusUrl(null);
        setProgress(0); // Reset progress
      } else if (status.state === 'failed') {
        console.error('Quiz generation failed');
        setIsPolling(false);
        setLoadingAction(null);
        setStatusUrl(null);
        setProgress(0); // Reset progress
      }
    } catch (error) {
      console.error('Error polling job status:', error);
      setIsPolling(false);
      setLoadingAction(null);
      setStatusUrl(null);
      setProgress(0); // Reset progress
    }
  }, []);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (statusUrl && isPolling) {
      pollInterval = setInterval(() => {
        pollJobStatus(statusUrl); // Now this makes more sense
      }, 2000);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [statusUrl, isPolling, pollJobStatus]);

  const fetchQuizData = async (actionType: string) => {
    setLoadingAction(actionType);
    setProgress(0);

    try {
      if (useSampleData) {
        const formattedSampleData = await formatSampleData(sampleData.quiz);
        const requestData = {
          ...formattedSampleData.quiz,
          hook_video: hookVideo,
          bg_style: backgroundStyle,
          action: actionType,
        };
        setLoadingAction(null);
        setQuizData(formattedSampleData);
      } else {
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...quizData.quiz,
            hook_video: hookVideo,
            bg_style: backgroundStyle,
            action: actionType,
            numberOfQuestions: quizData.quiz.topic.numberOfQuestions || 1, // Add this
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quiz data');
        }

        const data = await response.json();
        if (data.url) {
          setStatusUrl(data.url);
          setIsPolling(true);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setLoadingAction(null);
    }
  };

  return {
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
    progress, // Add this
  };
};
