import { Card, CardBody } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./Character.css";
import CharacterGetter from "./CharacterListGetter";
import CharacterCreator from "./CharacterCreator";
import CharacterViewer from "./CharacterViewer";
import type { Character } from "./CharacterInterface";

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
				<main className="character-page">
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
							<CharacterCreator />
						)}
					</div>
				</main>
			</Card.Body>
		</Card>
	);
}

export default CharacterPage;
