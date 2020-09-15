import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  PlaneBufferGeometry,
  VideoTexture,
  MeshBasicMaterial,
  Box3,
  Vector3,
  Mesh,
  DoubleSide,
  AmbientLight,
  SpotLight
} from "three";

export function fitCameraToObject(camera, object, controls = null) {
  const boundingBox = new Box3();
  const center = new Vector3();
  const size = new Vector3();

  controls && controls.reset();

  boundingBox.setFromObject(object);
  boundingBox.getCenter(center);
  boundingBox.getSize(size);

  const maxSize = Math.min(size.x, size.y);
  camera.position.z = maxSize / 2 / Math.tan((Math.PI * camera.fov) / 360);
}

function createVideoPlan({ width, height, video } = {}) {
  const geometry = new PlaneBufferGeometry(width, height, 1);
  const texture = video && new VideoTexture(video);
  const material = new MeshBasicMaterial({
    side: DoubleSide,
    color: 0xffff00,
    map: texture
  });
  return new Mesh(geometry, material);
}

export function createScene({ width, height, video } = {}) {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true });
  const camera = new PerspectiveCamera(75, width / height, 1, 5000);
  const controls = new OrbitControls(camera, renderer.domElement);
  const scene = new Scene();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  const videoPlan = createVideoPlan({ width, height, video });
  fitCameraToObject(camera, videoPlan, controls);

  const ambientLight = new AmbientLight(0x555555);
  const spotLight = new SpotLight(0xffffff, 0.2);
  spotLight.position.set(0, 1000, 5000);

  scene.add(ambientLight);
  scene.add(spotLight);

  scene.add(camera);
  scene.add(videoPlan);

  function animate(callback) {
    requestAnimationFrame(() => animate(callback));
    callback && callback();
    controls.update();
    renderer.render(scene, camera);
  }

  document.body.addEventListener("dblclick", () => {
    fitCameraToObject(camera, videoPlan, controls);
  });

  return {
    renderer,
    camera,
    controls,
    scene,
    videoPlan,
    animate
  };
}
