import { useState } from 'react';

export default function HookSelector() {
  const [useHook, setUseHook] = useState(false);
  const [selectedHook, setSelectedHook] = useState('');

  return (
    <div>
      {/* Hook Toggle */}
      <div className="flex items-center mb-4">
        <h4 className="text-white mr-4">Use Hook:</h4>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={useHook}
            onChange={() => setUseHook(!useHook)}
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-300 after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-white"></div>
        </label>
      </div>

      {/* Hook Video Selector */}
      {useHook && (
        <div className="form-group" id="hook-container">
          <div className="flex space-x-4 overflow-x-auto">
            {/* First Video Option */}
            <div className="flex-none w-28">
              <label className="cursor-pointer block">
                <input
                  type="radio"
                  name="hook-video"
                  value="https://storage.googleapis.com/vidplus/media/hooks/fail_hook_1.mp4"
                  className="hidden"
                  onChange={(e) => setSelectedHook(e.target.value)}
                />
                <video
                  src="https://storage.googleapis.com/vidplus/media/hooks/fail_hook_1.mp4"
                  playsInline
                  muted
                  className="rounded-lg border-2 border-transparent hover:border-purple-500"
                  loading="lazy"
                />
              </label>
            </div>

            {/* Second Video Option */}
            <div className="flex-none w-28">
              <label className="cursor-pointer block">
                <input
                  type="radio"
                  name="hook-video"
                  value="https://storage.googleapis.com/vidplus/media/hooks/sports_hook_1.mp4"
                  className="hidden"
                  onChange={(e) => setSelectedHook(e.target.value)}
                />
                <video
                  src="https://storage.googleapis.com/vidplus/media/hooks/sports_hook_1.mp4"
                  playsInline
                  muted
                  className="rounded-lg border-2 border-transparent hover:border-purple-500"
                  loading="lazy"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Selected Hook */}
      {selectedHook && (
        <div className="mt-4 text-white">
          <strong>Selected Hook:</strong> {selectedHook}
        </div>
      )}
    </div>
  );
}
