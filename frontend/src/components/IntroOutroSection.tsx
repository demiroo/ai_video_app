import React, { useState, useCallback, useRef, useEffect } from 'react';
import AudioControl from './AudioControl';
import BackgroundImageControl from './BackgroundImageControl';

interface IntroOutroData {
  text: string;
  audioUrl: string;
  backgroundImage: string;
}

interface IntroOutroSectionProps {
  type: 'intro' | 'outro';
  data: IntroOutroData;
  onTextChange: (value: string) => void;
  onGenerateAudio: (audioUrl: string) => void;
  onRegenerateAudio: () => void;
  onGenerateBackgroundImage: () => Promise<void>;
  onFocus: () => void;
}

function useDebounce(callback: Function, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

const IntroOutroSection: React.FC<IntroOutroSectionProps> = React.memo(({
  type,
  data,
  onTextChange,
  onGenerateAudio,
  onRegenerateAudio,
  onGenerateBackgroundImage,
  onFocus,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const debouncedOnTextChange = useDebounce((value: string) => {
    onTextChange(value);
  }, 300);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = data.text;
    }
  }, [data.text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    debouncedOnTextChange(newValue);
  };

  const handleFocus = useCallback(() => {
    onFocus();
    // Don't call setCurrentSection here
  }, [onFocus]);

  const handleGenerateImage = async () => {
    setIsLoading(true);
    try {
      await onGenerateBackgroundImage();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAudio = async () => {
    setIsAudioLoading(true);
    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textareaRef.current?.value }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const responseData = await response.json();
      const audioUrl = responseData.audioUrl;

      onGenerateAudio(audioUrl);
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsAudioLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-4">
      <h3 className="text-white text-xl font-bold mb-4 capitalize">{type}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <textarea
            ref={textareaRef}
            defaultValue={data.text}
            onChange={handleTextChange}
            onFocus={handleFocus}
            className="w-full bg-gray-700 text-white p-2 rounded-lg mb-2"
            rows={3}
            placeholder={`Enter ${type} text`}
          />
          <AudioControl
            src={data.audioUrl}
            label={type}
            onGenerate={handleGenerateAudio}
            onRegenerate={onRegenerateAudio}
            isLoading={isAudioLoading}
          />
        </div>
        <div>
          <BackgroundImageControl
            imageUrl={data.backgroundImage}
            onGenerate={handleGenerateImage}
            label={type}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
});

export default IntroOutroSection;
