import { Card, Col, Row } from "react-bootstrap";
import { Combatant } from "../../modules/encounter-api/types.gen";

type CombatantProps = {
  combatant: Combatant;
};
export default function CombatantCard({ combatant }: CombatantProps) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{combatant.displayName}</Card.Title>
        <Card.Subtitle>{combatant.kind}</Card.Subtitle>
        <Row>
          <Col>
            <p>{combatant.maxHp}</p>
          </Col>
          <Col>
            <p>{combatant.kind}</p>
          </Col>
          <Col>
            <p>{combatant.currentHp}</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
