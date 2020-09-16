const THREE = (window.THREE = require("three"));

require("../../../node_modules/three/examples/js/controls/OrbitControls.js");

let camera;
let scene;
let controls;
let renderer;
let videoPlan;
let ambientLight;
let spotLight;
let mesh;

function xhrProgress(label, xhr) {
  const percent = (xhr.loaded / xhr.total) * 100;
  console.log(`${label}: ${percent} % loaded`);
}

function fitCameraToObject(object) {
  const boundingBox = new THREE.Box3();
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();

  controls.reset();

  boundingBox.setFromObject(object);
  boundingBox.getCenter(center);
  boundingBox.getSize(size);

  const maxSize = Math.min(size.x, size.y);
  camera.position.z = maxSize / 2 / Math.tan((Math.PI * camera.fov) / 360);
}

function createVideoPlan({ width, height, video } = {}) {
  const geometry = new THREE.PlaneBufferGeometry(width, height, 1);
  const texture = new THREE.VideoTexture(video);
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture
  });
  return new THREE.Mesh(geometry, material);
}

function createMask(maxPoints, uvs = []) {
  const texture = new THREE.TextureLoader().load("textures/facemesh_map.jpg");
  // texture.wrapS = THREE.RepeatWrapping;
  // texture.wrapT = THREE.RepeatWrapping;
  // texture.repeat.set(1, 1);

  const geometry = new THREE.BufferGeometry();
  const material = new THREE.MeshPhongMaterial({
    color: 0xdddddd,
    specular: 0x222222,
    shininess: 35,
    map: texture
  });

  const buffer = new Float32Array(maxPoints * 3);
  const position = new THREE.BufferAttribute(buffer, 3);

  geometry.setAttribute("position", position);
  geometry.setDrawRange(0, maxPoints);

  geometry.faceVertexUvs = [[]];

  for (let i = 0; i < uvs.length; i += 3) {
    const a = uvs[i + 0];
    const b = uvs[i + 1];
    const c = uvs[i + 2];

    geometry.faceVertexUvs[0].push([
      new THREE.Vector2(a[0], a[1]),
      new THREE.Vector2(b[0], b[1]),
      new THREE.Vector2(c[0], c[1])
    ]);
  }

  geometry.uvsNeedUpdate = true;

  return new THREE.Mesh(geometry, material);
}

function createFinger(maxPoints) {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const buffer = new Float32Array(maxPoints * 3);
  const position = new THREE.BufferAttribute(buffer, 3);
  geometry.setAttribute("position", position);
  geometry.setDrawRange(0, maxPoints);
  return new THREE.Line(geometry, material);
}

function createHand() {
  const group = new THREE.Group();
  // const palmBase = createPalm()
  const thumb = createFinger(4);
  const indexFinger = createFinger(4);
  const middleFinger = createFinger(4);
  const ringFinger = createFinger(4);
  const pinky = createFinger(4);

  group.add(thumb);
  group.add(indexFinger);
  group.add(middleFinger);
  group.add(ringFinger);
  group.add(pinky);

  return {
    group,
    annotations: {
      thumb,
      indexFinger,
      middleFinger,
      ringFinger,
      pinky
    }
  };
}

function createScene({ width, height, video } = {}) {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  camera = new THREE.PerspectiveCamera(75, width / height, 1, 5000);
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  videoPlan = createVideoPlan({ width, height, video });
  fitCameraToObject(videoPlan);

  scene.add(camera);
  scene.add(videoPlan);

  ambientLight = new THREE.AmbientLight(0x555555);
  spotLight = new THREE.SpotLight(0xffffff, 0.2);
  spotLight.position.set(0, 1000, 5000);

  scene.add(ambientLight);
  scene.add(spotLight);

  document.body.addEventListener("dblclick", () => {
    fitCameraToObject(videoPlan);
  });

  return { scene, renderer, videoPlan };
}

function animate(callback) {
  requestAnimationFrame(() => animate(callback));
  callback && callback();
  controls.update();
  renderer.render(scene, camera);
}

module.exports = { createScene, createMask, createHand, animate };
