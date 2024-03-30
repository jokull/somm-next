/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:import/errors",
    "plugin:import/typescript",
  ],
  parserOptions: {
    project: true,
    ecmaFeatures: {
      jsx: true,
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    tsconfigRootDir: __dirname,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "unicorn"],
  rules: {
    // start custom
    "@typescript-eslint/no-confusing-void-expression": "error",
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/ban-ts-comment": [
      1,
      {
        "ts-expect-error": "allow-with-description",
        "ts-ignore": "allow-with-description",
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { fixStyle: "inline-type-imports", prefer: "type-imports" },
    ],
    "import/no-namespace": ["error", { ignore: ["@radix-ui/*"] }],
    "no-console": ["error", { allow: ["warn", "error"] }],

    // start https://github.com/cpojer/eslint-config
    "@typescript-eslint/no-dynamic-delete": 0,
    "@typescript-eslint/no-invalid-void-type": 0,
    "@typescript-eslint/no-namespace": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/require-await": 0,
    "@typescript-eslint/no-unnecessary-condition": 2,
    "array-bracket-spacing": [2, "never"],
    "arrow-parens": [2, "always"],
    "arrow-spacing": 2,
    "brace-style": [
      2,
      "1tbs",
      {
        allowSingleLine: true,
      },
    ],
    curly: 2,
    "eol-last": 2,
    // `import/default` and `import/namespace` are slow.
    "import/default": 0,
    "import/named": 0,
    "import/namespace": 0,
    "import/no-duplicates": 2,
    "import/no-extraneous-dependencies": 2,
    "import/no-named-as-default-member": 0,
    "import/sort": 0,
    "no-const-assign": 2,
    "no-extra-parens": [2, "functions"],
    "no-irregular-whitespace": 2,
    "no-this-before-super": 2,
    "no-unused-expressions": 2,
    "no-unused-labels": 2,
    "no-unused-vars": 0,
    "no-var": 2,
    // https://eslint.org/blog/2022/07/interesting-bugs-caught-by-no-constant-binary-expression/
    "no-constant-binary-expression": 2,
    "object-curly-spacing": 0,
    "object-shorthand": 2,
    "prefer-arrow-callback": [2, { allowNamedFunctions: true }],
    "prefer-const": 2,
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "useIsomorphicLayoutEffect",
      },
    ],
    "react/jsx-sort-props": 0,
    "react/prop-types": 0,
    "react/react-in-jsx-scope": 0,
    "space-before-blocks": 2,
    "space-before-function-paren": [
      2,
      { anonymous: "never", asyncArrow: "always", named: "never" },
    ],
    "unicorn/better-regex": 2,
    "unicorn/catch-error-name": 2,
    "unicorn/consistent-function-scoping": 0,
    "unicorn/no-abusive-eslint-disable": 2,
    "unicorn/no-hex-escape": 2,
    "unicorn/no-typeof-undefined": 2,
    "unicorn/no-useless-promise-resolve-reject": 2,
    "unicorn/no-useless-spread": 2,
    "unicorn/numeric-separators-style": 2,
    "unicorn/prefer-array-flat-map": 2,
    "unicorn/prefer-array-index-of": 2,
    "unicorn/prefer-array-some": 2,
    "unicorn/prefer-at": 2,
    "unicorn/prefer-dom-node-append": 2,
    "unicorn/prefer-native-coercion-functions": 2,
    "unicorn/prefer-node-protocol": 2,
    "unicorn/prefer-number-properties": 2,
    "unicorn/prefer-optional-catch-binding": 2,
    "unicorn/prefer-set-size": 2,
    "unicorn/prefer-string-replace-all": 2,
    "unicorn/prefer-string-slice": 2,
    "unicorn/text-encoding-identifier-case": 2,
    "@next/next/no-img-element": 0,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: ["tsconfig.json"],
      },
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    react: {
      version: "18.2.0",
    },
  },
  ignorePatterns: ["lib/gql"],
};
