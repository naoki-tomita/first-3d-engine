import { 
  Color,
  Face,
  Matrix,
  Vertex3D, 
  Vertex2D,
  Vector,
  render,
  orthographicViewProjection as project,
} from "./scripts/Engine";
import {
  Model,
  Cube,
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



const light = new Vertex3D(-1, -1, -1);
const cube1 = new Cube(new Vertex3D(30, 80, 100), 60, 60, 60, Color.red);
// const cube2 = new Cube(new Vertex3D(100, 100, 150), 60, 60, 60, Color.blue);
// const cube3 = new Cube(new Vertex3D(200, 200, 180), 60, 60, 60, Color.green);
// const cube4 = new Cube(new Vertex3D(-100, 0, 80), 60, 60, 60, Color.orange);
// const cube5 = new Cube(new Vertex3D(-100, 140, 100), 60, 60, 60, Color.pink);
const objects = [ 
  cube1,
  // cube2,
  // cube3,
  // cube4,
  // cube5,
];

function autorotate() {
  objects.forEach(o => {
    o.rotate(Math.PI / 360, Math.PI / 720);
  });
  render({ 
    objects, 
    context: c,
    canvasSize: { 
      width: 500, 
      height: 250 
    },
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
  objects[0].move(dx, dy, dz);
  setTimeout(keymove, 1000/30);
}

keymove();