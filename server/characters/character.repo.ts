import { db } from "../db/connection";
import { sql } from "../db/sql";
import { id } from "../utils/ids";
import { Character } from "./character.types";

// Create a character with user inputted stats
function addCharacter(input: {
  charID: string;
  name: string;
  level: number;
  characterClass: string;
  background: string;
  armorClass: number;
  initiative: number;
  speed: number;
  currentHP: number;
  maxHP: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}): Character {
  const character = {
    id: id("char"),
    charID: input.charID,
    name: input.name,
    level: input.level,
    characterClass: input.characterClass,
    background: input.background,
    armorClass: input.armorClass,
    initiative: input.initiative,
    speed: input.speed,
    maxHP: input.maxHP,
    currentHP: input.currentHP,
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
        current_hp,
        max_hp,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma
      )
      values
      (@id, @charID, @name, @level, @characterClass, @background, @armorClass, @initiative, @speed, @maxHP, @currentHP, @strength, @dexterity, @constitution, @intelligence, @wisdom, @charisma)
        `
  ).run(character);

  return {
    ...character,
  };
}

// View a specific character
function getCharacter(id: string): Character | undefined {
  return db.prepare(
    sql`
      select
        character_id as charID,
        name,
        level,
        character_class as characterClass,
        background,
        armor_class as armorClass,
        initiative,
        speed,
        max_hp as maxHP,
        current_hp as currentHP,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom, 
        charisma
      from characters where character_id = ?
    `
  ).get(id) as Character | undefined;
}

// List all characters
function listCharacters(): Character[] {
  const rows = db.prepare(
    sql`
      select
        character_id as charID,
        name,
        level,
        character_class as characterClass,
        background,
        armor_class as armorClass,
        initiative,
        speed,
        max_hp as maxHP,
        current_hp as currentHP,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom, 
        charisma
      from characters
      order by name asc
    `
  ).all();

  return rows.map((row: any) => (row))

}

// Delete a character
function deleteCharacter(id: string) {
  db.prepare(
    sql`
      DELETE FROM characters WHERE character_id = ?
    `
  );
}

export { addCharacter, getCharacter, listCharacters, deleteCharacter };
  