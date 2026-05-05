import swaggerJsdoc from "swagger-jsdoc";

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
  apis: ["server/**/*.routes.ts"],
});
