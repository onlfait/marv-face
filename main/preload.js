const getVideo = require("./getVideo");
const estimateFaces = require("./estimateFaces");
const facemesh = require("@tensorflow-models/facemesh");
const tf = require("@tensorflow/tfjs-core");

require("@tensorflow/tfjs-backend-wasm");

let elements;

const backend = "wasm";
const maxFaces = 1;

document.addEventListener("DOMContentLoaded", async () => {
  await tf.setBackend(backend);
  model = await facemesh.load({ maxFaces });
  elements = await getVideo();
  render();
});

async function render() {
  await estimateFaces(elements, model);
  requestAnimationFrame(render);
}
