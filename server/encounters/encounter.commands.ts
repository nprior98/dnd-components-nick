export type DamageCombatantCommand = {
  type: "command.damage";
  expectedVersion: number;
  payload: {
    combatantId: string;
    amount: number;
  };
};
export type NextTurnCommand = {
  type: "command.next_turn";
  expectedVersion: number;
  payload?: {};
};
export type RollInitiativeCommand = {
  type: "command.roll_initiative";
  expectedVersion: number;
  payload?: {};
};
export type AttackCombatantCommand = {
  type: "command.attack";
  expectedVersion: number;
  payload: {
    targetId: string;
  };
};
export type EndEncounterCommand = {
  type: "command.end_encounter";
  expectedVersion: number;
  payload?: {};
};

export type EncounterCommand =
  | DamageCombatantCommand
  | NextTurnCommand
  | RollInitiativeCommand
  | AttackCombatantCommand
  | EndEncounterCommand;
