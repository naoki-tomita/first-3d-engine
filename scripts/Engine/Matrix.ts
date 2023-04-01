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
  static rotate(point: Vertex3D, center: Vertex3D, theta: number, phi: number): Vertex3D {
    const ct = Math.cos(theta), st = Math.sin(theta), cp = Math.cos(phi), sp = Math.sin(phi);
    const x = point.x - center.x,
            y = point.y - center.y,
            z = point.z - center.z;

    return new Vertex3D(
      ct * x - st * cp * z + st * sp * y + center.x,
      st * x + ct * cp * z - ct * sp * y + center.z,
      sp * z + cp * y + center.y
    );
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
