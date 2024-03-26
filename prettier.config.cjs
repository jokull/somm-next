/**
 * @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions &
 *       import("@ianvs/prettier-plugin-sort-imports").PluginConfig}
 */
const config = {
  tailwindConfig: "tailwind.config.ts",
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "<BUILT_IN_MODULES>",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^~/(.*)$",
    "",
    "^[./]",
  ],
};

module.exports = config;
