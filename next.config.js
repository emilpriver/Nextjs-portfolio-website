/* eslint-disable */
const { parsed: localEnv } = require("dotenv").config();
const webpack = require("webpack");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const withSass = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");

module.exports = withCSS(
  withSass({
    env: {},
    target: "serverless",
    webpack: config => {
      config.node = {
        fs: "empty"
      };
      config.optimization.minimizer = [];
      config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));
      config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
      return config;
    }
  })
);
