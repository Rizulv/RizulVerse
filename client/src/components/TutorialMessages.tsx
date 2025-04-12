import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TutorialMessageProps {
  activePage: 'startup' | 'design' | 'time';
}

const TutorialMessages: React.FC<TutorialMessageProps> = ({ activePage }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);
  
  // Reset visibility when changing pages, unless it's been dismissed
  useEffect(() => {
    if (!hasBeenDismissed) {
      setIsVisible(true);
    }
  }, [activePage, hasBeenDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasBeenDismissed(true);
  };

  if (!isVisible) return null;

  let tutorialContent;
  
  switch (activePage) {
    case 'startup':
      tutorialContent = (
        <>
          <h3 className="font-semibold text-lg mb-2">Startup Lab Tutorial</h3>
          <p className="text-sm text-gray-300 mb-2">
            Enter your startup idea in the text field and get an AI-powered analysis including:
          </p>
          <ul className="text-sm text-gray-300 list-disc list-inside mb-3">
            <li>Market fit assessment</li>
            <li>Recommended tech stack</li>
            <li>Potential competitors</li>
            <li>Overall viability score</li>
          </ul>
        </>
      );
      break;
    case 'design':
      tutorialContent = (
        <>
          <h3 className="font-semibold text-lg mb-2">Design Roast Tutorial</h3>
          <p className="text-sm text-gray-300 mb-2">
            Upload a screenshot of your design to receive critical feedback:
          </p>
          <ul className="text-sm text-gray-300 list-disc list-inside mb-3">
            <li>UI/UX evaluation</li>
            <li>Areas of improvement</li>
            <li>Specific suggestions</li>
            <li>Design score</li>
          </ul>
        </>
      );
      break;
    case 'time':
      tutorialContent = (
        <>
          <h3 className="font-semibold text-lg mb-2">Time Portal Tutorial</h3>
          <p className="text-sm text-gray-300 mb-2">
            Set up your time portal to chat with your past and future selves:
          </p>
          <ul className="text-sm text-gray-300 list-disc list-inside mb-3">
            <li>Select your past and future years</li>
            <li>Ask questions to different time personas</li>
            <li>Get perspectives based on different time periods</li>
            <li>Save your conversations when signed in</li>
          </ul>
        </>
      );
      break;
  }

  return (
    <div className="fixed bottom-4 right-4 z-10 max-w-xs w-full">
      <Card className="bg-indigo-900 border-indigo-700 text-white shadow-xl">
        <CardContent className="pt-4 pb-3 px-4 relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDismiss}
            className="absolute top-1 right-1 text-gray-400 hover:text-white hover:bg-indigo-800"
          >
            <X size={16} />
          </Button>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-lg">💡</span>
            </div>
            <div>
              {tutorialContent}
              <div className="text-xs text-indigo-300">
                Sign in to save your data across sessions.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialMessages;