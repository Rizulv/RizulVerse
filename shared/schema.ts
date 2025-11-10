// shared/schema.ts

export interface User {
  uid: string; // Firebase UID
  username: string;
  createdAt: Date;
}

export interface StartupAnalysis {
  id?: string;
  userId: string;
  idea: string;
  analysis: string;
  marketFit: number;
  techStack: string[];
  competitors: string[];
  emoji: string;
  createdAt: Date;
}

export interface DesignRoast {
  id?: string;
  userId: string;
  imageUrl: string;
  title: string;
  score: number;
  feedback: Array<{ type: string; text: string }>;
  suggestedFix: string;
  createdAt: Date;
}

export interface ChatMessage {
  id?: string;
  userId: string;
  sender: 'user' | 'past' | 'present' | 'future';
  message: string;
  timestamp: Date;
}
