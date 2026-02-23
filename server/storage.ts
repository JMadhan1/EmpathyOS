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
    return await db.select().from(conversations);
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conv;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conv] = await db.insert(conversations).values(insertConversation).returning();
    return conv;
  }

  async updateConversation(id: number, updates: Partial<InsertConversation>): Promise<Conversation> {
    const [conv] = await db.update(conversations)
      .set(updates)
      .where(eq(conversations.id, id))
      .returning();
    return conv;
  }
}

export const storage = new DatabaseStorage();
