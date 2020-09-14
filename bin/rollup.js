#!/usr/bin/env node

const path = require("path");
const rollup = require("./modules/rollup");
const config = path.resolve(__dirname, "rollup.config.js");

rollup.events.on("bundle_end", () => {
  console.log("Bundle end !!!");
});

rollup.run(config);
