import { Model } from "./Model";
import { Vertex3D } from "./Vertex3D";

export class Stage {
  objects: Model[];
  constructor(objects: Model[] = []) {
    this.objects = objects;
  }

  appear(objects: Model[]) {
    this.objects = [ ...this.objects, ...objects ];
  }

  move(dx: number, dy: number, dz: number) {
    this.objects.forEach(o => o.move(dx, dy, dz));
  }

  rotate(theta: number, phi: number) {
    this.objects.forEach(o => o.rotate(theta, phi, new Vertex3D(0, 0, 0)));
  }

  zsort() {
    return this.objects.slice().sort((a, b) => b.getCenter().z - a.getCenter().z);
  }
}
