import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  DropdownItem,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  generateEncounters,
  listCreatureTypes,
  type CreatureTypeOption,
  type Difficulty,
  type EncounterResult,
} from "../../modules/encounter-gen";
import {
  addCombatant,
  addEncounter,
  Encounter,
} from "../../modules/encounter-api";
import { creatureToCombatantRequest } from "../handbook/creatureEncounter";

type EncounterGenProps = {
  encounterList: Encounter[];
  refreshEncounters: () => Promise<void>;
};

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "deadly"];

function parseLevels(raw: string): number[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number.parseInt(s, 10));
}

export default function EncounterGenDemo({
  encounterList,
  refreshEncounters,
}: EncounterGenProps) {
  const [levelsInput, setLevelsInput] = useState("3,3,3,3");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [uniqueLimit, setUniqueLimit] = useState(4);
  const [creatureType, setCreatureType] = useState("");
  const [creatureTypes, setCreatureTypes] = useState<CreatureTypeOption[]>([]);
  const [crMax, setCrMax] = useState<string>("");
  const [count, setCount] = useState(3);

  useEffect(() => {
    let cancelled = false;
    refreshEncounters();
    listCreatureTypes().then((types) => {
      if (!cancelled) setCreatureTypes(types);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const [results, setResults] = useState<EncounterResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onGenerate(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setResults([]);

    const partyLevels = parseLevels(levelsInput);
    if (
      partyLevels.length === 0 ||
      partyLevels.some((n) => !Number.isFinite(n))
    ) {
      setError("Enter at least one valid character level (e.g. 3,3,3,4).");
      return;
    }
    const crMaxParsed = crMax.trim() === "" ? undefined : Number(crMax);
    if (crMaxParsed !== undefined && !Number.isFinite(crMaxParsed)) {
      setError("CR Max must be a number or blank.");
      return;
    }

    setLoading(true);
    try {
      const res = await generateEncounters({
        partyLevels,
        difficulty,
        uniqueLimit,
        creatureType: creatureType.trim() || undefined,
        crMax: crMaxParsed,
        count,
      });
      setResults(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-3">
      <Card className="mb-4">
        <h2>Encounter Generator</h2>
        <p className="text-muted">
          Pulls creatures from open5e, filtered by CR (and optionally type),
          then fills an encounter to the DMG 2014 XP budget for the party.
        </p>

        <Card.Body>
          <Form onSubmit={onGenerate}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="levels">
                  <Form.Label>Party levels (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={levelsInput}
                    onChange={(e) => setLevelsInput(e.target.value)}
                    placeholder="3,3,3,4"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="difficulty">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(e.target.value as Difficulty)
                    }
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d[0].toUpperCase() + d.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="uniqueLimit">
                  <Form.Label>Unique creatures (max)</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={20}
                    value={uniqueLimit}
                    onChange={(e) => setUniqueLimit(Number(e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="creatureType">
                  <Form.Label>Creature type (optional)</Form.Label>
                  <Form.Select
                    value={creatureType}
                    onChange={(e) => setCreatureType(e.target.value)}
                    disabled={creatureTypes.length === 0}
                  >
                    <option value="">Any</option>
                    {creatureTypes.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="crMax">
                  <Form.Label>CR max (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={crMax}
                    onChange={(e) => setCrMax(e.target.value)}
                    placeholder="auto"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="count">
                  <Form.Label>How many encounters</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={20}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button type="submit" disabled={loading} className="w-100">
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Generating…
                    </>
                  ) : (
                    "Generate"
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {results.map((r, i) => (
        <EncounterResultView
          key={i}
          index={i}
          result={r}
          encounterList={encounterList}
          refreshEncounters={refreshEncounters}
        />
      ))}
    </div>
  );
}

function EncounterResultView({
  index,
  result,
  encounterList,
  refreshEncounters,
}: {
  index: number;
  result: EncounterResult;
  encounterList: Encounter[];
  refreshEncounters: () => Promise<void>;
}) {
  const [show, setShow] = useState<boolean>(false);
  const [encounterName, setEncounterName] = useState<string>("");
  const totalMonsters = result.picks.reduce((n, p) => n + p.count, 0);
  const overBudget = result.adjustedXp > result.targetXp;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function createEncounterAddCombatants(
    result: EncounterResult,
    encounterName: string
  ) {
    const encounter = await addEncounter({ name: encounterName });
    const encounterId = encounter.id;

    await refreshEncounters();

    await handleAddToEncounter(encounterId, result);
  }

  async function handleAddToEncounter(
    encounterId: string,
    result: EncounterResult
  ) {
    result.picks.map((pick) => {
      const combatant = creatureToCombatantRequest(pick.creature.source);
      addCombatant(combatant, encounterId);
    });
  }

  return (
    <Card className="mb-3">
      <Card.Header>Encounter {index + 1}</Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col>
            <div className="text-muted small">Target XP</div>
            <div className="h5">{result.targetXp}</div>
          </Col>
          <Col>
            <div className="text-muted small">Raw XP</div>
            <div className="h5">{result.rawXp}</div>
          </Col>
          <Col>
            <div className="text-muted small">Adjusted XP</div>
            <div className="h5">
              {result.adjustedXp}{" "}
              <Badge bg={overBudget ? "warning" : "success"} text="dark">
                {overBudget ? "over" : "within"}
              </Badge>
            </div>
          </Col>
          <Col>
            <div className="text-muted small">Monsters</div>
            <div className="h5">{totalMonsters}</div>
          </Col>
          <Col>
            <div className="text-muted small">Pool size</div>
            <div className="h5">{result.poolSize}</div>
          </Col>
          <Col>
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="save">
                Save Encounter
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {encounterList?.map((encounter) => (
                  <DropdownItem
                    onClick={() => handleAddToEncounter(encounter.id, result)}
                  >
                    {encounter.name}
                  </DropdownItem>
                ))}
                <DropdownItem onClick={handleShow}>New Encounter</DropdownItem>
              </Dropdown.Menu>
              <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>New Encounter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await createEncounterAddCombatants(result, encounterName);
                      handleClose();
                    }}
                  >
                    <Row>
                      <Form.Group
                        className="mb-3"
                        controlId="newEncounterForm.ControlInput1"
                      >
                        <Form.Label>Encounter Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={encounterName}
                          onChange={(e) => setEncounterName(e.target.value)}
                          placeholder="Dark Forest"
                          autoFocus
                        />
                      </Form.Group>
                      <Button type="submit">Submit</Button>
                    </Row>
                  </Form>
                </Modal.Body>
              </Modal>
            </Dropdown>
          </Col>
        </Row>

        {result.picks.length === 0 ? (
          <Alert variant="secondary">
            No creatures matched the budget. Try widening the filters.
          </Alert>
        ) : (
          <Table striped hover responsive size="sm">
            <thead>
              <tr>
                <th>Count</th>
                <th>Name</th>
                <th>Type</th>
                <th>CR</th>
                <th className="text-end">XP (each)</th>
                <th className="text-end">XP (total)</th>
              </tr>
            </thead>
            <tbody>
              {result.picks.map(({ creature, count }) => (
                <tr key={creature.key}>
                  <td>×{count}</td>
                  <td>{creature.name}</td>
                  <td>
                    <Badge bg="secondary">{creature.typeName}</Badge>
                  </td>
                  <td>{creature.cr}</td>
                  <td className="text-end">{creature.xp}</td>
                  <td className="text-end">{creature.xp * count}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
