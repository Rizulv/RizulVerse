import { useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import { useAppContext } from '../context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

// Quick prompt suggestions by section
const quickPrompts = {
  startup: [
    { text: 'Help me ideate a fintech startup', action: 'Copy to startup idea field' },
    { text: 'What makes a good MVP?', action: 'Get insight' },
    { text: 'Compare AI vs Web3 startups', action: 'Get comparison' }
  ],
  design: [
    { text: 'What makes a great color scheme?', action: 'Get tips' },
    { text: 'How to improve my UI spacing?', action: 'Get advice' },
    { text: 'Show me design principles', action: 'View principles' }
  ],
  time: [
    { text: 'What should I ask my future self?', action: 'Get suggestions' },
    { text: 'How to make better life decisions?', action: 'Get advice' },
    { text: 'Top regrets to avoid', action: 'View insights' }
  ],
  general: [
    { text: 'How does Rizulverse work?', action: 'Learn more' },
    { text: 'Give me an interesting fact', action: 'Get fact' },
    { text: 'Tell me a developer joke', action: 'Hear joke' }
  ]
};

// Fun facts and tips to display randomly
const funTips = [
  "Try clicking the future persona for long-term advice!",
  "Upload a design mockup to get detailed UX critique",
  "Gemini AI powers all the analysis in Rizulverse",
  "You can use this for both personal and work projects",
  "The bulb icon pulses when it has a suggestion for you"
];

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(3); // Default to general
  const { toast } = useToast();
  
  // Cycle through pulsing animation every 10 seconds when idle
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 3000);
    }, 10000);
    
    // Cycle through tips every 5 seconds when dialog is open
    const tipInterval = setInterval(() => {
      if (isOpen) {
        setTipIndex(prev => (prev + 1) % funTips.length);
      }
    }, 5000);
    
    return () => {
      clearInterval(pulseInterval);
      clearInterval(tipInterval);
    };
  }, [isOpen]);
  
  const handlePromptClick = (prompt: string) => {
    toast({
      title: "Assistant Prompt",
      description: `"${prompt}" - This would trigger an appropriate action in a full implementation!`,
      duration: 5000,
    });
    setIsOpen(false);
  };
  
  const categories = ['startup', 'design', 'time', 'general'];
  
  return (
    <>
      <div className="fixed bottom-6 right-6 z-20">
        <button 
          className={`w-14 h-14 rounded-full bg-primary-600 shadow-lg flex items-center justify-center 
            hover:bg-primary-500 transition-all duration-300 group ${isPulsing ? 'animate-pulse-light' : ''}`}
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          
          {/* Tooltip on hover */}
          <div className={`absolute right-16 bottom-0 w-64 p-4 rounded-lg shadow-xl bg-neutral-800 border border-neutral-700 transition-opacity duration-150 ${
            isHovering && !isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex-shrink-0 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-white">Rizul Assistant</p>
                <p className="text-xs text-gray-400 mt-1">Click for AI help, tips & suggestions</p>
              </div>
            </div>
          </div>
        </button>
      </div>
      
      {/* Assistant Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-700 text-white max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <span className="mr-2">✨</span> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-indigo-100">
                Rizul Assistant
              </span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Your AI companion for all things Rizulverse
            </DialogDescription>
          </DialogHeader>
          
          {/* Category Tabs */}
          <div className="flex space-x-1 mb-4 overflow-x-auto pb-2">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                  ${activeCategoryIndex === index 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                  }`}
                onClick={() => setActiveCategoryIndex(index)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Prompt Suggestions */}
          <div className="space-y-3">
            {quickPrompts[categories[activeCategoryIndex] as keyof typeof quickPrompts].map((prompt, index) => (
              <div
                key={index}
                className="bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-md p-3 cursor-pointer transition-colors"
                onClick={() => handlePromptClick(prompt.text)}
              >
                <div className="flex justify-between items-center">
                  <p className="text-gray-200">{prompt.text}</p>
                  <span className="text-xs bg-primary-900 text-primary-200 px-2 py-1 rounded-full">
                    {prompt.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Fun Fact/Tip Bar */}
          <div className="mt-4 bg-indigo-900/30 border border-indigo-700/50 rounded-md p-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-indigo-200">Tip:</p>
                <p className="text-xs text-indigo-300 mt-1 transition-all duration-300 ease-in-out">
                  {funTips[tipIndex]}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <DialogClose asChild>
              <button className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors text-sm">
                Close
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* CSS is in index.css */}
    </>
  );
};

export default AIAssistant;
