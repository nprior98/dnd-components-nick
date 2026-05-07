import { useState, type ChangeEvent, Fragment } from "react";
import "./Character.css";
import { addCharacter } from "../../modules/character-api"
import { Character } from "./CharacterInterface";

const STAT_FIELDS = [
	{ id: "armorClass", label: "Armor Class", placeholder: "15" },
	{ id: "initiative", label: "Initiative", placeholder: "2" },
	{ id: "speed", label: "Speed", placeholder: "30" },
	{ id: "maxHP", label: "Max HP", placeholder: "20" },
];

const ATTRIBUTE_FIELDS = [
	"strength",
	"dexterity",
	"constitution",
	"intelligence",
	"wisdom",
	"charisma",
] as const;

/* maybe cast char as Character later or change default fields if addCharacter breaks the hoover dam */

function CharacterCreator() {
	const [char, setChar] = useState({ 
		name: "",
		level: "",
		characterClass: "",
		background: "",
		armorClass: "",
		initiative: "",
		speed: "",
		maxHP: "",
		strength: "",
		dexterity: "",
		constitution: "",
		intelligence: "",
		wisdom: "",
		charisma: "",
	});

	// Returns modifier for attribute values
	const getModifier = (val: string) => {
		if (!val) return "+0";
		const mod = Math.floor((Number(val) - 10) / 2);
		return mod >= 0 ? `+${mod}` : `${mod}`;
	};

	// Handles user inputs
	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		const numValue = Number(value);
		const isNumeric = e.target.inputMode === "numeric";

		if (isNumeric && value !== "") {
			if (isNaN(numValue)) return;
			if (id === "level" && (numValue < 1 || numValue > 20)) return;
			if (
				ATTRIBUTE_FIELDS.includes(id as any) &&
				(numValue < 1 || numValue > 30)
			)
				return;
		}

		setChar((prev) => ({ ...prev, [id]: value }));
	};

	const createCharacter = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Create a new character with a unique ID
		const newCharacter = {
			...char,
			charID: crypto.randomUUID(),
			currentHP: char.maxHP,
		};
		const result = await addCharacter(((newCharacter as unknown) as Character));
		if (result == 201) {
			console.log("Created character:", newCharacter);
		} else if (result == 400) {
			console.error("Data was bad?", newCharacter);
		} else {
			console.error("Yeah I don't know what happened here, but:", newCharacter);
		}
		// const existing = JSON.parse(localStorage.getItem("characters") || "[]");
		// localStorage.setItem(
		// 	"characters",
		// 	JSON.stringify([...existing, newCharacter]),
		// );

		// Reset form
		setChar({
			name: "",
			level: "",
			characterClass: "",
			background: "",
			armorClass: "",
			initiative: "",
			speed: "",
			maxHP: "",
			strength: "",
			dexterity: "",
			constitution: "",
			intelligence: "",
			wisdom: "",
			charisma: "",
		});
	};

	return (
		<form onSubmit={createCharacter}>
			<div className="flex-down">
				<h1>Character Creator</h1>
				<div className="character-info-container">
					<img src="src/gandalf.png" alt="" />
					<div className="character-info">
						<div className="name-container">
							<label htmlFor="name">Name</label>
							<input
								type="text"
								id="name"
								placeholder="Gandalf"
								value={char.name}
								onChange={handleInput}
								required
							/>
						</div>
						<div className="class-row">
							<div>
								<label htmlFor="level">Level</label>
								<input
									type="text"
									inputMode="numeric"
									id="level"
									placeholder="5"
									value={char.level}
									onChange={handleInput}
									required
								/>
							</div>
							<div>
								<label htmlFor="characterClass">Class</label>
								<input
									className="class-input"
									type="text"
									id="characterClass"
									placeholder="Wizard"
									value={char.characterClass}
									onChange={handleInput}
									required
								/>
							</div>
							<div>
								<label htmlFor="background">Background</label>
								<input
									className="class-input"
									type="text"
									id="background"
									placeholder="Sage"
									value={char.background}
									onChange={handleInput}
									required
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="stat-row">
					{STAT_FIELDS.map((field) => (
						<div key={field.id} className="stat-box">
							<label htmlFor={field.id}>{field.label}</label>
							<input
								type="text"
								inputMode="numeric"
								id={field.id}
								placeholder={field.placeholder}
								value={char[field.id as keyof typeof char]}
								onChange={handleInput}
								required
							/>
						</div>
					))}
				</div>

				<div className="attributes-abilities-container">
					<div className="attributes-box">
						<strong>
							<h2>Attributes</h2>
						</strong>
						{ATTRIBUTE_FIELDS.map((attr, index) => (
							<Fragment key={attr}>
								<div>
									<label htmlFor={attr}>
										{attr.charAt(0).toUpperCase() + attr.slice(1)}
									</label>
									<div className="attribute-container">
										<input
											type="text"
											inputMode="numeric"
											id={attr}
											placeholder="10"
											value={char[attr]}
											onChange={handleInput}
											required
										/>
										<p id={`${attr}Modifier`}>({getModifier(char[attr])})</p>
									</div>
								</div>
								{index < ATTRIBUTE_FIELDS.length - 1 && <hr />}
							</Fragment>
						))}
					</div>
					<div>
						<strong>
							<h2>Abilities & Features</h2>
						</strong>
					</div>
				</div>

				<button type="submit" name="submit" id="submit">
					Create Character
				</button>
			</div>
		</form>
	);
}

export default CharacterCreator;
