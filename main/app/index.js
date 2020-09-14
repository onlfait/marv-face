const { getVideo } = require("./video");
const { triangulation } = require("./triangulation");
const { getModel, getUVCoords } = require("./facemesh");
const { createScene, animate, createMask, loadObject } = require("./scene");

const { Triangle, Vector3 } = require("three");

const videoConfig = { height: 400 };
const modelConfig = { backend: "wasm", maxFaces: 1 };

let hatObject;

function drawMask(mask, faces) {
  if (!faces.length) return;

  const points = faces[0].scaledMesh;
  const geometry = mask.geometry;
  const position = geometry.attributes.position;
  const positions = position.array;

  let index = 0;

  triangulation.forEach(i => {
    const [x, y, z] = points[i];
    positions[index++] = -x;
    positions[index++] = -y;
    positions[index++] = -z;
  });

  const normal = new Vector3();
  const v1 = new Vector3(positions[0], positions[1], positions[2]);
  const v2 = new Vector3(positions[3], positions[4], positions[5]);
  const v3 = new Vector3(positions[6], positions[7], positions[8]);
  const triangle = new Triangle(v1, v2, v3);
  triangle.getNormal(normal);

  if (hatObject) {
    hatObject.position.set(positions[0], positions[1], positions[2]);
    hatObject.lookAt(normal.normalize());
    // const normal = new Vector3();
    // const triangle = new Triangle(positions[3], positions[4], positions[5]);
    // triangle.getNormal(normal);
    // console.log(normal);
  }

  position.needsUpdate = true;

  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
}

async function init() {
  const video = await getVideo(videoConfig);
  const model = await getModel(modelConfig);

  const { videoWidth: width, videoHeight: height } = video;

  document.body.appendChild(video);

  const scene = createScene({ width, height, video });
  const mask = createMask(triangulation.length);
  const draw = drawMask.bind(null, mask);

  mask.position.set(-width / 2, height / 2, 0);

  scene.add(mask);

  loadObject({
    path: "obj/Leather_Hat/",
    obj: "Leather_Hat.obj",
    mtl: "Leather_Hat.mtl"
  }).then(object => {
    object.scale.set(100, 100, 100);
    hatObject = object;
    mask.add(object);
  });

  animate(() => {
    model.estimateFaces(video, false, true).then(draw);
  });
}

init();
