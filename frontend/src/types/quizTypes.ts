export interface ContentSettings {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontColor: string;
  textAlign: "center" | "left";
  borderColor: string;
  borderWidth: number;
  shadowColor: string;
  shadowBlur: number;
}

export interface IntroOutro {
  text: string;
  audioUrl: string;
  backgroundImage: string;
  duration: number;
  contentSettings: ContentSettings;
}

export interface QuizItem {
  question: {
    text: string;
    questionAudioUrl: string;
    contentSettings: ContentSettings;
  };
  options: {
    optionData: string[];
    optionsAudioUrl: string;
    contentSettings: ContentSettings;
  };
  answer: {
    text: string;
    answerAudioUrl: string;
    contentSettings: ContentSettings;
  };
  backgroundImage: string;
  questionDuration: number;
  optionsDuration: number;
  answerDuration: number;
  questionAudioTime: number;
  optionsAudioTime: number;
  answerAudioTime: number;
  totalDuration: number;
}

export interface TopicSection {
  text: string;
  contentSettings: ContentSettings;
  numberOfQuestions?: number; // Add this
}

export interface IntroOutroSection {
  text: string;
  audioUrl: string;
  backgroundImage: string;
  duration: number;
  contentSettings: ContentSettings;
}

export interface QuizData {
  quiz: {
    topic: TopicSection;
    intro: IntroOutroSection;
    outro: IntroOutroSection;
    quizzes: QuizItem[];
    totalDuration: number;
  };
}
