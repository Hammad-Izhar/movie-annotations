/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss"), require.resolve('@trivago/prettier-plugin-sort-imports')]
};

module.exports = config;
