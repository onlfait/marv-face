const facemesh = require("@tensorflow-models/facemesh");
const tensorflow = require("@tensorflow/tfjs-core");

require("@tensorflow/tfjs-backend-wasm");

async function getModel({ backend = "wasm", maxFaces = 1 } = {}) {
  await tensorflow.setBackend(backend);
  return await facemesh.load({ maxFaces });
}

function getUVCoords() {
  return facemesh.FaceMesh.getUVCoords();
}

module.exports = { facemesh, tensorflow, getModel, getUVCoords };
