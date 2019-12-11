import { Vertex3D } from "./Vertex3D";
import { Vertex2D, Face, Matrix } from ".";
import { Vector } from "./Vector";

export abstract class Camera {
  position: Vertex3D;
  direction: Vector;

  constructor(position: Vertex3D, direction: Vector) {
    this.position = position;
    this.direction = direction;
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

  constructor(position: Vertex3D, direction: Vector, distance: number) {
    super(position, direction)
    this.distance = distance;
  }

  project({ x, y, z } : Vertex3D): Vertex2D {
    const ratio = (this.distance / ((z - this.position.z) || 1));
    return new Vertex2D(ratio * (x - this.position.x), ratio * (y - this.position.y));
  }

  project_(vertex : Vertex3D): Vertex2D {
    // 向きのベクトルを得る
    const dx = this.direction.x - this.position.x;
    const dy = this.direction.y - this.position.y;
    const dz = this.direction.z - this.position.z;
    // 向きベクトルから、カメラの回転角を計算する
    const theta = Math.atan2(dx, dy);
    const phi = Math.atan2(dz, dx);
    const psi = Math.atan2(dy, dz);
    // カメラの回転角から、点の座標を逆回転させる => カメラの座標系に変換する
    const rotatedPoint = Matrix.rotate(vertex, this.position, phi, theta, psi);

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
