import { conversations, type Conversation, type InsertConversation } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getConversations(): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, updates: Partial<InsertConversation>): Promise<Conversation>;
}

export class MemStorage implements IStorage {
  private conversations: Map<number, Conversation>;
  private idCounter: number;

  constructor() {
    this.conversations = new Map();
    this.idCounter = 1;
  }

  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values());
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.idCounter++;
    const conversation: Conversation = { ...insertConversation, id } as Conversation;
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: number, updates: Partial<InsertConversation>): Promise<Conversation> {
    const existing = this.conversations.get(id);
    if (!existing) throw new Error("Conversation not found");
    const updated = { ...existing, ...updates };
    this.conversations.set(id, updated);
    return updated;
  }
}

export class DatabaseStorage implements IStorage {
  async getConversations(): Promise<Conversation[]> {
    const { db } = await import("./db");
    return db.select().from(conversations).all();
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const { db } = await import("./db");
    return db.select().from(conversations).where(eq(conversations.id, id)).get();
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const { db } = await import("./db");
    const [conv] = db.insert(conversations).values(insertConversation).returning().all();
    return conv;
  }

  async updateConversation(id: number, updates: Partial<InsertConversation>): Promise<Conversation> {
    const { db } = await import("./db");
    const [conv] = db.update(conversations)
      .set(updates)
      .where(eq(conversations.id, id))
      .returning()
      .all();
    return conv;
  }
}

// Fallback logic for Vercel/Native issues
let storage: IStorage;

if (process.env.VERCEL) {
  console.log("Vercel environment detected. Using Memory Storage.");
  storage = new MemStorage();
} else {
  try {
    storage = new DatabaseStorage();
    console.log("Using Database Storage");
  } catch (e) {
    console.error("Failed to initialize database storage, falling back to Memory Storage", e);
    storage = new MemStorage();
  }
}

export { storage };
