import { getSnapshot } from "./encounter.service";
import type { EncounterEvent } from "./encounter.events";

type EncounterBroadcaster = (encounterId: string, message: EncounterEvent) => void;

let broadcaster: EncounterBroadcaster | null = null;

export function registerEncounterBroadcaster(nextBroadcaster: EncounterBroadcaster) {
  broadcaster = nextBroadcaster;
}

export function broadcastEncounterSnapshot(encounterId: string) {
  broadcaster?.(encounterId, {
    type: "state.snapshot",
    payload: getSnapshot(encounterId),
  });
}
