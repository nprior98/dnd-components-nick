import axios from "axios";
import { useEffect, useState } from "react";
import { Character } from "../../components/playerCharacters/CharacterInterface";

export const BASE_URL = "http://localhost:3001/api/characters"

const addCharacter = async (newCharacter: Character) => {
    if (!newCharacter) return 400; // guard statement
    const request = axios.post(`${BASE_URL}/`, newCharacter);
    return (await request).status;
};

const listCharacters = () => {
	const [characters, setCharacters] = useState<Character[]>([]);
	const [error, setError] = useState<unknown>(null);
	const [loading, setLoading] = useState(true);
	
    (async () => {
        try {
            const result = await axios.get(`${BASE_URL}/`);
            setCharacters(result.data);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    })();	

	return { characters, error, loading };
}

export { addCharacter, listCharacters };