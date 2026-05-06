# Users

Scaffold for user backend code.

## Current Status

This directory currently contains empty placeholders:

- `user.repo.ts`
- `user.routes.ts`
- `user.types.ts`

No user router is mounted in `server/index.ts` yet, and there are no user tables in `server/db/schema.sql`.

## Intended Usage

Use this module for account records, authentication ownership, and user-to-campaign relationships once those features are added.

Recommended file responsibilities:

- `user.types.ts` should define user models and API request/response types.
- `user.repo.ts` should contain direct SQLite reads and writes.
- `user.routes.ts` should expose the Express router for `/api/users`.

## Adding the API

When this module is implemented:

1. Add user tables to `server/db/schema.sql`.
2. Implement repository functions in `user.repo.ts`.
3. Create an Express `Router` in `user.routes.ts`.
4. Mount the router in `server/index.ts`.
5. Document the routes here.
