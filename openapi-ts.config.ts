import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./data/OpenApi.yaml",
  output: "src/modules/open5e/",
  plugins: ["@hey-api/client-axios"],
});
