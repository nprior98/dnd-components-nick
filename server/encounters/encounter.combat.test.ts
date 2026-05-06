import assert from "node:assert/strict";
import test from "node:test";
import {
  rollD20,
  resolveAttackRoll,
  sortInitiativeResults,
} from "./encounter.combat";

test("resolveAttackRoll adds attack bonus and hits armor class", () => {
  const result = resolveAttackRoll({
    d20: 12,
    attackBonus: 4,
    armorClass: 15,
  });

  assert.deepEqual(result, {
    attackRoll: 12,
    attackTotal: 16,
    hit: true,
  });
});

test("sortInitiativeResults orders highest initiative first with stable ties", () => {
  const ordered = sortInitiativeResults([
    { id: "slow", initiative: 9, originalOrder: 0 },
    { id: "tie-first", initiative: 14, originalOrder: 1 },
    { id: "fast", initiative: 18, originalOrder: 2 },
    { id: "tie-second", initiative: 14, originalOrder: 3 },
  ]);

  assert.deepEqual(
    ordered.map((combatant) => combatant.id),
    ["fast", "tie-first", "tie-second", "slow"]
  );
});

test("rollD20 maps random values to inclusive d20 range", () => {
  assert.equal(rollD20(() => 0), 1);
  assert.equal(rollD20(() => 0.999), 20);
});
