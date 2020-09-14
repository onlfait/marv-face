const { app } = require("electron");
const createWindow = require("./modules/createWindow");

app.whenReady().then(createWindow);
