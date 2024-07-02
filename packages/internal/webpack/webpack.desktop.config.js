const path = require("path");

const webpack = require("webpack");

const browser = require("./webpack.browser.config");

/** @type {webpack.Configuration} */
module.exports = {
  ...browser,
  target: "node",
  devtool: "source-map",
  output: {
    path: path.resolve(path.join(__dirname, "/../lib-dist")),
    filename: "bundle.desktop.js",
    sourceMapFilename: "bundle.desktop.js.map",
    libraryTarget: "commonjs2",
  },
  resolve: {
    extensions: [
      ".electron.js",
      ".electron.ts",
      ".electron.tsx",
      ".js",
      ".ts",
      ".tsx",
      ".json",
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};
