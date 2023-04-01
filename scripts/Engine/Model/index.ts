import { Vertex3D, Face } from "../../Engine";

export class Model {
  faces: Face[];

  constructor(faces: Face[]) {
    this.faces = faces;
  }

  getCenter() {
    let sumX = 0, sumY = 0, sumZ = 0;

    const vertices = this.faces.map(it => ([it.vertex1, it.vertex2, it.vertex3])).flat()
    vertices.forEach((v) => {
      sumX += v.x;
      sumY += v.y;
      sumZ += v.z;
    });
    const count = vertices.length;
    return new Vertex3D(sumX / count, sumY / count, sumZ / count);
  }

  get vertices() {
    return this.faces.map(it => ([it.vertex1, it.vertex2, it.vertex3])).flat();
  }

  rotate(theta: number, phi: number, center: Vertex3D = this.getCenter()) {
    const ct = Math.cos(theta), st = Math.sin(theta), cp = Math.cos(phi), sp = Math.sin(phi);
    this.vertices.forEach((v) => {
      const x = v.x - center.x,
            y = v.y - center.y,
            z = v.z - center.z;

      v.x = ct * x - st * cp * z + st * sp * y + center.x;
      v.z = st * x + ct * cp * z - ct * sp * y + center.z;
      v.y = sp * z + cp * y + center.y;
    });
  }

  move(dx: number, dy: number, dz: number) {
    this.vertices.forEach((v)=> {
      v.x += dx;
      v.y += dy;
      v.z += dz;
    });
  }

  zsort() {
    return this.faces.slice().sort((a, b) => b.getCenter().z - a.getCenter().z);
  }

  mergeModel(model: Model) {
    this.faces = [...this.faces, ...model.faces];
  }
}
