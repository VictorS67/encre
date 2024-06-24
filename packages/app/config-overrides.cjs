const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    perf_hooks: false,
    child_process: false,
    fs: false,
    tls: false,
    net: false,
    path: require.resolve("path-browserify"),
    util: require.resolve("util/"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    // "stream/web": false,
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
    "process/browser": require.resolve("process/browser"),
    process: require.resolve("process/browser"), // Ensures process is available
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.IgnorePlugin({
      resourceRegExp: /^node:/, // Regular expression to match all node: prefixed modules
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^stream\/web/, // Regular expression to match all node: prefixed modules
    }),
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  // config.resolve.extensions = [".js", ".json", ".jsx", ".mjs"]; // Make sure to include '.mjs' if you're dealing with ES Modules
  return config;
};
