import { Col, Container, Row } from "react-bootstrap";
import MainLayout from "./components/MainLayout";

import {
  Armor,
  Background,
  Class,
  Condition,
  Document,
  Feat,
  MagicItem,
  Monster,
  Plane,
  Race,
  Section,
  Spell,
  SpellList,
  Weapon,
} from "./components/handbook";
import "./styles/Nick.css";

export default function App() {
  return (
    <MainLayout>
      <Row>
        <Col>
          <Monster />
        </Col>
        <Col>
          <Class />
        </Col>
        <Col>
          <Weapon />
        </Col>
      </Row>
    </MainLayout>
  );
}
