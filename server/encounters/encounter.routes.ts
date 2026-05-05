import { Router } from "express";
import * as repo from "./encounter.repo";
import { getSnapshot } from "./encounter.service";

export const encounterRoutes = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Encounter:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - status
 *         - roundNumber
 *         - createdAt
 *       properties:
 *         id:
 *           type: string
 *           example: enc_seed_goblin_ambush
 *         name:
 *           type: string
 *           example: Goblin Ambush
 *         status:
 *           type: string
 *           enum:
 *             - setup
 *             - running
 *             - paused
 *             - completed
 *           example: setup
 *         roundNumber:
 *           type: integer
 *           example: 1
 *         activeTurnIndex:
 *           type: integer
 *           example: 0
 *         version:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Combatant:
 *       type: object
 *       required:
 *         - id
 *         - encounterId
 *         - kind
 *         - displayName
 *         - initiative
 *         - initiativeOrder
 *         - currentHp
 *         - maxHp
 *         - conditions
 *         - isDefeated
 *       properties:
 *         id:
 *           type: string
 *           example: cmb_seed_goblin_1
 *         encounterId:
 *           type: string
 *           example: enc_seed_goblin_ambush
 *         kind:
 *           type: string
 *           enum:
 *             - player
 *             - enemy
 *             - npc
 *           example: enemy
 *         displayName:
 *           type: string
 *           example: Goblin Scout
 *         initiative:
 *           type: integer
 *           example: 14
 *         initiativeOrder:
 *           type: integer
 *           example: 2
 *         currentHp:
 *           type: integer
 *           example: 7
 *         maxHp:
 *           type: integer
 *           example: 7
 *         armorClass:
 *           type: integer
 *           nullable: true
 *           example: 13
 *         attackBonus:
 *           type: integer
 *           nullable: true
 *           example: 4
 *         conditions:
 *           type: array
 *           items:
 *             type: string
 *           example: []
 *         isDefeated:
 *           type: boolean
 *           example: false
 *     EncounterSnapshot:
 *       type: object
 *       required:
 *         - encounter
 *         - combatants
 *       properties:
 *         encounter:
 *           $ref: "#/components/schemas/Encounter"
 *         combatants:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Combatant"
 *     CreateEncounterRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Goblin Ambush
 *     AddCombatantRequest:
 *       type: object
 *       required:
 *         - kind
 *         - displayName
 *         - currentHp
 *         - maxHp
 *       properties:
 *         kind:
 *           type: string
 *           enum:
 *             - player
 *             - enemy
 *             - npc
 *           example: enemy
 *         displayName:
 *           type: string
 *           example: Goblin Scout
 *         initiative:
 *           type: integer
 *           example: 14
 *         currentHp:
 *           type: integer
 *           example: 7
 *         maxHp:
 *           type: integer
 *           example: 7
 */

/**
 * @openapi
 * /api/encounters:
 *   post:
 *     summary: Create an encounter
 *     tags:
 *       - Encounters
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateEncounterRequest"
 *     responses:
 *       "201":
 *         description: Encounter created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Encounter"
 */
// Start a new encounter in setup state.
encounterRoutes.post("/", (req, res) => {
  const encounter = repo.createEncounter(req.body.name ?? "Untitled Encounter");
  res.status(201).json(encounter);
});
/**
 * @openapi
 * /api/encounters:
 *   get:
 *     summary: List encounters
 *     tags:
 *       - Encounters
 *     responses:
 *       "200":
 *         description: Encounter list.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Encounter"
 */
encounterRoutes.get("/", (_req, res) => {
  res.json(repo.listEncounters());
});

/**
 * @openapi
 * /api/encounters/{encounterId}/state:
 *   get:
 *     summary: Get encounter state
 *     tags:
 *       - Encounters
 *     parameters:
 *       - in: path
 *         name: encounterId
 *         required: true
 *         schema:
 *           type: string
 *         example: enc_seed_goblin_ambush
 *     responses:
 *       "200":
 *         description: Encounter snapshot with combatants.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EncounterSnapshot"
 *       "500":
 *         description: Encounter was not found.
 */
// Return the current encounter and its combatants for initial page load.
encounterRoutes.get("/:encounterId/state", (req, res) => {
  res.json(getSnapshot(req.params.encounterId));
});

/**
 * @openapi
 * /api/encounters/{encounterId}/combatants:
 *   post:
 *     summary: Add a combatant to an encounter
 *     tags:
 *       - Encounters
 *     parameters:
 *       - in: path
 *         name: encounterId
 *         required: true
 *         schema:
 *           type: string
 *         example: enc_seed_goblin_ambush
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AddCombatantRequest"
 *     responses:
 *       "201":
 *         description: Combatant added.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Combatant"
 */
// Add a player, enemy, or NPC combatant to an encounter.
encounterRoutes.post("/:encounterId/combatants", (req, res) => {
  const combatant = repo.addCombatant({
    encounterId: req.params.encounterId,
    kind: req.body.kind,
    displayName: req.body.displayName,
    initiative: req.body.initiative,
    currentHp: req.body.currentHp,
    maxHp: req.body.maxHp,
  });

  res.status(201).json(combatant);
});
