import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface TutorialMessageProps {
  activePage: 'startup' | 'design' | 'time';
}

const TutorialMessages: React.FC<TutorialMessageProps> = ({ activePage }) => {
  const { toast } = useToast();
  const [shownTutorials, setShownTutorials] = useState<string[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('rizulverse_tutorials');
    return saved ? JSON.parse(saved) : [];
  });

  // Tutorial messages by page
  const tutorials = {
    startup: {
      title: "Welcome to Startup Lab!",
      description: "Enter your startup idea and get AI-powered analysis, market fit score, tech stack suggestions, and competitor analysis."
    },
    design: {
      title: "Welcome to Design Roast!",
      description: "Upload your design mockup and receive detailed feedback, a roast score, and suggestions for improvement."
    },
    time: {
      title: "Welcome to Time Portal!",
      description: "Chat with your past, present, or future self. Select a persona and ask questions to gain unique perspectives."
    }
  };

  useEffect(() => {
    // Check if we've already shown this tutorial
    if (!shownTutorials.includes(activePage)) {
      // Show the tutorial for this page
      setTimeout(() => {
        toast({
          title: tutorials[activePage].title,
          description: tutorials[activePage].description,
          duration: 6000,
        });

        // Save that we've shown this tutorial
        const updatedTutorials = [...shownTutorials, activePage];
        setShownTutorials(updatedTutorials);
        localStorage.setItem('rizulverse_tutorials', JSON.stringify(updatedTutorials));
      }, 1000);
    }
  }, [activePage, shownTutorials, toast]);

  // This component doesn't render anything visible
  return null;
};

export default TutorialMessages;