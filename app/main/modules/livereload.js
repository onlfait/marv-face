const chokidar = require("chokidar");

module.exports = function livereload({ win, watch, ...options } = {}) {
  let ready = false;
  chokidar
    .watch(watch, options)
    .on("ready", () => (ready = true))
    .on("all", (eventName, path) => {
      if (!ready) return;
      console.log(`[livereload] ${eventName} -> ${path}`);
      win.webContents.reloadIgnoringCache();
    });
};
