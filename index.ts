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
  getCenter() {
    const x = ( this.vertex1.x + this.vertex2.x + this.vertex3.x ) / 3;
    const y = ( this.vertex1.y + this.vertex2.y + this.vertex3.y ) / 3;
    const z = ( this.vertex1.z + this.vertex2.z + this.vertex3.z ) / 3;
    return new Vertex3D(x, y, z);
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
    return new Vertex3D(sumX / count, sumY / count, sumZ / count);
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
      // 頂点の順序はとても大切。
      // 頂点の順序によって面の生成方向を決める。v1 -> v2 のベクトルと v2 -> v3 のベクトルの外積を法線ベクトルとする。
      new Face(v[2], v[1], v[0], COLOR.red),
      new Face(v[2], v[3], v[1], COLOR.red),
      new Face(v[6], v[3], v[2], COLOR.blue),
      new Face(v[7], v[3], v[6], COLOR.blue),
      new Face(v[3], v[5], v[1], COLOR.green),
      new Face(v[3], v[7], v[5], COLOR.green),
      new Face(v[5], v[6], v[4], COLOR.orange),
      new Face(v[7], v[6], v[5], COLOR.orange),
      new Face(v[6], v[2], v[0], COLOR.yellow),
      new Face(v[4], v[6], v[0], COLOR.yellow),
      new Face(v[1], v[4], v[0], COLOR.purple),
      new Face(v[5], v[4], v[1], COLOR.purple),
    ];
    super(v, f);
  }
}

function project(vertex3d: Vertex3D) {
  // カメラと像を投影するスクリーンの距離
  var d = 200;
  var r = d / vertex3d.y;

  return new Vertex2D(r * vertex3d.x, r * vertex3d.z);
}

function vector(v1: Vertex3D, v2: Vertex3D) {
  return new Vertex3D(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}

// ベクトルのなす角というやつ
// この計算自体は cos theta を出すための計算なのだけど、関数名が思いつかなかった。
// thetaは計算不要のはず。
function vectorAngle(v1: Vertex3D, v2: Vertex3D) {
  return dotProduct(v1, v2) / (norm(v1) * norm(v2));
}

function norm(v: Vertex3D) {
  return Math.sqrt(
    Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2)
  );
}

// 内積をとる
function dotProduct(v1: Vertex3D, v2: Vertex3D) {
  return v1.x * v2.x + v1.y * v2.y + v1.x * v2.y;
}

// 外積をとる
function crossProduct(v1: Vertex3D, v2: Vertex3D) {
  return new Vertex3D(v1.y * v2.z - v1.z * v2.y,
                      v1.x * v2.z - v1.z * v2.x,
                      v1.x * v2.y - v1.y * v2.x);
}

function isDisplay(face: Face) {
  const v1 = vector(face.vertex1, face.vertex2); // v1 -> v2のベクトル
  const v2 = vector(face.vertex2, face.vertex3); // v2 -> v3のベクトル
  // 外積(法線ベクトル)をとって
  const facevec = crossProduct(v1, v2);
  // 外積ベクトルとカメラから面までのベクトルのなす角が90度以下なら表示してもいい
  if (vectorAngle(face.getCenter(), facevec) < 0) {
    return true;
  }
  return false;
}
// dx, dy は 画面の中心を設定する。そこを中心に画像が生成される
function render(objects: Model[], ctx: CanvasRenderingContext2D, dx: number, dy: number) {
  ctx.strokeStyle = `rgba(0, 0, 0, 1)`;
  ctx.clearRect(0, 0, dx * 2, dy * 2);
  objects.forEach((obj) => obj.faces.forEach((face) => {
    if(!isDisplay(face)) {
      return;
    }
    const v1 = project(face.vertex1), 
          v2 = project(face.vertex2), 
          v3 = project(face.vertex3);

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

const cube1 = new Cube(new Vertex3D(0, 0, 0), 60, 60, 60);
const cube2 = new Cube(new Vertex3D(0, 100, 0), 60, 60, 60);
const objects = [ 
  // cube1, 
  cube2,
];

function autorotate() {
  objects.forEach(o => {
    o.rotate(Math.PI / 720, Math.PI / 720);
  });
  render(objects, c, 250, 250);
  setTimeout(autorotate, 10);
}

autorotate();

let currentKey = 0;
document.addEventListener("keydown", (e) => {
  currentKey = e.keyCode;
});

function keymove() {
  let dx = 0, dy = 0, dz = 0;
  switch(currentKey) {
    case 37:
      dx -= 10;
      break;
    case 38:
      dy += 10;
      break;
    case 39:
      dx += 10;
      break;
    case 40:
      dy -= 10;
      break;
  }
  currentKey = 0;
  objects[0].move(dx, dy, dz);
  setTimeout(keymove, 1000/30);
}

keymove();