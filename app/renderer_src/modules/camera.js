import cloneDeep from "clone-deep";
import EventEmitter from "events";

const defaultSettings = {
  audio: false,
  video: {
    height: { ideal: 1080 },
    frameRate: { ideal: 30 }
  }
};

const ee = new EventEmitter();

export function getCamera(settings = {}) {
  settings = cloneDeep(defaultSettings, settings);

  return navigator.mediaDevices.getUserMedia(settings).then(stream => {
    const tracks = stream.getVideoTracks();
    const track = Array.from(tracks).shift();

    return Promise.resolve({ stream, track });
  });
}

export function cameraWatcher({ timeout = 2000, ...settings } = {}) {
  let watching = false;

  function waitForCamera() {
    if (!watching) return;

    getCamera(settings)
      .then(camera => {
        ee.emit("camera", camera);
        camera.track.addEventListener("ended", () => {
          ee.emit("ended", camera);
          waitForCamera();
        });
      })
      .catch(error => {
        setTimeout(waitForCamera, timeout);
        ee.emit("error", error);
      });
  }

  return {
    start() {
      if (watching) return;
      watching = true;
      waitForCamera();
    },
    stop() {
      watching = false;
    },
    on: ee.on.bind(ee),
    off: ee.off.bind(ee),
    once: ee.once.bind(ee)
  };
}
