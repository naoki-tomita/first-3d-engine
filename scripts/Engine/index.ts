import { Vertex3D } from "./Vertex3D";
import { Vertex2D } from "./Vertex2D";
import { Matrix } from "./Matrix";
import { Model } from "./Model";
import { Vector } from "./Vector";
import { Color } from "./Color";
import { Stage } from "./Stage";
import { Face } from "./Face";
import { Camera } from "./Camera";

export { Model } from "./Model";
export { convert } from "./Model/Convert";
export { Vertex2D, Vertex3D, Vector, Matrix, Color, Stage, Face };

interface CanvasSize {
  width: number;
  height: number;
}

interface RenderContext {
  context: CanvasRenderingContext2D,
  canvasSize: CanvasSize,
  light?: Vector,
}

export function render(stage: Stage, options: RenderContext) {
  clear(options);
  renderStage(stage, options);
}

export function renderStage(stage: Stage, options: RenderContext) {
  stage.convertToCameraCoordSystem().zsort()
    .forEach(model => renderModel(model, stage.camera, options));
}

export function renderModel(model: Model, camera: Camera, options: RenderContext) {
  model.zsort()
    .forEach(face => renderFace(face, camera, options));
}

export function renderFace(face: Face, camera: Camera, options: RenderContext) {
  const { light = new Vector(100, -100, 100) } = options;
  if (!camera.culling(face)) {
    return;
  }
  // ここで面の明るさを決めている。太陽に向いている方向は明るく、そうでない方向は適当に暗くする。
  const color = face.color.get(1 - ((Matrix.vectorAngle(face.getNormalVector(), light) + 1) / 2));
  const v1 = camera.project(face.vertex1),
        v2 = camera.project(face.vertex2),
        v3 = camera.project(face.vertex3);
  draw(v1, v2, v3, color, options);
}

// for debugging.
function renderNormalVector(face: Face, camera: Camera, options: RenderContext) {
  const center = face.getCenter();
  const normalVec = face.getNormalVector().normalize(1);
  const point = new Vertex3D(center.x + normalVec.x, center.y + normalVec.y, center.z + normalVec.z);
  const f = new Face(center, point, center, Color.red);
  renderFace(f, camera, options);
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
