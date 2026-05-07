import axios from "axios";
import { useEffect, useState } from "react";
import { Character } from "../../components/playerCharacters/CharacterInterface";

export const BASE_URL = "http://localhost:3001"

const addCharacter = async (newCharacter: Character) => {
    if (!newCharacter) return 400; // guard statement
    const request = axios.post(`${BASE_URL}/api/characters`, newCharacter);
    return (await request).status;
};

export { addCharacter };