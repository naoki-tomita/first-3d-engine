var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var c = document.getElementById("canvas").getContext("2d");
var Vertex3D = /** @class */ (function () {
    function Vertex3D(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return Vertex3D;
}());
var Vertex2D = /** @class */ (function () {
    function Vertex2D(x, y) {
        this.x = x;
        this.y = y;
    }
    return Vertex2D;
}());
var Color = /** @class */ (function () {
    function Color(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a || 1;
    }
    Color.prototype.get = function () {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    };
    Color.red = new Color(255, 0, 0);
    Color.green = new Color(0, 255, 0);
    Color.blue = new Color(0, 0, 255);
    Color.yellow = new Color(255, 255, 0);
    Color.pink = new Color(255, 20, 147);
    Color.orange = new Color(255, 99, 71);
    Color.cyan = new Color(0, 255, 255);
    Color.purple = new Color(255, 0, 255);
    return Color;
}());
var Face = /** @class */ (function () {
    function Face(v1, v2, v3, c) {
        this.vertex1 = v1;
        this.vertex2 = v2;
        this.vertex3 = v3;
        this.color = c;
    }
    Face.prototype.getCenter = function () {
        var x = (this.vertex1.x + this.vertex2.x + this.vertex3.x) / 3;
        var y = (this.vertex1.y + this.vertex2.y + this.vertex3.y) / 3;
        var z = (this.vertex1.z + this.vertex2.z + this.vertex3.z) / 3;
        return new Vertex3D(x, y, z);
    };
    return Face;
}());
var Model = /** @class */ (function () {
    function Model(vertices, faces) {
        this.vertices = vertices;
        this.faces = faces;
    }
    Model.prototype.getCenter = function () {
        var sumX = 0, sumY = 0, sumZ = 0;
        this.vertices.forEach(function (v) {
            sumX += v.x;
            sumY += v.y;
            sumZ += v.z;
        });
        var count = this.vertices.length;
        return new Vertex3D(sumX / count, sumY / count, sumZ / count);
    };
    Model.prototype.rotate = function (theta, phi) {
        var center = this.getCenter();
        var ct = Math.cos(theta), st = Math.sin(theta), cp = Math.cos(phi), sp = Math.sin(phi);
        this.vertices.forEach(function (v) {
            var x = v.x - center.x, y = v.y - center.y, z = v.z - center.z;
            v.x = ct * x - st * cp * z + st * sp * y + center.x;
            v.z = st * x + ct * cp * z - ct * sp * y + center.z;
            v.y = sp * z + cp * y + center.y;
        });
    };
    Model.prototype.move = function (dx, dy, dz) {
        this.vertices.forEach(function (v) {
            v.x += dx;
            v.y += dy;
            v.z += dz;
        });
    };
    return Model;
}());
var Cube = /** @class */ (function (_super) {
    __extends(Cube, _super);
    function Cube(initialPoint, width, height, depth, color) {
        var _this = this;
        var w = width / 2, h = height / 2, d = depth / 2, p = initialPoint;
        var v = [
            new Vertex3D(p.x - w, p.y - d, p.z - h),
            new Vertex3D(p.x + w, p.y - d, p.z - h),
            new Vertex3D(p.x - w, p.y - d, p.z + h),
            new Vertex3D(p.x + w, p.y - d, p.z + h),
            new Vertex3D(p.x - w, p.y + d, p.z - h),
            new Vertex3D(p.x + w, p.y + d, p.z - h),
            new Vertex3D(p.x - w, p.y + d, p.z + h),
            new Vertex3D(p.x + w, p.y + d, p.z + h),
        ];
        var f = [
            // 頂点の順序はとても大切。
            // 頂点の順序によって面の生成方向を決める。v1 -> v2 のベクトルと v2 -> v3 のベクトルの外積を法線ベクトルとする。
            new Face(v[2], v[1], v[0], color),
            new Face(v[2], v[3], v[1], color),
            new Face(v[6], v[3], v[2], color),
            new Face(v[7], v[3], v[6], color),
            new Face(v[3], v[5], v[1], color),
            new Face(v[3], v[7], v[5], color),
            new Face(v[5], v[6], v[4], color),
            new Face(v[7], v[6], v[5], color),
            new Face(v[6], v[2], v[0], color),
            new Face(v[4], v[6], v[0], color),
            new Face(v[1], v[4], v[0], color),
            new Face(v[5], v[4], v[1], color),
        ];
        _this = _super.call(this, v, f) || this;
        return _this;
    }
    return Cube;
}(Model));
function project(vertex3d) {
    // // カメラと像を投影するスクリーンの距離
    var d = 200;
    var r = d / vertex3d.z;
    return new Vertex2D(r * vertex3d.x, r * vertex3d.y);
    // return new Vertex2D(vertex3d.x, vertex3d.y);
}
function vector(v1, v2) {
    return new Vertex3D(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}
// ベクトルのなす角というやつ
// この計算自体は cos theta を出すための計算なのだけど、関数名が思いつかなかった。
// thetaは計算不要のはず。
function vectorAngle(v1, v2) {
    return dotProduct(v1, v2) / (norm(v1) * norm(v2));
}
function norm(v) {
    return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));
}
// 内積をとる
function dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.x * v2.y;
}
// 外積をとる
function crossProduct(v1, v2) {
    return new Vertex3D(v1.y * v2.z - v1.z * v2.y, v1.x * v2.z - v1.z * v2.x, v1.x * v2.y - v1.y * v2.x);
}
function isDisplay(face) {
    var v1 = vector(face.vertex1, face.vertex2); // v1 -> v2のベクトル
    var v2 = vector(face.vertex2, face.vertex3); // v2 -> v3のベクトル
    // 外積(法線ベクトル)をとって
    var facevec = crossProduct(v1, v2);
    // 法線ベクトルの奥行き(=y)が負(=カメラ方向を向いている)であれば、表示していい
    if (facevec.z >= 0) {
        return true;
    }
    return false;
}
// dx, dy は 画面の中心を設定する。そこを中心に画像が生成される
function render(objects, ctx, dx, dy) {
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.clearRect(0, 0, dx * 2, dy * 2);
    objects
        .sort(function (a, b) { return b.getCenter().z - a.getCenter().z; })
        .forEach(function (obj) {
        return obj.faces
            .sort(function (a, b) { return b.getCenter().z - a.getCenter().z; })
            .forEach(function (face) {
            if (!isDisplay(face)) {
                return;
            }
            var v1 = project(face.vertex1), v2 = project(face.vertex2), v3 = project(face.vertex3);
            ctx.beginPath();
            ctx.moveTo(v1.x + dx, -v1.y + dy);
            ctx.lineTo(v2.x + dx, -v2.y + dy);
            ctx.lineTo(v3.x + dx, -v3.y + dy);
            ctx.closePath();
            ctx.stroke();
            ctx.fillStyle = face.color.get();
            ctx.fill();
        });
    });
}
var cube1 = new Cube(new Vertex3D(30, 80, 100), 60, 60, 60, Color.red);
// const cube2 = new Cube(new Vertex3D(100, 100, 150), 60, 60, 60, Color.blue);
// const cube3 = new Cube(new Vertex3D(200, 200, 180), 60, 60, 60, Color.green);
// const cube4 = new Cube(new Vertex3D(-100, 0, 40), 60, 60, 60, Color.orange);
// const cube5 = new Cube(new Vertex3D(-100, 140, 100), 60, 60, 60, Color.pink);
var objects = [
    cube1,
];
function autorotate() {
    objects.forEach(function (o) {
        o.rotate(Math.PI / 360, Math.PI / 720);
    });
    render(objects, c, 250, 250);
    setTimeout(autorotate, 10);
}
autorotate();
var currentKey = 0;
document.addEventListener("keydown", function (e) {
    currentKey = e.keyCode;
});
function keymove() {
    var dx = 0, dy = 0, dz = 0;
    switch (currentKey) {
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
    setTimeout(keymove, 1000 / 30);
}
keymove();
