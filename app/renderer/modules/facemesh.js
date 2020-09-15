const facemesh = require("@tensorflow-models/facemesh");
const tensorflow = require("@tensorflow/tfjs-core");

async function getModel({ backend = "webgl", maxFaces = 1 } = {}) {
  if (backend === "wasm") {
    require("@tensorflow/tfjs-backend-wasm");
  } else {
    require("@tensorflow/tfjs-backend-webgl");
  }
  await tensorflow.setBackend(backend);
  return await facemesh.load({ maxFaces });
}

function getUVCoords() {
  return facemesh.FaceMesh.getUVCoords();
}

module.exports = { facemesh, tensorflow, getModel, getUVCoords };
