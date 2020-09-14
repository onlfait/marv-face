const Store = require("electron-store");
const { app } = require("electron");
const path = require("path");

module.exports = function create({ name, dir = "stores", ...options }) {
  const cwd = path.resolve(app.getPath("userData"), dir);
  return new Store({ ...options, name, cwd });
};
