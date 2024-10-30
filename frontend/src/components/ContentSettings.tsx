import React from 'react';
import type { ContentSettings } from '../types/quizTypes';

interface ContentSettingsProps {
  settings: ContentSettings;
  onSettingsChange: (newSettings: ContentSettings) => void;
  section: 'topic' | 'intro' | 'outro' | 'question' | 'options' | 'answer';
}

const ContentSettings: React.FC<ContentSettingsProps> = ({ settings, onSettingsChange, section }) => {
  const handleChange = (key: keyof ContentSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold capitalize">{section} Settings</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Font Size</label>
          <input
            type="number"
            value={settings.fontSize}
            onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Font Color</label>
          <input
            type="color"
            value={settings.fontColor}
            onChange={(e) => handleChange('fontColor', e.target.value)}
            className="w-full h-10 bg-gray-700 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Font Weight</label>
          <select
            value={settings.fontWeight}
            onChange={(e) => handleChange('fontWeight', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 rounded-md"
          >
            <option value={400}>Normal</option>
            <option value={800}>Bold</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Font Family</label>
          <select
            value={settings.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-md"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier">Courier</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Text Align</label>
          <select
            value={settings.textAlign}
            onChange={(e) => handleChange('textAlign', e.target.value as "center" | "left")}
            className="w-full px-3 py-2 bg-gray-700 rounded-md"
          >
            <option value="center">Center</option>
            <option value="left">Left</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Border Color</label>
          <input
            type="color"
            value={settings.borderColor || '#000000'}
            onChange={(e) => handleChange('borderColor', e.target.value)}
            className="w-full h-10 bg-gray-700 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Border Width</label>
          <input
            type="number"
            value={settings.borderWidth || 0}
            onChange={(e) => handleChange('borderWidth', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Shadow Color</label>
          <input
            type="color"
            value={settings.shadowColor || '#000000'}
            onChange={(e) => handleChange('shadowColor', e.target.value)}
            className="w-full h-10 bg-gray-700 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Shadow Blur</label>
          <input
            type="number"
            value={settings.shadowBlur || 0}
            onChange={(e) => handleChange('shadowBlur', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentSettings;