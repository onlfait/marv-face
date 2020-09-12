const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      preload: path.resolve(__dirname, "preload.js")
    }
  });

  win.loadFile("renderer/index.html");
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
