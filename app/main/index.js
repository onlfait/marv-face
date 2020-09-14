const { app } = require("electron");

require("./modules/errors/uncaughtException");
require("./modules/errors/unhandledRejection");

const createWindow = require("./modules/window/create");

app.whenReady().then(createWindow);
