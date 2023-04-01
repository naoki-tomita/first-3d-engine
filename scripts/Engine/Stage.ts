import { Model } from "./Model";
import { Vertex3D } from "./Vertex3D";
import { Camera } from "./Camera";

export class Stage {
  objects: Model[];
  camera: Camera;
  constructor(objects: Model[] = [], camera: Camera) {
    this.objects = objects;
    this.camera = camera;
  }

  appear(objects: Model[]) {
    this.objects = [ ...this.objects, ...objects ];
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }

  move(dx: number, dy: number, dz: number) {
    this.objects.forEach(o => o.move(dx, dy, dz));
  }

  rotate(theta: number, phi: number) {
    this.objects.forEach(o => o.rotate(theta, phi, new Vertex3D(0, 0, 0)));
  }

  convertToCameraCoordSystem(): Stage {
    return new Stage(this.objects.map(it => this.camera.modelToCameraCoordSystem(it)), this.camera);
  }

  zsort() {
    return this.objects.slice().sort((a, b) => b.getCenter().z - a.getCenter().z);
  }
}
