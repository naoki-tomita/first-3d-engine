import { Vertex3D } from "./Vertex3D";
import { Vertex2D } from "./Vertex2D";
import { Matrix } from "./Matrix";
import { Model } from "../Models";
import { Vector } from "./Vector";
import { Color } from "./Color";

export { Face } from "./Face";
export { Vertex2D, Vertex3D, Vector, Matrix, Color };

export type Project = (vertex3d: Vertex3D) => Vertex2D;

interface CanvasSize {
  width: number; 
  height: number;
}

export const orthographicViewProjection: Project = (vertex3d: Vertex3D) => {
  // カメラと像を投影するスクリーンの距離
  var d = 200;
  var r = d / vertex3d.z;
  return new Vertex2D(r * vertex3d.x, r * vertex3d.y);
}

export const perspectiveViewProjection: Project = (vertex3d: Vertex3D) => {
  return new Vertex2D(vertex3d.x, vertex3d.y);
}

// dx, dy は 画面の中心を設定する。そこを中心に画像が生成される
export function render(options: {
  objects: Model[];
  context: CanvasRenderingContext2D;
  canvasSize: CanvasSize;
  light?: Vector;
  projectMethod?: Project;
}) {
  const { 
    objects, 
    context, 
    canvasSize,
    light = new Vector(0, 0, 0),
    projectMethod: project = perspectiveViewProjection,
  } = options;

  clear(context, canvasSize);
  objects
  .sort((a, b) => b.getCenter().z - a.getCenter().z)
  .forEach((obj) => obj.faces
  .sort((a, b) => b.getCenter().z - a.getCenter().z)
  .forEach((face) => {
    const color = face.color.get(1-(((Matrix.vectorAngle(face.getNormalVector(), light) + 1) / 2)));
    const v1 = project(face.vertex1), 
          v2 = project(face.vertex2), 
          v3 = project(face.vertex3);
    draw(context, v1, v2, v3, color, canvasSize);
  }));
}

function clear(context: CanvasRenderingContext2D, screenSize: CanvasSize) {
  const { width, height } = screenSize;
  context.clearRect(0, 0, width, height);
}

function draw(context: CanvasRenderingContext2D, v1: Vertex2D, v2: Vertex2D, v3: Vertex2D, color: string, canvasSize: CanvasSize) {
  context.beginPath();
  context.moveTo(v1.x + canvasSize.width, -v1.y + canvasSize.height);
  context.lineTo(v2.x + canvasSize.width, -v2.y + canvasSize.height);
  context.lineTo(v3.x + canvasSize.width, -v3.y + canvasSize.height);
  context.closePath();
  context.strokeStyle = color;
  context.stroke();
  context.fillStyle = color;
  context.fill();
}