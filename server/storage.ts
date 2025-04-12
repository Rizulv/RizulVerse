import { 
  users, type User, type InsertUser,
  startupAnalyses, type StartupAnalysis, type InsertStartupAnalysis,
  designRoasts, type DesignRoast, type InsertDesignRoast,
  chatMessages, type ChatMessage, type InsertChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Startup Analysis operations
  getStartupAnalysis(id: number): Promise<StartupAnalysis | undefined>;
  createStartupAnalysis(analysis: InsertStartupAnalysis): Promise<StartupAnalysis>;
  
  // Design Roast operations
  getDesignRoast(id: number): Promise<DesignRoast | undefined>;
  createDesignRoast(roast: InsertDesignRoast): Promise<DesignRoast>;
  
  // Chat Message operations
  getChatMessages(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  // Startup Analysis operations
  async getStartupAnalysis(id: number): Promise<StartupAnalysis | undefined> {
    const result = await db.select().from(startupAnalyses).where(eq(startupAnalyses.id, id));
    return result[0];
  }
  
  async createStartupAnalysis(analysis: InsertStartupAnalysis): Promise<StartupAnalysis> {
    const result = await db.insert(startupAnalyses).values(analysis).returning();
    return result[0];
  }
  
  // Design Roast operations
  async getDesignRoast(id: number): Promise<DesignRoast | undefined> {
    const result = await db.select().from(designRoasts).where(eq(designRoasts.id, id));
    return result[0];
  }
  
  async createDesignRoast(roast: InsertDesignRoast): Promise<DesignRoast> {
    const result = await db.insert(designRoasts).values(roast).returning();
    return result[0];
  }
  
  // Chat Message operations
  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return db.select().from(chatMessages).where(eq(chatMessages.userId, userId));
  }
  
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const result = await db.insert(chatMessages).values(message).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
