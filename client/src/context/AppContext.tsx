import { createContext, useContext, useState, ReactNode } from 'react';
import { initialChatMessages } from '../lib/mockData';

export type ChatMessageSender = 'user' | 'past' | 'present' | 'future';

export interface ChatMessageType {
  id: string;
  sender: ChatMessageSender;
  text: string;
  timestamp: Date;
}

export interface StartupAnalysisType {
  analysis: string;
  marketFit: number;
  techStack: string[];
  competitors: string[];
  emoji: string;
}

export interface DesignRoastFeedbackItem {
  type: 'positive' | 'negative' | 'warning';
  text: string;
}

export interface DesignRoastType {
  title: string;
  score: number;
  feedback: DesignRoastFeedbackItem[];
  suggestedFix: string;
}

export interface UploadedImageType {
  file: File;
  preview: string;
}

interface AppContextType {
  // Chat messages
  chatMessages: ChatMessageType[];
  addChatMessage: (message: ChatMessageType) => void;
  
  // Startup analysis
  startupAnalysis: StartupAnalysisType | null;
  setStartupAnalysis: (analysis: StartupAnalysisType | null) => void;
  
  // Design roast
  designRoast: DesignRoastType | null;
  setDesignRoast: (roast: DesignRoastType | null) => void;
  
  // Uploaded image
  uploadedImage: UploadedImageType | null;
  setUploadedImage: (image: UploadedImageType | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>(initialChatMessages);
  const [startupAnalysis, setStartupAnalysis] = useState<StartupAnalysisType | null>(null);
  const [designRoast, setDesignRoast] = useState<DesignRoastType | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImageType | null>(null);
  
  const addChatMessage = (message: ChatMessageType) => {
    setChatMessages(prev => [...prev, message]);
  };
  
  return (
    <AppContext.Provider value={{
      chatMessages,
      addChatMessage,
      startupAnalysis,
      setStartupAnalysis,
      designRoast,
      setDesignRoast,
      uploadedImage,
      setUploadedImage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
