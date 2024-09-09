const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: "hooks.js",
    library: "hooks",
    path: path.resolve(__dirname, "./dist"),
    libraryTarget: "commonjs2",
    globalObject: "this",
  },
  mode: "production",
  devtool: "source-map",
  resolve: {
    extensions: [".json", ".js", ".ts"],
  },
  externals: [
    {
      react: "React",
    },
  ],
};
