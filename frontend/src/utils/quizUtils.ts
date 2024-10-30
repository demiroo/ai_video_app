import { QuizData, ContentSettings } from '../types/quizTypes';

export const calculateAudioDuration = (audioUrl: string): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
    });
  });
};

const defaultContentSettings: ContentSettings = {
  fontFamily: "Mulish",
  fontSize: 80,
  fontWeight: 800,
  fontColor: "yellow",
  textAlign: "center",
};

export const formatSampleData = async (data: any): Promise<QuizData> => {
  const formattedData = {
    quiz: {
      topic: {
        text: data.topic.text || '',
        contentSettings: { ...defaultContentSettings, ...data.topic.contentSettings },
      },
      intro: {
        text: data.intro.text || '',
        audioUrl: data.intro.audioUrl || '',
        backgroundImage: data.intro.backgroundImage || '',
        duration: 0,
        contentSettings: { ...defaultContentSettings, ...data.intro.contentSettings },
      },
      outro: {
        text: data.outro.text || '',
        audioUrl: data.outro.audioUrl || '',
        backgroundImage: data.outro.backgroundImage || '',
        duration: 0,
        contentSettings: { ...defaultContentSettings, ...data.outro.contentSettings },
      },
      quizzes: await Promise.all(data.quizzes.map(async (quiz: any) => ({
        ...quiz,
        backgroundImage: quiz.backgroundImage || '',
        questionDuration: await calculateAudioDuration(quiz.question.questionAudioUrl),
        optionsDuration: await calculateAudioDuration(quiz.options.optionsAudioUrl),
        answerDuration: await calculateAudioDuration(quiz.answer.answerAudioUrl),
        totalDuration: 0,
        questionAudioTime: 0,
        optionsAudioTime: 0,
        answerAudioTime: 0,
        question: {
          ...quiz.question,
          contentSettings: { ...defaultContentSettings, ...quiz.question.contentSettings },
        },
        options: {
          ...quiz.options,
          contentSettings: { ...defaultContentSettings, ...quiz.options.contentSettings },
        },
        answer: {
          ...quiz.answer,
          contentSettings: { ...defaultContentSettings, ...quiz.answer.contentSettings },
        },
      }))),
      totalDuration: 0,
    }
  };

  formattedData.quiz.intro.duration = await calculateAudioDuration(formattedData.quiz.intro.audioUrl);
  formattedData.quiz.outro.duration = await calculateAudioDuration(formattedData.quiz.outro.audioUrl);

  let totalDuration = formattedData.quiz.intro.duration + formattedData.quiz.outro.duration;
  formattedData.quiz.quizzes = formattedData.quiz.quizzes.map(quiz => {
    quiz.totalDuration = quiz.questionDuration + quiz.optionsDuration + 5 + quiz.answerDuration;
    totalDuration += quiz.totalDuration;
    return quiz;
  });

  formattedData.quiz.totalDuration = totalDuration;

  return formattedData;
};

export const calculateCurrentTime = (
  quizData: QuizData,
  currentSection: { type: 'intro' | 'outro' | 'quiz', index?: number, subSection?: 'question' | 'options' | 'answer' }
) => {
  let time = 0;

  if (quizData.quiz.intro.audioUrl) {
    // time += quizData.quiz.intro.duration;
    console.log('currentSection.type', currentSection.type);
    if (currentSection.type === 'intro') {
      time +=1;
      return time;
    }
  }

 time += quizData.quiz.intro.duration;

  for (let i = 0; i < quizData.quiz.quizzes.length; i++) {
    const quiz = quizData.quiz.quizzes[i];

    if (currentSection.type === 'quiz' && currentSection.index !== undefined) {
      if (currentSection.index === i) {
        if (currentSection.subSection === 'question') {
          time += quiz.questionDuration;
          return time;
        }

        if (currentSection.subSection === 'options') {
          time += quiz.questionDuration + quiz.optionsDuration;
          return time;
        }

        if (currentSection.subSection === 'answer') {
          time += quiz.totalDuration;
          return time;
        }
      } else if (currentSection.index < i) {
        break;
      }
    }
    
    time += quiz.totalDuration;
  }

  if (currentSection.type === 'outro') {
    time += quizData.quiz.outro.duration;
  }

  return time;
};