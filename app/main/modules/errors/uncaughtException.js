const { app } = require("electron");

process.on("uncaughtException", (err, origin) => {
  // console.error(err, origin);
  app.exit(1);
});
