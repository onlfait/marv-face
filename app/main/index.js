const { app } = require("electron");

require("./modules/errors/uncaughtException");
require("./modules/errors/unhandledRejection");

app.whenReady().then(require("./modules/window/create"));
