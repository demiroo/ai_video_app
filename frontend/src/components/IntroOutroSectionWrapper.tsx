import React, { ChangeEvent } from 'react';
import IntroOutroSection from './IntroOutroSection';
import { IntroOutro } from '../types/quizTypes';

interface IntroOutroSectionWrapperProps {
  type: 'intro' | 'outro';
  data: IntroOutro;
  onTextChange: (value: string) => void;
  onAudioChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  audioRef: React.RefObject<HTMLInputElement>;
  imageRef: React.RefObject<HTMLInputElement>;
  onFocus: () => void;
  onGenerateAudio: () => void;
  onRegenerateAudio: () => void;
  onGenerateBackgroundImage: () => Promise<void>;
}

const IntroOutroSectionWrapper: React.FC<IntroOutroSectionWrapperProps> = (props) => {
  if (!props.data.text) {
    return null;
  }

  return (
    <IntroOutroSection
      type={props.type}
      data={props.data}
      onTextChange={props.onTextChange}
      onGenerateAudio={props.onGenerateAudio}
      onRegenerateAudio={props.onRegenerateAudio}
      onGenerateBackgroundImage={props.onGenerateBackgroundImage}
      onFocus={props.onFocus}
    />
  );
};




export default IntroOutroSectionWrapper;
