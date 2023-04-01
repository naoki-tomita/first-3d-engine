import {
  Vertex3D, Stage, render,
  Vector,
  Color,
  convert,
} from "./scripts/Engine";
import { OrthographicCamera, PerspectiveCamera, PerspectiveCamera2 } from "./scripts/Engine/Camera";
import { Plane, Cube } from "./scripts/Models";


async function main() {
  const cupJson = await import("./scripts/Models/Cup.json");
  const cup = convert(cupJson);
  cup.move(0, 0, 2);
  cup.move(0, 0, 5);

  const c = (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d");

  const cube = new Cube(new Vertex3D(0, 0, 100), 60, 60, 60, Color.red);
  const plane = new Plane(new Vertex3D(0, 10, 100), 60, 60, Color.red);
  const objects = [
    // plane,
    cube,
    cup,
  ];
  const camera = new PerspectiveCamera2(new Vertex3D(0, 0, 0), new Vertex3D(0, 0, 1), 300);
  const stage = new Stage(objects, camera);

  function autorotate() {
    objects[0].rotate(Math.PI / 360, Math.PI / 720);
    setTimeout(autorotate, 10);
  }

  // autorotate();

  enum Keys {
    Up = "ArrowUp",
    Down = "ArrowDown",
    Right = "ArrowRight",
    Left = "ArrowLeft",
    W = "w",
    A = "a",
    S = "s",
    D = "d",
    NONE = "",
  }

  let currentKey = Keys.NONE;
  document.addEventListener("keydown", (e) => {
    currentKey = e.key as Keys;
  });

  function keymove() {
    let dx = 0, dz = 0;
    let ddx = 0, ddz = 0;
    switch(currentKey) {
      case Keys.Left:
        dx += 1;
        break;
      case Keys.Up:
        dz += 1;
        break;
      case Keys.Right:
        dx -= 1;
        break;
      case Keys.Down:
        dz -= 1;
        break;
      case Keys.W:
        ddz += 1;
        break;
      case Keys.S:
        ddz -= 1;
        break;
      case Keys.A:
        ddx += 1;
        break;
      case Keys.D:
        ddx -= 1;
        break;
      default:
        setTimeout(keymove, 1000 / 30);
        return;
    }
    currentKey = Keys.NONE;
    camera.position.move(dx, 0, dz);
    camera.lookAt.move(ddx, 0, ddz);

    console.log(camera.position, camera.lookAt, objects[0].getCenter())
    camera.calcCameraContext();
    setTimeout(keymove, 1000 / 30);
  }
  keymove();

  const debug = (document.getElementById("debug") as HTMLCanvasElement).getContext("2d");
  function rendering() {
    render(stage, {
      context: c,
      canvasSize: {
        width: 500,
        height: 500,
      }
    });
    debugRender();
    setTimeout(rendering, 1000 / 30);
  }
  rendering();

  function debugRender() {
    const points = [
      cube.getCenter(),
      camera.position,
      camera.lookAt,
      cup.getCenter(),
    ].map(({ x, z }) => ({ x, z }),);
    debug.clearRect(0, 0, 500, 500);
    const colors = [
      "black",
      "blue",
      "red",
      "purple",
    ];
    points.forEach(({ x, z }, i) => {
      debug.fillStyle = `${colors[i]}`;
      debug.fillRect(250 - x, 250 - z, 4, 4);
    })
  }
}

main()
