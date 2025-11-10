// src/context/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatMessageType {
  id: string;
  sender: 'user' | 'past' | 'present' | 'future';
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
  id: string;
  title: string;
  score: number;
  feedback: DesignRoastFeedbackItem[];
  suggestedFix: string;
  imagePreview: string;
}

export interface UploadedImageType {
  file: File;
  preview: string;
}

// Full context shape
export interface AppContextType {
  // Chat
  chatMessages: ChatMessageType[];
  addChatMessage: (msg: ChatMessageType) => void;

  // Startup
  startupAnalysis: StartupAnalysisType | null;
  setStartupAnalysis: (analysis: StartupAnalysisType | null) => void;

  // Design Roast
  designRoast: DesignRoastType | null;
  setDesignRoast: (roast: DesignRoastType | null) => void;
  roastHistory: DesignRoastType[];
  addToRoastHistory: (roast: DesignRoastType) => void;

  // Image upload
  uploadedImage: UploadedImageType | null;
  setUploadedImage: (img: UploadedImageType | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const addChatMessage = (msg: ChatMessageType) => setChatMessages((prev) => [...prev, msg]);

  // Startup state
  const [startupAnalysis, setStartupAnalysis] = useState<StartupAnalysisType | null>(null);

  // Design Roast state
  const [designRoast, setDesignRoast] = useState<DesignRoastType | null>(null);
  const [roastHistory, setRoastHistory] = useState<DesignRoastType[]>([]);
  const addToRoastHistory = (roast: DesignRoastType) =>
    setRoastHistory((prev) => [roast, ...prev]);

  // Upload state
  const [uploadedImage, setUploadedImage] = useState<UploadedImageType | null>(null);

  return (
    <AppContext.Provider
      value={{
        chatMessages,
        addChatMessage,
        startupAnalysis,
        setStartupAnalysis,
        designRoast,
        setDesignRoast,
        roastHistory,
        addToRoastHistory,
        uploadedImage,
        setUploadedImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
