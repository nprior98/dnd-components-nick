import fs from "node:fs";
import { db } from "./connection";

const schema = fs.readFileSync("server/db/schema.sql", "utf8");
db.exec(schema);

console.log("Database Migrated");
