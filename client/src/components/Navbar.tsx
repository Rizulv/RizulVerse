import { FC } from 'react';

interface NavbarProps {
  activeTab: 'startup' | 'design' | 'time';
  onTabChange: (tab: 'startup' | 'design' | 'time') => void;
}

const Navbar: FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="py-4 border-b border-neutral-800 sticky top-0 z-10 bg-dark-900/90 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            Rizulverse
          </h1>
        </div>
        
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
        
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
