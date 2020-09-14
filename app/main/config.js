const path = require("path");

const isDev = process.argv.includes("--dev");
const isDebug = process.argv.includes("--debug");
const devTools = isDev || isDebug;

const appPath = path.resolve(__dirname, "..");
const mainPath = path.resolve(appPath, "main");
const rendererPath = path.resolve(appPath, "renderer");

module.exports = {
  isDev,
  isDebug,
  devTools,
  appPath,
  mainPath,
  rendererPath
};
