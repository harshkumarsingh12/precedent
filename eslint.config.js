import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/node_modules/**", "**/dist/**", "reports/**", ".forge/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { process: "readonly", console: "readonly", URL: "readonly" },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    // Unbuilt acceptance criteria go through ledger() so CI can attribute them to an owner.
    files: ["**/*.test.ts"],
    ignores: ["test/ledger.ts"],
    rules: {
      "no-restricted-properties": [
        "error",
        { object: "test", property: "fails", message: "Use ledger() from test/ledger.ts." },
        { object: "it", property: "fails", message: "Use ledger() from test/ledger.ts." },
      ],
    },
  },
);
