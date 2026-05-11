import assert from "node:assert/strict";
import test from "node:test";
import { db } from "../db/connection";
import * as repo from "./encounter.repo";

test("addCombatant persists armor class and attack bonus", () => {
  const rollback = Symbol("rollback");

  try {
    db.transaction(() => {
      const encounter = repo.createEncounter("AC regression");
      const combatant = repo.addCombatant({
        encounterId: encounter.id,
        kind: "enemy",
        displayName: "Armored Goblin",
        initiative: 2,
        currentHp: 7,
        maxHp: 7,
        armorClass: 15,
        attackBonus: 4,
      });

      assert.equal(combatant.armorClass, 15);
      assert.equal(combatant.attackBonus, 4);

      const persisted = repo
        .listCombatants(encounter.id)
        .find((item) => item.id === combatant.id);

      assert.equal(persisted?.armorClass, 15);
      assert.equal(persisted?.attackBonus, 4);

      throw rollback;
    })();
  } catch (error) {
    if (error !== rollback) throw error;
  }
});
