// server/storage.ts
import { db } from './firebase-admin';
import {
  User,
  StartupAnalysis,
  DesignRoast,
  ChatMessage,
} from '@shared/schema';

export const storage = {
  // -------------------------
  // USERS
  // -------------------------
  async getUser(uid: string): Promise<User | undefined> {
    const doc = await db.collection('users').doc(uid).get();
    return doc.exists ? (doc.data() as User) : undefined;
  },

  async createUser(user: User): Promise<void> {
    await db.collection('users').doc(user.uid).set({
      ...user,
      createdAt: new Date(),
    });
  },

  // -------------------------
  // STARTUP ANALYSIS
  // -------------------------
  async getStartupAnalysis(id: string): Promise<StartupAnalysis | undefined> {
    const doc = await db.collection('startupAnalyses').doc(id).get();
    return doc.exists ? (doc.data() as StartupAnalysis) : undefined;
  },

  async createStartupAnalysis(analysis: Omit<StartupAnalysis, 'id'>): Promise<string> {
    const docRef = await db.collection('startupAnalyses').add({
      ...analysis,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  // -------------------------
  // DESIGN ROAST
  // -------------------------
  async getDesignRoast(id: string): Promise<DesignRoast | undefined> {
    const doc = await db.collection('designRoasts').doc(id).get();
    return doc.exists ? (doc.data() as DesignRoast) : undefined;
  },

  async createDesignRoast(roast: Omit<DesignRoast, 'id'>): Promise<string> {
    const docRef = await db.collection('designRoasts').add({
      ...roast,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  // -------------------------
  // CHAT MESSAGES
  // -------------------------
  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    const snapshot = await db
      .collection('chatMessages')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'asc')
      .get();

    return snapshot.docs.map((doc) => doc.data() as ChatMessage);
  },

  async createChatMessage(message: Omit<ChatMessage, 'id'>): Promise<string> {
    const docRef = await db.collection('chatMessages').add({
      ...message,
      timestamp: new Date(),
    });
    return docRef.id;
  },
};
