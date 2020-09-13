const { getModel } = require("./facemesh");
const { getVideo } = require("./getVideo");
const { getScene } = require("./getScene");

const videoConfig = { height: 400 };
const modelConfig = { backend: "wasm", maxFaces: 1 };
const maxPoints = 486;

let video;
let model;
let three;

function draw(faces) {
  if (!faces.length) return;
  // console.log("Draw...", faces[0]);

  const points = faces[0].scaledMesh;
  const geometry = three.line.geometry;
  const position = geometry.attributes.position;
  const positions = position.array;

  let index = 0;

  points.forEach(([x, y, z]) => {
    positions[index++] = -x;
    positions[index++] = -y;
    positions[index++] = -z;
  });

  position.needsUpdate = true;
  geometry.computeBoundingSphere();
}

function render() {
  three.render();
  requestAnimationFrame(render);
  model.estimateFaces(video, false, true).then(draw);
}

module.exports = async function onDOMContentLoaded() {
  video = await getVideo(videoConfig);
  model = await getModel(modelConfig);
  three = await getScene({
    width: video.videoWidth,
    height: video.videoHeight
  });

  document.body.appendChild(video);
  document.body.appendChild(three.element);

  render();
};
