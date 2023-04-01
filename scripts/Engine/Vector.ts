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

  rotate(phi: number, theta: number, psi: number): Vector {
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    const sinPsi = Math.sin(psi);
    const cosPsi = Math.cos(psi);

    // ロール、ピッチ、ヨーの順に回転させる
    const rotatedX = this.x * (cosTheta * cosPsi) +
                     this.y * (cosTheta * sinPsi) +
                     this.z * (-sinTheta);
    const rotatedY = this.x * (sinPhi * sinTheta * cosPsi - cosPhi * sinPsi) +
                     this.y * (sinPhi * sinTheta * sinPsi + cosPhi * cosPsi) +
                     this.z * (sinPhi * cosTheta);
    const rotatedZ = this.x * (cosPhi * sinTheta * cosPsi + sinPhi * sinPsi) +
                     this.y * (cosPhi * sinTheta * sinPsi - sinPhi * cosPsi) +
                     this.z * (cosPhi * cosTheta);
    return new Vector(rotatedX, rotatedY, rotatedZ);
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
