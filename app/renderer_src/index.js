import { cameraWatcher } from "./modules/camera";

console.log("renderer_src/index.js -> bundle.js");

const watcher = cameraWatcher();

watcher.on("camera", camera => console.log(">>> camera:", { camera }));
watcher.on("error", error => console.error(">>> error:", { error }));

watcher.start();
