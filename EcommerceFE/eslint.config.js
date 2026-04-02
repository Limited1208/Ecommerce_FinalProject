import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  {
    ignores: ["dist", "node_modules"],
  },

  {
    files: ["**/*.{js,jsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },

    rules: {
      /* Base */
      ...js.configs.recommended.rules,

      /* React */
      ...react.configs.recommended.rules,

      /* Hooks */
      ...reactHooks.configs.recommended.rules,

      /* Accessibility */
      ...jsxA11y.configs.recommended.rules,

      /* 🔥 Custom rules (important) */

      // no unused vars (ignore _ prefix)
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // React 17+ không cần import React
      "react/react-in-jsx-scope": "off",

      // PropTypes off (nếu dùng TS hoặc không cần)
      "react/prop-types": "off",

      // Fix annoying warning
      "react/no-unknown-property": "off",

      // Hooks strict
      "react-hooks/exhaustive-deps": "warn",

      // Fast refresh safe
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      /* Style rules */

      "no-console": ["warn", { allow: ["warn", "error"] }],

      "no-debugger": "warn",

      "eqeqeq": ["error", "always"],

      "curly": ["error", "all"],

      /* Optional but good */

      "prefer-const": "error",

      "no-var": "error",
    },
  },
];