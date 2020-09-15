const loadConfigFile = require("rollup/dist/loadConfigFile");
const EventEmitter = require("events");
const rollup = require("rollup");
const path = require("path");

const rootPath = path.resolve(__dirname, "../..");

function cleanPath(input) {
  return path.relative(rootPath, input).replace(/\\/g, "/");
}

const events = new EventEmitter();

events.on("start", () => {
  console.log("[rollup] Rollup is watching...");
});

events.on("bundle_start", ({ input }) => {
  console.log(`[rollup] <= ${input}`);
});

events.on("bundle_end", ({ output, duration }) => {
  output.forEach(item => console.log(`[rollup] => ${cleanPath(item)}`));
  console.log(`[rollup] Bundling took ${duration} ms`);
});

events.on("error", event => {
  console.error("[rollup]", event.error.stack);
});

events.on("end", () => {
  console.log("[rollup] Waiting for change...");
});

function printWarningsCount(w) {
  if (w.count) {
    console.log(`[rollup] We currently have ${w.count} warnings.`);
  }
  w.flush();
}

function rollupWatch(options) {
  rollup.watch(options).on("event", event => {
    events.emit(event.code.toLowerCase(), event);
  });
}

function run(configFile) {
  loadConfigFile(configFile, { format: "es" })
    .then(({ options, warnings }) => {
      printWarningsCount(warnings);
      rollupWatch(options);
    })
    .catch(err => {
      console.error("[rollup] Error:", err.stack);
    });
}

module.exports = { events, run };
