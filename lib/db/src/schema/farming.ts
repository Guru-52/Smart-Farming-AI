import { pgTable, text, serial, timestamp, real, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// Crop prediction history table
export const predictionHistoryTable = pgTable("prediction_history", {
  id: serial("id").primaryKey(),
  crop: text("crop").notNull(),
  confidence: real("confidence").notNull(),
  nitrogen: real("nitrogen").notNull(),
  phosphorus: real("phosphorus").notNull(),
  potassium: real("potassium").notNull(),
  temperature: real("temperature").notNull(),
  humidity: real("humidity").notNull(),
  ph: real("ph").notNull(),
  rainfall: real("rainfall").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPredictionHistorySchema = createInsertSchema(predictionHistoryTable).omit({ id: true, createdAt: true });
export type InsertPredictionHistory = z.infer<typeof insertPredictionHistorySchema>;
export type PredictionHistory = typeof predictionHistoryTable.$inferSelect;

// Farming knowledge base table (acts as vector store with embeddings)
export const knowledgeBaseTable = pgTable("knowledge_base", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array().notNull().default([]),
  // Store embedding as JSON array of numbers (simple vector store implementation)
  embedding: jsonb("embedding").$type<number[]>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertKnowledgeBaseSchema = createInsertSchema(knowledgeBaseTable).omit({ id: true, createdAt: true });
export type InsertKnowledgeBase = z.infer<typeof insertKnowledgeBaseSchema>;
export type KnowledgeBase = typeof knowledgeBaseTable.$inferSelect;

// Q&A history table
export const qaHistoryTable = pgTable("qa_history", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sources: text("sources").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertQaHistorySchema = createInsertSchema(qaHistoryTable).omit({ id: true, createdAt: true });
export type InsertQaHistory = z.infer<typeof insertQaHistorySchema>;
export type QaHistory = typeof qaHistoryTable.$inferSelect;
