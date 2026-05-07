import axios from "axios";
import { useEffect, useState } from "react";
import { Character } from "../../components/playerCharacters/CharacterInterface";

const addCharacter = async (newCharacter: Character) => {
    if (!newCharacter) return 400; // guard statement
    const request = axios.post("/api/characters", newCharacter);
    return (await request).status;
};

export { addCharacter };