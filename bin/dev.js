#!/usr/bin/env node
const chokidar = require("chokidar");
const electron = require("./modules/electron");

const watchPattern = "app/main/**/*";
const electronArgs = ["app/main/index.js", "--dev"];

let watchReady = false;

chokidar
  .watch(watchPattern)
  .on("ready", () => {
    electron.launch(electronArgs);
    watchReady = true;
  })
  .on("all", (eventName, path) => {
    if (!watchReady) return;

    console.log(`[livereload] ${eventName} -> ${path}`);

    if (electron.isLaunched()) electron.exit();
    else electron.launch(electronArgs);
  });
