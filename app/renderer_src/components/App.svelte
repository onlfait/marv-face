<script>
  // import { cameraWatcher } from "../modules/camera";
  // import { createScene } from "../modules/three";
  // import { getModel } from "../modules/facemesh";
  //
  // let three;
  // let camera;
  // let videoWrapper;
  // let sceneWrapper;
  //
  // const modelConfig = { backend: "wasm", maxFaces: 1 };
  //
  // const cameraSize = { width: 400, height: 400 };
  // const cameraWatch = cameraWatcher({ video: cameraSize });
  //
  // cameraWatch.on("camera", cam => (camera = cam));
  // cameraWatch.on("ended", () => (camera = null));
  // cameraWatch.on("error", console.warn);
  //
  // cameraWatch.start();
  //
  // function draw() {
  //   console.log("draw...");
  // }
  //
  // async function animate() {
  //   const model = await getModel(modelConfig);
  //   three.animate(() => {
  //     // model.estimateFaces(camera.video, false, true).then(draw);
  //   });
  // }
  //
  // $: if (camera && videoWrapper) {
  //   three = createScene({ ...cameraSize, video: camera.video });
  //   videoWrapper.appendChild(camera.video);
  //   sceneWrapper.appendChild(three.renderer.domElement);
  //   animate();
  // }
</script>

<div class="">
  caca
</div>
