const { isDev, devTools, mainPath, rendererPath } = require("../config");
const { BrowserWindow } = require("electron");
const storeWindow = require("./storeWindow");
const path = require("path");

let win;

module.exports = function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      devTools,
      nodeIntegration: true,
      preload: path.resolve(mainPath, "preload.js")
    }
  });

  isDev && require("./livereload")({ win, watch: "**/*", cwd: rendererPath });
  win.loadFile(path.resolve(rendererPath, "index.html"));
  devTools && win.webContents.openDevTools();
  storeWindow(win, { name: "marv-face" });

  win.webContents.once("did-finish-load", () => {
    win.show();
  });

  return win;
};
