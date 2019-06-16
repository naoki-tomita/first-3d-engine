import {
  Vertex3D, Stage, render,
  convert,
  Vector,
} from "./scripts/Engine";
import { PerspectiveCamera } from "./scripts/Engine/Camera";

const cupJson = require("./scripts/Models/Cup.json");

const c = (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d");

const cup = convert(cupJson);
cup.move(0, 0, 2);

const objects = [
  // cube,
  cup,
];
cup.move(0, 0, 5);
const camera = new PerspectiveCamera(new Vertex3D(0, 0, 0), new Vector(0, 0, 1), 300);
const stage = new Stage(objects, camera);

function autorotate() {
  objects[0].rotate(Math.PI / 360, Math.PI / 720);
  setTimeout(autorotate, 10);
}

autorotate();

enum Keys {
  Up = "ArrowUp",
  Down = "ArrowDown",
  Right = "ArrowRight",
  Left = "ArrowLeft",
}

let currentKey = "";
document.addEventListener("keydown", (e) => {
  currentKey = e.key;
});

function keymove() {
  let dx = 0, dz = 0;
  switch(currentKey) {
    case "ArrowLeft":
      dx -= 1;
      break;
    case "ArrowUp":
      dz += 1;
      break;
    case "ArrowRight":
      dx += 1;
      break;
    case "ArrowDown":
      dz -= 1;
      break;
    default:
      setTimeout(keymove, 1000 / 30);
      return;
  }
  currentKey = "";
  camera.move(dx, 0, dz);
  setTimeout(keymove, 1000 / 30);
}
keymove();

function rendering() {
  render(stage, {
    context: c,
    canvasSize: {
      width: 500,
      height: 500,
    }
  });
  setTimeout(rendering, 1000 / 30);
}

rendering();
