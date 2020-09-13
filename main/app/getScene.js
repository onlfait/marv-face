const THREE = (window.THREE = require("three"));
require("../../node_modules/three/examples/js/controls/OrbitControls.js");

const maxPoints = 486;

function makeLine() {
  const material = new THREE.PointsMaterial({ color: 0x008888, size: 5 });
  const geometry = new THREE.BufferGeometry();
  const buffer = new Float32Array(maxPoints * 3);
  const position = new THREE.BufferAttribute(buffer, 3);
  geometry.setAttribute("position", position);
  geometry.setDrawRange(0, maxPoints);
  return new THREE.Points(geometry, material);
}

function getScene({ width, height }) {
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 10000);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  const scene = new THREE.Scene();
  const line = makeLine();

  line.position.x = -270;
  line.position.y = 200;

  renderer.setSize(width, height);
  camera.position.set(0, 0, 260);
  camera.lookAt(0, 0, 0);
  controls.update();
  scene.add(line);

  return {
    line,
    scene,
    camera,
    controls,
    renderer,
    element: renderer.domElement,
    render: () => {
      controls.update();
      renderer.render(scene, camera);
    }
  };
}

module.exports = { getScene };
