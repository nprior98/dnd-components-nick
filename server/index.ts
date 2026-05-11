import express from "express";
import { createServer } from "node:http";
import { encounterRoutes } from "./encounters/encounter.routes";
import { characterRoutes } from "./characters/character.routes";
import { attachEncounterWebSocket } from "./encounters/encounter.websocket";
import { openApiSpec } from "./openapi";

import swaggerUi from "swagger-ui-express";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

// Parse JSON request bodies before requests reach any API routers.
app.use(express.json());

// Serve swagger documentation
app.get("/api/openapi.json", (_req, res) => {
  res.json(openApiSpec);
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Serve generated AsyncAPI WebSocket documentation.
app.use("/api/async-docs", express.static("dist/asyncapi"));

// API modules
app.use("/api/encounters", encounterRoutes);
app.use("/api/characters", characterRoutes);

const server = createServer(app);

// Attach live encounter updates to the same HTTP server Express uses.
attachEncounterWebSocket(server);

server.listen(3001, () => {
  console.log("API listening on http://localhost:3001");
  console.log("Swagger docs available: http://localhost:3001/api/docs");
  console.log("AsyncAPI docs available: http://localhost:3001/api/async-docs");
});
