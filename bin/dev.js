#!/usr/bin/env node

const path = require("path");
const chokidar = require("chokidar");
// const rollup = require("./modules/rollup");
const electron = require("./modules/electron");

const watchPattern = "app/main/**/*";
const electronArgs = ["app/main/index.js", "--dev"];
// const rollupConfig = path.resolve(__dirname, "config/rollup.js");

let watchReady = false;

process.argv.push("--dev");

chokidar
  .watch(watchPattern)
  .on("ready", () => {
    watchReady = true;
    electron.launch(electronArgs);
    // rollup.events.once("bundle_end", () => {
    //   electron.launch(electronArgs);
    //   watchReady = true;
    // });
    //
    // rollup.run(rollupConfig);
  })
  .on("all", (eventName, path) => {
    if (!watchReady) return;

    console.log(`[livereload] ${eventName} -> ${path}`);

    if (electron.isLaunched()) electron.exit();
    else electron.launch(electronArgs);
  });
