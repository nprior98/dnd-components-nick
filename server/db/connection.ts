import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

// Keep local development data in the project-level data directory.
fs.mkdirSync("data", { recursive: true });

export const db = new Database(path.join("data", "app.sqlite"));

// WAL improves local read/write behavior, and foreign keys are required for
// encounter child rows to cascade correctly.
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
