<script>
  import { cameraWatcher } from "../modules/camera";
  import { createScene } from "../modules/three";

  let three;
  let camera;
  let videoWrapper;
  let sceneWrapper;

  const cameraSize = { width: 400, height: 400 };
  const cameraWatch = cameraWatcher({ video: cameraSize });

  cameraWatch.on("camera", cam => (camera = cam));
  cameraWatch.on("ended", () => (camera = null));
  cameraWatch.on("error", console.warn);

  cameraWatch.start();

  $: if (camera && videoWrapper) {
    three = createScene({ ...cameraSize, video: camera.video });
    videoWrapper.appendChild(camera.video);
    sceneWrapper.appendChild(three.renderer.domElement);
    three.animate();
  }
</script>

{#if camera}
<div class="p-2 bg-gray-700">
  {camera.track.label}
</div>
<div class="relative">
  <div bind:this={videoWrapper} class="absolute"></div>
  <div bind:this={sceneWrapper} class="absolute"></div>
</div>
{:else}
<div class="p-2 bg-gray-700">
  Waiting for camera...
</div>
{/if}
