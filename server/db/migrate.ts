import fs from "node:fs";
import { db } from "./connection";

// Re-run the idempotent schema file to bring a local database up to date.
const schema = fs.readFileSync("server/db/schema.sql", "utf8");
db.exec(schema);

console.log("Database Migrated");
