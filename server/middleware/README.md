# Middleware

Scaffold for shared Express middleware.

## Current Status

This directory currently contains empty placeholders:

- `auth.ts`
- `errors.ts`
- `json.ts`

`server/index.ts` currently uses `express.json()` directly and does not import middleware from this directory.

## Intended Usage

Use this directory for reusable request handling that applies across routers:

- `auth.ts` can validate session or user identity once user support exists.
- `errors.ts` can centralize route error handling and HTTP error responses.
- `json.ts` can hold JSON parsing configuration if the app needs custom limits or validation.

## Development Notes

Middleware should stay framework-facing and avoid domain persistence. Domain-specific validation belongs in the owning module's route or service layer.
