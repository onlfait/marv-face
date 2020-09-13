module.exports = callback => {
  const chokidar = require("chokidar");
  const cwd = path.resolve(__dirname, "..");
  const watch = ["./main/**/*", "./renderer**/*"];
  chokidar.watch(watch, { cwd }).on("all", callback);
};
