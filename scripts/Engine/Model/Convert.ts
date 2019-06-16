import { Vertex3D } from "../Vertex3D";
import { Face } from "../Face";
import { Color } from "../Color";
import { Model } from "../Model";

export function convert(object: {
  vertics: Array<{ x: number, y: number, z: number }>,
  faces: number[][];
}) {
  const v = object.vertics.map((v: any) => new Vertex3D(v.x, v.y, v.z));
  const f = object.faces.map((f: any) => new Face(v[f[0]], v[f[1]], v[f[2]], Color.orange));
  return new Model(v, f);
}
