const { createScene, animate } = require("./scene");

createScene({ width: 400, height: 400 });

animate(() => {
  console.log("animate...");
});
