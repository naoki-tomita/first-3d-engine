import { Vertex3D } from "./Vertex3D";
import { Vertex2D } from "./Vertex2D";
import { Matrix } from "./Matrix";
import { Model } from "./Model";
import { Vector } from "./Vector";
import { Color } from "./Color";
import { Stage } from "./Stage";
import { Face } from "./Face";

export { Model } from "./Model";
export { convert } from "./Model/Convert";
export { Vertex2D, Vertex3D, Vector, Matrix, Color, Stage, Face };

export type Project = (vertex3d: Vertex3D) => Vertex2D;
export type Culling = (face: Face) => boolean;

interface CanvasSize {
  width: number;
  height: number;
}

interface RenderContext {
  context: CanvasRenderingContext2D,
  canvasSize: CanvasSize,
  light?: Vector,
  projectionMethod?: Project,
  cullingMethod?: Culling,
}

// 画面の橋に行くほど歪むのはなぜ？
export const perspectiveViewProjection: Project = (o: Vertex3D) => {
  // カメラと像を投影するスクリーンの距離
  const d = 300;
  const y = (d / (o.z || 1)) * o.y;
  const x = (d / (o.z || 1)) * o.x;
  return new Vertex2D(x, y);
}

export const orthographicViewProjection: Project = (vertex3d: Vertex3D) => {
  return new Vertex2D(vertex3d.x, vertex3d.y);
}

// 面がカメラを向いていない場合に表示しないカリング
export const normalCulling: Culling = (face: Face) => {
  // ベクトルのなす角(カメラから面の中心に向かうベクトル, 面の法線ベクトル)を出す。
  // 結果は cosθ の値がえられる。(-1 ~ 1)
  // 0 ~ 1の範囲が 90°未満であるため、その場合にのみ表示してよい。
  const angle = Matrix.vectorAngle(
    // 面の法線ベクトル
    face.getNormalVector().normalize(),
    // カメラから面の中心に向かうベクトル
    face.getCenter().toVector());
  if (angle < 0) {
    return true;
  }
  return false;
}

// カメラの見える範囲の座標にある場合のみ表示する
export const visibleCulling: Culling = (face: Face) => {
  return face.getCenter().z > 0;
}

// カリングを無効にするやつ
export const disabledCulling: Culling = () => {
  return true;
}

export function render(stage: Stage, options: RenderContext) {
  clear(options);
  renderStage(stage, options);
}

export function renderStage(stage: Stage, options: RenderContext) {
  stage.zsort()
    .forEach(model => renderModel(model, options));
}

export function renderModel(model: Model, options: RenderContext) {
  model.zsort()
    .forEach(face => renderFace(face, options));
}

export function renderFace(face: Face, options: RenderContext) {
  const {
    light = new Vector(1, -1, 1),
    projectionMethod: project = orthographicViewProjection,
    cullingMethod: culling = normalCulling,
  } = options;
  if (!culling(face)) {
    return;
  }
  // ここで面の明るさを決めている。太陽に向いている方向は明るく、そうでない方向は適当に暗くする。
  const color = face.color.get(1 - ((Matrix.vectorAngle(face.getNormalVector(), light) + 1) / 2));
  const v1 = project(face.vertex1),
        v2 = project(face.vertex2),
        v3 = project(face.vertex3);
  draw(v1, v2, v3, color, options);
}

// for debugging.
function renderNormalVector(face: Face, options: RenderContext) {
  const center = face.getCenter();
  const normalVec = face.getNormalVector().normalize(1);
  const point = new Vertex3D(center.x + normalVec.x, center.y + normalVec.y, center.z + normalVec.z);
  const f = new Face(center, point, center, Color.red);
  renderFace(f, options);
}


// low level api.
function clear(options: RenderContext) {
  const { context, canvasSize } = options;
  const { width, height } = canvasSize;
  context.clearRect(0, 0, width, height);
}

function draw(v1: Vertex2D, v2: Vertex2D, v3: Vertex2D, color: string, options: RenderContext) {
  const { context: c, canvasSize: s } = options;
  const dx = s.width / 2;
  const dy = s.height / 2;
  c.beginPath();
  c.moveTo(v1.x + dx, -v1.y + dy);
  c.lineTo(v2.x + dx, -v2.y + dy);
  c.lineTo(v3.x + dx, -v3.y + dy);
  c.closePath();
  c.strokeStyle = color;
  c.stroke();
  c.fillStyle = color;
  c.fill();
}
