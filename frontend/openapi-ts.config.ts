import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:5268/swagger/v1/swagger.json",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "src/generated/client",
  },
  plugins: [
    {
      name: "@hey-api/client-fetch",
      runtimeConfigPath: "./src/hey-api.ts",
    },
  ],
});
