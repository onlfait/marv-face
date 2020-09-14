const THREE = (window.THREE = require("three"));

require("../../node_modules/three/examples/js/controls/OrbitControls.js");
require("../../node_modules/three/examples/js/loaders/MTLLoader.js");
require("../../node_modules/three/examples/js/loaders/OBJLoader.js");

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

function loadMaterial({ file, path = null } = {}) {
  const loader = new THREE.MTLLoader();
  path && loader.setPath(path);
  return new Promise((resolve, reject) => {
    loader.load(file, resolve, xhrProgress.bind(null, "material"), reject);
  });
}

function loadObject({ obj, mtl = null, path = null } = {}) {
  return new Promise(async (resolve, reject) => {
    const loader = new THREE.OBJLoader();
    path && loader.setPath(path);
    if (mtl) {
      const materials = await loadMaterial({ file: mtl, path });
      materials.preload();
      loader.setMaterials(materials);
    }
    loader.load(obj, resolve, xhrProgress.bind(null, "object"), reject);
  });
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

function createVideoPlan({ width, height, video = null } = {}) {
  const geometry = new THREE.PlaneBufferGeometry(width, height, 1);
  const texture = video && new THREE.VideoTexture(video);
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    color: 0xffff00,
    map: texture
  });
  return new THREE.Mesh(geometry, material);
}

function createCube({ size } = {}) {
  const geometry = new THREE.BoxBufferGeometry(size, size, size);
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  return new THREE.Mesh(geometry, material);
}

function createMask(maxPoints) {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  const buffer = new Float32Array(maxPoints * 3);
  const position = new THREE.BufferAttribute(buffer, 3);
  geometry.setAttribute("position", position);
  geometry.setDrawRange(0, maxPoints);
  return new THREE.Mesh(geometry, material);
}

function createScene({ width, height, video = null } = {}) {
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

  //---
  ambientLight = new THREE.AmbientLight(0x555555);
  spotLight = new THREE.SpotLight(0xffffff, 0.2);
  spotLight.position.set(0, 1000, 5000);

  mesh = createCube({ size: 100 });

  scene.add(ambientLight);
  scene.add(spotLight);
  // scene.add(mesh);
  //---

  document.body.appendChild(renderer.domElement);
  document.body.addEventListener("dblclick", () => {
    fitCameraToObject(videoPlan);
  });

  return scene;
}

function animate(callback) {
  requestAnimationFrame(() => animate(callback));
  callback && callback();
  controls.update();
  renderer.render(scene, camera);
}

module.exports = { createScene, createMask, animate, scene, loadObject };
