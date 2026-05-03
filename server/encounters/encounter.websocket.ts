import type { Server } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { damageCombatant, getSnapshot } from "./encounter.service";

const rooms = new Map<string, Set<WebSocket>>();

function broadcast(encounterId: string, message: unknown) {
  const room = rooms.get(encounterId);
  if (!room) return;

  const raw = JSON.stringify(message);
  for (const socket of room) {
    if (socket.readyState === WebSocket.OPEN) socket.send(raw);
  }
}

export function attachEncounterWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/api/encounters/live" });

  wss.on("connection", (socket, req) => {
    const url = new URL(req.url ?? "", "http://localhost");
    const encounterId = url.searchParams.get("encounterId");

    if (!encounterId) {
      socket.close(1008, "Missing encounterId");
      return;
    }

    if (!rooms.has(encounterId)) rooms.set(encounterId, new Set());
    rooms.get(encounterId)!.add(socket);

    socket.send(
      JSON.stringify({
        type: "state.snapshot",
        payload: getSnapshot(encounterId),
      }),
    );

    socket.on("message", (raw) => {
      const msg = JSON.parse(String(raw));

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

    socket.on("close", () => {
      rooms.get(encounterId)?.delete(socket);
    });
  });
}
