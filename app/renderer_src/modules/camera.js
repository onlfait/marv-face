import cloneDeep from "clone-deep";
import EventEmitter from "events";

const defaultSettings = {
  audio: false,
  video: {
    height: { ideal: 1080 },
    frameRate: { ideal: 30 }
  }
};

const events = new EventEmitter();

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
        events.emit("camera", camera);
        camera.track.addEventListener("ended", () => {
          events.emit("ended", camera);
          waitForCamera();
        });
      })
      .catch(error => {
        events.emit("error", error);
        setTimeout(waitForCamera, timeout);
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
    on: events.on.bind(events),
    off: events.off.bind(events),
    once: events.once.bind(events)
  };
}
