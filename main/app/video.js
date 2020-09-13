function getVideo({
  width = null,
  height = 720,
  frameRate = 25,
  facingMode = "user"
} = {}) {
  return new Promise(async resolve => {
    const video = document.createElement('video');
    width && video.setAttribute('width', width);
    height && video.setAttribute('height', height);
    video.setAttribute('autoplay', true);
    video.onloadedmetadata = () => resolve(video);
    video.srcObject = await navigator.mediaDevices.getUserMedia({
      video: { width, height, frameRate, facingMode },
      audio: false
    });
  });
};

module.exports = { getVideo };
