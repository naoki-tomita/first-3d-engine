import { Vector } from "./Vector";
import { Vertex3D } from "./Vertex3D";

export class Matrix {
  // 内積をとる
  static dotProduct(v1: Vector, v2: Vector): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  }

  // 外積をとる
  static crossProduct(v1: Vector, v2: Vector) {
    return new Vector(v1.y * v2.z - v1.z * v2.y,
                      v1.z * v2.x - v1.x * v2.z,
                      v1.x * v2.y - v1.y * v2.x);
  }

  // ベクトルのノルム(長さ)を計算する
  static norm(v: Vector) {
    return Math.sqrt(
      Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2)
    );
  }

  // ベクトルのなす角というやつ
  // この計算自体は cos theta を出すための計算なのだけど、関数名が思いつかなかった。
  // thetaは計算不要のはず。
  static vectorAngle(v1: Vector, v2: Vector) {
    return this.dotProduct(v1, v2) / (this.norm(v1) * this.norm(v2));
  }
}