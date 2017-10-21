import { Model } from "../Engine";
import { Vertex3D, Face, Color } from "../Engine";

export class Cube extends Model {
  constructor(initialPoint: Vertex3D, width: number, height: number, depth: number, color: Color) {
    const w = width / 2, h = height / 2, d = depth / 2, p = initialPoint;
    const v = [
      new Vertex3D(p.x - w, p.y - h, p.z - d),
      new Vertex3D(p.x + w, p.y - h, p.z - d),
      new Vertex3D(p.x - w, p.y - h, p.z + d),
      new Vertex3D(p.x + w, p.y - h, p.z + d),
      new Vertex3D(p.x - w, p.y + h, p.z - d),
      new Vertex3D(p.x + w, p.y + h, p.z - d),
      new Vertex3D(p.x - w, p.y + h, p.z + d),
      new Vertex3D(p.x + w, p.y + h, p.z + d),
    ];
    const f = [
      // 頂点の順序はとても大切。
      // 頂点の順序によって面の生成方向を決める。v1 -> v2 のベクトルと v2 -> v3 のベクトルの外積を法線ベクトルとする。
      new Face(v[0], v[1], v[2], color),
      new Face(v[1], v[3], v[2], color),
      new Face(v[2], v[3], v[6], color),
      new Face(v[6], v[3], v[7], color),
      new Face(v[1], v[5], v[3], color),
      new Face(v[5], v[7], v[3], color),
      new Face(v[4], v[6], v[5], color),
      new Face(v[5], v[6], v[7], color),
      new Face(v[0], v[2], v[6], color),
      new Face(v[0], v[6], v[4], color),
      new Face(v[0], v[4], v[1], color),
      new Face(v[1], v[4], v[5], color),
    ];
    super(v, f);
  }
}