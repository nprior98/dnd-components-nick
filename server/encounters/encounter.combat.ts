export function rollD20(random = Math.random): number {
  return Math.floor(random() * 20) + 1;
}

export function resolveAttackRoll(input: {
  d20: number;
  attackBonus: number | null | undefined;
  armorClass: number | null | undefined;
}) {
  const attackRoll = input.d20;
  const attackTotal = attackRoll + (input.attackBonus ?? 0);
  const armorClass = input.armorClass ?? 10;

  return {
    attackRoll,
    attackTotal,
    hit: attackRoll === 20 || (attackRoll !== 1 && attackTotal >= armorClass),
  };
}

export function sortInitiativeResults<
  T extends { initiative: number; originalOrder: number },
>(combatants: T[]): T[] {
  return [...combatants].sort((a, b) => {
    if (b.initiative !== a.initiative) return b.initiative - a.initiative;
    return a.originalOrder - b.originalOrder;
  });
}
