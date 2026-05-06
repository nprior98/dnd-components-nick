-- One row per encounter session. Version is used for optimistic concurrency
-- when clients send live combat commands.
CREATE TABLE if NOT EXISTS encounters(
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  round_number INTEGER NOT NULL DEFAULT 1,
  active_turn_index INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL CONSTRAINT encounters_status_check CHECK(status IN(
    'setup',
    'running',
    'paused',
    'completed'
  ))
);
-- Combatants are encounter-local copies of players, enemies, or NPCs.
-- Initiative order is stored separately so ties can be sorted deterministically.
CREATE TABLE if NOT EXISTS encounter_combatants(
  id TEXT PRIMARY KEY,
  encounter_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  display_name TEXT NOT NULL,
  initiative INTEGER NOT NULL DEFAULT 0,
  initiative_order INTEGER NOT NULL DEFAULT 0,
  current_hp INTEGER NOT NULL,
  max_hp INTEGER NOT NULL,
  armor_class INTEGER,
  attack_bonus INTEGER,
  conditions TEXT NOT NULL DEFAULT '[]',
  is_defeated INTEGER NOT NULL DEFAULT 0 FOREIGN KEY(encounter_id) REFERENCES encounters(id)
ON DELETE cascade CONSTRAINT encounter_combatants_kind_check CHECK(kind IN(
    'player',
    'enemy',
    'npc'
  ))
);
-- Append-only event log for changes that should be broadcast or replayed.
CREATE TABLE if NOT EXISTS encounter_events(
  id TEXT PRIMARY KEY,
  encounter_id TEXT NOT NULL,
  type TEXT NOT NULL,
  version INTEGER NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL FOREIGN KEY(encounter_id) REFERENCES encounters(id)
ON DELETE cascade
);
-- Characters are player characters
CREATE TABLE if NOT EXISTS characters(
  id TEXT PRIMARY KEY,
  character_id TEXT NOT NULL,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  character_class TEXT NOT NULL,
  background TEXT NOT NULL,
  armor_class INTEGER DEFAULT 10,
  intiative INTEGER NOT NULL DEFAULT 0,
  speed INTEGER NOT NULL DEFAULT 30,
  max_hp INTEGER NOT NULL,
  strength INTEGER NOT NULL DEFAULT 10,
  dexterity INTEGER NOT NULL DEFAULT 10,
  constitution INTEGER NOT NULL DEFAULT 10,
  intelligence INTEGER NOT NULL DEFAULT 10,
  wisdom INTEGER NOT NULL DEFAULT 10,
  charisma INTEGER NOT NULL DEFAULT 10
);
