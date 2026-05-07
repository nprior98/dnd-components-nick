import fs from "node:fs";
import swaggerJsdoc from "swagger-jsdoc";

const routeApiGlobs = fs.existsSync("build/server")
  ? ["build/server/**/*.routes.js"]
  : ["server/**/*.routes.ts"];

export const openApiSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Encounter API",
      version: "0.1.0",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Local development server",
      },
    ],
  },
  apis: routeApiGlobs,
});
