import React, { ChangeEvent } from 'react';

interface AudioPlayerProps {
  src: string;
  label: string;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, label, onUpload, inputRef }) => (
  <div className="flex items-center space-x-2 mb-2">
    <input
      type="file"
      accept="audio/*"
      onChange={onUpload}
      className="hidden"
      ref={inputRef}
    />
    <button
      onClick={() => inputRef.current?.click()}
      className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
    >
      Upload {label} Audio
    </button>
    {src && (
      <audio controls src={src} className="w-full" />
    )}
  </div>
);

export default AudioPlayer;