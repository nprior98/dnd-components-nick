import { db } from "../db/connection";
import { sql } from "../db/sql";
import { id } from "../utils/ids";
import { nowIso } from "../utils/time";

// Create a character with user inputted stats
export function addCharacter(input: {
  characterId: string;
  name: string;
  level: number;
  characterClass: string;
  background: string;
  armorClass: number;
  initiative: number;
  speed: number;
  maxHp: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}) {
  const character = {
    id: id("char"),
    characterId: input.characterId,
    name: input.name,
    level: input.level,
    characterClass: input.characterClass,
    background: input.background,
    armorClass: input.armorClass,
    initiative: input.initiative,
    speed: input.speed,
    maxHp: input.maxHp,
    strength: input.strength,
    dexterity: input.dexterity,
    constitution: input.constitution,
    intelligence: input.intelligence,
    wisdom: input.wisdom,
    charisma: input.charisma,
  };

  db.prepare(
    sql`
      insert into characters
      (
        id, 
        character_id,
        name,
        level,
        character_class,
        background,
        armor_class,
        initiative,
        speed,
        max_hp,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma
      )
      values
      (@id, @characterId, @name, @level, @characterClass, @background, @armorClass, @initiative, @speed, @maxHp, @strength, @dexterity, @constitution, @intelligence, @wisdom, @charisma)
        `
  ).run(character);

  return {
    ...character,
  };
}

