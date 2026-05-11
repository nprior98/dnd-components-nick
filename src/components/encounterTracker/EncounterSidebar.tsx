import { useEncounterSocket } from "./useEncounterSocket";
import "../../styles/Tracker.css";
import { Button, ButtonGroup, ListGroup, Row } from "react-bootstrap";
import CombatantCard from "./CombatantCard";
import { useState } from "react";
import { Combatant } from "../../modules/encounter-api";

type EncounterProps = {
  encounterId: string;
};
// Main function
export default function EncounterSidebar({ encounterId }: EncounterProps) {
  const {
    snapshot,
    nextTurn,
    rollInitiative,
    attack,
    endEncounter,
    lastAttack,
  } = useEncounterSocket(encounterId);
  const [attackMode, setAttackMode] = useState(false);

  const activeTurnIndex = snapshot?.encounter.activeTurnIndex ?? 0;
  const activeCombatantId = snapshot?.combatants[activeTurnIndex]?.id;
  const activeCombatant = snapshot?.combatants[activeTurnIndex];
  const encounterStatus = snapshot?.encounter.status ?? "setup";
  const canAct = encounterStatus === "running" && !activeCombatant?.isDefeated;

  const handleAttackTarget = (targetId: string) => {
    attack(targetId);
    setAttackMode(false);
  };

  const handleNextTurn = () => {
    nextTurn();
    setAttackMode(false);
  };

  return (
    <>
      <div className="encounter">
        <br />
        <ListGroup variant="flush" className="library-list">
          {snapshot?.combatants.map((combatant: Combatant) => {
            const isActive = combatant.id === activeCombatantId;
            const isTargetable =
              attackMode && canAct && !isActive && !combatant.isDefeated;

            return (
              <ListGroup.Item
                key={combatant.id}
                action={isActive || isTargetable}
                disabled={combatant.isDefeated}
                onClick={() => {
                  if (isTargetable) handleAttackTarget(combatant.id);
                }}
              >
                <CombatantCard
                  combatant={combatant}
                  isActive={isActive}
                  isTargetable={isTargetable}
                />
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>
      <footer>
        {lastAttack && <div className="action-status">{lastAttack}</div>}
        <Row>
          {encounterStatus === "setup" ? (
            <Button variant="outline-light" onClick={rollInitiative}>
              Roll Initiative
            </Button>
          ) : encounterStatus === "running" ? (
            <>
              <ButtonGroup size="lg">
                <Button variant="outline-light" disabled>
                  Prev
                </Button>
                <Button
                  variant={attackMode ? "warning" : "outline-light"}
                  onClick={() => setAttackMode((value) => !value)}
                  disabled={!canAct}
                >
                  Attack
                </Button>
                <Button variant="outline-light" onClick={handleNextTurn}>
                  Next
                </Button>
              </ButtonGroup>
              <Button
                className="end-encounter-btn"
                variant="outline-danger"
                onClick={endEncounter}
              >
                End Encounter
              </Button>
            </>
          ) : (
            <Button variant="outline-light" disabled>
              Encounter Ended
            </Button>
          )}
        </Row>
      </footer>
    </>
  );
}
