import crypto from "node:crypto";

// Prefix IDs by domain so logs and API payloads are easier to read.
export function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}
