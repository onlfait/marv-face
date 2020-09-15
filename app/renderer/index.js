const { cameraWatcher } = require("./modules/camera");
const { createScene, animate, createMask } = require("./modules/scene");
const { triangulation } = require("./modules/triangulation");
const { getModel } = require("./modules/facemesh");

const size = { width: 400, height: 400 };
const modelConfig = { backend: "wasm", maxFaces: 1 };

const watcher = cameraWatcher({ video: size });
const $sceneWrapper = document.querySelector("#scene");
const $videoWrapper = document.querySelector("#video");

watcher.on("error", console.warn);
watcher.on("camera", async camera => {
  const model = await getModel(modelConfig);
  const { scene, renderer, videoPlan } = createScene({
    ...size,
    video: camera.video
  });
  const mask = createMask(triangulation.length, camera.video);
  const draw = drawMask.bind(null, mask);

  mask.position.set(size.width / 2, size.height / 2, 0);

  $sceneWrapper.appendChild(renderer.domElement);
  $videoWrapper.appendChild(camera.video);

  scene.add(mask);

  window.addEventListener("keydown", event => {
    console.log(event.keyCode);
    if (event.keyCode === 49) {
      videoPlan.visible = !videoPlan.visible;
    }
  });

  animate(() => {
    model.estimateFaces(camera.video, false, true).then(draw);
  });
});

watcher.start();

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
