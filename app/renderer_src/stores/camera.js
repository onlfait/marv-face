import { readable } from "svelte/store";
import { cameraWatcher } from "../modules/camera";

export const camera = readable(null, set => {
  const cameraWatch = cameraWatcher();

  cameraWatch.on("camera", camera => set(camera));
  cameraWatch.on("ended", camera => set(null));
  cameraWatch.on("error", () => set(null));

  cameraWatch.start();

  return function stop() {
    cameraWatch.stop();
  };
});
