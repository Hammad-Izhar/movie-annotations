/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
const config = {
  importOrder: [
    "^@core/(.*)$",
    "",
    "^@server/(.*)$",
    "",
    "^@ui/(.*)$",
    "",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
  plugins: [
    require("prettier-plugin-tailwindcss"),
    require("@ianvs/prettier-plugin-sort-imports"),
  ],
};

module.exports = config;
