# Database

SQLite persistence layer for the backend.

## Files

- `connection.ts` opens `data/app.sqlite`, creates the `data/` directory, enables WAL mode, and turns on foreign keys.
- `schema.sql` defines the database schema.
- `migrate.ts` loads and executes `schema.sql`.
- `seeds.ts` is reserved for seed data and is currently empty.
- `sql.ts` provides a tiny tagged-template helper for readable SQL strings.

## Usage

Run migrations from the project root:

```bash
npm run migrate
```

The database file is created at `data/app.sqlite`.

## Current Schema

The schema currently creates:

- `encounters`
- `encounter_combatants`
- `encounter_events`

All encounter child tables cascade deletes through `encounter_id`.

## Development Notes

Import the shared connection from `connection.ts`:

```ts
import { db } from "../db/connection";
```

Keep module-specific queries in that module's repository file. Use transactions for multi-step writes that must update related rows together.
