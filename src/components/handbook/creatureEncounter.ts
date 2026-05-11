import type { AddCombatantRequest } from "../../modules/encounter-api";
import type { Creature } from "../../modules/open5e/types.gen";

export type CreatureCombatantRequest = AddCombatantRequest & {
  armorClass: number;
  attackBonus: number;
};

export function creatureToCombatantRequest(
  creature: Creature
): CreatureCombatantRequest {
  const hitPoints = creature.hit_points ?? 1;

  return {
    kind: "enemy",
    displayName: creature.name,
    initiative: creature.initiative_bonus ?? 0,
    currentHp: hitPoints,
    maxHp: hitPoints,
    armorClass: creature.armor_class ?? 10,
    attackBonus: getPrimaryAttackBonus(creature),
  };
}

function getPrimaryAttackBonus(creature: Creature): number {
  for (const action of creature.actions) {
    const attack = action.attacks[0];
    if (attack) return attack.to_hit_mod;
  }

  return 0;
}
