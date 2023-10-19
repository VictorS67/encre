/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "./jest.env.cjs",
  modulePathIgnorePatterns: ["build/"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    // "^.+\\.jsx?$": "babel-jest",
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!camelcase|decamelize|nanoid)",
    "./scripts/jest-setup-after-env.js",
  ],
};
