const { createScene, animate } = require("./scene");
const { getVideo } = require("./video");

getVideo({ height: 400 }).then(video => {
  const { videoWidth: width, videoHeight: height } = video;

  document.body.appendChild(video);

  createScene({ width, height });

  animate(() => {
    console.log("animate...");
  });
});
