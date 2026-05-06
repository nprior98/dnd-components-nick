# Utilities

Small shared helpers for backend modules.

## Files

- `ids.ts` exports `id(prefix)`, which returns IDs like `enc_<uuid>` or `cmb_<uuid>`.
- `time.ts` exports `nowIso()`, which returns the current timestamp as an ISO string.

## Usage

```ts
import { id } from "../utils/ids";
import { nowIso } from "../utils/time";

const encounterId = id("enc");
const createdAt = nowIso();
```

## Development Notes

Keep this directory limited to generic helpers with no Express or database dependencies. Domain-specific logic should live in the owning server module.
