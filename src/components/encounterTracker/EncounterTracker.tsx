import React, { useState } from "react";
import "../../styles/Tracker.css";

// Custom type for members of combat to hold specific values needed
type Combatant = {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  strength: number;
  dexterity: number;
  attack: number;
  portrait: string;
  type: "player" | "enemy";
};

// Temp lists, will replace these with imports of player saves and enemies later

// List for the players
const players: Combatant[] = [
  {
    id: "Big Lug",
    name: "Barbarian",
    initiative: 15,
    hp: 40,
    maxHp: 40,
    strength: 16,
    dexterity: 8,
    attack: 3,
    portrait: "",
    type: "player",
  },
  {
    id: "Tiny Lug",
    name: "Wizard",
    initiative: 11,
    hp: 10,
    maxHp: 12,
    strength: 8,
    dexterity: 12,
    attack: 2,
    portrait: "",
    type: "player",
  },
];

//List for the monsters
const monsters: Combatant[] = [
  {
    id: "Gleeb",
    name: "Goblin",
    initiative: 15,
    hp: 10,
    maxHp: 10,
    strength: 14,
    dexterity: 8,
    attack: 1,
    portrait: "",
    type: "enemy",
  },
  {
    id: "Fleeb",
    name: "Goblin",
    initiative: 14,
    hp: 11,
    maxHp: 11,
    strength: 14,
    dexterity: 8,
    attack: 2,
    portrait: "",
    type: "enemy",
  },
];

// Main function
function EncounterTracker() {
  // Creates and sorts a list of combatants
  const allCombatants = [...players, ...monsters];
  const sorComb = allCombatants.sort((a, b) => {
    return b.initiative - a.initiative;
  });
  const [combatants, setCombatants] = useState<Combatant[]>(sorComb);

  // Sets the current turn
  const [curIndex, setCurrentIndex] = useState(0);

  // Sets the current attacker to null
  const [selAttId, setSelectedAttackerId] = useState<string | null>(null);

  const currentCombatant = combatants[curIndex];
  const selectedAttacker = combatants.find((c) => c.id == selAttId);

  // Function to change turn
  const nextTurn = () => {
    // Changes turn, unless at the end of turn order at which will reset
    setCurrentIndex((prev) => {
      if (prev + 1 >= combatants.length) {
        return 0;
      } else {
        return prev + 1;
      }
    });
    setSelectedAttackerId(null);
  };

  //Function that actually performs the attack
  const performAttack = (targetId: string) => {
    if (!selectedAttacker) return;

    const target = combatants.find((c) => c.id == targetId);

    // Prevent attacking if either the attacker or victim is dead
    if (!target || target.hp <= 0 || selectedAttacker.hp <= 0) return;

    setCombatants((prev) =>
      prev.map((c) =>
        c.id === targetId
          ? { ...c, hp: Math.max(0, c.hp - selectedAttacker.attack) }
          : c
      )
    );

    setSelectedAttackerId(null);
  };

  const startAttack = () => {
    if (!currentCombatant || currentCombatant.hp == 0) return;
    setSelectedAttackerId(currentCombatant.id);
  };

  // Renders a list of entities in the encounter
  const renderList = (type: "player" | "enemy") => {
    return combatants
      .filter((c) => c.type === type)
      .map((c) => {
        const isActive = c.id === currentCombatant.id;
        const isSelected = c.id === selAttId;
        const isDead = c.hp <= 0;
        const canSelect = isActive && !isDead;
        const canAttack =
          selAttId === currentCombatant.id &&
          c.id !== currentCombatant.id &&
          !isDead &&
          currentCombatant.hp > 0;

        return (
          <div
            key={c.id}
            className={`combatant 
                            ${isActive ? "active" : ""} 
                            ${isSelected ? "selected" : ""} 
                            ${isDead ? "dead" : ""}`}
          >
            <div className="info">
              <div className="name">{c.id}</div>
              <div>{c.name}</div>
              <div>Initiative: {c.initiative}</div>
              <div>
                HP: {c.hp} / {c.maxHp}
              </div>
              <div>ATK: {c.attack}</div>
            </div>

            {canAttack && (
              <button onClick={() => performAttack(c.id)}>Attack</button>
            )}

            {isActive && <div>Current Turn</div>}
            {isDead && <div>Dead</div>}
          </div>
        );
      });
  };

  //Encounter tracker renderer

  return (
    <div className="encountertracker">
      <div className="tracker-sidebar">
        <h3>Actions</h3>

        <br />

        <button className="next-turn-btn" onClick={nextTurn}>
          Next Turn
        </button>

        <div className="action-status">
          {currentCombatant.hp <= 0 ? (
            <div className="dead-status">⚠️ Cannot act (Dead)</div>
          ) : (
            <>
              <div>
                Acting:{" "}
                <span className="acting-label">{currentCombatant.id}</span>
              </div>
              <button onClick={startAttack}>Attack</button>
            </>
          )}
        </div>
      </div>

      <div className="combatArea">
        <h2>Encounter Tracker</h2>

        <div className="combatList">
          <div className="playerList">
            <h3>Players</h3>
            <br />
            {renderList("player")}
          </div>

          <div className="monsterList">
            <h3>Monsters</h3>
            <br />
            {renderList("enemy")}
          </div>
        </div>
      </div>

      <br />
    </div>
  );
}

export default EncounterTracker;
