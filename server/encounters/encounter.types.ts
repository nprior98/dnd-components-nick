export type EncounterStatus = "setup" | "running" | "paused" | "completed";
export type CombatantKind = "player" | "enemy" | "npc";

export type Encounter = {
  id: string;
  name: string;
  status: EncounterStatus;
  roundNumber: number;
  activeTurnIndex: number;
  version: number;
  createdAt: string;
};

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

export type EncounterSnapshot = {
  encounter: Encounter;
  combatants: Combatant[];
};
