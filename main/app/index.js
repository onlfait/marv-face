const { getVideo } = require("./video");
const { triangulation } = require("./triangulation");
const { getModel, getUVCoords } = require("./facemesh");
const { createScene, animate, createMask } = require("./scene");

const videoConfig = { height: 400 };
const modelConfig = { backend: "wasm", maxFaces: 1 };

function drawMask(mask, faces) {
  if (!faces.length) return;

  const points = faces[0].scaledMesh;
  const geometry = mask.geometry;
  const position = geometry.attributes.position;
  const positions = position.array;

  let index = 0;

  triangulation.forEach(i => {
    const [x, y, z] = points[i];
    positions[index++] = -x;
    positions[index++] = -y;
    positions[index++] = -z;
  });

  position.needsUpdate = true;

  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
}

async function init() {
  const video = await getVideo(videoConfig);
  const model = await getModel(modelConfig);

  const { videoWidth: width, videoHeight: height } = video;

  document.body.appendChild(video);

  const scene = createScene({ width, height });
  const mask = createMask(triangulation.length);
  const draw = drawMask.bind(null, mask);

  mask.position.set(-width / 2, height / 2, 0);

  scene.add(mask);

  animate(() => {
    model.estimateFaces(video, false, true).then(draw);
  });
}

init();
