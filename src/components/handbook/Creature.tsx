import { useHandbookData } from "./useHandbookData";
import { creaturesRetrieve } from "../../modules/open5e/sdk.gen";
import {
  Creature,
  CreatureAction,
  SpeedAll,
} from "../../modules/open5e/types.gen";
import { useParams } from "react-router";
import HandbookPage from "./HandbookPage";
import {
  addCombatant,
  getEncounterSnapshot,
  listEncounters,
} from "../../modules/encounter-api";
import { Alert, Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import type { Encounter } from "../../modules/encounter-api";
import { creatureToCombatantRequest } from "./creatureEncounter";

function SpeedBlock({ speed }: { speed: SpeedAll }) {
  const unit = speed.unit;
  const walk: number = speed.walk ? +speed.walk : 0;
  const swim: number = speed.swim ? +speed.swim : 0;
  const fly: number = speed.fly ? +speed.fly : 0;
  const burrow: number = speed.burrow ? +speed.burrow : 0;
  const crawl: number = speed.crawl ? +speed.crawl : 0;
  const climb: number = speed.climb ? +speed.climb : 0;
  const hover: boolean = speed.hover;
  return (
    <>
      <dt>
        <strong>speed</strong>
      </dt>
      <dd className="">
        {walk > 0 ? `${walk} ${unit} ` : ""}
        {swim > 0 ? `Swim: ${swim} ${unit} ` : ""}
        {fly > 0 ? `Fly: ${fly} ${unit} ` : ""}
        {burrow > 0 ? `Burrow: ${burrow} ${unit} ` : ""}
        {crawl > 0 ? `Crawl: ${crawl} ${unit} ` : ""}
        {climb > 0 ? `Climb: ${climb} ${unit} ` : ""}
        {hover ? "(hover)" : ""}
      </dd>
    </>
  );
}

export default function CreaturePage() {
  let { stub } = useParams<{ stub: string }>();
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [encounterLoadError, setEncounterLoadError] = useState<string | null>(
    null
  );
  const [addStatus, setAddStatus] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { data: creature, loading } = useHandbookData(
    stub,
    creaturesRetrieve,
    (data): data is Creature => (data as Creature)?.name !== undefined
  );

  useEffect(() => {
    let cancelled = false;

    async function loadEncounters() {
      const result = await listEncounters();
      if (cancelled) return;

      if (result.status === 200) {
        const nextEncounters = result.data ?? [];
        setEncounters(nextEncounters);
        setEncounterLoadError(null);
      } else {
        setEncounters([]);
        setEncounterLoadError("Could not load encounters");
      }
    }

    loadEncounters().catch(() => {
      if (!cancelled) {
        setEncounters([]);
        setEncounterLoadError("Could not load encounters");
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div>
        <p>...loading</p>
      </div>
    );
  }

  if (!creature) {
    return (
      <div>
        <p>Creature not found</p>
      </div>
    );
  }

  const addToEncounter = async (encounterId: string) => {
    if (!encounterId) return;

    setIsAdding(true);
    setAddStatus(null);

    try {
      const result = await addCombatant(
        creatureToCombatantRequest(creature),
        encounterId
      );
      const selectedEncounter = encounters.find(
        (encounter) => encounter.id === encounterId
      );

      if (result.status === 201) {
        setAddStatus(`Added to ${selectedEncounter?.name ?? "encounter"}`);
      } else {
        setAddStatus("Could not add creature");
      }
    } catch {
      setAddStatus("Could not add creature");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <HandbookPage>
      <div className="creature-encounter-actions">
        {encounterLoadError && (
          <Alert variant="danger">{encounterLoadError}</Alert>
        )}
        {addStatus && <Alert variant="secondary">{addStatus}</Alert>}
        <Dropdown>
          <Dropdown.Toggle
            className="creature-encounter-toggle"
            disabled={encounters.length === 0 || isAdding}
          >
            {isAdding ? "Adding..." : "Add to Encounter"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {encounters.length === 0 ? (
              <Dropdown.Item disabled>No encounters</Dropdown.Item>
            ) : (
              encounters.map((encounter) => (
                <Dropdown.Item
                  key={encounter.id}
                  onClick={() => addToEncounter(encounter.id)}
                >
                  {encounter.name}
                </Dropdown.Item>
              ))
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div id="p1" data-index="0">
        <h1>creature</h1>
        <div className="columnWrapper">
          <div
            className="watercolor9"
            style={{
              opacity: 0.24,
              top: -750,
              left: -500,
            }}
          ></div>
          {creature.illustration != null ? (
            <img
              src={creature.illustration.url}
              alt={creature.illustration.alt_text}
            />
          ) : null}
          <div className="block monster frame wide">
            <h2 id="creature">{creature.name}</h2>
            <p>
              <em>
                {creature.size.name} {creature.type.name} {creature.category}
                <span className="inline-block bonus">{creature.alignment}</span>
              </em>
            </p>
            <hr />
            <dl>
              <dt>
                <strong>armor class</strong>
              </dt>
              <dd>
                {creature.armor_class}
                <br />
              </dd>
              <dt>
                <strong>hit points</strong>
              </dt>
              <dd>
                {creature.hit_points}
                <br />
              </dd>
              <SpeedBlock speed={creature.speed_all} />
            </dl>
            <hr />
            <table>
              <thead>
                <tr>
                  <th align="center">str</th>
                  <th align="center">dex</th>
                  <th align="center">con</th>
                  <th align="center">int</th>
                  <th align="center">wis</th>
                  <th align="center">cha</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td align="center">{creature.modifiers.strength}</td>
                  <td align="center">{creature.modifiers.dexterity}</td>
                  <td align="center">{creature.modifiers.constitution}</td>
                  <td align="center">{creature.modifiers.intelligence}</td>
                  <td align="center">{creature.modifiers.wisdom}</td>
                  <td align="center">{creature.modifiers.charisma}</td>
                </tr>
              </tbody>
            </table>
            <hr />

            {creature.actions.some(
              (actionType: CreatureAction): boolean =>
                actionType.action_type == "LEGENDARY_ACTION"
            ) ? (
              <h3 id="actions">Legendary Actions</h3>
            ) : null}
            {creature.actions
              .filter(
                (action: CreatureAction): boolean =>
                  action.action_type == "LEGENDARY_ACTION"
              )
              .map((action) => (
                <dl>
                  <dt>
                    <strong>{action.name}</strong>
                  </dt>
                  <dd>{action.desc}</dd>
                  <dd>{action.legendary_action_cost}</dd>
                  {/* <dd>{action.usage_limits}</dd> */}
                  {/* I commented this out because I can't find a usage_limits property anywhere in the data files */}
                </dl>
              ))}
            {creature.actions.some(
              (actionType) => actionType.action_type == "LAIR_ACTION"
            ) ? (
              <h3 id="actions">Lair Actions</h3>
            ) : null}
            {creature.actions
              .filter((action) => action.action_type == "LAIR_ACTION")
              .map((action) => (
                <dl>
                  <dt>
                    <strong>{action.name}</strong>
                  </dt>
                  <dd>{action.desc}</dd>
                  <dd>{action.legendary_action_cost}</dd>
                </dl>
              ))}
            {creature.actions.some(
              (actionType) => actionType.action_type == "REACTION"
            ) ? (
              <h3 id="actions">Reactions</h3>
            ) : null}
            {creature.actions
              .filter((action) => action.action_type == "REACTION")
              .map((action) => (
                <dl>
                  <dt>
                    <strong>{action.name}</strong>
                  </dt>
                  <dd>{action.desc}</dd>
                  <dd>{action.legendary_action_cost}</dd>
                </dl>
              ))}
            {creature.actions.some(
              (actionType) => actionType.action_type == "ACTION"
            ) ? (
              <h3 id="actions">Actions</h3>
            ) : null}
            {creature.actions
              .filter((action) => action.action_type == "ACTION")
              .map((action) => (
                <dl>
                  <dt>
                    <strong>{action.name}</strong>
                  </dt>
                  <dd>{action.desc}</dd>
                  <dd>{action.legendary_action_cost}</dd>
                </dl>
              ))}
            {creature.actions.some(
              (actionType) => actionType.action_type == "BONUS_ACTION"
            ) ? (
              <h3 id="actions">Bonus Actions</h3>
            ) : null}
            {creature.actions
              .filter((action) => action.action_type == "BONUS_ACTION")
              .map((action) => (
                <dl>
                  <dt>
                    <strong>{action.name}</strong>
                  </dt>
                  <dd>{action.desc}</dd>
                  <dd>{action.legendary_action_cost}</dd>
                </dl>
              ))}
          </div>
          <a className="artist" href={creature.document.permalink}>
            {creature.document.publisher.name}
          </a>
        </div>
      </div>
      <div className="footnote">
        <p className="">{creature.document.display_name}</p>
      </div>
      <div className="pageNumber auto"></div>
    </HandbookPage>
  );
}
