// src/components/Navbar.tsx
import { FC } from 'react';
import UserProfile from './UserProfile';

interface NavbarProps {
  activeTab: 'startup' | 'design' | 'time';
  onTabChange: (tab: 'startup' | 'design' | 'time') => void;
}

const Navbar: FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="py-4 border-b border-neutral-800 sticky top-0 z-10 bg-dark-900/90 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        {/* Left side: brand name or title */}
        <div className="flex items-center space-x-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            Rizulverse
          </h1>
        </div>
        
        {/* Middle: tab buttons */}
        <div className="flex space-x-2">
          <button 
            onClick={() => onTabChange('startup')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-150 ${
              activeTab === 'startup' 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Startup Lab
          </button>
          <button 
            onClick={() => onTabChange('design')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-150 ${
              activeTab === 'design' 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Design Roast
          </button>
          <button 
            onClick={() => onTabChange('time')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-150 ${
              activeTab === 'time' 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Time Portal
          </button>
        </div>
        <div>
        </div>
        {/* Right side: user avatar/profile dropdown 
        <UserProfile />*/}
      </div>
    </nav>
  );
};

export default Navbar;
