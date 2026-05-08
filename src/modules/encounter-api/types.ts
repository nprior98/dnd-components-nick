interface Encounter {
  id: string;
  name: string;
  status: "setup" | "running" | "paused" | "completed";
  roundNumber: number;
  activeTurnIndex: number;
  version: number;
  createdAt: string;
}

interface CreateEncounterRequest {
  name: string;
}

interface EncounterSnapshot {
  id: string;
  name: string;
  status: "setup" | "running" | "paused" | "completed";
  roundNumber: number;
  activeTurnIndex: number;
  version: number;
  createdAt: string;
  combatants: Combatant[];
}

interface Combatant {
  id: string;
  encounterId: string;
  kind: "player" | "enemy" | "npc";
  displayName: string;
  initiative: number;
  initiativeOrder: number;
  currentHp: number;
  maxHp: number;
  armorClass: number;
  attackBonus: number;
  conditions: string[];
  isDefeated: boolean;
}

interface AddCombatantRequest {
  kind: "player" | "enemy" | "npc";
  displayName: string;
  initiative: number;
  currentHp: number;
  armorClass: number;
  maxHp: number;
  attackBonus: number;
}

export type {
  Encounter,
  CreateEncounterRequest,
  EncounterSnapshot,
  Combatant,
  AddCombatantRequest,
};

