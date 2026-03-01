// Creature Type generated from data/monsters/*.json

export interface Creature {
  slug: string;
  desc: string;
  name: string;

  size: string;
  type: string;
  subtype?: string | null;
  group?: string | null;
  alignment?: string | null;

  armor_class: number;
  armor_desc?: string | null;

  hit_points: number;
  hit_dice?: string | null;

  speed: Speed;

  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  strength_save?: number | null;
  dexterity_save?: number | null;
  constitution_save?: number | null;
  intelligence_save?: number | null;
  wisdom_save?: number | null;
  charisma_save?: number | null;

  perception?: number | null;

  skills: Skills;

  damage_vulnerabilities?: string | null;
  damage_resistances?: string | null;
  damage_immunities?: string | null;
  condition_immunities?: string | null;

  senses?: string | null;
  languages?: string | null;

  challenge_rating?: string | null;
  cr?: number | null;

  actions?: NamedBlock[] | null;
  bonus_actions?: NamedBlock[] | null;
  reactions?: NamedBlock[] | null;

  legendary_desc?: string | null;
  legendary_actions?: NamedBlock[] | null;

  special_abilities?: NamedBlock[] | null;

  spell_list?: string[] | null;

  page_no?: number | null;
  environments?: string[] | null;

  img_main?: string | null;

  document__slug?: string | null;
  document__title?: string | null;
  document__license_url?: string | null;
  document__url?: string | null;

  v2_converted_path?: string | null;
}

export interface Speed {
  walk?: number;
  swim?: number;
  fly?: number;
  crawl?: number;
  climb?: number;
}

export type Skills = Record<string, number>;

export interface NamedBlock {
  name: string;
  desc: string;
}
