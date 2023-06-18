/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
const config = {
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
  importOrder: [
    "<TYPES>",
    "",
    "react",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@movies/(.*)$",
  ],
  plugins: [
    require("prettier-plugin-tailwindcss"),
    require("@ianvs/prettier-plugin-sort-imports"),
  ],
};

module.exports = config;
