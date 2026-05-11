import axios from "axios";
import { Character } from "./types";

export const BASE_URL = "http://localhost:3001/api/characters"

async function addCharacter(newCharacter: Character) {
    const response = await axios.post(`${BASE_URL}/`, newCharacter);
    return response.status;
};

async function listCharacters() {
    const response = await axios.get(`${BASE_URL}/`);
	return response.data as Character[];
};

async function getCharacter(charID: string) {
    const response = await axios.get(`${BASE_URL}/${charID}`);
    return response.data as Character;
};

async function deleteCharacter(charID: string) {
    const response = await axios.delete(`${BASE_URL}/${charID}`);
    return response.status;
}
export { addCharacter, listCharacters, getCharacter, deleteCharacter };