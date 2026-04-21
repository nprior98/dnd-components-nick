import { openDB } from "idb";
import { Category } from "./config";
import { ListFn } from "./paginate";

type CategoryRecord = { key: Category; entries: unknown[]; fetchedAt: number };

const dbPromise = openDB("Open5eDB", 1, {
  upgrade(db) {
    db.createObjectStore("categories", { keyPath: "key" });
  },
});

export async function getCategory(
  name: Category,
): Promise<CategoryRecord | undefined> {
  const db = await dbPromise;
  return db.get("categories", name);
}

export async function setCategory(name: Category, entries: unknown[]) {
  const db = await dbPromise;
  await db.put("categories", { key: name, entries, fetchedAt: Date.now() });
}

export type { CategoryRecord }