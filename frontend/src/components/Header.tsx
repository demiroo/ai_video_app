import React from 'react';

const Header: React.FC = () => (
  <header className="bg-gray-800 p-4 flex justify-between items-center">
    <div className="flex items-center gap-4">
      <div className="w-24 h-6 bg-gray-700 text-center text-xs text-gray-300">90 x 18</div>
      <nav>
        <ul className="flex gap-6">
          <li className="text-gray-300">Home</li>
          <li className="text-gray-300">Media</li>
        </ul>
      </nav>
    </div>
    <div className="flex items-center gap-4">
      <div className="bg-green-600 text-white rounded-full px-4 py-1">Credit: 769 mins</div>
      <div className="w-8 h-8 rounded-full bg-gray-600"></div>
    </div>
  </header>
);

export default Header;