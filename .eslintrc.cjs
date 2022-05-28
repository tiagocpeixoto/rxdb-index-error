const eslintConfig = {
  root: true,
  env: {
    browser: false,
    // es6: true,
    es2020: true,
    node: true,
    "jest/globals": true,
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.eslint.json"],
    extraFileExtensions: [".cjs"],
  },
  plugins: [
    "@typescript-eslint",
    "prettier",
    "jest",
    "jest-formatting",
    "node",
    "promise",
    "import",
    "etc",
  ],
  extends: [
    "standard",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // "prettier/@typescript-eslint",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:jest-formatting/recommended",
    // "plugin:promise/recommended",
    // "plugin:node/recommended",
    // "plugin:import/errors",
    // "plugin:import/warnings",
    // "plugin:import/typescripts",
    // "prettier",
    "plugin:prettier/recommended",
    "plugin:etc/recommended",
  ],
  rules: {
    "prettier/prettier": "warn",
    "jest/no-standalone-expect": "warn",
    "jest/no-conditional-expect": "warn",
    "jest/no-export": "warn",
    "etc/prefer-interface": "error",
    // "etc/no-t": "warn",
    "etc/no-misused-generics": "error",
    "etc/throw-error": "error",
    // "@typescript-eslint/no-var-requires": "warn",
    // note you must disable the base rule as it can report incorrect errors
    "@typescript-eslint/no-use-before-define": "off",
    // "@typescript-eslint/no-unused-vars": "off",
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "parent", "sibling", "index"],
        // "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "no-use-before-define": "off",
    eqeqeq: "warn",
  },
  overrides: [
    {
      files: ["**/*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
  ignorePatterns: ["**/*.snap", "node_modules/"],
};

// export default eslintConfig;
module.exports = eslintConfig;
