import { Model } from "../Engine";
import { Vertex3D, Face, Color } from "../Engine";

export class Plane extends Model {
  constructor(initialPoint: Vertex3D, width: number, depth: number, color: Color) {
    const w = width / 2, d = depth / 2, p = initialPoint;
    const v = [
      new Vertex3D(p.x - w, p.y, p.z - d),
      new Vertex3D(p.x + w, p.y, p.z - d),
      new Vertex3D(p.x - w, p.y, p.z + d),
      new Vertex3D(p.x + w, p.y, p.z + d),
    ];
    const f = [
      // 頂点の順序はとても大切。
      // 頂点の順序によって面の生成方向を決める。v1 -> v2 のベクトルと v2 -> v3 のベクトルの外積を法線ベクトルとする。
      // 面が上を向いているとき
      new Face(v[2], v[1], v[0], color),
      new Face(v[2], v[3], v[1], color),
      // 面が下を向いているとき
      new Face(v[0], v[1], v[2], color),
      new Face(v[1], v[3], v[2], color),
    ];
    super(f);
  }
}
