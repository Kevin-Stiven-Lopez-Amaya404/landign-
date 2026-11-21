// npm run lint: ESLint con las reglas recomendadas, sin reglas de estilo (no reformatea nada).
import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["_site/**", "_site-ejemplo/**", ".cache-ejemplo/**", "node_modules/**", "assets/js/vendor/**", "docs/**"] },
  js.configs.recommended,
  {
    files: ["assets/js/**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "module", globals: { ...globals.browser } }
  },
  {
    files: ["assets/js/arranque.js", "assets/js/seasonal.js"],
    languageOptions: { sourceType: "script" }
  },
  {
    files: ["**/*.mjs", "api/**/*.mjs"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: { ...globals.node } }
  },
  {
    files: ["src/_data/*.js", "src/**/*.11tydata.js"],
    languageOptions: { sourceType: "commonjs", globals: { ...globals.node } }
  },
  {
    files: ["test/e2e/**/*.cjs", "playwright.config.cjs"],
    languageOptions: { sourceType: "commonjs", globals: { ...globals.node, ...globals.browser } }
  },
  { rules: { "no-unused-vars": ["error", { args: "none", caughtErrors: "none" }] } }
];
