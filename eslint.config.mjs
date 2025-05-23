import path from "node:path";
import { fileURLToPath } from "node:url";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

/** @type {import("eslint").Linter.Config[]} */
const cfg = [
  {
    ignores: [
      "**/*.min.*",
      "**/*.user.js",
      "**/*.map",
      "dist/**/*",
      "**/test.ts",
    ],
  }, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ), {
    files: ["**/*.ts", "**/*.mts", "**/*.cts"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        GM: "readonly",
        unsafeWindow: "writable",
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unreachable": "off",
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "eol-last": ["error", "always"],
      "no-async-promise-executor": "off",
      "no-cond-assign": "off",
      indent: ["error", 2, {
        ignoredNodes: ["VariableDeclaration[declarations.length=0]"],
      }],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        vars: "local",
        ignoreRestSiblings: true,
        args: "after-used",
        argsIgnorePattern: "^_",
      }],
      "no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": ["error", {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      }],
      "comma-dangle": ["error", "only-multiline"],
      "no-misleading-character-class": "off",
    },
  }, {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "eol-last": ["error", "always"],
      "no-async-promise-executor": "off",
      indent: ["error", 2, {
        ignoredNodes: ["VariableDeclaration[declarations.length=0]"],
      }],
      "no-unused-vars": ["warn", {
        vars: "local",
        ignoreRestSiblings: true,
        args: "after-used",
        argsIgnorePattern: "^_",
      }],
      "comma-dangle": ["error", "only-multiline"],
    },
  },
];

export default cfg;
