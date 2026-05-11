# Campaigns

Scaffold for campaign backend code.

## Current Status

This directory currently contains empty placeholders:

- `campaign.repo.ts`
- `campaign.routes.ts`
- `campaign.types.ts`

No campaign router is mounted in `server/index.ts` yet, and there are no campaign tables in `server/db/schema.sql`.

## Intended Usage

Use this module for campaign-level data such as campaign records, membership, notes, and links between campaigns and encounters or characters.

Recommended file responsibilities:

- `campaign.types.ts` should define request, response, and database-facing TypeScript types.
- `campaign.repo.ts` should contain direct SQLite reads and writes.
- `campaign.routes.ts` should define the Express router for `/api/campaigns`.

## Adding the API

When this module is implemented:

1. Add campaign tables to `server/db/schema.sql`.
2. Implement repository functions in `campaign.repo.ts`.
3. Create an Express `Router` in `campaign.routes.ts`.
4. Mount the router in `server/index.ts`.
5. Document the routes here.
