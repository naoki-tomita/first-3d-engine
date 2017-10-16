const c = (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d");

class Vertex3D {
  x: number;
  y: number;
  z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Vertex2D {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Color {
  r: number;
  g: number;
  b: number;
  a: number;
  constructor(r: number, g: number, b: number, a?: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a || 1;
  }
  get() {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`;
  }
}

const COLOR = {
  red: new Color(255, 0, 0),
  green: new Color(0, 255, 0),
  blue: new Color(0, 0, 255),
  yellow: new Color(255, 255, 0),
  pink: new Color(255, 20, 147),
  orange: new Color(255, 99, 71),
  cyan: new Color(0, 255, 255),
  purple: new Color(255, 0, 255),
};

class Face {
  vertex1: Vertex3D;
  vertex2: Vertex3D;
  vertex3: Vertex3D;
  color: Color;
  constructor(v1: Vertex3D, v2: Vertex3D, v3: Vertex3D, c: Color) {
    this.vertex1 = v1;
    this.vertex2 = v2;
    this.vertex3 = v3;
    this.color = c;
  }
}

class Model {
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
    return new Vertex3D(sumX/count, sumY/count, sumZ/count);
  }
  rotate(theta: number, phi: number) {
    const center = this.getCenter();
    const ct = Math.cos(theta), st = Math.sin(theta), cp = Math.cos(phi), sp = Math.sin(phi);

    this.vertices.forEach((v) => {
      const x = v.x - center.x,
            y = v.y - center.y,
            z = v.z - center.z;

      v.x = ct * x - st * cp * y + st * sp * z + center.x;
      v.y = st * x + ct * cp * y - ct * sp * z + center.y;
      v.z = sp * y + cp * z + center.z;
    });
  }
  move(dx: number, dy: number, dz: number) {
    this.vertices.forEach((v)=> {
      v.x += dx;
      v.y += dy;
      v.z += dz;
    });
  }
}

class Cube extends Model {
  constructor(initialPoint: Vertex3D, width: number, height: number, depth: number) {
    const w = width/2, h = height/2, d = depth/2, p = initialPoint;
    const v = [
      new Vertex3D(p.x - w, p.y - d, p.z - h),
      new Vertex3D(p.x + w, p.y - d, p.z - h),
      new Vertex3D(p.x - w, p.y - d, p.z + h),
      new Vertex3D(p.x + w, p.y - d, p.z + h),
      new Vertex3D(p.x - w, p.y + d, p.z - h),
      new Vertex3D(p.x + w, p.y + d, p.z - h),
      new Vertex3D(p.x - w, p.y + d, p.z + h),
      new Vertex3D(p.x + w, p.y + d, p.z + h),
    ];
    const f = [
      new Face(v[0], v[1], v[2], COLOR.red),
      new Face(v[1], v[3], v[2], COLOR.red),
      new Face(v[2], v[3], v[6], COLOR.blue),
      new Face(v[6], v[3], v[7], COLOR.blue),
      new Face(v[1], v[5], v[3], COLOR.green),
      new Face(v[5], v[7], v[3], COLOR.green),
      new Face(v[4], v[6], v[5], COLOR.orange),
      new Face(v[5], v[6], v[7], COLOR.orange),
      new Face(v[0], v[2], v[6], COLOR.yellow),
      new Face(v[0], v[6], v[4], COLOR.yellow),
      new Face(v[0], v[4], v[1], COLOR.purple),
      new Face(v[1], v[4], v[5], COLOR.purple),
    ];
    super(v, f);
  }
}

function project(vertex3d: Vertex3D) {
  // Distance between the camera and the plane
  var d = 400;
  var r = d / vertex3d.y;

  return new Vertex2D(r * vertex3d.x, r * vertex3d.z);
}

function vec(v1: Vertex3D, v2: Vertex3D) {
  return new Vertex3D(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}

function crossProduct(vec1: Vertex3D, vec2: Vertex3D) {
  return new Vertex3D(vec1.y * vec2.z - vec1.z * vec2.y,
                      vec1.x * vec2.z - vec1.z * vec2.x,
                      vec1.x * vec2.y - vec1.y * vec2.x);
}

function isDisplay(v1: Vertex3D, v2: Vertex3D, v3: Vertex3D) {
  const vec1 = vec(v1, v2);
  const vec2 = vec(v2, v3);
  const facevec = crossProduct(vec1, vec2);
  if (facevec.y < 0) {
    return true;
  }
  return false;
}

function render(objects: Model[], ctx: CanvasRenderingContext2D, dx, dy, d) {
  ctx.strokeStyle = `rgba(0, 0, 0, 1)`;
  ctx.clearRect(0, 0, 500, 500);
  objects.forEach((obj) => obj.faces.forEach((face) => {
    const v1 = project(face.vertex1), 
          v2 = project(face.vertex2), 
          v3 = project(face.vertex3);
    
    if(!isDisplay(face.vertex1, face.vertex2, face.vertex3)) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(v1.x + dx, -v1.y + dy);
    ctx.lineTo(v2.x + dx, -v2.y + dy);
    ctx.lineTo(v3.x + dx, -v3.y + dy);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = face.color.get();
    ctx.fill();
  }));
}

const cube1 = new Cube(new Vertex3D(30, 100, 30), 60, 60, 60);
const cube2 = new Cube(new Vertex3D(-30, -100, -30), 60, 60, 60);
const objects = [ cube1, cube2 ];

function autorotate() {
  objects.forEach(o => {
    o.rotate(Math.PI / 720, Math.PI / 240);
  });
  render(objects, c, 250, 250, 0);
  setTimeout(autorotate, 1);
}

autorotate();