import type { Character } from "./CharacterInterface";

interface GetterProps {
	characters: Character[];
	onSelectCharacter: (id: string) => void;
}

function CharacterGetter({ characters, onSelectCharacter }: GetterProps) {
	return (
		<>
			{characters.map((char) => (
				<li
					className="character-card"
					key={char.charID}
					onClick={() => onSelectCharacter(char.charID)}>
					{char.name}
				</li>
			))}
		</>
	);
}

export default CharacterGetter;
