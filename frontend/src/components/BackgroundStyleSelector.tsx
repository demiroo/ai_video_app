import React from 'react';

interface BackgroundStyleSelectorProps {
  backgroundStyle: string;
  setBackgroundStyle: (style: string) => void;
}

const BackgroundStyleSelector: React.FC<BackgroundStyleSelectorProps> = ({ backgroundStyle, setBackgroundStyle }) => (
  <div>
    <label className="block text-gray-400 mb-2">Background Style:</label>
    <select
      value={backgroundStyle}
      onChange={(e) => setBackgroundStyle(e.target.value)}
      className="w-full bg-gray-700 text-white p-3 rounded-lg"
    >
      <option value="satisfying_videos">Satisfying videos</option>
      <option value="nature">Nature</option>
      <option value="abstract">Abstract</option>
    </select>
  </div>
);

export default BackgroundStyleSelector;