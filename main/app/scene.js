const THREE = require("three");

window.THREE = THREE;
require("../../node_modules/three/examples/js/controls/OrbitControls.js");

let camera;
let scene;
let controls;
let renderer;
let videoPlan;

function fitCameraToObject(object) {
  const boundingBox = new THREE.Box3();
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();

  controls.reset();

  boundingBox.setFromObject(object);
  boundingBox.getCenter(center);
  boundingBox.getSize(size);

  const maxSize = Math.max(size.x, size.y);
  camera.position.z = maxSize / 2 / Math.tan((Math.PI * camera.fov) / 360);
}

function createVideoPlan({ width, height } = {}) {
  const geometry = new THREE.PlaneBufferGeometry(width, height, 32);
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    color: 0xffff00
  });
  return new THREE.Mesh(geometry, material);
}

function createScene({ width, height } = {}) {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  camera = new THREE.PerspectiveCamera(75, width / height, 1, 2000);
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  videoPlan = createVideoPlan({ width, height });
  fitCameraToObject(videoPlan);

  scene.add(camera);
  scene.add(videoPlan);

  document.body.appendChild(renderer.domElement);
  document.body.addEventListener("dblclick", () => {
    fitCameraToObject(videoPlan);
  });
}

function animate(callback) {
  requestAnimationFrame(() => animate(callback));
  callback && callback();
  controls.update();
  renderer.render(scene, camera);
}

module.exports = { createScene, animate };
