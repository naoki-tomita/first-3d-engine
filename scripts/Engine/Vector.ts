import { isNumber } from "../Utils/isNumber";

export class Vector {
  x: number;
  y: number;
  z: number;
  constructor(x: number | Vector, y: number | Vector, z?: number) {
    if (isNumber(x) && isNumber(y) && isNumber(z)) {
      this.x = x;
      this.y = y;
      this.z = z;
    } else if (Vector.isVector(x) && Vector.isVector(y)) {
      this.x = x.x - y.x;
      this.y = x.y - y.y;
      this.z = x.z - y.z;
    }
  }
  static isVector(arg): arg is Vector {
    return isNumber(arg.x) && isNumber(arg.y) && isNumber(arg.z)
  }
}