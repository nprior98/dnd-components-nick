import axios from "axios";
import { useEffect, useState } from "react";
import { Character } from "../../components/playerCharacters/CharacterInterface";

export const BASE_URL = "http://localhost:3001/api/characters"

async function addCharacter(newCharacter: Character) {
    if (!newCharacter) return 400; // guard statement
    const response = axios.post(`${BASE_URL}/`, newCharacter);
    return (await response).status;
};

async function listCharacters() {
    const response = await axios.get(`${BASE_URL}/`);
	return response.data as Character[];
}

export { addCharacter, listCharacters };