import type { Creature } from "../open5e/types.gen";
import { getCategory, warmAll } from "../open5e-cache";

export type Difficulty = "easy" | "medium" | "hard" | "deadly";

export type NormalizedCreature = {
  key: string;
  name: string;
  cr: number;
  crText: string;
  xp: number;
  type: string;
  typeName: string;
  url: string;
  source: Creature;
};

export type EncounterPick = {
  creature: NormalizedCreature;
  count: number;
};

export type EncounterResult = {
  picks: EncounterPick[];
  rawXp: number;
  adjustedXp: number;
  targetXp: number;
  attemptsUsed: number;
  poolSize: number;
};

export type GenerateEncounterOptions = {
  partyLevels: number[];
  difficulty: Difficulty;
  uniqueLimit?: number;
  creatureType?: string;
  crMax?: number;
  maxAttempts?: number;
  rng?: () => number;
};

export type FetchPoolOptions = {
  crMax?: number;
  crMin?: number;
  creatureType?: string;
};

// DMG 2014 per-character XP thresholds: [easy, medium, hard, deadly].
const XP_THRESHOLDS: Record<number, [number, number, number, number]> = {
  1: [25, 50, 75, 100],
  2: [50, 100, 150, 200],
  3: [75, 150, 225, 400],
  4: [125, 250, 375, 500],
  5: [250, 500, 750, 1100],
  6: [300, 600, 900, 1400],
  7: [350, 750, 1100, 1700],
  8: [450, 900, 1400, 2100],
  9: [550, 1100, 1600, 2400],
  10: [600, 1200, 1900, 2800],
  11: [800, 1600, 2400, 3600],
  12: [1000, 2000, 3000, 4500],
  13: [1100, 2200, 3400, 5100],
  14: [1250, 2500, 3800, 5700],
  15: [1400, 2800, 4300, 6400],
  16: [1600, 3200, 4800, 7200],
  17: [2000, 3900, 5900, 8800],
  18: [2100, 4200, 6300, 9500],
  19: [2400, 4900, 7300, 10900],
  20: [2800, 5700, 8500, 12700],
};

const DIFFICULTY_INDEX: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
  deadly: 3,
};

export function partyXpBudget(
  levels: number[],
  difficulty: Difficulty,
): number {
  const idx = DIFFICULTY_INDEX[difficulty];
  let total = 0;
  for (const lvl of levels) {
    const row = XP_THRESHOLDS[lvl];
    if (!row) throw new Error(`Unsupported character level: ${lvl}`);
    total += row[idx];
  }
  return total;
}

export function encounterMultiplier(monsterCount: number): number {
  if (monsterCount === 1) return 1;
  if (monsterCount === 2) return 1.5;
  if (monsterCount <= 6) return 2;
  if (monsterCount <= 10) return 2.5;
  return 3;
}

export function normalizeCreature(c: Creature): NormalizedCreature {
  return {
    key: c.key,
    name: c.name,
    cr: Number(c.challenge_rating_decimal),
    crText: c.challenge_rating_text,
    xp: c.experience_points,
    type: c.type.key,
    typeName: c.type.name,
    url: c.url,
    source: c,
  };
}

let normalizedAll: Promise<NormalizedCreature[]> | null = null;

function loadAll(): Promise<NormalizedCreature[]> {
  if (normalizedAll) return normalizedAll;
  normalizedAll = (async () => {
    let rec = await getCategory("creatures");
    if (!rec) {
      await warmAll();
      rec = await getCategory("creatures");
    }
    if (!rec) return [];
    return (rec.entries as Creature[]).map(normalizeCreature);
  })();
  return normalizedAll;
}

export async function fetchCreaturePool(
  opts: FetchPoolOptions = {},
): Promise<NormalizedCreature[]> {
  const all = await loadAll();
  return all.filter((c) => {
    if (opts.crMax !== undefined && c.cr > opts.crMax) return false;
    if (opts.crMin !== undefined && c.cr < opts.crMin) return false;
    if (opts.creatureType && c.type !== opts.creatureType) return false;
    return true;
  });
}

export function clearPoolCache(): void {
  normalizedAll = null;
}

export type CreatureTypeOption = { key: string; name: string };

export async function listCreatureTypes(): Promise<CreatureTypeOption[]> {
  const all = await loadAll();
  const seen = new Map<string, string>();
  for (const c of all) {
    if (!seen.has(c.type)) seen.set(c.type, c.typeName);
  }
  return [...seen.entries()]
    .map(([key, name]) => ({ key, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function effectiveMonsterCount(picks: EncounterPick[]): number {
  let totalCr = 0;
  let totalCount = 0;

  for (const pick of picks) {
    totalCr += pick.creature.cr * pick.count;
    totalCount += pick.count;
  }

  if (totalCount === 0) return 0;

  const avgCr = totalCr / totalCount;

  const minCr = avgCr * 0.5;
  const maxCr = avgCr * 1.5;

  let effectiveCount = 0;

  for (const pick of picks) {
    const cr = pick.creature.cr;

    if (cr >= minCr && cr <= maxCr) {
      effectiveCount += pick.count;
    }
  }

  return effectiveCount;
}

export async function generateEncounter(
  opts: GenerateEncounterOptions,
): Promise<EncounterResult> {
  const {
    partyLevels,
    difficulty,
    uniqueLimit = 4,
    creatureType,
    maxAttempts = 1000,
    rng = Math.random,
  } = opts;

  if (partyLevels.length === 0) {
    throw new Error("partyLevels must contain at least one level");
  }

  const targetXp = partyXpBudget(partyLevels, difficulty);
  const crMax = opts.crMax ?? Math.max(...partyLevels) + 4;
  const pool = await fetchCreaturePool({ crMax, creatureType });

  const picks = new Map<string, EncounterPick>();
  let rawXp = 0;
  let count = 0;
  let attempts = 0;

  while (attempts < maxAttempts && pool.length > 0) {
    attempts++;

    const effectiveCount = effectiveMonsterCount([...picks.values()]);
    const adjusted = rawXp * encounterMultiplier(effectiveCount);
    const remaining = targetXp - adjusted;
    if (remaining <= 0) break;

    const nextMult = encounterMultiplier(Math.max(1, effectiveCount + 1));
    const maxCandidateXp = remaining / nextMult;
    const upper = maxCandidateXp * 0.5;
    const lower = maxCandidateXp * 0.05;

    const unique = picks.size;
    const atUniqueCap = unique >= uniqueLimit;

    const candidates = pool.filter((c) => {
      if (c.xp <= 0) return false;
      if (c.xp > upper) return false;
      if (c.xp < lower) return false;
      if (atUniqueCap && !picks.has(c.key)) return false;
      return true;
    });

    if (candidates.length === 0) break;

    const chosen = candidates[Math.floor(rng() * candidates.length)];
    const entry = picks.get(chosen.key);
    if (entry) {
      entry.count++;
    } else {
      picks.set(chosen.key, { creature: chosen, count: 1 });
    }
    rawXp += chosen.xp;
    count++;
  }

const effectiveCount = effectiveMonsterCount([...picks.values()]);

  return {
    picks: [...picks.values()],
    rawXp,
    adjustedXp: rawXp * encounterMultiplier(effectiveCount),
    targetXp,
    attemptsUsed: attempts,
    poolSize: pool.length,
  };
}

export async function generateEncounters(
  opts: GenerateEncounterOptions & { count: number },
): Promise<EncounterResult[]> {
  const { count, ...rest } = opts;
  if (count <= 0) return [];
  const out: EncounterResult[] = [];
  for (let i = 0; i < count; i++) {
    out.push(await generateEncounter(rest));
  }
  return out;
}

export function calculateAdjustedXp(picks: EncounterPick[]): number {
  let rawXp = 0;
  for (const p of picks) {
    rawXp += p.creature.xp * p.count;
  }

  const effectiveCount = effectiveMonsterCount(picks);

  return Math.ceil(rawXp * encounterMultiplier(effectiveCount));
}
