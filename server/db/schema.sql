create table if not exists encounters (
  id text primary key,
  name text not null,
  status text not null,
  round_number integer not null default 1,
  active_turn_index integer not null default 0,
  version integer not null default 1,
  created_at text not null,
  constraint encounters_status_check
    check (status in ('setup', 'running', 'paused', 'completed'))
);

create table if not exists encounter_combatants (
  id text primary key,
  encounter_id text not null,
  kind text not null,
  display_name text not null,
  initiative integer not null default 0,
  initiative_order integer not null default 0,
  current_hp integer not null,
  max_hp integer not null,
  armor_class integer,
  attack_bonus integer,
  conditions text not null default '[]',
  is_defeated integer not null default 0,
  foreign key (encounter_id) references encounters(id) on delete cascade,
  constraint encounter_combatants_kind_check
    check (kind in ('player', 'enemy', 'npc'))
);

create table if not exists encounter_events (
  id text primary key,
  encounter_id text not null,
  type text not null,
  version integer not null,
  payload text not null,
  created_at text not null,
  foreign key (encounter_id) references encounters(id) on delete cascade
);
