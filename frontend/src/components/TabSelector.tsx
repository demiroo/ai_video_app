import React from 'react';

type Tab = 'contents' | 'settings';

interface TabSelectorProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex mb-6 bg-gray-700 p-1 rounded-full">
      <button
        className={`px-6 py-2 rounded-full transition-all duration-200 ease-in-out ${
          activeTab === 'contents'
            ? 'bg-gray-800 text-white'
            : 'bg-transparent text-gray-300 hover:bg-gray-600'
        }`}
        onClick={() => setActiveTab('contents')}
      >
        Contents
      </button>
      <button
        className={`px-6 py-2 rounded-full ml-2 transition-all duration-200 ease-in-out ${
          activeTab === 'settings'
            ? 'bg-gray-800 text-white'
            : 'bg-transparent text-gray-300 hover:bg-gray-600'
        }`}
        onClick={() => setActiveTab('settings')}
      >
        Settings
      </button>
    </div>
  );
};

export default TabSelector;