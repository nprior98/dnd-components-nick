import { Col, Row } from "react-bootstrap";
import MainLayout from "./components/MainLayout";
import "./styles/Nick.css";
import Router from "./routes";

export default function App() {
  return (
    <MainLayout>
      <Row>
        <Col>
          <Router />
        </Col>
      </Row>
    </MainLayout>
  );
}
