import { useState } from 'react';

const AIAssistant = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div className="fixed bottom-6 right-6 z-20">
      <button 
        className="w-14 h-14 rounded-full bg-primary-600 shadow-lg flex items-center justify-center hover:bg-primary-500 transition duration-150 group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        
        <div className={`absolute right-16 bottom-0 w-64 p-4 rounded-lg shadow-xl bg-neutral-800 border border-neutral-700 transition-opacity duration-150 ${
          isHovering ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex-shrink-0 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-white">Need help with Rizulverse?</p>
              <p className="text-xs text-gray-400 mt-1">Try "Analyze my startup idea" or "Upload a design to roast"</p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default AIAssistant;
