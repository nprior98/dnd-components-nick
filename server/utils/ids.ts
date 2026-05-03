import crypto from "node:crypto";

export function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}
