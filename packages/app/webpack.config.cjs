const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist", "renderer"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/, // This rule will apply to any files ending in .css
        use: ["style-loader", "css-loader"], // Use these loaders for .css files
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Path to your original index.html
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  target: "electron-renderer",
};
