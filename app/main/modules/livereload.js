const { app, BrowserWindow } = require("electron");
const chokidar = require("chokidar");

process.on("message", message => {
  if (message.type === "exit") {
    app.exit(parseInt(message.code));
  }
});

module.exports = function livereload({ win, watch, ...options } = {}) {
  let ready = false;

  chokidar
    .watch(watch, options)
    .on("ready", () => (ready = true))
    .on("all", (eventName, path) => {
      if (!ready) return;
      console.log(`[livereload] ${eventName} -> ${path}`);
      console.log(`[livereload] ↻ Window #${win.id}`, win.getTitle());
      win.webContents.reloadIgnoringCache();
    });
};
