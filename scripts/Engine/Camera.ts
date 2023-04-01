import { Vertex3D } from "./Vertex3D";
import { Vertex2D, Face, Matrix, Model } from ".";
import { Vector } from "./Vector";

type CameraContext = {
    xAxis: Vector;
    yAxis: Vector;
    zAxis: Vector;
    translation: {
      x: number;
      y: number;
      z: number;
    };
  }

export abstract class Camera {
  position: Vertex3D;
  lookAt: Vertex3D;
  context: CameraContext;

  constructor(position: Vertex3D, lookAt: Vertex3D) {
    this.position = position;
    this.lookAt = lookAt;
    this.calcCameraContext();
  }

  abstract project(v: Vertex3D): Vertex2D;

  calcCameraContext() {
    const zAxis = this.position.subtract(this.lookAt).normalize();
    const xAxis = Matrix.crossProduct(Vector.Up, zAxis).normalize();
    const yAxis = Matrix.crossProduct(zAxis, xAxis);
    const translation = {
      x: -Matrix.dotProduct(xAxis, this.position),
      y: -Matrix.dotProduct(yAxis, this.position),
      z: -Matrix.dotProduct(zAxis, this.position),
    }
    this.context = {
      xAxis, yAxis, zAxis,
      translation,
    }
  }

  toCameraCoordSystem(vertex: Vertex3D): Vertex3D {
    const {xAxis, yAxis, zAxis, translation} = this.context;
    const vertexX = Matrix.dotProduct(vertex, xAxis) + translation.x;
    const vertexY = Matrix.dotProduct(vertex, yAxis) + translation.y;
    const vertexZ = Matrix.dotProduct(vertex, zAxis) + translation.z;
    return new Vertex3D(vertexX, vertexY, vertexZ);
  }

  faceToCameraCoordSystem(face: Face): Face {
    return new Face(
      this.toCameraCoordSystem(face.vertex1),
      this.toCameraCoordSystem(face.vertex2),
      this.toCameraCoordSystem(face.vertex3),
      face.color,
    );
  }

  modelToCameraCoordSystem(model: Model): Model {
    return new Model(model.vertices, model.faces.map(it => this.faceToCameraCoordSystem(it)));
  }

  culling(face: Face): boolean {
    return face.getCenter().z > this.position.z;
  }

  move(dx: number, dy: number, dz: number) {
    this.position.move(dx, dy, dz);
  }

  jump(position: Vertex3D) {
    this.position.jump(position.x, position.y, position.z);
  }

  getCenter() {
    return this.position;
  }
}

export class PerspectiveCamera extends Camera {
  distance: number;

  constructor(position: Vertex3D, lookAt: Vertex3D, distance: number) {
    super(position, lookAt)
    this.distance = distance;
  }

  project(vertex: Vertex3D): Vertex2D {
    // const cameraVertex = this.toCameraCoordSystem(vertex);
    const ratio = (this.distance / ((vertex.z - this.position.z) || 1));
    return new Vertex2D(ratio * (vertex.x - this.position.x), ratio * (vertex.y - this.position.y));
  }

  culling(face: Face): boolean {
    return super.culling(face) && this.perspectiveCurring(face);
  }

  private perspectiveCurring(face: Face): boolean {
    const angle = Matrix.vectorAngle(
      // 面の法線ベクトル
      face.getNormalVector().normalize(),
      // カメラから面の中心に向かうベクトル
      new Vector(this.position, this.lookAt),
    );
    // ベクトルのなす角が90度を超えている = その面は向こうを向いている
    if (angle < 0) {
      // カリングする
      return true;
    }
    return false;
  }
}

export class PerspectiveCamera2 extends PerspectiveCamera {
  project({ x, y, z } : Vertex3D): Vertex2D {
    const ratio = (this.distance / ((z - this.position.z) || 1));
    return new Vertex2D(ratio * (x - this.position.x), ratio * (y - this.position.y));
  }
}

export class OrthographicCamera extends Camera {
  project = ({ x, y }: Vertex3D) => new Vertex2D(x, y);
}
