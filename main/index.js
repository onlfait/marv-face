const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      preload: path.resolve(__dirname, "preload.js")
    }
  });

  win.loadFile("renderer/index.html");
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
