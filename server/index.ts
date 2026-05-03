import express from "express";
import http, { createServer } from "node:http";
import { encounterRoutes } from "./encounters/encounter.routes";
import { attachEncounterWebSocket } from "./encounters/encounter.websocket";

const app = express();

app.use(express.json());
app.use("/api/encounters", encounterRoutes);

const server = http.createServer(app);

attachEncounterWebSocket(server);

server.listen(3001, () => {
  console.log("API listening on http://localhost:3001");
});
