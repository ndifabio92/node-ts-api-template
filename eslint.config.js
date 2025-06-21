export default [
  {
    files: ["src/**/*.ts"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      project: "./tsconfig.json",
    },
    plugins: ["@typescript-eslint"],
    extends: [
      "eslint:recommended",
      "@typescript-eslint/recommended",
      "@typescript-eslint/recommended-requiring-type-checking",
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/restrict-plus-operands": "error",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
    env: {
      node: true,
      es6: true,
    },
  },
];
