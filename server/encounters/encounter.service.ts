import { db } from "../db/connection";
import { sql } from "../db/sql";
import { id } from "../utils/ids";
import { nowIso } from "../utils/time";
import * as repo from "./encounter.repo";

export function getSnapshot(encounterId: string) {
  const encounter = repo.getEncounter(encounterId);
  if (!encounter) throw new Error("Encounter not found");

  return {
    encounter,
    combatants: repo.listCombatants(encounterId),
  };
}

export const damageCombatant = db.transaction(
  (input: {
    encounterId: string;
    combatantId: string;
    amount: number;
    expectedVersion: number;
  }) => {
    const encounter: any = repo.getEncounter(input.encounterId);
    if (!encounter) throw new Error("Encounter not found");

    if (encounter.version !== input.expectedVersion) {
      return {
        type: "error.version_conflict",
        currentVersion: encounter.version,
      };
    }

    const combatant: any = db
      .prepare(
        sql`
          select id, current_hp as currentHp
          from encounter_combatants
          where id = ? and encounter_id = ?
        `,
      )
      .get(input.combatantId, input.encounterId);

    if (!combatant) throw new Error("Combatant not found");

    const nextHp = Math.max(0, combatant.currentHp - input.amount);
    const nextVersion = encounter.version + 1;

    db.prepare(
      sql`update encounter_combatants set current_hp = ?, is_defeated = ? where id = ?`,
    ).run(nextHp, nextHp <= 0 ? 1 : 0, input.combatantId);

    db.prepare(sql` update encounters set version = ? where id = ?`).run(
      nextVersion,
      input.encounterId,
    );

    const event = {
      id: id("evt"),
      encounterId: input.encounterId,
      type: "event.combatants.hp_changed",
      version: nextVersion,
      payload: {
        combatantId: input.combatantId,
        previousHp: combatant.current_hp,
        currentHp: nextHp,
        delta: -input.amount,
      },
      createdAt: nowIso(),
    };
    db.prepare(
      sql`insert into encounter_events (id, encounter_id, type, version, payload, created_at) values (@id, @encounterId, @type, @version, @payload, @createdAt)`,
    ).run({ ...event, payload: JSON.stringify(event.payload) });
    return event;
  },
);
