import { db } from "./db";
import { conversations, type Conversation, type InsertConversation } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getConversations(): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, updates: Partial<InsertConversation>): Promise<Conversation>;
}

export class DatabaseStorage implements IStorage {
  async getConversations(): Promise<Conversation[]> {
    return db.select().from(conversations).all();
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    return db.select().from(conversations).where(eq(conversations.id, id)).get();
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conv] = db.insert(conversations).values(insertConversation).returning().all();
    return conv;
  }

  async updateConversation(id: number, updates: Partial<InsertConversation>): Promise<Conversation> {
    const [conv] = db.update(conversations)
      .set(updates)
      .where(eq(conversations.id, id))
      .returning()
      .all();
    return conv;
  }
}

export const storage = new DatabaseStorage();
