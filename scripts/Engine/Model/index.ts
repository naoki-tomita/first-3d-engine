import { Vertex3D, Face } from "../../Engine";

export class Model {
  vertices: Vertex3D[];
  faces: Face[];

  constructor(vertices: Vertex3D[], faces: Face[]) {
    this.vertices = vertices;
    this.faces = faces;
  }

  getCenter() {
    let sumX = 0, sumY = 0, sumZ = 0;

    this.vertices.forEach((v) => {
      sumX += v.x;
      sumY += v.y;
      sumZ += v.z;
    });
    const count = this.vertices.length;
    return new Vertex3D(sumX / count, sumY / count, sumZ / count);
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
    this.vertices = [...this.vertices, ...model.vertices];
  }
}
