import { db } from "../db/connection";
import { sql } from "../db/sql";
import { id } from "../utils/ids";
import { nowIso } from "../utils/time";
import { resolveAttackRoll, rollD20, sortInitiativeResults } from "./encounter.combat";
import * as repo from "./encounter.repo";
import type {
  AttackResolvedEvent,
  CombatantHpChangedEvent,
  EncounterEndedEvent,
  EncounterStartedEvent,
  TurnAdvancedEvent,
  VersionConflictError,
} from "./encounter.events";
import type { EncounterSnapshot } from "./encounter.types";

// Build the state shape consumed by HTTP clients and WebSocket snapshots.
export function getSnapshot(encounterId: string): EncounterSnapshot {
  const encounter = repo.getEncounter(encounterId);
  if (!encounter) throw new Error("Encounter not found");

  return {
    encounter,
    combatants: repo.listCombatants(encounterId),
  };
}

// Apply damage atomically so HP, encounter version, and event log stay aligned.
export const damageCombatant = db.transaction(
  (input: {
    encounterId: string;
    combatantId: string;
    amount: number;
    expectedVersion: number;
  }): CombatantHpChangedEvent | VersionConflictError => {
    const encounter = repo.getEncounter(input.encounterId);
    if (!encounter) throw new Error("Encounter not found");

    if (encounter.version !== input.expectedVersion) {
      // Tell stale clients to refresh before issuing another command.
      return {
        type: "error.version_conflict",
        currentVersion: encounter.version,
      };
    }

    const combatant = db
      .prepare(
        sql`
          select id, current_hp as currentHp
          from encounter_combatants
          where id = ? and encounter_id = ?
        `
      )
      .get(input.combatantId, input.encounterId) as
      | { id: string; currentHp: number }
      | undefined;

    if (!combatant) throw new Error("Combatant not found");

    const nextHp = Math.max(0, combatant.currentHp - input.amount);
    const nextVersion = encounter.version + 1;

    // Defeated state is derived from HP reaching zero.
    db.prepare(
      sql`update encounter_combatants set current_hp = ?, is_defeated = ? where id = ?`
    ).run(nextHp, nextHp <= 0 ? 1 : 0, input.combatantId);

    db.prepare(sql` update encounters set version = ? where id = ?`).run(
      nextVersion,
      input.encounterId
    );

    const event: CombatantHpChangedEvent = {
      id: id("evt"),
      encounterId: input.encounterId,
      type: "event.combatants.hp_changed",
      version: nextVersion,
      payload: {
        combatantId: input.combatantId,
        previousHp: combatant.currentHp,
        currentHp: nextHp,
        delta: -input.amount,
      },
      createdAt: nowIso(),
    };
    db.prepare(
      sql`insert into encounter_events (id, encounter_id, type, version, payload, created_at) values (@id, @encounterId, @type, @version, @payload, @createdAt)`
    ).run({ ...event, payload: JSON.stringify(event.payload) });
    return event;
  }
);

export const advanceTurn = db.transaction(
  (input: {
    encounterId: string;
    expectedVersion: number;
  }): TurnAdvancedEvent | VersionConflictError => {
    const encounter = repo.getEncounter(input.encounterId);
    if (!encounter) throw new Error("Encounter not found");

    if (encounter.version !== input.expectedVersion) {
      return {
        type: "error.version_conflict",
        currentVersion: encounter.version,
      };
    }

    const combatants = repo.listCombatants(input.encounterId);
    if (combatants.length === 0) {
      throw new Error("Cannot advance turn without combatants");
    }

    const previousTurnIndex = encounter.activeTurnIndex ?? 0;
    const activeTurnIndex = (previousTurnIndex + 1) % combatants.length;
    const roundNumber =
      activeTurnIndex === 0 ? encounter.roundNumber + 1 : encounter.roundNumber;
    const nextVersion = encounter.version + 1;
    const activeCombatant = combatants[activeTurnIndex];

    db.prepare(
      sql`
          update encounters
          set active_turn_index = ?, round_number = ?, version = ?
          where id = ?
        `
    ).run(activeTurnIndex, roundNumber, nextVersion, input.encounterId);

    const event: TurnAdvancedEvent = {
      id: id("evt"),
      encounterId: input.encounterId,
      type: "event.turn.advanced",
      version: nextVersion,
      payload: {
        previousTurnIndex,
        activeTurnIndex,
        roundNumber,
        activeCombatantId: activeCombatant.id,
      },
      createdAt: nowIso(),
    };

    db.prepare(
      sql`
          insert into encounter_events
          (id, encounter_id, type, version, payload, created_at)
          values (@id, @encounterId, @type, @version, @payload, @createdAt)
        `
    ).run({
      ...event,
      payload: JSON.stringify(event.payload),
    });

    return event;
  }
);

export const rollInitiative = db.transaction(
  (input: {
    encounterId: string;
    expectedVersion: number;
  }): EncounterStartedEvent | VersionConflictError => {
    const encounter = repo.getEncounter(input.encounterId);
    if (!encounter) throw new Error("Encounter not found");

    if (encounter.version !== input.expectedVersion) {
      return {
        type: "error.version_conflict",
        currentVersion: encounter.version,
      };
    }

    const combatants = repo.listCombatants(input.encounterId);
    if (combatants.length === 0) {
      throw new Error("Cannot roll initiative without combatants");
    }

    const rolledCombatants = sortInitiativeResults(
      combatants.map((combatant, originalOrder) => ({
        ...combatant,
        initiative: rollD20() + combatant.initiative,
        originalOrder,
      }))
    ).map(({ originalOrder: _originalOrder, ...combatant }, initiativeOrder) => ({
      ...combatant,
      initiativeOrder,
    }));

    const nextVersion = encounter.version + 1;

    const updateCombatant = db.prepare(
      sql`
        update encounter_combatants
        set initiative = ?, initiative_order = ?
        where id = ? and encounter_id = ?
      `
    );
    for (const combatant of rolledCombatants) {
      updateCombatant.run(
        combatant.initiative,
        combatant.initiativeOrder,
        combatant.id,
        input.encounterId
      );
    }

    db.prepare(
      sql`
        update encounters
        set status = 'running', round_number = 1, active_turn_index = 0, version = ?
        where id = ?
      `
    ).run(nextVersion, input.encounterId);

    const event: EncounterStartedEvent = {
      id: id("evt"),
      encounterId: input.encounterId,
      type: "event.encounter.started",
      version: nextVersion,
      payload: {
        status: "running",
        roundNumber: 1,
        activeTurnIndex: 0,
        combatants: rolledCombatants,
      },
      createdAt: nowIso(),
    };

    db.prepare(
      sql`insert into encounter_events (id, encounter_id, type, version, payload, created_at) values (@id, @encounterId, @type, @version, @payload, @createdAt)`
    ).run({ ...event, payload: JSON.stringify(event.payload) });

    return event;
  }
);

export const attackCombatant = db.transaction(
  (input: {
    encounterId: string;
    targetId: string;
    expectedVersion: number;
  }): AttackResolvedEvent | VersionConflictError => {
    const encounter = repo.getEncounter(input.encounterId);
    if (!encounter) throw new Error("Encounter not found");

    if (encounter.version !== input.expectedVersion) {
      return {
        type: "error.version_conflict",
        currentVersion: encounter.version,
      };
    }

    if (encounter.status !== "running") {
      throw new Error("Cannot attack unless encounter is running");
    }

    const combatants = repo.listCombatants(input.encounterId);
    const attacker = combatants[encounter.activeTurnIndex % combatants.length];
    const target = combatants.find((combatant) => combatant.id === input.targetId);

    if (!attacker) throw new Error("Active combatant not found");
    if (!target) throw new Error("Target combatant not found");
    if (attacker.id === target.id) throw new Error("Combatant cannot attack itself");
    if (attacker.isDefeated) throw new Error("Defeated combatant cannot attack");
    if (target.isDefeated) throw new Error("Defeated target cannot be attacked");

    const armorClass = target.armorClass ?? 10;
    const attack = resolveAttackRoll({
      d20: rollD20(),
      attackBonus: attacker.attackBonus,
      armorClass,
    });
    const damage = attack.hit ? Math.max(1, attacker.attackBonus ?? 1) : 0;
    const currentHp = Math.max(0, target.currentHp - damage);
    const nextVersion = encounter.version + 1;

    if (attack.hit) {
      db.prepare(
        sql`
          update encounter_combatants
          set current_hp = ?, is_defeated = ?
          where id = ? and encounter_id = ?
        `
      ).run(currentHp, currentHp <= 0 ? 1 : 0, target.id, input.encounterId);
    }

    db.prepare(sql`update encounters set version = ? where id = ?`).run(
      nextVersion,
      input.encounterId
    );

    const event: AttackResolvedEvent = {
      id: id("evt"),
      encounterId: input.encounterId,
      type: "event.attack.resolved",
      version: nextVersion,
      payload: {
        attackerId: attacker.id,
        targetId: target.id,
        attackRoll: attack.attackRoll,
        attackTotal: attack.attackTotal,
        armorClass,
        hit: attack.hit,
        damage,
        previousHp: target.currentHp,
        currentHp,
      },
      createdAt: nowIso(),
    };

    db.prepare(
      sql`insert into encounter_events (id, encounter_id, type, version, payload, created_at) values (@id, @encounterId, @type, @version, @payload, @createdAt)`
    ).run({ ...event, payload: JSON.stringify(event.payload) });

    return event;
  }
);

export const endEncounter = db.transaction(
  (input: {
    encounterId: string;
    expectedVersion: number;
  }): EncounterEndedEvent | VersionConflictError => {
    const encounter = repo.getEncounter(input.encounterId);
    if (!encounter) throw new Error("Encounter not found");

    if (encounter.version !== input.expectedVersion) {
      return {
        type: "error.version_conflict",
        currentVersion: encounter.version,
      };
    }

    const nextVersion = encounter.version + 1;
    db.prepare(
      sql`
        update encounters
        set status = 'setup', round_number = 1, active_turn_index = 0, version = ?
        where id = ?
      `
    ).run(nextVersion, input.encounterId);

    const event: EncounterEndedEvent = {
      id: id("evt"),
      encounterId: input.encounterId,
      type: "event.encounter.ended",
      version: nextVersion,
      payload: {
        status: "setup",
        roundNumber: 1,
        activeTurnIndex: 0,
      },
      createdAt: nowIso(),
    };

    db.prepare(
      sql`insert into encounter_events (id, encounter_id, type, version, payload, created_at) values (@id, @encounterId, @type, @version, @payload, @createdAt)`
    ).run({ ...event, payload: JSON.stringify(event.payload) });

    return event;
  }
);
