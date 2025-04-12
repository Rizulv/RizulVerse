import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Startup Analysis model
export const startupAnalyses = pgTable("startup_analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  idea: text("idea").notNull(),
  analysis: text("analysis").notNull(),
  marketFit: integer("market_fit").notNull(),
  techStack: json("tech_stack").$type<string[]>().notNull(),
  competitors: json("competitors").$type<string[]>().notNull(),
  emoji: text("emoji").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Design Roast model
export const designRoasts = pgTable("design_roasts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  imageUrl: text("image_url").notNull(),
  title: text("title").notNull(),
  score: integer("score").notNull(),
  feedback: json("feedback").$type<Array<{type: string, text: string}>>().notNull(),
  suggestedFix: text("suggested_fix").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chat Messages model
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sender: text("sender").notNull(), // 'user', 'past', 'present', 'future'
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Schemas for validating input
export const insertUserSchema = createInsertSchema(users);
export const insertStartupAnalysisSchema = createInsertSchema(startupAnalyses);
export const insertDesignRoastSchema = createInsertSchema(designRoasts);
export const insertChatMessageSchema = createInsertSchema(chatMessages);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type StartupAnalysis = typeof startupAnalyses.$inferSelect;
export type InsertStartupAnalysis = z.infer<typeof insertStartupAnalysisSchema>;

export type DesignRoast = typeof designRoasts.$inferSelect;
export type InsertDesignRoast = z.infer<typeof insertDesignRoastSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
