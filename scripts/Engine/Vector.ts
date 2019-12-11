import { Matrix } from "./Matrix";
import { Vertex3D } from "./Vertex3D";
import { isNumber } from "../Utils/isNumber";

export class Vector {
  x: number;
  y: number;
  z: number;

  constructor(x: number | Vector | Vertex3D, y: number | Vector | Vertex3D, z?: number) {
    if (isNumber(x) && isNumber(y) && isNumber(z)) {
      this.x = x;
      this.y = y;
      this.z = z;
    } else if (Vector.isVector(x) && Vector.isVector(y)) {
      this.x = y.x - x.x;
      this.y = y.y - x.y;
      this.z = y.z - x.z;
    }
  }

  static isVector(arg: any): arg is Vector {
    return isNumber(arg.x) && isNumber(arg.y) && isNumber(arg.z);
  }

  normalize(length: number = 1) {
    const norm = Matrix.norm(this) / length;
    return new Vector(this.x / norm, this.y / norm, this.z / norm);
  }

  toVertex3D() {
    return new Vertex3D(this.x, this.y, this.z);
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
}
