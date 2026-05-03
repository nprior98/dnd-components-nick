import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

fs.mkdirSync("data", { recursive: true });

export const db = new Database(path.join("data", "app.sqlite"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
