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

  /**
   * ある点を回転させる
   * @param point 回転させたい点
   * @param center 回転させるとき、中央とする点
   * @param phi x軸を回転させる角度
   * @param theta y軸を回転させる角度
   * @param psi z軸を回転させる角度
   */
  static rotate(point: Vertex3D, center: Vertex3D, roll: number, pitch: number, yaw: number): Vertex3D {
    const { cos, sin } = Math;
    const { x, y, z } = point;
    const [Cr, Cp, Cy, Sr, Sp, Sy] = [cos(roll), cos(pitch), cos(yaw), sin(roll), sin(pitch), sin(yaw)];
    const converted = [
      [Cy * Cp, Cy * Sp * Sr - Sy * Cr, Cy * Sp * Cr + Sy * Sr],
      [Sy * Cp, Sy * Sp * Sr - Cy * Cr, Sy * Sp * Cr + Cy * Sr],
      [-Sp,     Cp * Sr               , Cp * Cr               ],
    ].map(i => i[0] * x + i[1] * y + i[2] * z);
    return new Vertex3D(...[converted[0] + center.x, converted[1] + center.y, converted[2] + center.z] as [number, number, number]);
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
