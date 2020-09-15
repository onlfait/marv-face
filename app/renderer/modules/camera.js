const deepMerge = require("deepMerge");
const EventEmitter = require("events");

const defaultSettings = {
  audio: false,
  video: {
    height: { ideal: 1080 },
    frameRate: { ideal: 30 }
  }
};

const ee = new EventEmitter();

function getVideo({ stream = null, width = null, height = 1080 } = {}) {
  return new Promise(async resolve => {
    const video = document.createElement("video");
    const track = stream.getVideoTracks()[0];
    const { aspectRatio, ...size } = track.getSettings();

    if (!width && !height) {
      width = size.width;
      height = size.height;
    } else if (!width) {
      width = height * aspectRatio;
    } else if (!height) {
      height = width / aspectRatio;
    }

    video.setAttribute("width", width);
    video.setAttribute("height", height);
    video.setAttribute("autoplay", true);

    video.onloadedmetadata = () => resolve(video);
    video.srcObject = stream;
  });
}

function getCamera(settings = {}) {
  const opts = deepMerge(defaultSettings, settings);

  return navigator.mediaDevices.getUserMedia(opts).then(async stream => {
    const tracks = stream.getVideoTracks();
    const track = Array.from(tracks).shift();
    const video = await getVideo({ ...opts.video, stream });
    return Promise.resolve({ stream, track, video });
  });
}

function cameraWatcher({ timeout = 2000, ...settings } = {}) {
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

module.exports = { getVideo, getCamera, cameraWatcher };
