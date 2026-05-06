import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { Combatant } from "../../modules/encounter-api/types.gen";

type CombatantProps = {
  combatant: Combatant;
  isActive: boolean;
  isTargetable: boolean;
};
export default function CombatantCard({
  combatant,
  isActive,
  isTargetable,
}: CombatantProps) {
  return (
    <Card border={isTargetable ? "danger" : isActive ? "warning" : ""}>
      <Card.Body>
        <Card.Title>
          {combatant.displayName}{" "}
          {isActive && (
            <Badge bg="warning" text="dark">
              Turn
            </Badge>
          )}{" "}
          {isTargetable && <Badge bg="danger">Target</Badge>}
        </Card.Title>
        <Card.Subtitle>{combatant.kind}</Card.Subtitle>
        <Row>
          <Col>
            <Button variant="primary">
              HP{" "}
              <Badge bg="secondary">{`${combatant.currentHp} / ${combatant.maxHp}`}</Badge>
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
