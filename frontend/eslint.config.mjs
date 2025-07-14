import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores(["src/generated"]),
  {
    rules: {
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
          },
          groups: [["builtin", "external"], "parent", "sibling", "index"],
          "newlines-between": "always",
        },
      ],
    },
  },
]);

export default eslintConfig;
