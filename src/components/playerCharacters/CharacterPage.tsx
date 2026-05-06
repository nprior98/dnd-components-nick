import { Card, CardBody } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./Character.css";
import CharacterGetter from "./CharacterListGetter";
import CharacterCreator from "./CharacterCreator";
import CharacterViewer from "./CharacterViewer";
import type { Character } from "./CharacterInterface";

export interface Character {
  charID: string;
  name: string;
  level: string;
  characterClass: string;
  background: string;
  armorClass: string;
  initiative: string;
  speed: string;
  maxHP: number;
  currentHP: number;
  strength: string;
  dexterity: string;
  constitution: string;
  intelligence: string;
  wisdom: string;
  charisma: string;
}

function CharacterPage() {
  const [selectedCharID, setSelectedCharID] = useState<string | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  const loadCharacters = () => {
    const stored = localStorage.getItem("characters");
    if (stored) {
      setCharacters(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  return (
    <Card className="mb-4">
      <Card.Body>
        <main className="page-layout">
          <div className="character-selector">
            <ul>
              <CharacterGetter
                characters={characters}
                onSelectCharacter={setSelectedCharID}
              />
              <button
                id="createCharacterTab"
                onClick={() => setSelectedCharID(null)}
              >
                Create Character
              </button>
            </ul>
          </div>
          <div className="character-viewer">
            {selectedCharID ? (
              <CharacterViewer requestedCharacterID={selectedCharID} />
            ) : (
              <CharacterCreator onCharacterCreated={loadCharacters} />
            )}
          </div>
        </main>
      </Card.Body>
    </Card>
  );
}

export default CharacterPage;
