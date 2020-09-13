const facemesh = require("@tensorflow-models/facemesh");
const tensorflow = require("@tensorflow/tfjs-core");
require("@tensorflow/tfjs-backend-wasm");

async function getModel({ backend, maxFaces }) {
  await tensorflow.setBackend(backend);
  return await facemesh.load({ maxFaces });
}

module.exports = { facemesh, tensorflow, getModel };
