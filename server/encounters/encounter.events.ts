import type { EncounterSnapshot } from "./encounter.types";
import type { Combatant } from "./encounter.types";

export type StateSnapshotMessage = {
  type: "state.snapshot";
  payload: EncounterSnapshot;
};
export type TurnAdvancedEvent = {
  id: string;
  encounterId: string;
  type: "event.turn.advanced";
  version: number;
  payload: {
    previousTurnIndex: number;
    activeTurnIndex: number;
    roundNumber: number;
    activeCombatantId?: string;
  };
  createdAt: string;
};
export type EncounterStartedEvent = {
  id: string;
  encounterId: string;
  type: "event.encounter.started";
  version: number;
  payload: {
    status: "running";
    roundNumber: number;
    activeTurnIndex: number;
    combatants: Combatant[];
  };
  createdAt: string;
};
export type EncounterEndedEvent = {
  id: string;
  encounterId: string;
  type: "event.encounter.ended";
  version: number;
  payload: {
    status: "setup";
    roundNumber: number;
    activeTurnIndex: number;
  };
  createdAt: string;
};
export type AttackResolvedEvent = {
  id: string;
  encounterId: string;
  type: "event.attack.resolved";
  version: number;
  payload: {
    attackerId: string;
    targetId: string;
    attackRoll: number;
    attackTotal: number;
    armorClass: number;
    hit: boolean;
    damage: number;
    previousHp: number;
    currentHp: number;
  };
  createdAt: string;
};

export type CombatantHpChangedEvent = {
  id: string;
  encounterId: string;
  type: "event.combatants.hp_changed";
  version: number;
  payload: {
    combatantId: string;
    previousHp: number;
    currentHp: number;
    delta: number;
  };
  createdAt: string;
};

export type VersionConflictError = {
  type: "error.version_conflict";
  currentVersion: number;
};

export type EncounterEvent =
  | StateSnapshotMessage
  | CombatantHpChangedEvent
  | VersionConflictError
  | TurnAdvancedEvent
  | EncounterStartedEvent
  | EncounterEndedEvent
  | AttackResolvedEvent;
