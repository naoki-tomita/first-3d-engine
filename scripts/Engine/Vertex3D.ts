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
}