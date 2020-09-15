import * as facemesh from "@tensorflow-models/facemesh";
// import tensorflow from "@tensorflow/tfjs-core";
//
// import "@tensorflow/tfjs-backend-wasm";

console.log(facemesh);

export async function getModel({ backend = "wasm", maxFaces = 1 } = {}) {
  // await tensorflow.setBackend(backend);
  // return await facemesh.load({ maxFaces });
}

export function getUVCoords() {
  return facemesh.FaceMesh.getUVCoords();
}
