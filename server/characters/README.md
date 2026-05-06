# Characters

Scaffold for character backend code.

## Current Status

This directory currently contains empty placeholders:

- `character.repo.ts`
- `character.routes.ts`
- `character.types.ts`

No character router is mounted in `server/index.ts` yet, and there are no character tables in `server/db/schema.sql`.

## Intended Usage

Use this module for persistent player characters and reusable NPC or enemy templates. Encounter-specific combatant state should stay in `server/encounters`.

Recommended file responsibilities:

- `character.types.ts` should define character models and API request/response types.
- `character.repo.ts` should contain direct SQLite reads and writes.
- `character.routes.ts` should expose the Express router for `/api/characters`.

## Adding the API

When this module is implemented:

1. Add character tables to `server/db/schema.sql`.
2. Implement repository functions in `character.repo.ts`.
3. Create an Express `Router` in `character.routes.ts`.
4. Mount the router in `server/index.ts`.
5. Document the routes here.
