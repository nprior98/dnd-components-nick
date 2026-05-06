import type { Server } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { damageCombatant, getSnapshot } from "./encounter.service";
import { registerEncounterBroadcaster } from "./encounter.realtime";
import type { EncounterCommand } from "./encounter.commands";
import type { EncounterEvent } from "./encounter.events";

// Each encounter ID maps to the set of live sockets watching that encounter.
const rooms = new Map<string, Set<WebSocket>>();

// Send a message to every open socket in one encounter room.
function broadcast(encounterId: string, message: EncounterEvent) {
  const room = rooms.get(encounterId);
  if (!room) return;

  const raw = JSON.stringify(message);
  for (const socket of room) {
    if (socket.readyState === WebSocket.OPEN) socket.send(raw);
  }
}

// Register the live encounter endpoint on the existing HTTP server.
export function attachEncounterWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/api/encounters/live" });
  registerEncounterBroadcaster(broadcast);

  wss.on("connection", (socket, req) => {
    const url = new URL(req.url ?? "", "http://localhost");
    const encounterId = url.searchParams.get("encounterId");

    // A room cannot be selected without an encounter ID.
    if (!encounterId) {
      socket.close(1008, "Missing encounterId");
      return;
    }

    if (!rooms.has(encounterId)) rooms.set(encounterId, new Set());
    rooms.get(encounterId)!.add(socket);

    // Send the current state immediately so the client can render before events.
    socket.send(
      JSON.stringify({
        type: "state.snapshot",
        payload: getSnapshot(encounterId),
      })
    );

    socket.on("message", (raw) => {
      const msg = JSON.parse(String(raw)) as EncounterCommand;

      // Commands are versioned so stale clients do not overwrite newer state.
      if (msg.type === "command.damage") {
        const result = damageCombatant({
          encounterId,
          combatantId: msg.payload.combatantId,
          amount: msg.payload.amount,
          expectedVersion: msg.expectedVersion,
        });

        if (result.type?.startsWith("error.")) {
          socket.send(JSON.stringify(result));
          return;
        }
        broadcast(encounterId, result);
      }
    });

    // Remove closed sockets from the room to avoid broadcasting to dead clients.
    socket.on("close", () => {
      rooms.get(encounterId)?.delete(socket);
    });
  });
}
