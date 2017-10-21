import { Model } from "./Model";

export class Stage {
  objects: Model[];
  constructor(objects: Model[] = []) {
    this.objects = objects;
  }

  appear(objects: Model[]) {
    this.objects = [ ...this.objects, ...objects ];
  }

  zsort() {
    return this.objects.slice().sort((a, b) => b.getCenter().z - a.getCenter().z);
  }
}