const { app } = require("electron");
const createWindow = require("./modules/window/create");

app.whenReady().then(createWindow);
