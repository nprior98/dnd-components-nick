import { defineConfig } from "@hey-api/openapi-ts";
import { openApiSpec } from "./server/openapi";

export default defineConfig({
  input: openApiSpec,
  output: "src/modules/encounter-api/",
});
