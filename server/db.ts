import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store the database file in the project root
const dbPath = path.resolve(__dirname, "..", "sqlite.db");

export const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

console.log(`Using SQLite database at: ${dbPath}`);
