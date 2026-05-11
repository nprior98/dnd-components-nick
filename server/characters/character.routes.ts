import { Router } from "express";
import * as repo from "./character.repo";

export const characterRoutes = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Character:
 *       type: object
 *       required:
 *         - characterId
 *         - name
 *         - level
 *         - characterClass
 *         - background
 *         - armorClass
 *         - initiative
 *         - speed
 *         - maxHp
 *         - strength
 *         - dexterity
 *         - constitution
 *         - intelligence
 *         - wisdom
 *         - charisma
 *       properties:
 *         characterId:
 *           type: string
 *           example: pc_aria
 *         name:
 *           type: string
 *           example: Aria
 *         level:
 *           type: integer
 *           example: 3
 *         characterClass:
 *           type: string
 *           example: Fighter
 *         background:
 *           type: string
 *           example: Soldier
 *         armorClass:
 *           type: integer
 *           example: 16
 *         initiative:
 *           type: integer
 *           example: 2
 *         speed:
 *           type: integer
 *           example: 30
 *         maxHp:
 *           type: integer
 *           example: 28
 *         strength:
 *           type: integer
 *           example: 16
 *         dexterity:
 *           type: integer
 *           example: 14
 *         constitution:
 *           type: integer
 *           example: 15
 *         intelligence:
 *           type: integer
 *           example: 10
 *         wisdom:
 *           type: integer
 *           example: 12
 *         charisma:
 *           type: integer
 *           example: 8
 *     CreateCharacterRequest:
 *       type: object
 *       required:
 *         - characterId
 *         - name
 *         - level
 *         - characterClass
 *         - background
 *         - armorClass
 *         - initiative
 *         - speed
 *         - maxHp
 *         - strength
 *         - dexterity
 *         - constitution
 *         - intelligence
 *         - wisdom
 *         - charisma
 *       properties:
 *         characterId:
 *           type: string
 *           example: pc_aria
 *         name:
 *           type: string
 *           example: Aria
 *         level:
 *           type: integer
 *           example: 3
 *         characterClass:
 *           type: string
 *           example: Fighter
 *         background:
 *           type: string
 *           example: Soldier
 *         armorClass:
 *           type: integer
 *           example: 16
 *         initiative:
 *           type: integer
 *           example: 2
 *         speed:
 *           type: integer
 *           example: 30
 *         maxHp:
 *           type: integer
 *           example: 28
 *         strength:
 *           type: integer
 *           example: 16
 *         dexterity:
 *           type: integer
 *           example: 14
 *         constitution:
 *           type: integer
 *           example: 15
 *         intelligence:
 *           type: integer
 *           example: 10
 *         wisdom:
 *           type: integer
 *           example: 12
 *         charisma:
 *           type: integer
 *           example: 8
 */

/**
 * @openapi
 * /api/characters:
 *   post:
 *     summary: Create a character
 *     tags:
 *       - Characters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateCharacterRequest"
 *     responses:
 *       "201":
 *         description: Character created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Character"
 */
// Create a character with user inputted stats
characterRoutes.post("/", (req, res) => {
  const character = repo.addCharacter(req.body);
  res.status(201).json(character);
});

/**
 * @openapi
 * /api/characters/{characterId}:
 *   get:
 *     summary: Get a character
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: path
 *         name: characterId
 *         required: true
 *         schema:
 *           type: string
 *         example: char_123
 *     responses:
 *       "200":
 *         description: Character, if found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Character"
 */
// View a specific character
characterRoutes.get("/:characterId", (req, res) => {
  res.status(200).json(repo.getCharacter(req.params.characterId));
});

/**
 * @openapi
 * /api/characters:
 *   get:
 *     summary: List characters
 *     tags:
 *       - Characters
 *     responses:
 *       "200":
 *         description: Character list.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Character"
 */
// List all characters
characterRoutes.get("/", (_req, res) => {
  res.status(200).json(repo.listCharacters());
});

// Delete a specific character
// Not implemented in webapp
characterRoutes.delete("/:characterId", (req, res) => {
  repo.deleteCharacter(req.params.characterId);
  res.status(204)
})
