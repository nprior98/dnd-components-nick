import { useEffect, useRef, useState } from "react";
import { EncounterSnapshot } from "../../modules/encounter-api/types.gen";

export function useEncounterSocket(encounterId: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [snapshot, setSnapshot] = useState<EncounterSnapshot | null>(null);
  const [version, setVersion] = useState<number>(0);

  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:3001/api/encounters/live?encounterId=${encounterId}`
    );

    socketRef.current = socket;

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "state.snapshot") {
        setSnapshot(msg.payload);
        setVersion(msg.payload.encounter.version);
      }

      if (msg.type === "event.combatants.hp_changed") {
        setVersion(msg.version);
        setSnapshot((prev: any) => ({
          ...prev,
          combatants: prev.combatants.map((c: any) =>
            c.id === msg.payload.combatantId
              ? {
                  ...c,
                  currentHp: msg.payload.currentHp,
                  isDefeated: msg.payload.currentHp <= 0,
                }
              : c
          ),
          encounter: {
            ...prev.encounter,
            version: msg.version,
          },
        }));
      }
    };

    return () => socket.close();
  }, [encounterId]);

  function damage(combatantId: string, amount: number) {
    socketRef.current?.send(
      JSON.stringify({
        type: "command.damage",
        expectedVersion: version,
        payload: { combatantId, amount },
      })
    );
  }
  return { snapshot, damage };
}
