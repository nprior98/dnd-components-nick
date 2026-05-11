// Lifecycle values persisted in the encounters table.
export type EncounterStatus = "setup" | "running" | "paused" | "completed";

// Combatant categories accepted by the database constraint and routes.
export type CombatantKind = "player" | "enemy" | "npc";

// API-facing encounter shape. Database snake_case fields are mapped in the repo.
export type Encounter = {
  id: string;
  name: string;
  status: EncounterStatus;
  roundNumber: number;
  activeTurnIndex: number;
  version: number;
  createdAt: string;
};

// Encounter-local combatant state, including transient combat fields like HP.
export type Combatant = {
  id: string;
  encounterId: string;
  kind: CombatantKind;
  displayName: string;
  initiative: number;
  initiativeOrder: number;
  currentHp: number;
  maxHp: number;
  armorClass: number | null;
  attackBonus: number | null;
  conditions: string[];
  isDefeated: boolean;
};

// Full encounter state sent over HTTP and as the initial WebSocket snapshot.
export type EncounterSnapshot = {
  encounter: Encounter;
  combatants: Combatant[];
};
