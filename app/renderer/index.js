const { cameraWatcher } = require("./modules/camera");
const {
  createScene,
  createMask,
  createHand,
  animate
} = require("./modules/scene");

const facemeshTris = require("./modules/tensorflow/facemesh");
const loadBackend = require("./modules/tensorflow/backend");
const facemesh = require("@tensorflow-models/facemesh");
const handpose = require("@tensorflow-models/handpose");

const backend = "webgl";
const handposeConfig = {};
const facemeshConfig = { maxFaces: 1 };
const size = { width: 400, height: 400 };

const watcher = cameraWatcher({ video: size });
const $sceneWrapper = document.querySelector("#scene");
const $videoWrapper = document.querySelector("#video");

loadBackend(backend);

watcher.on("error", console.warn);
watcher.on("camera", async camera => {
  const facemeshModel = await facemesh.load(facemeshConfig);
  const handposeModel = await handpose.load(handposeConfig);
  const { scene, renderer, videoPlan } = createScene({
    ...size,
    video: camera.video
  });

  const mask = createMask(facemeshTris.length);
  mask.position.set(size.width / 2, size.height / 2, 0);

  const hand = createHand();
  hand.group.position.set(size.width / 2, size.height / 2, 0);

  $sceneWrapper.appendChild(renderer.domElement);
  $videoWrapper.appendChild(camera.video);

  scene.add(mask);
  scene.add(hand.group);

  window.addEventListener("keydown", event => {
    console.log(event.keyCode);
    if (event.keyCode === 49) {
      videoPlan.visible = !videoPlan.visible;
    }
  });

  animate(() => {
    facemeshModel.estimateFaces(camera.video, false, true).then(faces => {
      drawMask(mask, faces);
    });
    handposeModel.estimateHands(camera.video, true).then(hands => {
      drawHand(hand, hands);
    });
  });
});

watcher.start();

function drawFinger(finger, points) {
  const geometry = finger.geometry;
  const position = geometry.attributes.position;
  const positions = position.array;

  let index = 0;

  points.forEach(([x, y, z]) => {
    positions[index++] = -x;
    positions[index++] = -y;
    positions[index++] = -z;
  });

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
}

function drawHand(hand, hands) {
  if (!hands.length) return;

  const { annotations, handInViewConfidence } = hands[0];

  drawFinger(hand.annotations.thumb, annotations.thumb);
  drawFinger(hand.annotations.indexFinger, annotations.indexFinger);
  drawFinger(hand.annotations.middleFinger, annotations.middleFinger);
  drawFinger(hand.annotations.ringFinger, annotations.ringFinger);
  drawFinger(hand.annotations.pinky, annotations.pinky);
}

function drawMask(mask, faces) {
  if (!faces.length) return;

  const points = faces[0].scaledMesh;
  const geometry = mask.geometry;
  const position = geometry.attributes.position;
  const positions = position.array;

  let index = 0;

  facemeshTris.forEach(i => {
    const [x, y, z] = points[i];
    positions[index++] = -x;
    positions[index++] = -y;
    positions[index++] = -z;
  });

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
}
