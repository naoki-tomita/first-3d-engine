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
    return Color;
}());
var COLOR = {
    red: new Color(255, 0, 0),
    green: new Color(0, 255, 0),
    blue: new Color(0, 0, 255),
    yellow: new Color(255, 255, 0),
    pink: new Color(255, 20, 147),
    orange: new Color(255, 99, 71),
    cyan: new Color(0, 255, 255),
    purple: new Color(255, 0, 255)
};
var Face = /** @class */ (function () {
    function Face(v1, v2, v3, c) {
        this.vertex1 = v1;
        this.vertex2 = v2;
        this.vertex3 = v3;
        this.color = c;
    }
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
            v.x = ct * x - st * cp * y + st * sp * z + center.x;
            v.y = st * x + ct * cp * y - ct * sp * z + center.y;
            v.z = sp * y + cp * z + center.z;
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
    function Cube(initialPoint, width, height, depth) {
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
        _this = _super.call(this, v, f) || this;
        return _this;
    }
    return Cube;
}(Model));
function project(vertex3d) {
    // カメラと像を投影するスクリーンの距離
    var d = 200;
    var r = d / vertex3d.y;
    return new Vertex2D(r * vertex3d.x, r * vertex3d.z);
}
function vec(v1, v2) {
    return new Vertex3D(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}
// 外積をとる
function crossProduct(vec1, vec2) {
    return new Vertex3D(vec1.y * vec2.z - vec1.z * vec2.y, vec1.x * vec2.z - vec1.z * vec2.x, vec1.x * vec2.y - vec1.y * vec2.x);
}
function isDisplay(v1, v2, v3) {
    var vec1 = vec(v1, v2);
    var vec2 = vec(v2, v3);
    // 外積(法線ベクトル)をとって
    var facevec = crossProduct(vec1, vec2);
    // 外積ベクトルがカメラを向いていれば(yが負であれば)表示してもよい
    if (facevec.y < 0) {
        return true;
    }
    return false;
}
// dx, dy は 
function render(objects, ctx, dx, dy) {
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.clearRect(0, 0, 500, 500);
    objects.forEach(function (obj) { return obj.faces.forEach(function (face) {
        var v1 = project(face.vertex1), v2 = project(face.vertex2), v3 = project(face.vertex3);
        if (!isDisplay(face.vertex1, face.vertex2, face.vertex3)) {
            return;
        }
        ctx.beginPath();
        ctx.moveTo(v1.x, -v1.y);
        ctx.lineTo(v2.x, -v2.y);
        ctx.lineTo(v3.x, -v3.y);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = face.color.get();
        ctx.fill();
    }); });
}
var cube1 = new Cube(new Vertex3D(0, 0, 0), 60, 60, 60);
var cube2 = new Cube(new Vertex3D(0, 100, 0), 60, 60, 60);
var objects = [
    // cube1, 
    cube2,
];
function autorotate() {
    objects.forEach(function (o) {
        o.rotate(Math.PI / 720, Math.PI / 720);
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
