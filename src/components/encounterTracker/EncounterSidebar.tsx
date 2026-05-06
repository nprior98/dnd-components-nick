import { useEncounterSocket } from "./useEncounterSocket";
import type { Encounter } from "../../modules/encounter-api/types.gen";
import "../../styles/Tracker.css";
import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import CombatantCard from "./CombatantCard";

type EncounterProps = {
  encounterId: string;
};
// Main function
export default function EncounterSidebar({ encounterId }: EncounterProps) {
  const { snapshot, damage } = useEncounterSocket(encounterId);

  return (
    <div className="encounter">
      <br />
      <ListGroup variant="flush" className="library-list">
        {snapshot?.combatants.map((combatant) => (
          <ListGroup.Item key={combatant.id} action>
            <CombatantCard combatant={combatant} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
