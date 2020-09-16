const tensorflow = require("@tensorflow/tfjs-core");

let loaded = false;

async function load(backend = "webgl") {
  if (loaded) return;

  require("@tensorflow/tfjs-backend-cpu");

  if (backend === "wasm") {
    require("@tensorflow/tfjs-backend-wasm");
  } else {
    require("@tensorflow/tfjs-backend-webgl");
  }

  await tensorflow.setBackend(backend);
  loaded = true;
}

module.exports = load;
