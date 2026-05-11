import { useEffect, useRef, useState } from "react";
import { EncounterSnapshot } from "../../modules/encounter-api/types.gen";

export function useEncounterSocket(encounterId: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [snapshot, setSnapshot] = useState<EncounterSnapshot | null>(null);
  const [version, setVersion] = useState<number>(0);
  const [lastAttack, setLastAttack] = useState<string | null>(null);

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

      if (msg.type === "event.turn.advanced") {
        setVersion(msg.version);
        setSnapshot((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            encounter: {
              ...prev.encounter,
              activeTurnIndex: msg.payload.activeTurnIndex,
              roundNumber: msg.payload.roundNumber,
              version: msg.version,
            },
          };
        });
      }

      if (msg.type === "event.encounter.started") {
        setVersion(msg.version);
        setLastAttack(null);
        setSnapshot((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            combatants: msg.payload.combatants,
            encounter: {
              ...prev.encounter,
              status: msg.payload.status,
              activeTurnIndex: msg.payload.activeTurnIndex,
              roundNumber: msg.payload.roundNumber,
              version: msg.version,
            },
          };
        });
      }

      if (msg.type === "event.attack.resolved") {
        setVersion(msg.version);
        setLastAttack(
          msg.payload.hit
            ? `Hit ${msg.payload.attackTotal} vs AC ${msg.payload.armorClass} for ${msg.payload.damage} damage`
            : `Miss ${msg.payload.attackTotal} vs AC ${msg.payload.armorClass}`
        );
        setSnapshot((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            combatants: prev.combatants.map((combatant) =>
              combatant.id === msg.payload.targetId
                ? {
                    ...combatant,
                    currentHp: msg.payload.currentHp,
                    isDefeated: msg.payload.currentHp <= 0,
                  }
                : combatant
            ),
            encounter: {
              ...prev.encounter,
              version: msg.version,
            },
          };
        });
      }

      if (msg.type === "event.encounter.ended") {
        setVersion(msg.version);
        setLastAttack(null);
        setSnapshot((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            encounter: {
              ...prev.encounter,
              status: msg.payload.status,
              activeTurnIndex: msg.payload.activeTurnIndex,
              roundNumber: msg.payload.roundNumber,
              version: msg.version,
            },
          };
        });
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

  function nextTurn() {
    socketRef.current?.send(
      JSON.stringify({
        type: "command.next_turn",
        expectedVersion: version,
        payload: {},
      })
    );
  }

  function rollInitiative() {
    socketRef.current?.send(
      JSON.stringify({
        type: "command.roll_initiative",
        expectedVersion: version,
        payload: {},
      })
    );
  }

  function attack(targetId: string) {
    socketRef.current?.send(
      JSON.stringify({
        type: "command.attack",
        expectedVersion: version,
        payload: { targetId },
      })
    );
  }

  function endEncounter() {
    socketRef.current?.send(
      JSON.stringify({
        type: "command.end_encounter",
        expectedVersion: version,
        payload: {},
      })
    );
  }

  return {
    snapshot,
    damage,
    nextTurn,
    rollInitiative,
    attack,
    endEncounter,
    lastAttack,
  };
}
