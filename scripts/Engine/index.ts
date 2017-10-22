import { Vertex3D } from "./Vertex3D";
import { Vertex2D } from "./Vertex2D";
import { Matrix } from "./Matrix";
import { Model } from "./Model";
import { Vector } from "./Vector";
import { Color } from "./Color";
import { Stage } from "./Stage";
import { Face } from "./Face";

export { Model } from "./Model";
export { Vertex2D, Vertex3D, Vector, Matrix, Color, Stage, Face };

export type Project = (vertex3d: Vertex3D) => Vertex2D;

interface CanvasSize {
  width: number; 
  height: number;
}

export const orthographicViewProjection: Project = (vertex3d: Vertex3D) => {
  // カメラと像を投影するスクリーンの距離
  const d = 100;
  const z = vertex3d.z || 1;
  const r = d / z;
  return new Vertex2D(r * vertex3d.x, r * vertex3d.y);
}

export const perspectiveViewProjection: Project = (vertex3d: Vertex3D) => {
  return new Vertex2D(vertex3d.x, vertex3d.y);
}

// dx, dy は 画面の中心を設定する。そこを中心に画像が生成される
export function render(options: {
  stage: Stage;
  context: CanvasRenderingContext2D;
  canvasSize: CanvasSize;
  light?: Vector;
  projectMethod?: Project;
}) {
  function renderFace(face: Face) {
    const color = face.color.get(1 - ((Matrix.vectorAngle(face.getNormalVector(), light) + 1) / 2));
    const v1 = project(face.vertex1), 
          v2 = project(face.vertex2), 
          v3 = project(face.vertex3);
    draw(context, v1, v2, v3, color, canvasSize);
  }

  function renderNormalVector(face: Face) {
    const center = face.getCenter();
    const normalVec = face.getNormalVector().normalize(20);
    const point = new Vertex3D(center.x + normalVec.x, center.y + normalVec.y, center.z + normalVec.z);
    const f = new Face(center, point, center, face.color);
    renderFace(f);
  }

  const { 
    stage, 
    context, 
    canvasSize,
    light = new Vector(1, -1, 1),
    projectMethod: project = perspectiveViewProjection,
  } = options;

  clear(context, canvasSize);
  stage.zsort()
  .forEach((obj) => 
  obj.zsort()
  .forEach((face) => {
    // ベクトルのなす角(カメラから面の中心に向かうベクトル, 面の法線ベクトル)を出す。
    // 結果は cosθ の値がえられる。(-1 ~ 1)
    // 0 ~ 1の範囲が 90°未満であるため、その場合にのみ表示してよい。
    const angle = Matrix.vectorAngle(
      // 面の法線ベクトル
      face.getNormalVector().normalize(), 
      // カメラから面の中心に向かうベクトル
      face.getCenter().toVector());
    if (angle < 0) {
      renderFace(face);
    }
    renderNormalVector(face);
  }));
}

function clear(context: CanvasRenderingContext2D, canvasSize: CanvasSize) {
  const { width, height } = canvasSize;
  context.clearRect(0, 0, width, height);
}

function draw(context: CanvasRenderingContext2D, v1: Vertex2D, v2: Vertex2D, v3: Vertex2D, color: string, canvasSize: CanvasSize) {
  const dx = canvasSize.width / 2;
  const dy = canvasSize.height / 2;
  context.beginPath();
  context.moveTo(v1.x + dx, -v1.y + dy);
  context.lineTo(v2.x + dx, -v2.y + dy);
  context.lineTo(v3.x + dx, -v3.y + dy);
  context.closePath();
  context.strokeStyle = color;
  context.stroke();
  context.fillStyle = color;
  context.fill();
}