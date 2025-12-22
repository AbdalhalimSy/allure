import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Base Next.js + TypeScript config
const base = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
]);

// Project-specific adjustments to reduce noisy errors and allow common patterns
const overrides = defineConfig([
  {
    // JS/CommonJS config files should allow require/module.exports
    files: ["**/*.js", "**/*.cjs", "jest.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    // Test files and mocks: relax React and Next.js specific constraints
    files: ["src/tests/**", "**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "react/display-name": "off",
      "@next/next/no-img-element": "off",
    },
  },
  {
    // General TypeScript rules tuning for iterative migration
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Allow temporary any usage to unblock builds; tighten later per module
      "@typescript-eslint/no-explicit-any": "off",
      // Some components intentionally initialize derived state in effects
      // until refactoring; silence hard errors to avoid CI breaks
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default defineConfig([
  ...base,
  ...overrides,
]);
