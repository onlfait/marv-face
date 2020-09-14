const { app } = require("electron");

process.on("unhandledRejection", reason => {
  console.error(reason);
  app.exit(1);
});
