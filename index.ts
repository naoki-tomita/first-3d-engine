import { 
  Color,
  Face,
  Matrix,
  Model,
  Vertex3D, 
  Vertex2D,
  Vector,
  Stage,
  render,
  orthographicViewProjection as project,
} from "./scripts/Engine";
import {
  Cube,
  Plane,
} from "./scripts/Models";

const c = (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d");

// カリング処理用。いまのところ透視図法だとうまくいかない。
function isDisplay(face: Face) {
  const v1 = new Vector(face.vertex1, face.vertex2); // v1 -> v2のベクトル
  const v2 = new Vector(face.vertex2, face.vertex3); // v2 -> v3のベクトル
  // 外積(法線ベクトル)をとって
  const facevec = Matrix.crossProduct(v1, v2);
  // 法線ベクトルの奥行き(=z)が正(=カメラ方向を向いている)であれば、表示していい(奥に行くほうzが大きくなる)
  if (facevec.z >= 0) {
    return true;
  }
  return false;
}

const cube = new Cube(new Vertex3D(30, 80, 100), 60, 60, 60, Color.red);
const plane = new Plane(new Vertex3D(100, -100, 120), 100, 100, Color.blue);
const objects = [ 
  cube,
  plane,
];
const stage = new Stage(objects);

function autorotate() {
  objects[0].rotate(Math.PI / 360, Math.PI / 720);
  render({ 
    stage,
    context: c,
    canvasSize: { 
      width: 500, 
      height: 500, 
    },
    projectMethod: project,
  });
  setTimeout(autorotate, 10);
}

autorotate();

let currentKey = 0;
document.addEventListener("keydown", (e) => {
  currentKey = e.keyCode;
});

function keymove() {
  let dx = 0, dy = 0, dz = 0;
  switch(currentKey) {
    case 37:
      dx -= 10;
      break;
    case 38:
      dy += 10;
      break;
    case 39:
      dx += 10;
      break;
    case 40:
      dy -= 10;
      break;
  }
  currentKey = 0;
  objects[1].move(dx, dy, dz);
  setTimeout(keymove, 1000 / 30);
}

keymove();