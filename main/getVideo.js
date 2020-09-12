module.exports = function getVideo({
  videoSelector = "#video",
  canvasSelector = "#canvas",
  width = 600,
  height = 600
} = {}) {
  return new Promise(async resolve => {
    const video = document.querySelector(videoSelector);
    const canvas = document.querySelector(canvasSelector);

    video.srcObject = await navigator.mediaDevices.getUserMedia({
      video: { width, height, frameRate: 25, facingMode: "user" },
      audio: false
    });

    console.log(video.srcObject.getVideoTracks());

    canvas.width = width;
    canvas.height = height;

    video.onloadedmetadata = () => {
      video.style.display = "block";
      canvas.style.display = "block";
      resolve({ video, canvas });
    };
  });
};
