import { useState, useEffect } from "react";
import type { Character } from "./CharacterInterface";

interface CharacterViewerProps {
	requestedCharacterID: string;
}

function CharacterViewer({ requestedCharacterID }: CharacterViewerProps) {
	const [characters, setCharacters] = useState<Character[]>([]);

	// Get characters from local storage
	useEffect(() => {
		const storedCharacters = localStorage.getItem("characters");
		if (storedCharacters) {
			setCharacters(JSON.parse(storedCharacters));
		}
	}, [requestedCharacterID]);

	// Find the requested character
	const char = characters.find((c) => c.charID === requestedCharacterID);

	// If the character isn't found, return an error message
	if (!char) {
		return <div>Character not found.</div>;
	}

	// Returns modifier for attribute values
	const getModifier = (val: string) => {
		if (!val) return "+0";
		const mod = Math.floor((Number(val) - 10) / 2);
		return mod >= 0 ? `+${mod}` : `${mod}`;
	};

	return (
		<div className="flex-down">
			<div className="character-info-container">
				{/* <img src="src/gandalf.png" alt="" /> */}
				<div className="character-info">
					<div className="name-container">
						<h1>{char.name}</h1>
					</div>
					<div>
						<p>Level: {char.level}</p>
						<p>Class: {char.characterClass}</p>
						<p>Background: {char.background}</p>
					</div>
				</div>
			</div>
			<div className="stat-row">
				<div className="stat-box">
					<label htmlFor="AC">Armor Class</label>
					<p id="AC">
						<strong>{char.armorClass}</strong>
					</p>
				</div>
				<div className="stat-box">
					<label htmlFor="initiative">Initiative</label>
					<p id="initiative">
						<strong>+{char.initiative}</strong>
					</p>
				</div>
				<div className="stat-box">
					<label htmlFor="speed">Speed</label>
					<p id="speed">
						<strong>{char.speed}ft</strong>
					</p>
				</div>
				<div className="stat-box">
					<label htmlFor="HP">HP</label>
					<p id="HP">
						<strong>
							{char.maxHP}/{char.maxHP}
						</strong>
					</p>
				</div>
			</div>
			<div className="attributes-abilities-container">
				<div className="attributes-box">
					<strong>
						<h2>Attributes</h2>
					</strong>
					<div>
						<label htmlFor="strength">Strength</label>
						<div className="attribute-container">
							<p id="strength">{char.strength}</p>
							<p>&nbsp;({getModifier(char["strength"])})</p>
						</div>
					</div>
					<hr />
					<div>
						<label htmlFor="dexterity">Dexterity</label>
						<div className="attribute-container">
							<p id="dexterity">{char.dexterity}</p>
							<p>&nbsp;({getModifier(char["dexterity"])})</p>
						</div>
					</div>
					<hr />
					<div>
						<label htmlFor="constitution">Constitution</label>
						<div className="attribute-container">
							<p id="constitution">{char.constitution}</p>
							<p>&nbsp;({getModifier(char["constitution"])})</p>
						</div>
					</div>
					<hr />
					<div>
						<label htmlFor="intelligence">Intelligence</label>
						<div className="attribute-container">
							<p id="intelligence">{char.intelligence}</p>
							<p>&nbsp;({getModifier(char["intelligence"])})</p>
						</div>
					</div>
					<hr />
					<div>
						<label htmlFor="wisdom">Wisdom</label>
						<div className="attribute-container">
							<p id="wisdom">{char.wisdom}</p>
							<p>&nbsp;({getModifier(char["wisdom"])})</p>
						</div>
					</div>
					<hr />
					<div>
						<label htmlFor="charisma">Charisma</label>
						<div className="attribute-container">
							<p id="charisma">{char.charisma}</p>
							<p>&nbsp;({getModifier(char["charisma"])})</p>
						</div>
					</div>
				</div>
				<div>
					<strong>
						<h2>Abilities & Features</h2>
					</strong>
				</div>
			</div>
		</div>
	);
}

export default CharacterViewer;
