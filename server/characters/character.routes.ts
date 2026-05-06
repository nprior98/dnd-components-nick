import { Router } from "express";
import * as repo from "./character.repo";

export const characterRoutes = Router();

// Creating a character
characterRoutes.post("/", (req, res) => {
    const character = repo.addCharacter(req.body.name ?? "Unnamed Character");
    res.status(201).json(character);
});

// View a specific character
// characterRoutes.get("/:characterId", (req, res) => {
//     const character = repo.json(getCharacter(req.params.characterId));
// })

// Listing all characters
// characterRoutes.get("/", (_req, res) => {
//     res.json(repo.listCharacters());
// });



