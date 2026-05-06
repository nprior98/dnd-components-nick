import fs from "node:fs";
import { db } from "./connection";

const createdAt = "2026-01-01T00:00:00.000Z";

// Make the seed script standalone for fresh local databases.
const schema = fs.readFileSync("server/db/schema.sql", "utf8");
db.exec(schema);

const encounter = {
  id: "enc_seed_goblin_ambush",
  name: "Seed: Goblin Ambush",
  status: "setup",
  roundNumber: 1,
  activeTurnIndex: 0,
  version: 1,
  createdAt,
};

const combatants = [
  {
    id: "cmb_seed_aria",
    encounterId: encounter.id,
    kind: "player",
    displayName: "Aria Thornbow",
    initiative: 18,
    initiativeOrder: 0,
    currentHp: 24,
    maxHp: 24,
    armorClass: 15,
    attackBonus: 6,
    conditions: "[]",
    isDefeated: 0,
  },
  {
    id: "cmb_seed_borin",
    encounterId: encounter.id,
    kind: "player",
    displayName: "Borin Emberhand",
    initiative: 12,
    initiativeOrder: 1,
    currentHp: 31,
    maxHp: 31,
    armorClass: 18,
    attackBonus: 5,
    conditions: "[]",
    isDefeated: 0,
  },
  {
    id: "cmb_seed_goblin_1",
    encounterId: encounter.id,
    kind: "enemy",
    displayName: "Goblin Scout",
    initiative: 14,
    initiativeOrder: 2,
    currentHp: 7,
    maxHp: 7,
    armorClass: 13,
    attackBonus: 4,
    conditions: "[]",
    isDefeated: 0,
  },
  {
    id: "cmb_seed_goblin_2",
    encounterId: encounter.id,
    kind: "enemy",
    displayName: "Goblin Cutter",
    initiative: 9,
    initiativeOrder: 3,
    currentHp: 7,
    maxHp: 7,
    armorClass: 13,
    attackBonus: 4,
    conditions: '["hidden"]',
    isDefeated: 0,
  },
];

const event = {
  id: "evt_seed_created",
  encounterId: encounter.id,
  type: "event.encounter.seeded",
  version: encounter.version,
  payload: JSON.stringify({
    note: "Sample encounter for local development.",
    combatantCount: combatants.length,
  }),
  createdAt,
};

const seed = db.transaction(() => {
  db.prepare(
    `
      insert or ignore into encounters
      (id, name, status, round_number, active_turn_index, version, created_at)
      values
      (@id, @name, @status, @roundNumber, @activeTurnIndex, @version, @createdAt)
    `,
  ).run(encounter);

  const insertCombatant = db.prepare(
    `
      insert or ignore into encounter_combatants
      (
        id,
        encounter_id,
        kind,
        display_name,
        initiative,
        initiative_order,
        current_hp,
        max_hp,
        armor_class,
        attack_bonus,
        conditions,
        is_defeated
      )
      values
      (
        @id,
        @encounterId,
        @kind,
        @displayName,
        @initiative,
        @initiativeOrder,
        @currentHp,
        @maxHp,
        @armorClass,
        @attackBonus,
        @conditions,
        @isDefeated
      )
    `,
  );

  for (const combatant of combatants) {
    insertCombatant.run(combatant);
  }

  db.prepare(
    `
      insert or ignore into encounter_events
      (id, encounter_id, type, version, payload, created_at)
      values
      (@id, @encounterId, @type, @version, @payload, @createdAt)
    `,
  ).run(event);
});

seed();

console.log(`Seeded encounter ${encounter.id}`);
