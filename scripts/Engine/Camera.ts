import { Vertex3D } from "./Vertex3D";
import { Vertex2D, Face, Matrix } from ".";
import { Vector } from "./Vector";

export abstract class Camera {
  position: Vertex3D;
  lookAt: Vertex3D;

  constructor(position: Vertex3D, lookAt: Vertex3D) {
    this.position = position;
    this.lookAt = lookAt;
  }

  abstract project(v: Vertex3D): Vertex2D;

  culling(face: Face): boolean {
    return face.getCenter().z > this.position.z;
  }

  move(dx: number, dy: number, dz: number) {
    this.position.move(dx, dy, dz);
  }

  jump(position: Vertex3D) {
    this.position.jump(position.x, position.y, position.z);
  }

  getCenter() {
    return this.position;
  }
}

export class PerspectiveCamera extends Camera {
  distance: number;

  constructor(position: Vertex3D, lookAt: Vertex3D, distance: number) {
    super(position, lookAt)
    this.distance = distance;
  }

  project(vertex : Vertex3D): Vertex2D {
    const dx = this.lookAt.x - this.position.x;
    const dy = this.lookAt.y - this.position.y;
    const dz = this.lookAt.z - this.position.z;

    const theta = Math.atan2(dx, dz);
    const phi = Math.atan2(dy, Math.sqrt(dx ** 2 + dz ** 2));
    const psi = 0;

    const rotatedX = Math.cos(theta) * Math.cos(psi) + Math.sin(theta) * Math.sin(phi) * Math.sin(psi);
    const rotatedY = Math.sin(phi) * Math.sin(psi);
    const rotatedZ = Math.sin(theta) * Math.cos(psi) - Math.cos(theta) * Math.sin(phi) * Math.sin(psi);

    const x = vertex.x - this.position.x;
    const y = vertex.y - this.position.y;
    const z = vertex.z - this.position.z;

    const rotatedPoint = new Vertex3D(
      rotatedX * x + rotatedY * y + rotatedZ * z + this.position.x,
      rotatedY * x + Math.cos(phi) * y - Math.sin(phi) * z + this.position.y,
      rotatedZ * x + Math.sin(phi) * y + Math.cos(phi) * z + this.position.z
    );

    const ratio = (this.distance / ((rotatedPoint.z - this.position.z) || 1));
    return new Vertex2D(ratio * (rotatedPoint.x - this.position.x), ratio * (rotatedPoint.y - this.position.y));
  }


  culling(face: Face): boolean {
    return super.culling(face) && this.perspectiveCurring(face);
  }

  private perspectiveCurring(face: Face): boolean {
    const angle = Matrix.vectorAngle(
      // 面の法線ベクトル
      face.getNormalVector().normalize(),
      // カメラから面の中心に向かうベクトル
      new Vector(this.position, face.getCenter()),
    );
    // ベクトルのなす角が90度を超えている = その面は向こうを向いている
    if (angle < 0) {
      // カリングする
      return true;
    }
    return false;
  }
}

export class OrthographicCamera extends Camera {
  project = ({ x, y }: Vertex3D) => new Vertex2D(x, y);
}
