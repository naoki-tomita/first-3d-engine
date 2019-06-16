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

  culling(face: Face): boolean {
    return super.culling(face) && this.perspectiveCurring(face);
  }

  private perspectiveCurring(face: Face): boolean {
    const angle = Matrix.vectorAngle(
      // 面の法線ベクトル
      face.getNormalVector().normalize(),
      // カメラから面の中心に向かうベクトル
      face.getCenter().toVector(), // TODO: ここはカメラの座標を0, 0, 0として計算しているので移動を考慮する必要がある
    );
    if (angle < 0) {
      return true;
    }
    return false;
  }
}

export class OrthographicCamera extends Camera {
  project = ({ x, y }: Vertex3D) => new Vertex2D(x, y);
}
