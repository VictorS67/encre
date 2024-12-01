const path = require("path");

const webpack = require("webpack");

/** @type {webpack.Configuration} */
module.exports = {
  mode: process.env.NODE_ENV === "development" ? "development" : "production",
  entry: path.join(__dirname, "../src/server/main.ts"),
  context: path.resolve(__dirname, "../../.."),
  devtool: false,
  output: {
    path: path.resolve(path.join(__dirname, "/../lib-dist/browser")),
    library: "backend",
    publicPath: "/kcab/",
  },
  stats: {
    errorDetails: true,
  },
  externals: {
    "node:fs/promises": "commonjs2 node:fs/promises",
  },
  resolve: {
    extensions: [
      ".web.js",
      ".web.ts",
      ".web.tsx",
      ".js",
      ".ts",
      ".tsx",
      ".json",
    ],
    fallback: {
      assert: require.resolve("assert/"),
      http: false,
      https: require.resolve("https-browserify"),
      perf_hooks: false,
      buffer: require.resolve("buffer/"),
      crypto: false,
      fs: require.resolve("memfs"),
      net: false,
      path: require.resolve("path-browserify"),
      process: require.resolve("process/browser"),
      stream: require.resolve("stream-browserify"),
      url: false,
      zlib: require.resolve("browserify-zlib"),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?[tj]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
        },
      },
    ],
    noParse: [require.resolve("typescript/lib/typescript.js")],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": "{}",
      "process.env.IS_DEV": JSON.stringify(
        process.env.NODE_ENV === "development"
      ),
      "process.env.PUBLIC_URL": JSON.stringify(process.env.PUBLIC_URL || "/"),
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ],
};
