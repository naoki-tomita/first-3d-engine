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
      new Face(v[0], v[1], v[2], Color.red),
      new Face(v[1], v[3], v[2], Color.red),
      new Face(v[2], v[3], v[6], Color.green),
      new Face(v[6], v[3], v[7], Color.green),
      new Face(v[1], v[5], v[3], Color.blue),
      new Face(v[5], v[7], v[3], Color.blue),
      new Face(v[4], v[6], v[5], Color.purple),
      new Face(v[5], v[6], v[7], Color.purple),
      new Face(v[0], v[2], v[6], Color.yellow),
      new Face(v[0], v[6], v[4], Color.yellow),
      new Face(v[0], v[4], v[1], Color.pink),
      new Face(v[1], v[4], v[5], Color.pink),
    ];
    super(f);
  }
}
