# Encounters

Backend module for creating encounters, adding combatants, reading snapshots, and broadcasting live encounter updates.

## Files

- `encounter.routes.ts` defines the mounted HTTP routes under `/api/encounters`.
- `encounter.repo.ts` contains direct SQLite reads and writes.
- `encounter.service.ts` contains snapshot and transactional combat logic.
- `encounter.websocket.ts` attaches the live WebSocket endpoint.
- `encounter.types.ts` defines encounter, combatant, and snapshot types.
- `encounter.commands.ts` defines client-to-server WebSocket command types.
- `encounter.events.ts` defines server-to-client WebSocket message and event types.
- `asyncapi.yaml` documents the WebSocket contract.

## HTTP API

Create an encounter:

```http
POST /api/encounters
Content-Type: application/json

{ "name": "Goblin Ambush" }
```

Get encounter state:

```http
GET /api/encounters/:encounterId/state
```

Add a combatant:

```http
POST /api/encounters/:encounterId/combatants
Content-Type: application/json

{
  "kind": "enemy",
  "displayName": "Goblin",
  "initiative": 12,
  "currentHp": 7,
  "maxHp": 7
}
```

`kind` must be one of `player`, `enemy`, or `npc`.

## WebSocket API

Connect to:

```text
ws://localhost:3001/api/encounters/live?encounterId=<encounter-id>
```

On connect, the server sends:

```json
{
  "type": "state.snapshot",
  "payload": {
    "encounter": {},
    "combatants": []
  }
}
```

To damage a combatant, send:

```json
{
  "type": "command.damage",
  "expectedVersion": 1,
  "payload": {
    "combatantId": "cmb_example",
    "amount": 3
  }
}
```

Successful commands broadcast an `event.combatants.hp_changed` event to all sockets in the encounter room. If the supplied `expectedVersion` is stale, the sender receives `error.version_conflict`.

The full WebSocket message contract is documented in `asyncapi.yaml`.

## Development Notes

Use repository functions for direct data access and service functions for workflows that need validation, version checks, event records, or transactions.
