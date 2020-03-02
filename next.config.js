/* eslint-disable */
const webpack = require("webpack");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const withSass = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: false
});

module.exports = withBundleAnalyzer(
  withCSS(
    withSass({
      experimental: {
        polyfillsOptimization: true
      },
      env: {
        DEV: process.env.NODE_ENV === "development",
        BACKEND_URL:
          "https://ua83pq8w.apicdn.sanity.io/v1/graphql/production/default"
      },
      webpack: config => {
        config.node = {
          fs: "empty"
        };
        config.optimization.minimizer = [];
        config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));

        return config;
      }
    })
  )
);
