import { db } from "../db/connection";
import { sql } from "../db/sql";
import { id } from "../utils/ids";
import { nowIso } from "../utils/time";

export function createEncounter(name: string) {
  const encounter = {
    id: id("enc"),
    name,
    status: "setup",
    roundNumber: 1,
    createdAt: nowIso(),
  };

  db.prepare(
    sql`
    insert into encounters
    (id, name, status, round_number, active_turn_index, version, created_at)
    valuse (@id, @name, @status, @roundNumber, @activeTurnIndex, @version, @createdAt)
`,
  ).run(encounter);

  return encounter;
}

export function getEncounter(id: string) {
  return db
    .prepare(
      sql`
      select
        id, 
        name,
        status,
        round_number as roundNumber,
        active_turn_index as activeTurnIndex,
        version,
        created_at as createdAt
      from encounters
      where id = ?
`,
    )
    .get(id);
}

export function listCombatants(encounterID: string) {
  const rows = db
    .prepare(
      sql`
    select
      id,
      encounter_id as encounterId,
      kind,
      display_name as displayName,
      initiative,
      initiative_order as initiativeOrder,
      current_hp as currentHp,
      max_hp as maxHp,
      armor_class as armorClass,
      attack_bonus as attackBonus,
      conditions,
      is_defeated as isDefeated
    from encounter_combatants
    where encounter_id = ?
    order by initiative_order asc
`,
    )
    .all(encounterID);
  return rows.map((row: any) => ({
    ...row,
    conditions: JSON.parse(row.conditions),
    isDefeated: Boolean(row.isDefeated),
  }));
}

export function addCombatant(input: {
  encounterId: string;
  kind: string;
  displayName: string;
  initiative?: number;
  currentHp: number;
  maxHp: number;
}) {
  const combatant = {
    id: id("cmb"),
    encounterId: input.encounterId,
    kind: input.kind,
    displayName: input.displayName,
    initiative: input.initiative ?? 0,
    initiativeOrder: 999,
    currentHp: input.currentHp,
    maxHp: input.maxHp,
    armorClass: null,
    attackBonus: null,
    conditions: "[]",
    isDefeated: 0,
  };

  db.prepare(
    `
      insert into encounter_combatants
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
      (@id, @encounterId, @kind, @displayName, @initiative, @initiativeOrder, @currentHp, @maxHp, @armorClass, @attackBonus, @conditions, @isDefeated)
    `,
  ).run(combatant);

  return combatant;
}
