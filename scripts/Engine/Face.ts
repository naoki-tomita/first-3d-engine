import { Vertex3D } from "./Vertex3D";
import { Vector } from "./Vector";
import { Color } from "./Color";
import { Matrix } from "./Matrix";

export class Face {
  vertex1: Vertex3D;
  vertex2: Vertex3D;
  vertex3: Vertex3D;
  color: Color;
  constructor(v1: Vertex3D, v2: Vertex3D, v3: Vertex3D, c: Color) {
    this.vertex1 = v1;
    this.vertex2 = v2;
    this.vertex3 = v3;
    this.color = c;
  }
  getCenter() {
    const x = ( this.vertex1.x + this.vertex2.x + this.vertex3.x ) / 3;
    const y = ( this.vertex1.y + this.vertex2.y + this.vertex3.y ) / 3;
    const z = ( this.vertex1.z + this.vertex2.z + this.vertex3.z ) / 3;
    return new Vertex3D(x, y, z);
  }
  getNormalVector(): Vector {
    return Matrix.crossProduct(
      new Vector(this.vertex1.toVector(), this.vertex2.toVector()),
      new Vector(this.vertex2.toVector(), this.vertex3.toVector()));
  }
}
