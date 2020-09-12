module.exports = async function estimateFaces({ video, canvas }, model) {
  const predictions = await model.estimateFaces(video);
  const ctx = canvas.getContext("2d");

  if (predictions.length > 0) {
    const { bottomRight, topLeft } = predictions[0].boundingBox;

    const [x, y] = topLeft;
    const [w, h] = bottomRight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
    // ctx.fillRect(x, y, w - x, h - y);

    ctx.fillStyle = "#ff0000";

    for (let i = 0; i < predictions.length; i++) {
      const keypoints = predictions[i].scaledMesh;

      for (let i = 0; i < keypoints.length; i++) {
        const [x, y, z] = keypoints[i];
        ctx.fillRect(x, y, 5, 5);
      }
    }
  }
};
