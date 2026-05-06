import { Router } from "express";
import * as repo from "./character.repo";

export const characterRoutes = Router();

// Create a character with user inputted stats
characterRoutes.post("/", (req, res) => {
    const character = repo.addCharacter(req.body.name ?? "Unnamed Character");
    res.status(201).json(character);
});

// View a specific character
characterRoutes.get("/:characterId", (req, res) => {
    res.json(repo.getCharacter(req.params.characterId));
})

// List all characters
characterRoutes.get("/", (_req, res) => {
    res.json(repo.listCharacters());
});



