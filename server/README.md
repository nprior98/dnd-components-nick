# Server

Express and SQLite backend for the DnD encounter app.

## Run

Install dependencies from the project root, then migrate and start the API:

```bash
npm install

// Create database tables if they don't exist
npm run migrate

// Generate interactive websocket documentation
npm run docs:asyncapi

// Run dev server
npm run dev:server
```

The server listens on `http://localhost:3001`.

## Current API

Only the encounters API is mounted today:

- `POST /api/encounters` creates an encounter. Body may include `name`; `id`, `status`, `roundNumber`, `activeTurnIndex`, `version`, and `createdAt` are assigned by the server.
- `GET /api/encounters/:encounterId/state` returns the encounter snapshot.
- `POST /api/encounters/:encounterId/combatants` adds a combatant.
- `WS /api/encounters/live?encounterId=<id>` joins the live encounter room.

## Directory Map

- `campaigns/` is scaffolded for campaign persistence, routes, and types.
- `characters/` is scaffolded for player character persistence, routes, and types.
- `db/` owns the SQLite connection, schema migration, and SQL helpers.
- `encounters/` owns encounter routes, persistence, service logic, and live WebSocket updates.
- `middleware/` is scaffolded for shared Express middleware.
- `users/` is scaffolded for user persistence, routes, and types.
- `utils/` contains small shared backend helpers.

## Data Storage

SQLite data is stored in `data/app.sqlite`. The connection enables WAL mode and foreign keys. The schema currently creates encounter, combatant, and encounter event tables.

## Development Notes

Mount new routers from `server/index.ts`. Keep database access in each module's `*.repo.ts` file and put cross-row or transactional behavior in `*.service.ts` files.
