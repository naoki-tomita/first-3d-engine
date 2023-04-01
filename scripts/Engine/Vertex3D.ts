import { Matrix } from ".";
import { Vector } from "./Vector";

export class Vertex3D {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toVector() {
    return new Vector(this.x, this.y, this.z);
  }

  move(dx: number, dy: number, dz: number) {
    this.x += dx;
    this.y += dy;
    this.z += dz;
  }

  jump(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  subtract(other: Vertex3D): Vertex3D {
    return new Vertex3D(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  normalize(): Vector {
    return this.toVector().normalize()
  }

  rotate(center: Vertex3D, theta: number, phi: number): Vertex3D {
    return Matrix.rotate(this, center, theta, phi);
  }
}
