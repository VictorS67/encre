/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "./jest.env.cjs",
  setupFilesAfterEnv: ['./jest.global.env.ts'],
  modulePathIgnorePatterns: ["build/"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    // "^.+\\.jsx?$": "babel-jest",
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  transformIgnorePatterns: [
    // "/node_modules/(?!camelcase|decamelize|nanoid|eventemitter3)",
    "./scripts/jest-setup-after-env.js",
  ],
};
