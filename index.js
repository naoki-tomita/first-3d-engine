/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vertex3D_1 = __webpack_require__(1);
exports.Vertex3D = Vertex3D_1.Vertex3D;
var Vertex2D_1 = __webpack_require__(9);
exports.Vertex2D = Vertex2D_1.Vertex2D;
var Matrix_1 = __webpack_require__(3);
exports.Matrix = Matrix_1.Matrix;
var Vector_1 = __webpack_require__(2);
exports.Vector = Vector_1.Vector;
var Color_1 = __webpack_require__(4);
exports.Color = Color_1.Color;
var Stage_1 = __webpack_require__(10);
exports.Stage = Stage_1.Stage;
var Face_1 = __webpack_require__(5);
exports.Face = Face_1.Face;
var Model_1 = __webpack_require__(6);
exports.Model = Model_1.Model;
var Convert_1 = __webpack_require__(11);
exports.convert = Convert_1.convert;
exports.orthographicViewProjection = function (vertex3d) {
    // カメラと像を投影するスクリーンの距離
    var d = 100;
    var z = vertex3d.z || 1;
    var r = d / z;
    return new Vertex2D_1.Vertex2D(r * vertex3d.x, r * vertex3d.y);
};
exports.perspectiveViewProjection = function (vertex3d) {
    return new Vertex2D_1.Vertex2D(vertex3d.x, vertex3d.y);
};
// 面がカメラを向いていない場合に表示しないカリング
exports.normalCulling = function (face) {
    // ベクトルのなす角(カメラから面の中心に向かうベクトル, 面の法線ベクトル)を出す。
    // 結果は cosθ の値がえられる。(-1 ~ 1)
    // 0 ~ 1の範囲が 90°未満であるため、その場合にのみ表示してよい。
    var angle = Matrix_1.Matrix.vectorAngle(
    // 面の法線ベクトル
    face.getNormalVector().normalize(), 
    // カメラから面の中心に向かうベクトル
    face.getCenter().toVector());
    if (angle < 0) {
        return true;
    }
    return false;
};
// カメラの見える範囲の座標にある場合のみ表示する
exports.visibleCulling = function (face) {
    return face.getCenter().z > 0;
};
// カリングを無効にするやつ
exports.disabledCulling = function () {
    return true;
};
function render(stage, options) {
    clear(options);
    renderStage(stage, options);
}
exports.render = render;
function renderStage(stage, options) {
    stage.zsort()
        .forEach(function (model) { return renderModel(model, options); });
}
exports.renderStage = renderStage;
function renderModel(model, options) {
    model.zsort()
        .forEach(function (face) { return renderFace(face, options); });
}
exports.renderModel = renderModel;
function renderFace(face, options) {
    var _a = options.light, light = _a === void 0 ? new Vector_1.Vector(1, -1, 1) : _a, _b = options.projectionMethod, project = _b === void 0 ? exports.perspectiveViewProjection : _b, _c = options.cullingMethod, culling = _c === void 0 ? exports.normalCulling : _c;
    if (!culling(face)) {
        return;
    }
    var color = face.color.get(1 - ((Matrix_1.Matrix.vectorAngle(face.getNormalVector(), light) + 1) / 2));
    var v1 = project(face.vertex1), v2 = project(face.vertex2), v3 = project(face.vertex3);
    draw(v1, v2, v3, color, options);
}
exports.renderFace = renderFace;
// for debugging.
function renderNormalVector(face, options) {
    var center = face.getCenter();
    var normalVec = face.getNormalVector().normalize(20);
    var point = new Vertex3D_1.Vertex3D(center.x + normalVec.x, center.y + normalVec.y, center.z + normalVec.z);
    var f = new Face_1.Face(center, point, center, face.color);
    renderFace(f, options);
}
// low level api.
function clear(options) {
    var context = options.context, canvasSize = options.canvasSize;
    var width = canvasSize.width, height = canvasSize.height;
    context.clearRect(0, 0, width, height);
}
function draw(v1, v2, v3, color, options) {
    var c = options.context, s = options.canvasSize;
    var dx = s.width / 2;
    var dy = s.height / 2;
    c.beginPath();
    c.moveTo(v1.x + dx, -v1.y + dy);
    c.lineTo(v2.x + dx, -v2.y + dy);
    c.lineTo(v3.x + dx, -v3.y + dy);
    c.closePath();
    c.strokeStyle = color;
    c.stroke();
    c.fillStyle = color;
    c.fill();
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vector_1 = __webpack_require__(2);
var Vertex3D = /** @class */ (function () {
    function Vertex3D(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vertex3D.prototype.toVector = function () {
        return new Vector_1.Vector(this.x, this.y, this.z);
    };
    return Vertex3D;
}());
exports.Vertex3D = Vertex3D;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Matrix_1 = __webpack_require__(3);
var Vertex3D_1 = __webpack_require__(1);
var isNumber_1 = __webpack_require__(8);
var Vector = /** @class */ (function () {
    function Vector(x, y, z) {
        if (isNumber_1.isNumber(x) && isNumber_1.isNumber(y) && isNumber_1.isNumber(z)) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        else if (Vector.isVector(x) && Vector.isVector(y)) {
            this.x = y.x - x.x;
            this.y = y.y - x.y;
            this.z = y.z - x.z;
        }
    }
    Vector.isVector = function (arg) {
        return isNumber_1.isNumber(arg.x) && isNumber_1.isNumber(arg.y) && isNumber_1.isNumber(arg.z);
    };
    Vector.prototype.normalize = function (length) {
        if (length === void 0) { length = 1; }
        var norm = Matrix_1.Matrix.norm(this) / length;
        return new Vector(this.x / norm, this.y / norm, this.z / norm);
    };
    Vector.prototype.toVertex3D = function () {
        return new Vertex3D_1.Vertex3D(this.x, this.y, this.z);
    };
    return Vector;
}());
exports.Vector = Vector;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vector_1 = __webpack_require__(2);
var Matrix = /** @class */ (function () {
    function Matrix() {
    }
    // 内積をとる
    Matrix.dotProduct = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    };
    // 外積をとる
    Matrix.crossProduct = function (v1, v2) {
        return new Vector_1.Vector(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
    };
    // ベクトルのノルム(長さ)を計算する
    Matrix.norm = function (v) {
        return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));
    };
    // ベクトルのなす角というやつ
    // この計算自体は cos theta を出すための計算なのだけど、関数名が思いつかなかった。
    // thetaは計算不要のはず。
    Matrix.vectorAngle = function (v1, v2) {
        return this.dotProduct(v1, v2) / (this.norm(v1) * this.norm(v2));
    };
    return Matrix;
}());
exports.Matrix = Matrix;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Color = /** @class */ (function () {
    function Color(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a || 1;
    }
    Color.prototype.get = function (x) {
        if (x === void 0) { x = 1; }
        return "rgba(" + Math.floor(this.r * x) + "," + Math.floor(this.g * x) + "," + Math.floor(this.b * x) + "," + this.a + ")";
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
exports.Color = Color;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vertex3D_1 = __webpack_require__(1);
var Vector_1 = __webpack_require__(2);
var Matrix_1 = __webpack_require__(3);
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
        return new Vertex3D_1.Vertex3D(x, y, z);
    };
    Face.prototype.getNormalVector = function () {
        return Matrix_1.Matrix.crossProduct(new Vector_1.Vector(this.vertex1.toVector(), this.vertex2.toVector()), new Vector_1.Vector(this.vertex2.toVector(), this.vertex3.toVector()));
    };
    return Face;
}());
exports.Face = Face;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Engine_1 = __webpack_require__(0);
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
        return new Engine_1.Vertex3D(sumX / count, sumY / count, sumZ / count);
    };
    Model.prototype.rotate = function (theta, phi, center) {
        if (center === void 0) { center = this.getCenter(); }
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
    Model.prototype.zsort = function () {
        return this.faces.slice().sort(function (a, b) { return b.getCenter().z - a.getCenter().z; });
    };
    return Model;
}());
exports.Model = Model;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Engine_1 = __webpack_require__(0);
var Models_1 = __webpack_require__(12);
var cupJson = __webpack_require__(15);
var c = document.getElementById("canvas").getContext("2d");
// カリング処理用。いまのところ透視図法だとうまくいかない。
function isDisplay(face) {
    var v1 = new Engine_1.Vector(face.vertex1, face.vertex2); // v1 -> v2のベクトル
    var v2 = new Engine_1.Vector(face.vertex2, face.vertex3); // v2 -> v3のベクトル
    // 外積(法線ベクトル)をとって
    var facevec = Engine_1.Matrix.crossProduct(v1, v2);
    // 法線ベクトルの奥行き(=z)が正(=カメラ方向を向いている)であれば、表示していい(奥に行くほうzが大きくなる)
    if (facevec.z >= 0) {
        return true;
    }
    return false;
}
var cube = new Models_1.Cube(new Engine_1.Vertex3D(0, 0, 100), 60, 60, 60, Engine_1.Color.red);
var cup = Engine_1.convert(cupJson);
cup.move(0, 0, 2);
var objects = [
    // cube,
    cup,
];
var stage = new Engine_1.Stage(objects);
function autorotate() {
    objects[0].rotate(Math.PI / 360, Math.PI / 720);
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
            dx -= 1;
            break;
        case 38:
            dz += 1;
            break;
        case 39:
            dx += 1;
            break;
        case 40:
            dz -= 1;
            break;
        default:
            setTimeout(keymove, 1000 / 30);
            return;
    }
    currentKey = 0;
    stage.rotate(Math.PI / 90 * dx, Math.PI / 90 * dz);
    setTimeout(keymove, 1000 / 30);
}
keymove();
function rendering() {
    Engine_1.render(stage, {
        context: c,
        canvasSize: {
            width: 500,
            height: 500,
        },
        projectionMethod: Engine_1.orthographicViewProjection,
        cullingMethod: function (face) {
            return Engine_1.normalCulling(face) && Engine_1.visibleCulling(face);
        }
    });
    setTimeout(rendering, 1000 / 30);
}
rendering();


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isNumber(arg) {
    return typeof arg === "number";
}
exports.isNumber = isNumber;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vertex2D = /** @class */ (function () {
    function Vertex2D(x, y) {
        this.x = x;
        this.y = y;
    }
    return Vertex2D;
}());
exports.Vertex2D = Vertex2D;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vertex3D_1 = __webpack_require__(1);
var Stage = /** @class */ (function () {
    function Stage(objects) {
        if (objects === void 0) { objects = []; }
        this.objects = objects;
    }
    Stage.prototype.appear = function (objects) {
        this.objects = this.objects.concat(objects);
    };
    Stage.prototype.move = function (dx, dy, dz) {
        this.objects.forEach(function (o) { return o.move(dx, dy, dz); });
    };
    Stage.prototype.rotate = function (theta, phi) {
        this.objects.forEach(function (o) { return o.rotate(theta, phi, new Vertex3D_1.Vertex3D(0, 0, 0)); });
    };
    Stage.prototype.zsort = function () {
        return this.objects.slice().sort(function (a, b) { return b.getCenter().z - a.getCenter().z; });
    };
    return Stage;
}());
exports.Stage = Stage;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vertex3D_1 = __webpack_require__(1);
var Face_1 = __webpack_require__(5);
var Color_1 = __webpack_require__(4);
var Model_1 = __webpack_require__(6);
function convert(object) {
    var v = object.vertics.map(function (v) { return new Vertex3D_1.Vertex3D(v.x, v.y, v.z); });
    var f = object.faces.map(function (f) { return new Face_1.Face(v[f[0]], v[f[1]], v[f[2]], Color_1.Color.orange); });
    return new Model_1.Model(v, f);
}
exports.convert = convert;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Cube_1 = __webpack_require__(13);
exports.Cube = Cube_1.Cube;
var Plane_1 = __webpack_require__(14);
exports.Plane = Plane_1.Plane;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var Engine_1 = __webpack_require__(0);
var Engine_2 = __webpack_require__(0);
var Cube = /** @class */ (function (_super) {
    __extends(Cube, _super);
    function Cube(initialPoint, width, height, depth, color) {
        var _this = this;
        var w = width / 2, h = height / 2, d = depth / 2, p = initialPoint;
        var v = [
            new Engine_2.Vertex3D(p.x - w, p.y - h, p.z - d),
            new Engine_2.Vertex3D(p.x + w, p.y - h, p.z - d),
            new Engine_2.Vertex3D(p.x - w, p.y - h, p.z + d),
            new Engine_2.Vertex3D(p.x + w, p.y - h, p.z + d),
            new Engine_2.Vertex3D(p.x - w, p.y + h, p.z - d),
            new Engine_2.Vertex3D(p.x + w, p.y + h, p.z - d),
            new Engine_2.Vertex3D(p.x - w, p.y + h, p.z + d),
            new Engine_2.Vertex3D(p.x + w, p.y + h, p.z + d),
        ];
        var f = [
            // 頂点の順序はとても大切。
            // 頂点の順序によって面の生成方向を決める。v1 -> v2 のベクトルと v2 -> v3 のベクトルの外積を法線ベクトルとする。
            new Engine_2.Face(v[0], v[1], v[2], Engine_2.Color.red),
            new Engine_2.Face(v[1], v[3], v[2], Engine_2.Color.red),
            new Engine_2.Face(v[2], v[3], v[6], Engine_2.Color.green),
            new Engine_2.Face(v[6], v[3], v[7], Engine_2.Color.green),
            new Engine_2.Face(v[1], v[5], v[3], Engine_2.Color.blue),
            new Engine_2.Face(v[5], v[7], v[3], Engine_2.Color.blue),
            new Engine_2.Face(v[4], v[6], v[5], Engine_2.Color.purple),
            new Engine_2.Face(v[5], v[6], v[7], Engine_2.Color.purple),
            new Engine_2.Face(v[0], v[2], v[6], Engine_2.Color.yellow),
            new Engine_2.Face(v[0], v[6], v[4], Engine_2.Color.yellow),
            new Engine_2.Face(v[0], v[4], v[1], Engine_2.Color.pink),
            new Engine_2.Face(v[1], v[4], v[5], Engine_2.Color.pink),
        ];
        _this = _super.call(this, v, f) || this;
        return _this;
    }
    return Cube;
}(Engine_1.Model));
exports.Cube = Cube;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var Engine_1 = __webpack_require__(0);
var Engine_2 = __webpack_require__(0);
var Plane = /** @class */ (function (_super) {
    __extends(Plane, _super);
    function Plane(initialPoint, width, depth, color) {
        var _this = this;
        var w = width / 2, d = depth / 2, p = initialPoint;
        var v = [
            new Engine_2.Vertex3D(p.x - w, p.y, p.z - d),
            new Engine_2.Vertex3D(p.x + w, p.y, p.z - d),
            new Engine_2.Vertex3D(p.x - w, p.y, p.z + d),
            new Engine_2.Vertex3D(p.x + w, p.y, p.z + d),
        ];
        var f = [
            // 頂点の順序はとても大切。
            // 頂点の順序によって面の生成方向を決める。v1 -> v2 のベクトルと v2 -> v3 のベクトルの外積を法線ベクトルとする。
            new Engine_2.Face(v[0], v[1], v[2], color),
            new Engine_2.Face(v[1], v[3], v[2], color),
        ];
        _this = _super.call(this, v, f) || this;
        return _this;
    }
    return Plane;
}(Engine_1.Model));
exports.Plane = Plane;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = {"vertics":[{"x":0,"y":1,"z":-1},{"x":0.30902,"y":1,"z":-0.95106},{"x":0.30902,"y":0.8,"z":-0.95106},{"x":0,"y":0.8,"z":-1},{"x":0.24722,"y":1,"z":-0.76085},{"x":0,"y":1,"z":-0.8},{"x":0,"y":0.8,"z":-0.8},{"x":0.24722,"y":0.8,"z":-0.76085},{"x":0.58779,"y":1,"z":-0.80902},{"x":0.58779,"y":0.8,"z":-0.80902},{"x":0.47023,"y":1,"z":-0.64722},{"x":0.47023,"y":0.8,"z":-0.64722},{"x":0.80902,"y":1,"z":-0.58779},{"x":0.80902,"y":0.8,"z":-0.58779},{"x":0.64722,"y":1,"z":-0.47023},{"x":0.64722,"y":0.8,"z":-0.47023},{"x":0.95106,"y":1,"z":-0.30902},{"x":0.95106,"y":0.8,"z":-0.30902},{"x":0.76085,"y":1,"z":-0.24722},{"x":0.76085,"y":0.8,"z":-0.24722},{"x":1,"y":1,"z":0},{"x":1,"y":0.8,"z":0},{"x":0.8,"y":1,"z":0},{"x":0.8,"y":0.8,"z":0},{"x":0.95106,"y":1,"z":0.30901},{"x":0.95106,"y":0.8,"z":0.30901},{"x":0.76085,"y":1,"z":0.24721},{"x":0.76085,"y":0.8,"z":0.24721},{"x":0.80902,"y":1,"z":0.58778},{"x":0.80902,"y":0.8,"z":0.58778},{"x":0.64722,"y":1,"z":0.47022},{"x":0.64722,"y":0.8,"z":0.47022},{"x":0.58779,"y":1,"z":0.80901},{"x":0.58779,"y":0.8,"z":0.80901},{"x":0.47023,"y":1,"z":0.64721},{"x":0.47023,"y":0.8,"z":0.64721},{"x":0.30902,"y":1,"z":0.95105},{"x":0.30902,"y":0.8,"z":0.95105},{"x":0.24721,"y":1,"z":0.76084},{"x":0.24721,"y":0.8,"z":0.76084},{"x":0,"y":1,"z":1},{"x":0,"y":0.8,"z":1},{"x":0,"y":1,"z":0.8},{"x":0,"y":0.8,"z":0.8},{"x":-0.30902,"y":1,"z":0.95105},{"x":-0.30902,"y":0.8,"z":0.95105},{"x":-0.24721,"y":1,"z":0.76084},{"x":-0.24721,"y":0.8,"z":0.76084},{"x":-0.58778,"y":1,"z":0.80901},{"x":-0.58778,"y":0.8,"z":0.80901},{"x":-0.47023,"y":1,"z":0.64721},{"x":-0.47023,"y":0.8,"z":0.64721},{"x":-0.80901,"y":1,"z":0.58778},{"x":-0.80901,"y":0.8,"z":0.58778},{"x":-0.64721,"y":1,"z":0.47022},{"x":-0.64721,"y":0.8,"z":0.47022},{"x":-0.95105,"y":1,"z":0.30901},{"x":-0.95105,"y":0.8,"z":0.30901},{"x":-0.76084,"y":1,"z":0.24721},{"x":-0.76084,"y":0.8,"z":0.24721},{"x":-1,"y":1,"z":0},{"x":-1,"y":0.8,"z":0},{"x":-0.8,"y":1,"z":0},{"x":-0.8,"y":0.8,"z":0},{"x":-0.95105,"y":1,"z":-0.30902},{"x":-0.95105,"y":0.8,"z":-0.30902},{"x":-0.76084,"y":1,"z":-0.24722},{"x":-0.76084,"y":0.8,"z":-0.24722},{"x":-0.80901,"y":1,"z":-0.58779},{"x":-0.80901,"y":0.8,"z":-0.58779},{"x":-0.64721,"y":1,"z":-0.47023},{"x":-0.64721,"y":0.8,"z":-0.47023},{"x":-0.58778,"y":1,"z":-0.80902},{"x":-0.58778,"y":0.8,"z":-0.80902},{"x":-0.47022,"y":1,"z":-0.64722},{"x":-0.47022,"y":0.8,"z":-0.64722},{"x":-0.30901,"y":1,"z":-0.95106},{"x":-0.30901,"y":0.8,"z":-0.95106},{"x":-0.24721,"y":1,"z":-0.76085},{"x":-0.24721,"y":0.8,"z":-0.76085},{"x":0,"y":1,"z":-1},{"x":0,"y":0.8,"z":-1},{"x":0,"y":1,"z":-0.8},{"x":0,"y":0.8,"z":-0.8},{"x":0.30902,"y":0.6,"z":-0.95106},{"x":0,"y":0.6,"z":-1},{"x":0,"y":0.6,"z":-0.8},{"x":0.24722,"y":0.6,"z":-0.76085},{"x":0.58779,"y":0.6,"z":-0.80902},{"x":0.47023,"y":0.6,"z":-0.64722},{"x":0.80902,"y":0.6,"z":-0.58779},{"x":0.64722,"y":0.6,"z":-0.47023},{"x":0.95106,"y":0.6,"z":-0.30902},{"x":0.76085,"y":0.6,"z":-0.24722},{"x":1,"y":0.6,"z":0},{"x":0.8,"y":0.6,"z":0},{"x":0.95106,"y":0.6,"z":0.30901},{"x":0.76085,"y":0.6,"z":0.24721},{"x":0.80902,"y":0.6,"z":0.58778},{"x":0.64722,"y":0.6,"z":0.47022},{"x":0.58779,"y":0.6,"z":0.80901},{"x":0.47023,"y":0.6,"z":0.64721},{"x":0.30902,"y":0.6,"z":0.95105},{"x":0.24721,"y":0.6,"z":0.76084},{"x":0,"y":0.6,"z":1},{"x":0,"y":0.6,"z":0.8},{"x":-0.30902,"y":0.6,"z":0.95105},{"x":-0.24721,"y":0.6,"z":0.76084},{"x":-0.58778,"y":0.6,"z":0.80901},{"x":-0.47023,"y":0.6,"z":0.64721},{"x":-0.80901,"y":0.6,"z":0.58778},{"x":-0.64721,"y":0.6,"z":0.47022},{"x":-0.95105,"y":0.6,"z":0.30901},{"x":-0.76084,"y":0.6,"z":0.24721},{"x":-1,"y":0.6,"z":0},{"x":-0.8,"y":0.6,"z":0},{"x":-0.95105,"y":0.6,"z":-0.30902},{"x":-0.76084,"y":0.6,"z":-0.24722},{"x":-0.80901,"y":0.6,"z":-0.58779},{"x":-0.64721,"y":0.6,"z":-0.47023},{"x":-0.58778,"y":0.6,"z":-0.80902},{"x":-0.47022,"y":0.6,"z":-0.64722},{"x":-0.30901,"y":0.6,"z":-0.95106},{"x":-0.24721,"y":0.6,"z":-0.76085},{"x":0,"y":0.6,"z":-1},{"x":0,"y":0.6,"z":-0.8},{"x":0.30902,"y":0.4,"z":-0.95106},{"x":0,"y":0.4,"z":-1},{"x":0,"y":0.4,"z":-0.8},{"x":0.24722,"y":0.4,"z":-0.76085},{"x":0.58779,"y":0.4,"z":-0.80902},{"x":0.47023,"y":0.4,"z":-0.64722},{"x":0.80902,"y":0.4,"z":-0.58779},{"x":0.64722,"y":0.4,"z":-0.47023},{"x":0.95106,"y":0.4,"z":-0.30902},{"x":0.76085,"y":0.4,"z":-0.24722},{"x":1,"y":0.4,"z":0},{"x":0.8,"y":0.4,"z":0},{"x":0.95106,"y":0.4,"z":0.30901},{"x":0.76085,"y":0.4,"z":0.24721},{"x":0.80902,"y":0.4,"z":0.58778},{"x":0.64722,"y":0.4,"z":0.47022},{"x":0.58779,"y":0.4,"z":0.80901},{"x":0.47023,"y":0.4,"z":0.64721},{"x":0.30902,"y":0.4,"z":0.95105},{"x":0.24721,"y":0.4,"z":0.76084},{"x":0,"y":0.4,"z":1},{"x":0,"y":0.4,"z":0.8},{"x":-0.30902,"y":0.4,"z":0.95105},{"x":-0.24721,"y":0.4,"z":0.76084},{"x":-0.58778,"y":0.4,"z":0.80901},{"x":-0.47023,"y":0.4,"z":0.64721},{"x":-0.80901,"y":0.4,"z":0.58778},{"x":-0.64721,"y":0.4,"z":0.47022},{"x":-0.95105,"y":0.4,"z":0.30901},{"x":-0.76084,"y":0.4,"z":0.24721},{"x":-1,"y":0.4,"z":0},{"x":-0.8,"y":0.4,"z":0},{"x":-0.95105,"y":0.4,"z":-0.30902},{"x":-0.76084,"y":0.4,"z":-0.24722},{"x":-0.80901,"y":0.4,"z":-0.58779},{"x":-0.64721,"y":0.4,"z":-0.47023},{"x":-0.58778,"y":0.4,"z":-0.80902},{"x":-0.47022,"y":0.4,"z":-0.64722},{"x":-0.30901,"y":0.4,"z":-0.95106},{"x":-0.24721,"y":0.4,"z":-0.76085},{"x":0,"y":0.4,"z":-1},{"x":0,"y":0.4,"z":-0.8},{"x":0.30902,"y":0.2,"z":-0.95106},{"x":0,"y":0.2,"z":-1},{"x":0,"y":0.2,"z":-0.8},{"x":0.24722,"y":0.2,"z":-0.76085},{"x":0.58779,"y":0.2,"z":-0.80902},{"x":0.47023,"y":0.2,"z":-0.64722},{"x":0.80902,"y":0.2,"z":-0.58779},{"x":0.64722,"y":0.2,"z":-0.47023},{"x":0.95106,"y":0.2,"z":-0.30902},{"x":0.76085,"y":0.2,"z":-0.24722},{"x":1,"y":0.2,"z":0},{"x":0.8,"y":0.2,"z":0},{"x":0.95106,"y":0.2,"z":0.30901},{"x":0.76085,"y":0.2,"z":0.24721},{"x":0.80902,"y":0.2,"z":0.58778},{"x":0.64722,"y":0.2,"z":0.47022},{"x":0.58779,"y":0.2,"z":0.80901},{"x":0.47023,"y":0.2,"z":0.64721},{"x":0.30902,"y":0.2,"z":0.95105},{"x":0.24721,"y":0.2,"z":0.76084},{"x":0,"y":0.2,"z":1},{"x":0,"y":0.2,"z":0.8},{"x":-0.30902,"y":0.2,"z":0.95105},{"x":-0.24721,"y":0.2,"z":0.76084},{"x":-0.58778,"y":0.2,"z":0.80901},{"x":-0.47023,"y":0.2,"z":0.64721},{"x":-0.80901,"y":0.2,"z":0.58778},{"x":-0.64721,"y":0.2,"z":0.47022},{"x":-0.95105,"y":0.2,"z":0.30901},{"x":-0.76084,"y":0.2,"z":0.24721},{"x":-1,"y":0.2,"z":0},{"x":-0.8,"y":0.2,"z":0},{"x":-0.95105,"y":0.2,"z":-0.30902},{"x":-0.76084,"y":0.2,"z":-0.24722},{"x":-0.80901,"y":0.2,"z":-0.58779},{"x":-0.64721,"y":0.2,"z":-0.47023},{"x":-0.58778,"y":0.2,"z":-0.80902},{"x":-0.47022,"y":0.2,"z":-0.64722},{"x":-0.30901,"y":0.2,"z":-0.95106},{"x":-0.24721,"y":0.2,"z":-0.76085},{"x":0,"y":0.2,"z":-1},{"x":0,"y":0.2,"z":-0.8},{"x":0.30902,"y":0,"z":-0.95106},{"x":0,"y":0,"z":-1},{"x":0,"y":0,"z":-0.8},{"x":0.24722,"y":0,"z":-0.76085},{"x":0.58779,"y":0,"z":-0.80902},{"x":0.47023,"y":0,"z":-0.64722},{"x":0.80902,"y":0,"z":-0.58779},{"x":0.64722,"y":0,"z":-0.47023},{"x":0.95106,"y":0,"z":-0.30902},{"x":0.76085,"y":0,"z":-0.24722},{"x":1,"y":0,"z":0},{"x":0.8,"y":0,"z":0},{"x":0.95106,"y":0,"z":0.30901},{"x":0.76085,"y":0,"z":0.24721},{"x":0.80902,"y":0,"z":0.58778},{"x":0.64722,"y":0,"z":0.47022},{"x":0.58779,"y":0,"z":0.80901},{"x":0.47023,"y":0,"z":0.64721},{"x":0.30902,"y":0,"z":0.95105},{"x":0.24721,"y":0,"z":0.76084},{"x":0,"y":0,"z":1},{"x":0,"y":0,"z":0.8},{"x":-0.30902,"y":0,"z":0.95105},{"x":-0.24721,"y":0,"z":0.76084},{"x":-0.58778,"y":0,"z":0.80901},{"x":-0.47023,"y":0,"z":0.64721},{"x":-0.80901,"y":0,"z":0.58778},{"x":-0.64721,"y":0,"z":0.47022},{"x":-0.95105,"y":0,"z":0.30901},{"x":-0.76084,"y":0,"z":0.24721},{"x":-1,"y":0,"z":0},{"x":-0.8,"y":0,"z":0},{"x":-0.95105,"y":0,"z":-0.30902},{"x":-0.76084,"y":0,"z":-0.24722},{"x":-0.80901,"y":0,"z":-0.58779},{"x":-0.64721,"y":0,"z":-0.47023},{"x":-0.58778,"y":0,"z":-0.80902},{"x":-0.47022,"y":0,"z":-0.64722},{"x":-0.30901,"y":0,"z":-0.95106},{"x":-0.24721,"y":0,"z":-0.76085},{"x":0,"y":0,"z":-1},{"x":0,"y":0,"z":-0.8},{"x":0.30902,"y":-0.2,"z":-0.95106},{"x":0,"y":-0.2,"z":-1},{"x":0,"y":-0.2,"z":-0.8},{"x":0.24722,"y":-0.2,"z":-0.76085},{"x":0.58779,"y":-0.2,"z":-0.80902},{"x":0.47023,"y":-0.2,"z":-0.64722},{"x":0.80902,"y":-0.2,"z":-0.58779},{"x":0.64722,"y":-0.2,"z":-0.47023},{"x":0.95106,"y":-0.2,"z":-0.30902},{"x":0.76085,"y":-0.2,"z":-0.24722},{"x":1,"y":-0.2,"z":0},{"x":0.8,"y":-0.2,"z":0},{"x":0.95106,"y":-0.2,"z":0.30901},{"x":0.76085,"y":-0.2,"z":0.24721},{"x":0.80902,"y":-0.2,"z":0.58778},{"x":0.64722,"y":-0.2,"z":0.47022},{"x":0.58779,"y":-0.2,"z":0.80901},{"x":0.47023,"y":-0.2,"z":0.64721},{"x":0.30902,"y":-0.2,"z":0.95105},{"x":0.24721,"y":-0.2,"z":0.76084},{"x":0,"y":-0.2,"z":1},{"x":0,"y":-0.2,"z":0.8},{"x":-0.30902,"y":-0.2,"z":0.95105},{"x":-0.24721,"y":-0.2,"z":0.76084},{"x":-0.58778,"y":-0.2,"z":0.80901},{"x":-0.47023,"y":-0.2,"z":0.64721},{"x":-0.80901,"y":-0.2,"z":0.58778},{"x":-0.64721,"y":-0.2,"z":0.47022},{"x":-0.95105,"y":-0.2,"z":0.30901},{"x":-0.76084,"y":-0.2,"z":0.24721},{"x":-1,"y":-0.2,"z":0},{"x":-0.8,"y":-0.2,"z":0},{"x":-0.95105,"y":-0.2,"z":-0.30902},{"x":-0.76084,"y":-0.2,"z":-0.24722},{"x":-0.80901,"y":-0.2,"z":-0.58779},{"x":-0.64721,"y":-0.2,"z":-0.47023},{"x":-0.58778,"y":-0.2,"z":-0.80902},{"x":-0.47022,"y":-0.2,"z":-0.64722},{"x":-0.30901,"y":-0.2,"z":-0.95106},{"x":-0.24721,"y":-0.2,"z":-0.76085},{"x":0,"y":-0.2,"z":-1},{"x":0,"y":-0.2,"z":-0.8},{"x":0.30902,"y":-0.4,"z":-0.95106},{"x":0,"y":-0.4,"z":-1},{"x":0,"y":-0.4,"z":-0.8},{"x":0.24722,"y":-0.4,"z":-0.76085},{"x":0.58779,"y":-0.4,"z":-0.80902},{"x":0.47023,"y":-0.4,"z":-0.64722},{"x":0.80902,"y":-0.4,"z":-0.58779},{"x":0.64722,"y":-0.4,"z":-0.47023},{"x":0.95106,"y":-0.4,"z":-0.30902},{"x":0.76085,"y":-0.4,"z":-0.24722},{"x":1,"y":-0.4,"z":0},{"x":0.8,"y":-0.4,"z":0},{"x":0.95106,"y":-0.4,"z":0.30901},{"x":0.76085,"y":-0.4,"z":0.24721},{"x":0.80902,"y":-0.4,"z":0.58778},{"x":0.64722,"y":-0.4,"z":0.47022},{"x":0.58779,"y":-0.4,"z":0.80901},{"x":0.47023,"y":-0.4,"z":0.64721},{"x":0.30902,"y":-0.4,"z":0.95105},{"x":0.24721,"y":-0.4,"z":0.76084},{"x":0,"y":-0.4,"z":1},{"x":0,"y":-0.4,"z":0.8},{"x":-0.30902,"y":-0.4,"z":0.95105},{"x":-0.24721,"y":-0.4,"z":0.76084},{"x":-0.58778,"y":-0.4,"z":0.80901},{"x":-0.47023,"y":-0.4,"z":0.64721},{"x":-0.80901,"y":-0.4,"z":0.58778},{"x":-0.64721,"y":-0.4,"z":0.47022},{"x":-0.95105,"y":-0.4,"z":0.30901},{"x":-0.76084,"y":-0.4,"z":0.24721},{"x":-1,"y":-0.4,"z":0},{"x":-0.8,"y":-0.4,"z":0},{"x":-0.95105,"y":-0.4,"z":-0.30902},{"x":-0.76084,"y":-0.4,"z":-0.24722},{"x":-0.80901,"y":-0.4,"z":-0.58779},{"x":-0.64721,"y":-0.4,"z":-0.47023},{"x":-0.58778,"y":-0.4,"z":-0.80902},{"x":-0.47022,"y":-0.4,"z":-0.64722},{"x":-0.30901,"y":-0.4,"z":-0.95106},{"x":-0.24721,"y":-0.4,"z":-0.76085},{"x":0,"y":-0.4,"z":-1},{"x":0,"y":-0.4,"z":-0.8},{"x":0.30902,"y":-0.6,"z":-0.95106},{"x":0,"y":-0.6,"z":-1},{"x":0,"y":-0.6,"z":-0.8},{"x":0.24722,"y":-0.6,"z":-0.76085},{"x":0.58779,"y":-0.6,"z":-0.80902},{"x":0.47023,"y":-0.6,"z":-0.64722},{"x":0.80902,"y":-0.6,"z":-0.58779},{"x":0.64722,"y":-0.6,"z":-0.47023},{"x":0.95106,"y":-0.6,"z":-0.30902},{"x":0.76085,"y":-0.6,"z":-0.24722},{"x":1,"y":-0.6,"z":0},{"x":0.8,"y":-0.6,"z":0},{"x":0.95106,"y":-0.6,"z":0.30901},{"x":0.76085,"y":-0.6,"z":0.24721},{"x":0.80902,"y":-0.6,"z":0.58778},{"x":0.64722,"y":-0.6,"z":0.47022},{"x":0.58779,"y":-0.6,"z":0.80901},{"x":0.47023,"y":-0.6,"z":0.64721},{"x":0.30902,"y":-0.6,"z":0.95105},{"x":0.24721,"y":-0.6,"z":0.76084},{"x":0,"y":-0.6,"z":1},{"x":0,"y":-0.6,"z":0.8},{"x":-0.30902,"y":-0.6,"z":0.95105},{"x":-0.24721,"y":-0.6,"z":0.76084},{"x":-0.58778,"y":-0.6,"z":0.80901},{"x":-0.47023,"y":-0.6,"z":0.64721},{"x":-0.80901,"y":-0.6,"z":0.58778},{"x":-0.64721,"y":-0.6,"z":0.47022},{"x":-0.95105,"y":-0.6,"z":0.30901},{"x":-0.76084,"y":-0.6,"z":0.24721},{"x":-1,"y":-0.6,"z":0},{"x":-0.8,"y":-0.6,"z":0},{"x":-0.95105,"y":-0.6,"z":-0.30902},{"x":-0.76084,"y":-0.6,"z":-0.24722},{"x":-0.80901,"y":-0.6,"z":-0.58779},{"x":-0.64721,"y":-0.6,"z":-0.47023},{"x":-0.58778,"y":-0.6,"z":-0.80902},{"x":-0.47022,"y":-0.6,"z":-0.64722},{"x":-0.30901,"y":-0.6,"z":-0.95106},{"x":-0.24721,"y":-0.6,"z":-0.76085},{"x":0,"y":-0.6,"z":-1},{"x":0,"y":-0.6,"z":-0.8},{"x":0.30902,"y":-0.8,"z":-0.95106},{"x":0,"y":-0.8,"z":-1},{"x":0,"y":-0.8,"z":-0.8},{"x":0.24722,"y":-0.8,"z":-0.76085},{"x":0.58779,"y":-0.8,"z":-0.80902},{"x":0.47023,"y":-0.8,"z":-0.64722},{"x":0.80902,"y":-0.8,"z":-0.58779},{"x":0.64722,"y":-0.8,"z":-0.47023},{"x":0.95106,"y":-0.8,"z":-0.30902},{"x":0.76085,"y":-0.8,"z":-0.24722},{"x":1,"y":-0.8,"z":0},{"x":0.8,"y":-0.8,"z":0},{"x":0.95106,"y":-0.8,"z":0.30901},{"x":0.76085,"y":-0.8,"z":0.24721},{"x":0.80902,"y":-0.8,"z":0.58778},{"x":0.64722,"y":-0.8,"z":0.47022},{"x":0.58779,"y":-0.8,"z":0.80901},{"x":0.47023,"y":-0.8,"z":0.64721},{"x":0.30902,"y":-0.8,"z":0.95105},{"x":0.24721,"y":-0.8,"z":0.76084},{"x":0,"y":-0.8,"z":1},{"x":0,"y":-0.8,"z":0.8},{"x":-0.30902,"y":-0.8,"z":0.95105},{"x":-0.24721,"y":-0.8,"z":0.76084},{"x":-0.58778,"y":-0.8,"z":0.80901},{"x":-0.47023,"y":-0.8,"z":0.64721},{"x":-0.80901,"y":-0.8,"z":0.58778},{"x":-0.64721,"y":-0.8,"z":0.47022},{"x":-0.95105,"y":-0.8,"z":0.30901},{"x":-0.76084,"y":-0.8,"z":0.24721},{"x":-1,"y":-0.8,"z":0},{"x":-0.8,"y":-0.8,"z":0},{"x":-0.95105,"y":-0.8,"z":-0.30902},{"x":-0.76084,"y":-0.8,"z":-0.24722},{"x":-0.80901,"y":-0.8,"z":-0.58779},{"x":-0.64721,"y":-0.8,"z":-0.47023},{"x":-0.58778,"y":-0.8,"z":-0.80902},{"x":-0.47022,"y":-0.8,"z":-0.64722},{"x":-0.30901,"y":-0.8,"z":-0.95106},{"x":-0.24721,"y":-0.8,"z":-0.76085},{"x":0,"y":-0.8,"z":-1},{"x":0,"y":-0.8,"z":-0.8},{"x":0.30902,"y":-1,"z":-0.95106},{"x":0,"y":-1,"z":-1},{"x":0,"y":-1,"z":-0.8},{"x":0.24722,"y":-1,"z":-0.76085},{"x":0.58779,"y":-1,"z":-0.80902},{"x":0.47023,"y":-1,"z":-0.64722},{"x":0.80902,"y":-1,"z":-0.58779},{"x":0.64722,"y":-1,"z":-0.47023},{"x":0.95106,"y":-1,"z":-0.30902},{"x":0.76085,"y":-1,"z":-0.24722},{"x":1,"y":-1,"z":0},{"x":0.8,"y":-1,"z":0},{"x":0.95106,"y":-1,"z":0.30901},{"x":0.76085,"y":-1,"z":0.24721},{"x":0.80902,"y":-1,"z":0.58778},{"x":0.64722,"y":-1,"z":0.47022},{"x":0.58779,"y":-1,"z":0.80901},{"x":0.47023,"y":-1,"z":0.64721},{"x":0.30902,"y":-1,"z":0.95105},{"x":0.24721,"y":-1,"z":0.76084},{"x":0,"y":-1,"z":1},{"x":0,"y":-1,"z":0.8},{"x":-0.30902,"y":-1,"z":0.95105},{"x":-0.24721,"y":-1,"z":0.76084},{"x":-0.58778,"y":-1,"z":0.80901},{"x":-0.47023,"y":-1,"z":0.64721},{"x":-0.80901,"y":-1,"z":0.58778},{"x":-0.64721,"y":-1,"z":0.47022},{"x":-0.95105,"y":-1,"z":0.30901},{"x":-0.76084,"y":-1,"z":0.24721},{"x":-1,"y":-1,"z":0},{"x":-0.8,"y":-1,"z":0},{"x":-0.95105,"y":-1,"z":-0.30902},{"x":-0.76084,"y":-1,"z":-0.24722},{"x":-0.80901,"y":-1,"z":-0.58779},{"x":-0.64721,"y":-1,"z":-0.47023},{"x":-0.58778,"y":-1,"z":-0.80902},{"x":-0.47022,"y":-1,"z":-0.64722},{"x":-0.30901,"y":-1,"z":-0.95106},{"x":-0.24721,"y":-1,"z":-0.76085},{"x":0,"y":-1,"z":-1},{"x":0,"y":-1,"z":-0.8},{"x":0.24722,"y":1,"z":-0.76085},{"x":0.30902,"y":1,"z":-0.95106},{"x":0,"y":-1,"z":-1},{"x":0.30902,"y":-1,"z":-0.95106},{"x":0.24722,"y":-1,"z":-0.76085},{"x":0,"y":-1,"z":-0.8},{"x":0.47023,"y":1,"z":-0.64722},{"x":0.58779,"y":1,"z":-0.80902},{"x":0.58779,"y":-1,"z":-0.80902},{"x":0.47023,"y":-1,"z":-0.64722},{"x":0.64722,"y":1,"z":-0.47023},{"x":0.80902,"y":1,"z":-0.58779},{"x":0.80902,"y":-1,"z":-0.58779},{"x":0.64722,"y":-1,"z":-0.47023},{"x":0.76085,"y":1,"z":-0.24722},{"x":0.95106,"y":1,"z":-0.30902},{"x":0.95106,"y":-1,"z":-0.30902},{"x":0.76085,"y":-1,"z":-0.24722},{"x":0.8,"y":1,"z":0},{"x":1,"y":1,"z":0},{"x":1,"y":-1,"z":0},{"x":0.8,"y":-1,"z":0},{"x":0.76085,"y":1,"z":0.24721},{"x":0.95106,"y":1,"z":0.30901},{"x":0.95106,"y":-1,"z":0.30901},{"x":0.76085,"y":-1,"z":0.24721},{"x":0.64722,"y":1,"z":0.47022},{"x":0.80902,"y":1,"z":0.58778},{"x":0.80902,"y":-1,"z":0.58778},{"x":0.64722,"y":-1,"z":0.47022},{"x":0.47023,"y":1,"z":0.64721},{"x":0.58779,"y":1,"z":0.80901},{"x":0.58779,"y":-1,"z":0.80901},{"x":0.47023,"y":-1,"z":0.64721},{"x":0.24721,"y":1,"z":0.76084},{"x":0.30902,"y":1,"z":0.95105},{"x":0.30902,"y":-1,"z":0.95105},{"x":0.24721,"y":-1,"z":0.76084},{"x":0,"y":1,"z":0.8},{"x":0,"y":1,"z":1},{"x":0,"y":-1,"z":1},{"x":0,"y":-1,"z":0.8},{"x":-0.24721,"y":1,"z":0.76084},{"x":-0.30902,"y":1,"z":0.95105},{"x":-0.30902,"y":-1,"z":0.95105},{"x":-0.24721,"y":-1,"z":0.76084},{"x":-0.47023,"y":1,"z":0.64721},{"x":-0.58778,"y":1,"z":0.80901},{"x":-0.58778,"y":-1,"z":0.80901},{"x":-0.47023,"y":-1,"z":0.64721},{"x":-0.64721,"y":1,"z":0.47022},{"x":-0.80901,"y":1,"z":0.58778},{"x":-0.80901,"y":-1,"z":0.58778},{"x":-0.64721,"y":-1,"z":0.47022},{"x":-0.76084,"y":1,"z":0.24721},{"x":-0.95105,"y":1,"z":0.30901},{"x":-0.95105,"y":-1,"z":0.30901},{"x":-0.76084,"y":-1,"z":0.24721},{"x":-0.8,"y":1,"z":0},{"x":-1,"y":1,"z":0},{"x":-1,"y":-1,"z":0},{"x":-0.8,"y":-1,"z":0},{"x":-0.76084,"y":1,"z":-0.24722},{"x":-0.95105,"y":1,"z":-0.30902},{"x":-0.95105,"y":-1,"z":-0.30902},{"x":-0.76084,"y":-1,"z":-0.24722},{"x":-0.64721,"y":1,"z":-0.47023},{"x":-0.80901,"y":1,"z":-0.58779},{"x":-0.80901,"y":-1,"z":-0.58779},{"x":-0.64721,"y":-1,"z":-0.47023},{"x":-0.47022,"y":1,"z":-0.64722},{"x":-0.58778,"y":1,"z":-0.80902},{"x":-0.58778,"y":-1,"z":-0.80902},{"x":-0.47022,"y":-1,"z":-0.64722},{"x":-0.24721,"y":1,"z":-0.76085},{"x":-0.30901,"y":1,"z":-0.95106},{"x":-0.30901,"y":-1,"z":-0.95106},{"x":-0.24721,"y":-1,"z":-0.76085},{"x":0.00011,"y":-0.77315,"z":-1.00466},{"x":0.30913,"y":-0.77315,"z":-0.95572},{"x":0.30913,"y":-0.79315,"z":-0.95572},{"x":0.00011,"y":-0.79315,"z":-1.00466},{"x":0.58789,"y":-0.77315,"z":-0.81368},{"x":0.58789,"y":-0.79315,"z":-0.81368},{"x":0.80913,"y":-0.77315,"z":-0.59245},{"x":0.80913,"y":-0.79315,"z":-0.59245},{"x":0.95117,"y":-0.77315,"z":-0.31368},{"x":0.95117,"y":-0.79315,"z":-0.31368},{"x":1.00011,"y":-0.77315,"z":-0.00466},{"x":1.00011,"y":-0.79315,"z":-0.00466},{"x":0.95117,"y":-0.77315,"z":0.30435},{"x":0.95117,"y":-0.79315,"z":0.30435},{"x":0.80913,"y":-0.77315,"z":0.58312},{"x":0.80913,"y":-0.79315,"z":0.58312},{"x":0.58789,"y":-0.77315,"z":0.80435},{"x":0.58789,"y":-0.79315,"z":0.80435},{"x":0.30913,"y":-0.77315,"z":0.9464},{"x":0.30913,"y":-0.79315,"z":0.9464},{"x":0.00011,"y":-0.77315,"z":0.99534},{"x":0.00011,"y":-0.79315,"z":0.99534},{"x":-0.30891,"y":-0.77315,"z":0.9464},{"x":-0.30891,"y":-0.79315,"z":0.9464},{"x":-0.58768,"y":-0.77315,"z":0.80435},{"x":-0.58768,"y":-0.79315,"z":0.80435},{"x":-0.80891,"y":-0.77315,"z":0.58312},{"x":-0.80891,"y":-0.79315,"z":0.58312},{"x":-0.95095,"y":-0.77315,"z":0.30435},{"x":-0.95095,"y":-0.79315,"z":0.30435},{"x":-0.99989,"y":-0.77315,"z":-0.00466},{"x":-0.99989,"y":-0.79315,"z":-0.00466},{"x":-0.95095,"y":-0.77315,"z":-0.31368},{"x":-0.95095,"y":-0.79315,"z":-0.31368},{"x":-0.80891,"y":-0.77315,"z":-0.59245},{"x":-0.80891,"y":-0.79315,"z":-0.59245},{"x":-0.58767,"y":-0.77315,"z":-0.81368},{"x":-0.58767,"y":-0.79315,"z":-0.81368},{"x":-0.30891,"y":-0.77315,"z":-0.95572},{"x":-0.30891,"y":-0.79315,"z":-0.95572},{"x":0.00011,"y":-0.77315,"z":-1.00466},{"x":0.00011,"y":-0.79315,"z":-1.00466},{"x":0.30913,"y":-0.81315,"z":-0.95572},{"x":0.00011,"y":-0.81315,"z":-1.00466},{"x":0.58789,"y":-0.81315,"z":-0.81368},{"x":0.80913,"y":-0.81315,"z":-0.59245},{"x":0.95117,"y":-0.81315,"z":-0.31368},{"x":1.00011,"y":-0.81315,"z":-0.00466},{"x":0.95117,"y":-0.81315,"z":0.30435},{"x":0.80913,"y":-0.81315,"z":0.58312},{"x":0.58789,"y":-0.81315,"z":0.80435},{"x":0.30913,"y":-0.81315,"z":0.9464},{"x":0.00011,"y":-0.81315,"z":0.99534},{"x":-0.30891,"y":-0.81315,"z":0.9464},{"x":-0.58768,"y":-0.81315,"z":0.80435},{"x":-0.80891,"y":-0.81315,"z":0.58312},{"x":-0.95095,"y":-0.81315,"z":0.30435},{"x":-0.99989,"y":-0.81315,"z":-0.00466},{"x":-0.95095,"y":-0.81315,"z":-0.31368},{"x":-0.80891,"y":-0.81315,"z":-0.59245},{"x":-0.58767,"y":-0.81315,"z":-0.81368},{"x":-0.30891,"y":-0.81315,"z":-0.95572},{"x":0.00011,"y":-0.81315,"z":-1.00466},{"x":0.30913,"y":-0.83315,"z":-0.95572},{"x":0.00011,"y":-0.83315,"z":-1.00466},{"x":0.58789,"y":-0.83315,"z":-0.81368},{"x":0.80913,"y":-0.83315,"z":-0.59245},{"x":0.95117,"y":-0.83315,"z":-0.31368},{"x":1.00011,"y":-0.83315,"z":-0.00466},{"x":0.95117,"y":-0.83315,"z":0.30435},{"x":0.80913,"y":-0.83315,"z":0.58312},{"x":0.58789,"y":-0.83315,"z":0.80435},{"x":0.30913,"y":-0.83315,"z":0.9464},{"x":0.00011,"y":-0.83315,"z":0.99534},{"x":-0.30891,"y":-0.83315,"z":0.9464},{"x":-0.58768,"y":-0.83315,"z":0.80435},{"x":-0.80891,"y":-0.83315,"z":0.58312},{"x":-0.95095,"y":-0.83315,"z":0.30435},{"x":-0.99989,"y":-0.83315,"z":-0.00466},{"x":-0.95095,"y":-0.83315,"z":-0.31368},{"x":-0.80891,"y":-0.83315,"z":-0.59245},{"x":-0.58767,"y":-0.83315,"z":-0.81368},{"x":-0.30891,"y":-0.83315,"z":-0.95572},{"x":0.00011,"y":-0.83315,"z":-1.00466},{"x":0.30913,"y":-0.85315,"z":-0.95572},{"x":0.00011,"y":-0.85315,"z":-1.00466},{"x":0.58789,"y":-0.85315,"z":-0.81368},{"x":0.80913,"y":-0.85315,"z":-0.59245},{"x":0.95117,"y":-0.85315,"z":-0.31368},{"x":1.00011,"y":-0.85315,"z":-0.00466},{"x":0.95117,"y":-0.85315,"z":0.30435},{"x":0.80913,"y":-0.85315,"z":0.58312},{"x":0.58789,"y":-0.85315,"z":0.80435},{"x":0.30913,"y":-0.85315,"z":0.9464},{"x":0.00011,"y":-0.85315,"z":0.99534},{"x":-0.30891,"y":-0.85315,"z":0.9464},{"x":-0.58768,"y":-0.85315,"z":0.80435},{"x":-0.80891,"y":-0.85315,"z":0.58312},{"x":-0.95095,"y":-0.85315,"z":0.30435},{"x":-0.99989,"y":-0.85315,"z":-0.00466},{"x":-0.95095,"y":-0.85315,"z":-0.31368},{"x":-0.80891,"y":-0.85315,"z":-0.59245},{"x":-0.58767,"y":-0.85315,"z":-0.81368},{"x":-0.30891,"y":-0.85315,"z":-0.95572},{"x":0.00011,"y":-0.85315,"z":-1.00466},{"x":0.30913,"y":-0.87315,"z":-0.95572},{"x":0.00011,"y":-0.87315,"z":-1.00466},{"x":0.58789,"y":-0.87315,"z":-0.81368},{"x":0.80913,"y":-0.87315,"z":-0.59245},{"x":0.95117,"y":-0.87315,"z":-0.31368},{"x":1.00011,"y":-0.87315,"z":-0.00466},{"x":0.95117,"y":-0.87315,"z":0.30435},{"x":0.80913,"y":-0.87315,"z":0.58312},{"x":0.58789,"y":-0.87315,"z":0.80435},{"x":0.30913,"y":-0.87315,"z":0.9464},{"x":0.00011,"y":-0.87315,"z":0.99534},{"x":-0.30891,"y":-0.87315,"z":0.9464},{"x":-0.58768,"y":-0.87315,"z":0.80435},{"x":-0.80891,"y":-0.87315,"z":0.58312},{"x":-0.95095,"y":-0.87315,"z":0.30435},{"x":-0.99989,"y":-0.87315,"z":-0.00466},{"x":-0.95095,"y":-0.87315,"z":-0.31368},{"x":-0.80891,"y":-0.87315,"z":-0.59245},{"x":-0.58767,"y":-0.87315,"z":-0.81368},{"x":-0.30891,"y":-0.87315,"z":-0.95572},{"x":0.00011,"y":-0.87315,"z":-1.00466},{"x":0.30913,"y":-0.89315,"z":-0.95572},{"x":0.00011,"y":-0.89315,"z":-1.00466},{"x":0.58789,"y":-0.89315,"z":-0.81368},{"x":0.80913,"y":-0.89315,"z":-0.59245},{"x":0.95117,"y":-0.89315,"z":-0.31368},{"x":1.00011,"y":-0.89315,"z":-0.00466},{"x":0.95117,"y":-0.89315,"z":0.30435},{"x":0.80913,"y":-0.89315,"z":0.58312},{"x":0.58789,"y":-0.89315,"z":0.80435},{"x":0.30913,"y":-0.89315,"z":0.9464},{"x":0.00011,"y":-0.89315,"z":0.99534},{"x":-0.30891,"y":-0.89315,"z":0.9464},{"x":-0.58768,"y":-0.89315,"z":0.80435},{"x":-0.80891,"y":-0.89315,"z":0.58312},{"x":-0.95095,"y":-0.89315,"z":0.30435},{"x":-0.99989,"y":-0.89315,"z":-0.00466},{"x":-0.95095,"y":-0.89315,"z":-0.31368},{"x":-0.80891,"y":-0.89315,"z":-0.59245},{"x":-0.58767,"y":-0.89315,"z":-0.81368},{"x":-0.30891,"y":-0.89315,"z":-0.95572},{"x":0.00011,"y":-0.89315,"z":-1.00466},{"x":0.30913,"y":-0.91315,"z":-0.95572},{"x":0.00011,"y":-0.91315,"z":-1.00466},{"x":0.58789,"y":-0.91315,"z":-0.81368},{"x":0.80913,"y":-0.91315,"z":-0.59245},{"x":0.95117,"y":-0.91315,"z":-0.31368},{"x":1.00011,"y":-0.91315,"z":-0.00466},{"x":0.95117,"y":-0.91315,"z":0.30435},{"x":0.80913,"y":-0.91315,"z":0.58312},{"x":0.58789,"y":-0.91315,"z":0.80435},{"x":0.30913,"y":-0.91315,"z":0.9464},{"x":0.00011,"y":-0.91315,"z":0.99534},{"x":-0.30891,"y":-0.91315,"z":0.9464},{"x":-0.58768,"y":-0.91315,"z":0.80435},{"x":-0.80891,"y":-0.91315,"z":0.58312},{"x":-0.95095,"y":-0.91315,"z":0.30435},{"x":-0.99989,"y":-0.91315,"z":-0.00466},{"x":-0.95095,"y":-0.91315,"z":-0.31368},{"x":-0.80891,"y":-0.91315,"z":-0.59245},{"x":-0.58767,"y":-0.91315,"z":-0.81368},{"x":-0.30891,"y":-0.91315,"z":-0.95572},{"x":0.00011,"y":-0.91315,"z":-1.00466},{"x":0.30913,"y":-0.93315,"z":-0.95572},{"x":0.00011,"y":-0.93315,"z":-1.00466},{"x":0.58789,"y":-0.93315,"z":-0.81368},{"x":0.80913,"y":-0.93315,"z":-0.59245},{"x":0.95117,"y":-0.93315,"z":-0.31368},{"x":1.00011,"y":-0.93315,"z":-0.00466},{"x":0.95117,"y":-0.93315,"z":0.30435},{"x":0.80913,"y":-0.93315,"z":0.58312},{"x":0.58789,"y":-0.93315,"z":0.80435},{"x":0.30913,"y":-0.93315,"z":0.9464},{"x":0.00011,"y":-0.93315,"z":0.99534},{"x":-0.30891,"y":-0.93315,"z":0.9464},{"x":-0.58768,"y":-0.93315,"z":0.80435},{"x":-0.80891,"y":-0.93315,"z":0.58312},{"x":-0.95095,"y":-0.93315,"z":0.30435},{"x":-0.99989,"y":-0.93315,"z":-0.00466},{"x":-0.95095,"y":-0.93315,"z":-0.31368},{"x":-0.80891,"y":-0.93315,"z":-0.59245},{"x":-0.58767,"y":-0.93315,"z":-0.81368},{"x":-0.30891,"y":-0.93315,"z":-0.95572},{"x":0.00011,"y":-0.93315,"z":-1.00466},{"x":0.30913,"y":-0.95315,"z":-0.95572},{"x":0.00011,"y":-0.95315,"z":-1.00466},{"x":0.58789,"y":-0.95315,"z":-0.81368},{"x":0.80913,"y":-0.95315,"z":-0.59245},{"x":0.95117,"y":-0.95315,"z":-0.31368},{"x":1.00011,"y":-0.95315,"z":-0.00466},{"x":0.95117,"y":-0.95315,"z":0.30435},{"x":0.80913,"y":-0.95315,"z":0.58312},{"x":0.58789,"y":-0.95315,"z":0.80435},{"x":0.30913,"y":-0.95315,"z":0.9464},{"x":0.00011,"y":-0.95315,"z":0.99534},{"x":-0.30891,"y":-0.95315,"z":0.9464},{"x":-0.58768,"y":-0.95315,"z":0.80435},{"x":-0.80891,"y":-0.95315,"z":0.58312},{"x":-0.95095,"y":-0.95315,"z":0.30435},{"x":-0.99989,"y":-0.95315,"z":-0.00466},{"x":-0.95095,"y":-0.95315,"z":-0.31368},{"x":-0.80891,"y":-0.95315,"z":-0.59245},{"x":-0.58767,"y":-0.95315,"z":-0.81368},{"x":-0.30891,"y":-0.95315,"z":-0.95572},{"x":0.00011,"y":-0.95315,"z":-1.00466},{"x":0.30913,"y":-0.97315,"z":-0.95572},{"x":0.00011,"y":-0.97315,"z":-1.00466},{"x":0.58789,"y":-0.97315,"z":-0.81368},{"x":0.80913,"y":-0.97315,"z":-0.59245},{"x":0.95117,"y":-0.97315,"z":-0.31368},{"x":1.00011,"y":-0.97315,"z":-0.00466},{"x":0.95117,"y":-0.97315,"z":0.30435},{"x":0.80913,"y":-0.97315,"z":0.58312},{"x":0.58789,"y":-0.97315,"z":0.80435},{"x":0.30913,"y":-0.97315,"z":0.9464},{"x":0.00011,"y":-0.97315,"z":0.99534},{"x":-0.30891,"y":-0.97315,"z":0.9464},{"x":-0.58768,"y":-0.97315,"z":0.80435},{"x":-0.80891,"y":-0.97315,"z":0.58312},{"x":-0.95095,"y":-0.97315,"z":0.30435},{"x":-0.99989,"y":-0.97315,"z":-0.00466},{"x":-0.95095,"y":-0.97315,"z":-0.31368},{"x":-0.80891,"y":-0.97315,"z":-0.59245},{"x":-0.58767,"y":-0.97315,"z":-0.81368},{"x":-0.30891,"y":-0.97315,"z":-0.95572},{"x":0.00011,"y":-0.97315,"z":-1.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.77315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.00011,"y":-0.97315,"z":-0.00466},{"x":0.19607,"y":0.30172,"z":0.95405},{"x":0.17002,"y":0.29949,"z":0.9514},{"x":0.17499,"y":0.21606,"z":1.01886},{"x":0.20094,"y":0.22006,"z":1.02008},{"x":0.14759,"y":0.29268,"z":0.93951},{"x":0.15285,"y":0.20426,"z":1.01101},{"x":0.13266,"y":0.28246,"z":0.92044},{"x":0.13836,"y":0.18669,"z":0.99788},{"x":0.12782,"y":0.27061,"z":0.89748},{"x":0.13402,"y":0.16639,"z":0.98176},{"x":0.13389,"y":0.25917,"z":0.87462},{"x":0.14058,"y":0.14688,"z":0.96541},{"x":0.14984,"y":0.25012,"z":0.85578},{"x":0.1569,"y":0.13152,"z":0.95169},{"x":0.1729,"y":0.24503,"z":0.84425},{"x":0.18017,"y":0.12298,"z":0.94294},{"x":0.19909,"y":0.24477,"z":0.842},{"x":0.20636,"y":0.12272,"z":0.94069},{"x":0.22387,"y":0.24939,"z":0.84944},{"x":0.23093,"y":0.13079,"z":0.94533},{"x":0.24297,"y":0.2581,"z":0.86526},{"x":0.24966,"y":0.14581,"z":0.95605},{"x":0.25307,"y":0.26938,"z":0.88674},{"x":0.25928,"y":0.16517,"z":0.97101},{"x":0.25244,"y":0.28128,"z":0.91016},{"x":0.25815,"y":0.18551,"z":0.9876},{"x":0.24119,"y":0.29176,"z":0.93148},{"x":0.24645,"y":0.20334,"z":1.00297},{"x":0.22125,"y":0.29899,"z":0.947},{"x":0.22621,"y":0.21556,"z":1.01446},{"x":0.19607,"y":0.30172,"z":0.95405},{"x":0.20094,"y":0.22006,"z":1.02008},{"x":0.1827,"y":0.16736,"z":1.11427},{"x":0.20848,"y":0.17238,"z":1.11348},{"x":0.16102,"y":0.15264,"z":1.11213},{"x":0.14721,"y":0.13078,"z":1.10741},{"x":0.14365,"y":0.10556,"z":1.10094},{"x":0.15096,"y":0.08133,"z":1.09384},{"x":0.16786,"y":0.06229,"z":1.08732},{"x":0.19145,"y":0.05173,"z":1.08253},{"x":0.21763,"y":0.05147,"z":1.08028},{"x":0.24189,"y":0.06156,"z":1.08097},{"x":0.26003,"y":0.08026,"z":1.08448},{"x":0.26891,"y":0.10432,"z":1.0902},{"x":0.267,"y":0.1296,"z":1.09714},{"x":0.25462,"y":0.15172,"z":1.1041},{"x":0.23392,"y":0.16685,"z":1.10988},{"x":0.20848,"y":0.17238,"z":1.11348},{"x":0.19181,"y":0.1618,"z":1.22115},{"x":0.2174,"y":0.16694,"z":1.21809},{"x":0.17068,"y":0.14675,"z":1.22539},{"x":0.15768,"y":0.1244,"z":1.2301},{"x":0.15504,"y":0.09861,"z":1.23444},{"x":0.16322,"y":0.07385,"z":1.23768},{"x":0.18082,"y":0.05438,"z":1.23925},{"x":0.20478,"y":0.04359,"z":1.23888},{"x":0.23097,"y":0.04333,"z":1.23663},{"x":0.25485,"y":0.05365,"z":1.2329},{"x":0.2723,"y":0.07277,"z":1.22832},{"x":0.2803,"y":0.09738,"z":1.22369},{"x":0.27746,"y":0.12322,"z":1.21982},{"x":0.26428,"y":0.14583,"z":1.21736},{"x":0.24304,"y":0.16129,"z":1.21675},{"x":0.2174,"y":0.16694,"z":1.21809},{"x":0.20076,"y":0.20034,"z":1.321},{"x":0.22616,"y":0.20467,"z":1.31583},{"x":0.18017,"y":0.1876,"z":1.33122},{"x":0.16795,"y":0.16865,"z":1.34472},{"x":0.16621,"y":0.14676,"z":1.35917},{"x":0.17527,"y":0.12573,"z":1.37207},{"x":0.19354,"y":0.10918,"z":1.38119},{"x":0.21787,"y":0.09998,"z":1.38495},{"x":0.24405,"y":0.09972,"z":1.3827},{"x":0.26757,"y":0.10845,"z":1.37484},{"x":0.28434,"y":0.12465,"z":1.36271},{"x":0.29147,"y":0.14553,"z":1.34842},{"x":0.28773,"y":0.16747,"z":1.33444},{"x":0.27376,"y":0.18668,"z":1.32319},{"x":0.25198,"y":0.19984,"z":1.31661},{"x":0.22616,"y":0.20467,"z":1.31583},{"x":0.20799,"y":0.27633,"z":1.39656},{"x":0.23323,"y":0.27905,"z":1.38979},{"x":0.18783,"y":0.26813,"z":1.4113},{"x":0.17625,"y":0.25587,"z":1.43146},{"x":0.17525,"y":0.24168,"z":1.45356},{"x":0.185,"y":0.228,"z":1.47377},{"x":0.20382,"y":0.21719,"z":1.48861},{"x":0.22845,"y":0.21114,"z":1.49549},{"x":0.25463,"y":0.21088,"z":1.49324},{"x":0.27785,"y":0.21647,"z":1.48225},{"x":0.29407,"y":0.22692,"z":1.46441},{"x":0.30051,"y":0.24045,"z":1.44281},{"x":0.29603,"y":0.25469,"z":1.42119},{"x":0.28142,"y":0.26721,"z":1.40327},{"x":0.25921,"y":0.27583,"z":1.39217},{"x":0.23323,"y":0.27905,"z":1.38979},{"x":0.21225,"y":0.37662,"z":1.43477},{"x":0.23741,"y":0.37722,"z":1.4272},{"x":0.19235,"y":0.37442,"z":1.4518},{"x":0.18114,"y":0.371,"z":1.47533},{"x":0.18057,"y":0.36695,"z":1.50129},{"x":0.19074,"y":0.36297,"z":1.5252},{"x":0.20988,"y":0.35976,"z":1.54293},{"x":0.23469,"y":0.35786,"z":1.55139},{"x":0.26087,"y":0.3576,"z":1.54915},{"x":0.28391,"y":0.35903,"z":1.53657},{"x":0.29981,"y":0.3619,"z":1.51584},{"x":0.30583,"y":0.36572,"z":1.49054},{"x":0.30093,"y":0.36982,"z":1.46505},{"x":0.28595,"y":0.3735,"z":1.44376},{"x":0.26348,"y":0.37611,"z":1.43038},{"x":0.23741,"y":0.37722,"z":1.4272},{"x":0.21281,"y":0.48387,"z":1.42902},{"x":0.23796,"y":0.4822,"z":1.42157},{"x":0.19294,"y":0.48809,"z":1.4457},{"x":0.18179,"y":0.49412,"z":1.46872},{"x":0.18127,"y":0.50092,"z":1.49411},{"x":0.19149,"y":0.50732,"z":1.51746},{"x":0.21068,"y":0.51222,"z":1.53475},{"x":0.23551,"y":0.51476,"z":1.54298},{"x":0.26169,"y":0.5145,"z":1.54073},{"x":0.28471,"y":0.51149,"z":1.52839},{"x":0.30057,"y":0.50625,"z":1.5081},{"x":0.30653,"y":0.49969,"z":1.48336},{"x":0.30157,"y":0.49294,"z":1.45845},{"x":0.28654,"y":0.48716,"z":1.43767},{"x":0.26404,"y":0.48337,"z":1.42462},{"x":0.23796,"y":0.4822,"z":1.42157},{"x":0.20958,"y":0.57953,"z":1.38031},{"x":0.23479,"y":0.57584,"z":1.37388},{"x":0.18951,"y":0.58947,"z":1.39407},{"x":0.17807,"y":0.60394,"z":1.4128},{"x":0.17723,"y":0.62042,"z":1.43325},{"x":0.18713,"y":0.63609,"z":1.45189},{"x":0.20607,"y":0.64822,"z":1.46549},{"x":0.23077,"y":0.65471,"z":1.47171},{"x":0.25696,"y":0.65445,"z":1.46946},{"x":0.2801,"y":0.64749,"z":1.45914},{"x":0.29621,"y":0.63501,"z":1.44253},{"x":0.30249,"y":0.61919,"z":1.42251},{"x":0.29785,"y":0.60276,"z":1.40252},{"x":0.28311,"y":0.58855,"z":1.38604},{"x":0.2608,"y":0.57903,"z":1.37591},{"x":0.23479,"y":0.57584,"z":1.37388},{"x":0.20309,"y":0.64708,"z":1.29705},{"x":0.22845,"y":0.64196,"z":1.29239},{"x":0.18264,"y":0.66106,"z":1.30583},{"x":0.17063,"y":0.68147,"z":1.31722},{"x":0.16913,"y":0.70479,"z":1.32925},{"x":0.17841,"y":0.72699,"z":1.33983},{"x":0.19686,"y":0.74423,"z":1.34714},{"x":0.22129,"y":0.75352,"z":1.34991},{"x":0.24748,"y":0.75326,"z":1.34766},{"x":0.27089,"y":0.7435,"z":1.34079},{"x":0.28749,"y":0.72592,"z":1.33047},{"x":0.29439,"y":0.70356,"z":1.3185},{"x":0.29041,"y":0.6803,"z":1.30695},{"x":0.27624,"y":0.66013,"z":1.2978},{"x":0.25432,"y":0.64657,"z":1.29265},{"x":0.22845,"y":0.64196,"z":1.29239},{"x":0.1945,"y":0.67482,"z":1.19364},{"x":0.22003,"y":0.66911,"z":1.19116},{"x":0.17353,"y":0.69046,"z":1.19624},{"x":0.16076,"y":0.71332,"z":1.19852},{"x":0.15839,"y":0.73945,"z":1.20009},{"x":0.16684,"y":0.76433,"z":1.20066},{"x":0.18464,"y":0.78366,"z":1.20015},{"x":0.20871,"y":0.7941,"z":1.19863},{"x":0.2349,"y":0.79384,"z":1.19639},{"x":0.25867,"y":0.78293,"z":1.19379},{"x":0.27591,"y":0.76326,"z":1.1913},{"x":0.28365,"y":0.73821,"z":1.18933},{"x":0.28054,"y":0.71214,"z":1.18824},{"x":0.26712,"y":0.68953,"z":1.18821},{"x":0.24572,"y":0.67431,"z":1.18925},{"x":0.22003,"y":0.66911,"z":1.19116},{"x":0.18527,"y":0.65796,"z":1.08797},{"x":0.21099,"y":0.65261,"z":1.08773},{"x":0.16374,"y":0.67259,"z":1.08425},{"x":0.15016,"y":0.69396,"z":1.07722},{"x":0.14686,"y":0.71838,"z":1.06809},{"x":0.15441,"y":0.74163,"z":1.05843},{"x":0.17151,"y":0.75969,"z":1.04993},{"x":0.1952,"y":0.76943,"z":1.04405},{"x":0.22139,"y":0.76918,"z":1.0418},{"x":0.24554,"y":0.75897,"z":1.04358},{"x":0.26348,"y":0.74056,"z":1.04907},{"x":0.27212,"y":0.71715,"z":1.05734},{"x":0.26994,"y":0.69278,"z":1.06694},{"x":0.25734,"y":0.67166,"z":1.07622},{"x":0.23649,"y":0.65745,"z":1.08357},{"x":0.21099,"y":0.65261,"z":1.08773},{"x":0.17699,"y":0.59941,"z":0.9983},{"x":0.2029,"y":0.5953,"z":0.99996},{"x":0.15498,"y":0.61054,"z":0.98922},{"x":0.14067,"y":0.62675,"z":0.97429},{"x":0.13653,"y":0.64525,"z":0.95608},{"x":0.14328,"y":0.66284,"z":0.93775},{"x":0.15976,"y":0.67647,"z":0.92246},{"x":0.18311,"y":0.68379,"z":0.91287},{"x":0.20929,"y":0.68353,"z":0.91062},{"x":0.23379,"y":0.67574,"z":0.91612},{"x":0.25236,"y":0.66176,"z":0.92839},{"x":0.26179,"y":0.64402,"z":0.94533},{"x":0.26045,"y":0.62557,"z":0.96401},{"x":0.24858,"y":0.60962,"z":0.98119},{"x":0.22822,"y":0.59891,"z":0.99391},{"x":0.2029,"y":0.5953,"z":0.99996},{"x":0.17112,"y":0.50931,"z":0.94015},{"x":0.19715,"y":0.5071,"z":0.94304},{"x":0.14875,"y":0.51505,"z":0.92759},{"x":0.13392,"y":0.52332,"z":0.90753},{"x":0.12919,"y":0.53269,"z":0.88343},{"x":0.13538,"y":0.54156,"z":0.85948},{"x":0.15141,"y":0.54838,"z":0.83979},{"x":0.17451,"y":0.55197,"z":0.82779},{"x":0.2007,"y":0.55171,"z":0.82554},{"x":0.22544,"y":0.54765,"z":0.83344},{"x":0.24445,"y":0.54049,"z":0.85012},{"x":0.25445,"y":0.53146,"z":0.87268},{"x":0.25371,"y":0.52214,"z":0.89725},{"x":0.24235,"y":0.51412,"z":0.91955},{"x":0.22234,"y":0.5088,"z":0.93575},{"x":0.19715,"y":0.5071,"z":0.94304},{"x":0.16865,"y":0.40322,"z":0.92355},{"x":0.19473,"y":0.40325,"z":0.92679},{"x":0.14614,"y":0.40261,"z":0.91},{"x":0.13109,"y":0.40153,"z":0.88848},{"x":0.12611,"y":0.40018,"z":0.86271},{"x":0.13205,"y":0.39878,"z":0.83714},{"x":0.1479,"y":0.39757,"z":0.81621},{"x":0.1709,"y":0.39677,"z":0.80352},{"x":0.19709,"y":0.39651,"z":0.80127},{"x":0.22193,"y":0.39684,"z":0.80985},{"x":0.24113,"y":0.3977,"z":0.82778},{"x":0.25136,"y":0.39894,"z":0.85196},{"x":0.25087,"y":0.40035,"z":0.8782},{"x":0.23973,"y":0.40169,"z":0.90197},{"x":0.21988,"y":0.40271,"z":0.91916},{"x":0.19473,"y":0.40325,"z":0.92679},{"x":0.17002,"y":0.29949,"z":0.9514},{"x":0.19607,"y":0.30172,"z":0.95405},{"x":0.14759,"y":0.29268,"z":0.93951},{"x":0.13266,"y":0.28246,"z":0.92044},{"x":0.12782,"y":0.27061,"z":0.89748},{"x":0.13389,"y":0.25917,"z":0.87462},{"x":0.14984,"y":0.25012,"z":0.85578},{"x":0.1729,"y":0.24503,"z":0.84425},{"x":0.19909,"y":0.24477,"z":0.842},{"x":0.22387,"y":0.24939,"z":0.84944},{"x":0.24297,"y":0.2581,"z":0.86526},{"x":0.25307,"y":0.26938,"z":0.88674},{"x":0.25244,"y":0.28128,"z":0.91016},{"x":0.24119,"y":0.29176,"z":0.93148},{"x":0.22125,"y":0.29899,"z":0.947},{"x":0.19607,"y":0.30172,"z":0.95405},{"x":0.22566,"y":-0.30908,"z":1.28748},{"x":0.24623,"y":-0.31206,"z":1.28802},{"x":0.23847,"y":-0.35344,"z":1.21422},{"x":0.21806,"y":-0.34958,"z":1.21524},{"x":0.26397,"y":-0.32103,"z":1.29411},{"x":0.25575,"y":-0.36488,"z":1.2159},{"x":0.27581,"y":-0.33445,"z":1.3047},{"x":0.2669,"y":-0.38195,"z":1.21998},{"x":0.27971,"y":-0.34999,"z":1.31795},{"x":0.27001,"y":-0.40167,"z":1.22576},{"x":0.27499,"y":-0.36496,"z":1.33158},{"x":0.26454,"y":-0.42065,"z":1.23225},{"x":0.26246,"y":-0.37679,"z":1.34322},{"x":0.25143,"y":-0.43561,"z":1.23831},{"x":0.2443,"y":-0.38341,"z":1.35087},{"x":0.23294,"y":-0.44394,"z":1.24291},{"x":0.22364,"y":-0.3837,"z":1.3532},{"x":0.21229,"y":-0.44423,"z":1.24524},{"x":0.20406,"y":-0.37759,"z":1.34981},{"x":0.19302,"y":-0.43641,"z":1.2449},{"x":0.18894,"y":-0.36614,"z":1.34129},{"x":0.17849,"y":-0.42183,"z":1.24196},{"x":0.1809,"y":-0.35134,"z":1.3291},{"x":0.1712,"y":-0.40303,"z":1.23692},{"x":0.18132,"y":-0.33575,"z":1.31536},{"x":0.17241,"y":-0.38324,"z":1.23065},{"x":0.19013,"y":-0.32204,"z":1.30245},{"x":0.18191,"y":-0.3659,"z":1.22423},{"x":0.20582,"y":-0.31261,"z":1.29258},{"x":0.19806,"y":-0.35399,"z":1.21878},{"x":0.22566,"y":-0.30908,"z":1.28748},{"x":0.21806,"y":-0.34958,"z":1.21524},{"x":0.22908,"y":-0.36106,"z":1.13013},{"x":0.20888,"y":-0.35704,"z":1.13293},{"x":0.2458,"y":-0.37296,"z":1.12677},{"x":0.25613,"y":-0.3907,"z":1.12344},{"x":0.25829,"y":-0.41119,"z":1.12072},{"x":0.25191,"y":-0.43091,"z":1.11906},{"x":0.23808,"y":-0.44644,"z":1.11877},{"x":0.21921,"y":-0.4551,"z":1.11988},{"x":0.19855,"y":-0.45538,"z":1.12221},{"x":0.17968,"y":-0.44724,"z":1.12536},{"x":0.16586,"y":-0.43209,"z":1.12878},{"x":0.15947,"y":-0.41255,"z":1.13187},{"x":0.16163,"y":-0.39199,"z":1.13411},{"x":0.17196,"y":-0.37397,"z":1.13511},{"x":0.18867,"y":-0.36161,"z":1.13468},{"x":0.20888,"y":-0.35704,"z":1.13293},{"x":0.21969,"y":-0.33361,"z":1.05027},{"x":0.19968,"y":-0.33017,"z":1.05476},{"x":0.23584,"y":-0.34387,"z":1.04214},{"x":0.24535,"y":-0.35918,"z":1.03177},{"x":0.24656,"y":-0.3769,"z":1.02097},{"x":0.23926,"y":-0.39396,"z":1.01158},{"x":0.22473,"y":-0.40742,"z":1.00525},{"x":0.20547,"y":-0.41493,"z":1.00306},{"x":0.18482,"y":-0.41522,"z":1.00539},{"x":0.16633,"y":-0.40822,"z":1.01184},{"x":0.15322,"y":-0.39514,"z":1.0213},{"x":0.14774,"y":-0.37826,"z":1.03212},{"x":0.15085,"y":-0.36048,"z":1.04244},{"x":0.16201,"y":-0.34488,"z":1.05047},{"x":0.17928,"y":-0.33416,"z":1.05483},{"x":0.19968,"y":-0.33017,"z":1.05476},{"x":0.21192,"y":-0.27583,"z":0.98847},{"x":0.19208,"y":-0.27362,"z":0.99426},{"x":0.22761,"y":-0.28263,"z":0.97664},{"x":0.23643,"y":-0.29285,"z":0.96083},{"x":0.23685,"y":-0.30473,"z":0.94376},{"x":0.22881,"y":-0.3162,"z":0.9284},{"x":0.21369,"y":-0.32528,"z":0.91739},{"x":0.19411,"y":-0.33041,"z":0.91265},{"x":0.17345,"y":-0.33069,"z":0.91498},{"x":0.15529,"y":-0.32608,"z":0.92399},{"x":0.14276,"y":-0.31738,"z":0.93812},{"x":0.13804,"y":-0.30608,"z":0.95492},{"x":0.14193,"y":-0.29415,"z":0.97149},{"x":0.15377,"y":-0.28365,"z":0.98497},{"x":0.17151,"y":-0.27638,"z":0.99303},{"x":0.19208,"y":-0.27362,"z":0.99426},{"x":0.20712,"y":-0.19771,"z":0.9554},{"x":0.18737,"y":-0.19715,"z":0.96189},{"x":0.22252,"y":-0.19984,"z":0.94159},{"x":0.23091,"y":-0.20318,"z":0.92287},{"x":0.23085,"y":-0.20715,"z":0.90246},{"x":0.22234,"y":-0.21106,"z":0.8839},{"x":0.20686,"y":-0.21424,"z":0.87039},{"x":0.18708,"y":-0.21613,"z":0.86427},{"x":0.16642,"y":-0.21641,"z":0.8666},{"x":0.14846,"y":-0.21504,"z":0.87698},{"x":0.13629,"y":-0.21224,"z":0.89361},{"x":0.13204,"y":-0.20851,"z":0.91361},{"x":0.13642,"y":-0.20448,"z":0.93353},{"x":0.14868,"y":-0.20086,"z":0.94993},{"x":0.1667,"y":-0.19827,"z":0.95996},{"x":0.18737,"y":-0.19715,"z":0.96189},{"x":0.20611,"y":-0.11277,"z":0.95678},{"x":0.18639,"y":-0.11401,"z":0.96325},{"x":0.22145,"y":-0.10982,"z":0.94306},{"x":0.22975,"y":-0.10567,"z":0.92446},{"x":0.22959,"y":-0.10104,"z":0.90419},{"x":0.22098,"y":-0.09673,"z":0.88576},{"x":0.20542,"y":-0.09349,"z":0.87236},{"x":0.1856,"y":-0.09186,"z":0.8663},{"x":0.16494,"y":-0.09215,"z":0.86863},{"x":0.14702,"y":-0.09429,"z":0.87895},{"x":0.13494,"y":-0.09791,"z":0.89547},{"x":0.13077,"y":-0.1024,"z":0.91534},{"x":0.13526,"y":-0.10697,"z":0.93512},{"x":0.14761,"y":-0.11083,"z":0.9514},{"x":0.16569,"y":-0.11332,"z":0.96134},{"x":0.18639,"y":-0.11401,"z":0.96325},{"x":0.20907,"y":-0.03568,"z":0.99239},{"x":0.18929,"y":-0.03855,"z":0.9981},{"x":0.22459,"y":-0.02812,"z":0.98079},{"x":0.23315,"y":-0.01718,"z":0.96533},{"x":0.23329,"y":-0.00475,"z":0.94866},{"x":0.22497,"y":0.00702,"z":0.93368},{"x":0.20963,"y":0.0161,"z":0.92297},{"x":0.18993,"y":0.02091,"z":0.91838},{"x":0.16927,"y":0.02062,"z":0.92071},{"x":0.15123,"y":0.01529,"z":0.92956},{"x":0.13892,"y":0.00584,"z":0.94339},{"x":0.13447,"y":-0.00611,"z":0.95982},{"x":0.13866,"y":-0.01848,"z":0.97599},{"x":0.15075,"y":-0.02914,"z":0.98913},{"x":0.16866,"y":-0.03624,"z":0.99695},{"x":0.18929,"y":-0.03855,"z":0.9981},{"x":0.21549,"y":0.02022,"z":1.05605},{"x":0.19557,"y":0.01617,"z":1.06041},{"x":0.23139,"y":0.03112,"z":1.04826},{"x":0.24052,"y":0.04699,"z":1.0384},{"x":0.24131,"y":0.06507,"z":1.02818},{"x":0.23361,"y":0.08225,"z":1.01936},{"x":0.21876,"y":0.09556,"z":1.01346},{"x":0.19933,"y":0.10268,"z":1.01151},{"x":0.17867,"y":0.1024,"z":1.01384},{"x":0.16036,"y":0.09476,"z":1.02005},{"x":0.14756,"y":0.08107,"z":1.02907},{"x":0.14249,"y":0.06372,"z":1.03933},{"x":0.14602,"y":0.04569,"z":1.04907},{"x":0.15755,"y":0.03011,"z":1.0566},{"x":0.17507,"y":0.01966,"z":1.06061},{"x":0.19557,"y":0.01617,"z":1.06041},{"x":0.22425,"y":0.04527,"z":1.13676},{"x":0.20415,"y":0.04069,"z":1.13942},{"x":0.24068,"y":0.05767,"z":1.1338},{"x":0.25058,"y":0.07574,"z":1.13106},{"x":0.25226,"y":0.09636,"z":1.129},{"x":0.24541,"y":0.11597,"z":1.12799},{"x":0.23122,"y":0.13116,"z":1.1282},{"x":0.21215,"y":0.13933,"z":1.12959},{"x":0.19149,"y":0.13904,"z":1.13192},{"x":0.17282,"y":0.13036,"z":1.13479},{"x":0.15936,"y":0.11478,"z":1.1377},{"x":0.15344,"y":0.095,"z":1.14016},{"x":0.15609,"y":0.07444,"z":1.14172},{"x":0.16684,"y":0.05665,"z":1.14213},{"x":0.18384,"y":0.04471,"z":1.14132},{"x":0.20415,"y":0.04069,"z":1.13942},{"x":0.23385,"y":0.03513,"z":1.22057},{"x":0.21354,"y":0.03076,"z":1.22145},{"x":0.25085,"y":0.04692,"z":1.22262},{"x":0.2616,"y":0.0641,"z":1.22726},{"x":0.26425,"y":0.0837,"z":1.23369},{"x":0.25833,"y":0.10232,"z":1.24079},{"x":0.24486,"y":0.11675,"z":1.24733},{"x":0.22619,"y":0.1245,"z":1.25219},{"x":0.20553,"y":0.12421,"z":1.25452},{"x":0.18646,"y":0.11595,"z":1.25392},{"x":0.17228,"y":0.10114,"z":1.2505},{"x":0.16543,"y":0.08234,"z":1.24484},{"x":0.16711,"y":0.06281,"z":1.23793},{"x":0.17701,"y":0.04591,"z":1.23096},{"x":0.19344,"y":0.03457,"z":1.22513},{"x":0.21354,"y":0.03076,"z":1.22145},{"x":0.24263,"y":-0.00844,"z":1.29298},{"x":0.22213,"y":-0.01189,"z":1.29233},{"x":0.26015,"y":0.00075,"z":1.29936},{"x":0.27167,"y":0.01409,"z":1.31039},{"x":0.2752,"y":0.02928,"z":1.32414},{"x":0.27013,"y":0.04368,"z":1.33825},{"x":0.25733,"y":0.05482,"z":1.35027},{"x":0.23902,"y":0.06076,"z":1.35812},{"x":0.21836,"y":0.06048,"z":1.36046},{"x":0.19893,"y":0.05402,"z":1.35686},{"x":0.18409,"y":0.0425,"z":1.34796},{"x":0.17639,"y":0.02792,"z":1.33529},{"x":0.17718,"y":0.01279,"z":1.32105},{"x":0.18631,"y":-0.00026,"z":1.3077},{"x":0.20221,"y":-0.00899,"z":1.29754},{"x":0.22213,"y":-0.01189,"z":1.29233},{"x":0.24905,"y":-0.0779,"z":1.34148},{"x":0.22842,"y":-0.07988,"z":1.3398},{"x":0.26696,"y":-0.07287,"z":1.35076},{"x":0.27905,"y":-0.06565,"z":1.36606},{"x":0.28323,"y":-0.05749,"z":1.38472},{"x":0.27878,"y":-0.04981,"z":1.40352},{"x":0.26647,"y":-0.04393,"z":1.4192},{"x":0.24843,"y":-0.04086,"z":1.42907},{"x":0.22777,"y":-0.04115,"z":1.4314},{"x":0.20807,"y":-0.04473,"z":1.4258},{"x":0.19274,"y":-0.05099,"z":1.41323},{"x":0.18442,"y":-0.05885,"z":1.39587},{"x":0.18455,"y":-0.06695,"z":1.37672},{"x":0.19312,"y":-0.07388,"z":1.3591},{"x":0.20864,"y":-0.07846,"z":1.34603},{"x":0.22842,"y":-0.07988,"z":1.3398},{"x":0.25202,"y":-0.16126,"z":1.35767},{"x":0.23133,"y":-0.16147,"z":1.35565},{"x":0.27011,"y":-0.16121,"z":1.36792},{"x":0.28246,"y":-0.16133,"z":1.38465},{"x":0.28694,"y":-0.16161,"z":1.40495},{"x":0.28278,"y":-0.162,"z":1.42531},{"x":0.27069,"y":-0.16241,"z":1.44223},{"x":0.25277,"y":-0.1628,"z":1.45276},{"x":0.23212,"y":-0.16308,"z":1.45509},{"x":0.21229,"y":-0.16322,"z":1.44882},{"x":0.19673,"y":-0.16318,"z":1.43503},{"x":0.18813,"y":-0.16297,"z":1.4161},{"x":0.18797,"y":-0.16263,"z":1.39531},{"x":0.19627,"y":-0.16222,"z":1.37626},{"x":0.21161,"y":-0.16181,"z":1.36223},{"x":0.23133,"y":-0.16147,"z":1.35565},{"x":0.25103,"y":-0.24408,"z":1.33876},{"x":0.23036,"y":-0.24254,"z":1.33715},{"x":0.26905,"y":-0.24899,"z":1.34789},{"x":0.28132,"y":-0.25641,"z":1.36294},{"x":0.2857,"y":-0.26507,"z":1.38133},{"x":0.28144,"y":-0.27347,"z":1.39987},{"x":0.26928,"y":-0.28015,"z":1.41535},{"x":0.25131,"y":-0.28397,"z":1.4251},{"x":0.23066,"y":-0.28425,"z":1.42743},{"x":0.21088,"y":-0.28096,"z":1.42194},{"x":0.19539,"y":-0.27465,"z":1.40958},{"x":0.18688,"y":-0.26643,"z":1.39248},{"x":0.18682,"y":-0.25771,"z":1.37361},{"x":0.19521,"y":-0.25,"z":1.35622},{"x":0.21061,"y":-0.24464,"z":1.34332},{"x":0.23036,"y":-0.24254,"z":1.33715},{"x":0.24623,"y":-0.31206,"z":1.28802},{"x":0.22566,"y":-0.30908,"z":1.28748},{"x":0.26397,"y":-0.32103,"z":1.29411},{"x":0.27581,"y":-0.33445,"z":1.3047},{"x":0.27971,"y":-0.34999,"z":1.31795},{"x":0.27499,"y":-0.36496,"z":1.33158},{"x":0.26246,"y":-0.37679,"z":1.34322},{"x":0.2443,"y":-0.38341,"z":1.35087},{"x":0.22364,"y":-0.3837,"z":1.3532},{"x":0.20406,"y":-0.37759,"z":1.34981},{"x":0.18894,"y":-0.36614,"z":1.34129},{"x":0.1809,"y":-0.35134,"z":1.3291},{"x":0.18132,"y":-0.33575,"z":1.31536},{"x":0.19013,"y":-0.32204,"z":1.30245},{"x":0.20582,"y":-0.31261,"z":1.29258}],"faces":[[0,1,2],[2,3,0],[4,5,6],[6,7,4],[1,8,9],[9,2,1],[10,4,7],[7,11,10],[8,12,13],[13,9,8],[14,10,11],[11,15,14],[12,16,17],[17,13,12],[18,14,15],[15,19,18],[16,20,21],[21,17,16],[22,18,19],[19,23,22],[20,24,25],[25,21,20],[26,22,23],[23,27,26],[24,28,29],[29,25,24],[30,26,27],[27,31,30],[28,32,33],[33,29,28],[34,30,31],[31,35,34],[32,36,37],[37,33,32],[38,34,35],[35,39,38],[36,40,41],[41,37,36],[42,38,39],[39,43,42],[40,44,45],[45,41,40],[46,42,43],[43,47,46],[44,48,49],[49,45,44],[50,46,47],[47,51,50],[48,52,53],[53,49,48],[54,50,51],[51,55,54],[52,56,57],[57,53,52],[58,54,55],[55,59,58],[56,60,61],[61,57,56],[62,58,59],[59,63,62],[60,64,65],[65,61,60],[66,62,63],[63,67,66],[64,68,69],[69,65,64],[70,66,67],[67,71,70],[68,72,73],[73,69,68],[74,70,71],[71,75,74],[72,76,77],[77,73,72],[78,74,75],[75,79,78],[76,80,81],[81,77,76],[82,78,79],[79,83,82],[3,2,84],[84,85,3],[7,6,86],[86,87,7],[2,9,88],[88,84,2],[11,7,87],[87,89,11],[9,13,90],[90,88,9],[15,11,89],[89,91,15],[13,17,92],[92,90,13],[19,15,91],[91,93,19],[17,21,94],[94,92,17],[23,19,93],[93,95,23],[21,25,96],[96,94,21],[27,23,95],[95,97,27],[25,29,98],[98,96,25],[31,27,97],[97,99,31],[29,33,100],[100,98,29],[35,31,99],[99,101,35],[33,37,102],[102,100,33],[39,35,101],[101,103,39],[37,41,104],[104,102,37],[43,39,103],[103,105,43],[41,45,106],[106,104,41],[47,43,105],[105,107,47],[45,49,108],[108,106,45],[51,47,107],[107,109,51],[49,53,110],[110,108,49],[55,51,109],[109,111,55],[53,57,112],[112,110,53],[59,55,111],[111,113,59],[57,61,114],[114,112,57],[63,59,113],[113,115,63],[61,65,116],[116,114,61],[67,63,115],[115,117,67],[65,69,118],[118,116,65],[71,67,117],[117,119,71],[69,73,120],[120,118,69],[75,71,119],[119,121,75],[73,77,122],[122,120,73],[79,75,121],[121,123,79],[77,81,124],[124,122,77],[83,79,123],[123,125,83],[85,84,126],[126,127,85],[87,86,128],[128,129,87],[84,88,130],[130,126,84],[89,87,129],[129,131,89],[88,90,132],[132,130,88],[91,89,131],[131,133,91],[90,92,134],[134,132,90],[93,91,133],[133,135,93],[92,94,136],[136,134,92],[95,93,135],[135,137,95],[94,96,138],[138,136,94],[97,95,137],[137,139,97],[96,98,140],[140,138,96],[99,97,139],[139,141,99],[98,100,142],[142,140,98],[101,99,141],[141,143,101],[100,102,144],[144,142,100],[103,101,143],[143,145,103],[102,104,146],[146,144,102],[105,103,145],[145,147,105],[104,106,148],[148,146,104],[107,105,147],[147,149,107],[106,108,150],[150,148,106],[109,107,149],[149,151,109],[108,110,152],[152,150,108],[111,109,151],[151,153,111],[110,112,154],[154,152,110],[113,111,153],[153,155,113],[112,114,156],[156,154,112],[115,113,155],[155,157,115],[114,116,158],[158,156,114],[117,115,157],[157,159,117],[116,118,160],[160,158,116],[119,117,159],[159,161,119],[118,120,162],[162,160,118],[121,119,161],[161,163,121],[120,122,164],[164,162,120],[123,121,163],[163,165,123],[122,124,166],[166,164,122],[125,123,165],[165,167,125],[127,126,168],[168,169,127],[129,128,170],[170,171,129],[126,130,172],[172,168,126],[131,129,171],[171,173,131],[130,132,174],[174,172,130],[133,131,173],[173,175,133],[132,134,176],[176,174,132],[135,133,175],[175,177,135],[134,136,178],[178,176,134],[137,135,177],[177,179,137],[136,138,180],[180,178,136],[139,137,179],[179,181,139],[138,140,182],[182,180,138],[141,139,181],[181,183,141],[140,142,184],[184,182,140],[143,141,183],[183,185,143],[142,144,186],[186,184,142],[145,143,185],[185,187,145],[144,146,188],[188,186,144],[147,145,187],[187,189,147],[146,148,190],[190,188,146],[149,147,189],[189,191,149],[148,150,192],[192,190,148],[151,149,191],[191,193,151],[150,152,194],[194,192,150],[153,151,193],[193,195,153],[152,154,196],[196,194,152],[155,153,195],[195,197,155],[154,156,198],[198,196,154],[157,155,197],[197,199,157],[156,158,200],[200,198,156],[159,157,199],[199,201,159],[158,160,202],[202,200,158],[161,159,201],[201,203,161],[160,162,204],[204,202,160],[163,161,203],[203,205,163],[162,164,206],[206,204,162],[165,163,205],[205,207,165],[164,166,208],[208,206,164],[167,165,207],[207,209,167],[169,168,210],[210,211,169],[171,170,212],[212,213,171],[168,172,214],[214,210,168],[173,171,213],[213,215,173],[172,174,216],[216,214,172],[175,173,215],[215,217,175],[174,176,218],[218,216,174],[177,175,217],[217,219,177],[176,178,220],[220,218,176],[179,177,219],[219,221,179],[178,180,222],[222,220,178],[181,179,221],[221,223,181],[180,182,224],[224,222,180],[183,181,223],[223,225,183],[182,184,226],[226,224,182],[185,183,225],[225,227,185],[184,186,228],[228,226,184],[187,185,227],[227,229,187],[186,188,230],[230,228,186],[189,187,229],[229,231,189],[188,190,232],[232,230,188],[191,189,231],[231,233,191],[190,192,234],[234,232,190],[193,191,233],[233,235,193],[192,194,236],[236,234,192],[195,193,235],[235,237,195],[194,196,238],[238,236,194],[197,195,237],[237,239,197],[196,198,240],[240,238,196],[199,197,239],[239,241,199],[198,200,242],[242,240,198],[201,199,241],[241,243,201],[200,202,244],[244,242,200],[203,201,243],[243,245,203],[202,204,246],[246,244,202],[205,203,245],[245,247,205],[204,206,248],[248,246,204],[207,205,247],[247,249,207],[206,208,250],[250,248,206],[209,207,249],[249,251,209],[211,210,252],[252,253,211],[213,212,254],[254,255,213],[210,214,256],[256,252,210],[215,213,255],[255,257,215],[214,216,258],[258,256,214],[217,215,257],[257,259,217],[216,218,260],[260,258,216],[219,217,259],[259,261,219],[218,220,262],[262,260,218],[221,219,261],[261,263,221],[220,222,264],[264,262,220],[223,221,263],[263,265,223],[222,224,266],[266,264,222],[225,223,265],[265,267,225],[224,226,268],[268,266,224],[227,225,267],[267,269,227],[226,228,270],[270,268,226],[229,227,269],[269,271,229],[228,230,272],[272,270,228],[231,229,271],[271,273,231],[230,232,274],[274,272,230],[233,231,273],[273,275,233],[232,234,276],[276,274,232],[235,233,275],[275,277,235],[234,236,278],[278,276,234],[237,235,277],[277,279,237],[236,238,280],[280,278,236],[239,237,279],[279,281,239],[238,240,282],[282,280,238],[241,239,281],[281,283,241],[240,242,284],[284,282,240],[243,241,283],[283,285,243],[242,244,286],[286,284,242],[245,243,285],[285,287,245],[244,246,288],[288,286,244],[247,245,287],[287,289,247],[246,248,290],[290,288,246],[249,247,289],[289,291,249],[248,250,292],[292,290,248],[251,249,291],[291,293,251],[253,252,294],[294,295,253],[255,254,296],[296,297,255],[252,256,298],[298,294,252],[257,255,297],[297,299,257],[256,258,300],[300,298,256],[259,257,299],[299,301,259],[258,260,302],[302,300,258],[261,259,301],[301,303,261],[260,262,304],[304,302,260],[263,261,303],[303,305,263],[262,264,306],[306,304,262],[265,263,305],[305,307,265],[264,266,308],[308,306,264],[267,265,307],[307,309,267],[266,268,310],[310,308,266],[269,267,309],[309,311,269],[268,270,312],[312,310,268],[271,269,311],[311,313,271],[270,272,314],[314,312,270],[273,271,313],[313,315,273],[272,274,316],[316,314,272],[275,273,315],[315,317,275],[274,276,318],[318,316,274],[277,275,317],[317,319,277],[276,278,320],[320,318,276],[279,277,319],[319,321,279],[278,280,322],[322,320,278],[281,279,321],[321,323,281],[280,282,324],[324,322,280],[283,281,323],[323,325,283],[282,284,326],[326,324,282],[285,283,325],[325,327,285],[284,286,328],[328,326,284],[287,285,327],[327,329,287],[286,288,330],[330,328,286],[289,287,329],[329,331,289],[288,290,332],[332,330,288],[291,289,331],[331,333,291],[290,292,334],[334,332,290],[293,291,333],[333,335,293],[295,294,336],[336,337,295],[297,296,338],[338,339,297],[294,298,340],[340,336,294],[299,297,339],[339,341,299],[298,300,342],[342,340,298],[301,299,341],[341,343,301],[300,302,344],[344,342,300],[303,301,343],[343,345,303],[302,304,346],[346,344,302],[305,303,345],[345,347,305],[304,306,348],[348,346,304],[307,305,347],[347,349,307],[306,308,350],[350,348,306],[309,307,349],[349,351,309],[308,310,352],[352,350,308],[311,309,351],[351,353,311],[310,312,354],[354,352,310],[313,311,353],[353,355,313],[312,314,356],[356,354,312],[315,313,355],[355,357,315],[314,316,358],[358,356,314],[317,315,357],[357,359,317],[316,318,360],[360,358,316],[319,317,359],[359,361,319],[318,320,362],[362,360,318],[321,319,361],[361,363,321],[320,322,364],[364,362,320],[323,321,363],[363,365,323],[322,324,366],[366,364,322],[325,323,365],[365,367,325],[324,326,368],[368,366,324],[327,325,367],[367,369,327],[326,328,370],[370,368,326],[329,327,369],[369,371,329],[328,330,372],[372,370,328],[331,329,371],[371,373,331],[330,332,374],[374,372,330],[333,331,373],[373,375,333],[332,334,376],[376,374,332],[335,333,375],[375,377,335],[337,336,378],[378,379,337],[339,338,380],[380,381,339],[336,340,382],[382,378,336],[341,339,381],[381,383,341],[340,342,384],[384,382,340],[343,341,383],[383,385,343],[342,344,386],[386,384,342],[345,343,385],[385,387,345],[344,346,388],[388,386,344],[347,345,387],[387,389,347],[346,348,390],[390,388,346],[349,347,389],[389,391,349],[348,350,392],[392,390,348],[351,349,391],[391,393,351],[350,352,394],[394,392,350],[353,351,393],[393,395,353],[352,354,396],[396,394,352],[355,353,395],[395,397,355],[354,356,398],[398,396,354],[357,355,397],[397,399,357],[356,358,400],[400,398,356],[359,357,399],[399,401,359],[358,360,402],[402,400,358],[361,359,401],[401,403,361],[360,362,404],[404,402,360],[363,361,403],[403,405,363],[362,364,406],[406,404,362],[365,363,405],[405,407,365],[364,366,408],[408,406,364],[367,365,407],[407,409,367],[366,368,410],[410,408,366],[369,367,409],[409,411,369],[368,370,412],[412,410,368],[371,369,411],[411,413,371],[370,372,414],[414,412,370],[373,371,413],[413,415,373],[372,374,416],[416,414,372],[375,373,415],[415,417,375],[374,376,418],[418,416,374],[377,375,417],[417,419,377],[379,378,420],[420,421,379],[381,380,422],[422,423,381],[378,382,424],[424,420,378],[383,381,423],[423,425,383],[382,384,426],[426,424,382],[385,383,425],[425,427,385],[384,386,428],[428,426,384],[387,385,427],[427,429,387],[386,388,430],[430,428,386],[389,387,429],[429,431,389],[388,390,432],[432,430,388],[391,389,431],[431,433,391],[390,392,434],[434,432,390],[393,391,433],[433,435,393],[392,394,436],[436,434,392],[395,393,435],[435,437,395],[394,396,438],[438,436,394],[397,395,437],[437,439,397],[396,398,440],[440,438,396],[399,397,439],[439,441,399],[398,400,442],[442,440,398],[401,399,441],[441,443,401],[400,402,444],[444,442,400],[403,401,443],[443,445,403],[402,404,446],[446,444,402],[405,403,445],[445,447,405],[404,406,448],[448,446,404],[407,405,447],[447,449,407],[406,408,450],[450,448,406],[409,407,449],[449,451,409],[408,410,452],[452,450,408],[411,409,451],[451,453,411],[410,412,454],[454,452,410],[413,411,453],[453,455,413],[412,414,456],[456,454,412],[415,413,455],[455,457,415],[414,416,458],[458,456,414],[417,415,457],[457,459,417],[416,418,460],[460,458,416],[419,417,459],[459,461,419],[0,5,462],[462,463,0],[464,465,466],[466,467,464],[463,462,468],[468,469,463],[465,470,471],[471,466,465],[469,468,472],[472,473,469],[470,474,475],[475,471,470],[473,472,476],[476,477,473],[474,478,479],[479,475,474],[477,476,480],[480,481,477],[478,482,483],[483,479,478],[481,480,484],[484,485,481],[482,486,487],[487,483,482],[485,484,488],[488,489,485],[486,490,491],[491,487,486],[489,488,492],[492,493,489],[490,494,495],[495,491,490],[493,492,496],[496,497,493],[494,498,499],[499,495,494],[497,496,500],[500,501,497],[498,502,503],[503,499,498],[501,500,504],[504,505,501],[502,506,507],[507,503,502],[505,504,508],[508,509,505],[506,510,511],[511,507,506],[509,508,512],[512,513,509],[510,514,515],[515,511,510],[513,512,516],[516,517,513],[514,518,519],[519,515,514],[517,516,520],[520,521,517],[518,522,523],[523,519,518],[521,520,524],[524,525,521],[522,526,527],[527,523,522],[525,524,528],[528,529,525],[526,530,531],[531,527,526],[529,528,532],[532,533,529],[530,534,535],[535,531,530],[533,532,536],[536,537,533],[534,538,539],[539,535,534],[537,536,5],[5,0,537],[538,464,467],[467,539,538],[540,541,542],[542,543,540],[541,544,545],[545,542,541],[544,546,547],[547,545,544],[546,548,549],[549,547,546],[548,550,551],[551,549,548],[550,552,553],[553,551,550],[552,554,555],[555,553,552],[554,556,557],[557,555,554],[556,558,559],[559,557,556],[558,560,561],[561,559,558],[560,562,563],[563,561,560],[562,564,565],[565,563,562],[564,566,567],[567,565,564],[566,568,569],[569,567,566],[568,570,571],[571,569,568],[570,572,573],[573,571,570],[572,574,575],[575,573,572],[574,576,577],[577,575,574],[576,578,579],[579,577,576],[578,580,581],[581,579,578],[543,542,582],[582,583,543],[542,545,584],[584,582,542],[545,547,585],[585,584,545],[547,549,586],[586,585,547],[549,551,587],[587,586,549],[551,553,588],[588,587,551],[553,555,589],[589,588,553],[555,557,590],[590,589,555],[557,559,591],[591,590,557],[559,561,592],[592,591,559],[561,563,593],[593,592,561],[563,565,594],[594,593,563],[565,567,595],[595,594,565],[567,569,596],[596,595,567],[569,571,597],[597,596,569],[571,573,598],[598,597,571],[573,575,599],[599,598,573],[575,577,600],[600,599,575],[577,579,601],[601,600,577],[579,581,602],[602,601,579],[583,582,603],[603,604,583],[582,584,605],[605,603,582],[584,585,606],[606,605,584],[585,586,607],[607,606,585],[586,587,608],[608,607,586],[587,588,609],[609,608,587],[588,589,610],[610,609,588],[589,590,611],[611,610,589],[590,591,612],[612,611,590],[591,592,613],[613,612,591],[592,593,614],[614,613,592],[593,594,615],[615,614,593],[594,595,616],[616,615,594],[595,596,617],[617,616,595],[596,597,618],[618,617,596],[597,598,619],[619,618,597],[598,599,620],[620,619,598],[599,600,621],[621,620,599],[600,601,622],[622,621,600],[601,602,623],[623,622,601],[604,603,624],[624,625,604],[603,605,626],[626,624,603],[605,606,627],[627,626,605],[606,607,628],[628,627,606],[607,608,629],[629,628,607],[608,609,630],[630,629,608],[609,610,631],[631,630,609],[610,611,632],[632,631,610],[611,612,633],[633,632,611],[612,613,634],[634,633,612],[613,614,635],[635,634,613],[614,615,636],[636,635,614],[615,616,637],[637,636,615],[616,617,638],[638,637,616],[617,618,639],[639,638,617],[618,619,640],[640,639,618],[619,620,641],[641,640,619],[620,621,642],[642,641,620],[621,622,643],[643,642,621],[622,623,644],[644,643,622],[625,624,645],[645,646,625],[624,626,647],[647,645,624],[626,627,648],[648,647,626],[627,628,649],[649,648,627],[628,629,650],[650,649,628],[629,630,651],[651,650,629],[630,631,652],[652,651,630],[631,632,653],[653,652,631],[632,633,654],[654,653,632],[633,634,655],[655,654,633],[634,635,656],[656,655,634],[635,636,657],[657,656,635],[636,637,658],[658,657,636],[637,638,659],[659,658,637],[638,639,660],[660,659,638],[639,640,661],[661,660,639],[640,641,662],[662,661,640],[641,642,663],[663,662,641],[642,643,664],[664,663,642],[643,644,665],[665,664,643],[646,645,666],[666,667,646],[645,647,668],[668,666,645],[647,648,669],[669,668,647],[648,649,670],[670,669,648],[649,650,671],[671,670,649],[650,651,672],[672,671,650],[651,652,673],[673,672,651],[652,653,674],[674,673,652],[653,654,675],[675,674,653],[654,655,676],[676,675,654],[655,656,677],[677,676,655],[656,657,678],[678,677,656],[657,658,679],[679,678,657],[658,659,680],[680,679,658],[659,660,681],[681,680,659],[660,661,682],[682,681,660],[661,662,683],[683,682,661],[662,663,684],[684,683,662],[663,664,685],[685,684,663],[664,665,686],[686,685,664],[667,666,687],[687,688,667],[666,668,689],[689,687,666],[668,669,690],[690,689,668],[669,670,691],[691,690,669],[670,671,692],[692,691,670],[671,672,693],[693,692,671],[672,673,694],[694,693,672],[673,674,695],[695,694,673],[674,675,696],[696,695,674],[675,676,697],[697,696,675],[676,677,698],[698,697,676],[677,678,699],[699,698,677],[678,679,700],[700,699,678],[679,680,701],[701,700,679],[680,681,702],[702,701,680],[681,682,703],[703,702,681],[682,683,704],[704,703,682],[683,684,705],[705,704,683],[684,685,706],[706,705,684],[685,686,707],[707,706,685],[688,687,708],[708,709,688],[687,689,710],[710,708,687],[689,690,711],[711,710,689],[690,691,712],[712,711,690],[691,692,713],[713,712,691],[692,693,714],[714,713,692],[693,694,715],[715,714,693],[694,695,716],[716,715,694],[695,696,717],[717,716,695],[696,697,718],[718,717,696],[697,698,719],[719,718,697],[698,699,720],[720,719,698],[699,700,721],[721,720,699],[700,701,722],[722,721,700],[701,702,723],[723,722,701],[702,703,724],[724,723,702],[703,704,725],[725,724,703],[704,705,726],[726,725,704],[705,706,727],[727,726,705],[706,707,728],[728,727,706],[709,708,729],[729,730,709],[708,710,731],[731,729,708],[710,711,732],[732,731,710],[711,712,733],[733,732,711],[712,713,734],[734,733,712],[713,714,735],[735,734,713],[714,715,736],[736,735,714],[715,716,737],[737,736,715],[716,717,738],[738,737,716],[717,718,739],[739,738,717],[718,719,740],[740,739,718],[719,720,741],[741,740,719],[720,721,742],[742,741,720],[721,722,743],[743,742,721],[722,723,744],[744,743,722],[723,724,745],[745,744,723],[724,725,746],[746,745,724],[725,726,747],[747,746,725],[726,727,748],[748,747,726],[727,728,749],[749,748,727],[730,729,750],[750,751,730],[729,731,752],[752,750,729],[731,732,753],[753,752,731],[732,733,754],[754,753,732],[733,734,755],[755,754,733],[734,735,756],[756,755,734],[735,736,757],[757,756,735],[736,737,758],[758,757,736],[737,738,759],[759,758,737],[738,739,760],[760,759,738],[739,740,761],[761,760,739],[740,741,762],[762,761,740],[741,742,763],[763,762,741],[742,743,764],[764,763,742],[743,744,765],[765,764,743],[744,745,766],[766,765,744],[745,746,767],[767,766,745],[746,747,768],[768,767,746],[747,748,769],[769,768,747],[748,749,770],[770,769,748],[771,541,540],[772,544,541],[773,546,544],[774,548,546],[775,550,548],[776,552,550],[777,554,552],[778,556,554],[779,558,556],[780,560,558],[781,562,560],[782,564,562],[783,566,564],[784,568,566],[785,570,568],[786,572,570],[787,574,572],[788,576,574],[789,578,576],[790,580,578],[791,751,750],[792,750,752],[793,752,753],[794,753,754],[795,754,755],[796,755,756],[797,756,757],[798,757,758],[799,758,759],[800,759,760],[801,760,761],[802,761,762],[803,762,763],[804,763,764],[805,764,765],[806,765,766],[807,766,767],[808,767,768],[809,768,769],[810,769,770],[811,812,813],[813,814,811],[812,815,816],[816,813,812],[815,817,818],[818,816,815],[817,819,820],[820,818,817],[819,821,822],[822,820,819],[821,823,824],[824,822,821],[823,825,826],[826,824,823],[825,827,828],[828,826,825],[827,829,830],[830,828,827],[829,831,832],[832,830,829],[831,833,834],[834,832,831],[833,835,836],[836,834,833],[835,837,838],[838,836,835],[837,839,840],[840,838,837],[839,841,842],[842,840,839],[814,813,843],[843,844,814],[813,816,845],[845,843,813],[816,818,846],[846,845,816],[818,820,847],[847,846,818],[820,822,848],[848,847,820],[822,824,849],[849,848,822],[824,826,850],[850,849,824],[826,828,851],[851,850,826],[828,830,852],[852,851,828],[830,832,853],[853,852,830],[832,834,854],[854,853,832],[834,836,855],[855,854,834],[836,838,856],[856,855,836],[838,840,857],[857,856,838],[840,842,858],[858,857,840],[844,843,859],[859,860,844],[843,845,861],[861,859,843],[845,846,862],[862,861,845],[846,847,863],[863,862,846],[847,848,864],[864,863,847],[848,849,865],[865,864,848],[849,850,866],[866,865,849],[850,851,867],[867,866,850],[851,852,868],[868,867,851],[852,853,869],[869,868,852],[853,854,870],[870,869,853],[854,855,871],[871,870,854],[855,856,872],[872,871,855],[856,857,873],[873,872,856],[857,858,874],[874,873,857],[860,859,875],[875,876,860],[859,861,877],[877,875,859],[861,862,878],[878,877,861],[862,863,879],[879,878,862],[863,864,880],[880,879,863],[864,865,881],[881,880,864],[865,866,882],[882,881,865],[866,867,883],[883,882,866],[867,868,884],[884,883,867],[868,869,885],[885,884,868],[869,870,886],[886,885,869],[870,871,887],[887,886,870],[871,872,888],[888,887,871],[872,873,889],[889,888,872],[873,874,890],[890,889,873],[876,875,891],[891,892,876],[875,877,893],[893,891,875],[877,878,894],[894,893,877],[878,879,895],[895,894,878],[879,880,896],[896,895,879],[880,881,897],[897,896,880],[881,882,898],[898,897,881],[882,883,899],[899,898,882],[883,884,900],[900,899,883],[884,885,901],[901,900,884],[885,886,902],[902,901,885],[886,887,903],[903,902,886],[887,888,904],[904,903,887],[888,889,905],[905,904,888],[889,890,906],[906,905,889],[892,891,907],[907,908,892],[891,893,909],[909,907,891],[893,894,910],[910,909,893],[894,895,911],[911,910,894],[895,896,912],[912,911,895],[896,897,913],[913,912,896],[897,898,914],[914,913,897],[898,899,915],[915,914,898],[899,900,916],[916,915,899],[900,901,917],[917,916,900],[901,902,918],[918,917,901],[902,903,919],[919,918,902],[903,904,920],[920,919,903],[904,905,921],[921,920,904],[905,906,922],[922,921,905],[908,907,923],[923,924,908],[907,909,925],[925,923,907],[909,910,926],[926,925,909],[910,911,927],[927,926,910],[911,912,928],[928,927,911],[912,913,929],[929,928,912],[913,914,930],[930,929,913],[914,915,931],[931,930,914],[915,916,932],[932,931,915],[916,917,933],[933,932,916],[917,918,934],[934,933,917],[918,919,935],[935,934,918],[919,920,936],[936,935,919],[920,921,937],[937,936,920],[921,922,938],[938,937,921],[924,923,939],[939,940,924],[923,925,941],[941,939,923],[925,926,942],[942,941,925],[926,927,943],[943,942,926],[927,928,944],[944,943,927],[928,929,945],[945,944,928],[929,930,946],[946,945,929],[930,931,947],[947,946,930],[931,932,948],[948,947,931],[932,933,949],[949,948,932],[933,934,950],[950,949,933],[934,935,951],[951,950,934],[935,936,952],[952,951,935],[936,937,953],[953,952,936],[937,938,954],[954,953,937],[940,939,955],[955,956,940],[939,941,957],[957,955,939],[941,942,958],[958,957,941],[942,943,959],[959,958,942],[943,944,960],[960,959,943],[944,945,961],[961,960,944],[945,946,962],[962,961,945],[946,947,963],[963,962,946],[947,948,964],[964,963,947],[948,949,965],[965,964,948],[949,950,966],[966,965,949],[950,951,967],[967,966,950],[951,952,968],[968,967,951],[952,953,969],[969,968,952],[953,954,970],[970,969,953],[956,955,971],[971,972,956],[955,957,973],[973,971,955],[957,958,974],[974,973,957],[958,959,975],[975,974,958],[959,960,976],[976,975,959],[960,961,977],[977,976,960],[961,962,978],[978,977,961],[962,963,979],[979,978,962],[963,964,980],[980,979,963],[964,965,981],[981,980,964],[965,966,982],[982,981,965],[966,967,983],[983,982,966],[967,968,984],[984,983,967],[968,969,985],[985,984,968],[969,970,986],[986,985,969],[972,971,987],[987,988,972],[971,973,989],[989,987,971],[973,974,990],[990,989,973],[974,975,991],[991,990,974],[975,976,992],[992,991,975],[976,977,993],[993,992,976],[977,978,994],[994,993,977],[978,979,995],[995,994,978],[979,980,996],[996,995,979],[980,981,997],[997,996,980],[981,982,998],[998,997,981],[982,983,999],[999,998,982],[983,984,1000],[1000,999,983],[984,985,1001],[1001,1000,984],[985,986,1002],[1002,1001,985],[988,987,1003],[1003,1004,988],[987,989,1005],[1005,1003,987],[989,990,1006],[1006,1005,989],[990,991,1007],[1007,1006,990],[991,992,1008],[1008,1007,991],[992,993,1009],[1009,1008,992],[993,994,1010],[1010,1009,993],[994,995,1011],[1011,1010,994],[995,996,1012],[1012,1011,995],[996,997,1013],[1013,1012,996],[997,998,1014],[1014,1013,997],[998,999,1015],[1015,1014,998],[999,1000,1016],[1016,1015,999],[1000,1001,1017],[1017,1016,1000],[1001,1002,1018],[1018,1017,1001],[1004,1003,1019],[1019,1020,1004],[1003,1005,1021],[1021,1019,1003],[1005,1006,1022],[1022,1021,1005],[1006,1007,1023],[1023,1022,1006],[1007,1008,1024],[1024,1023,1007],[1008,1009,1025],[1025,1024,1008],[1009,1010,1026],[1026,1025,1009],[1010,1011,1027],[1027,1026,1010],[1011,1012,1028],[1028,1027,1011],[1012,1013,1029],[1029,1028,1012],[1013,1014,1030],[1030,1029,1013],[1014,1015,1031],[1031,1030,1014],[1015,1016,1032],[1032,1031,1015],[1016,1017,1033],[1033,1032,1016],[1017,1018,1034],[1034,1033,1017],[1020,1019,1035],[1035,1036,1020],[1019,1021,1037],[1037,1035,1019],[1021,1022,1038],[1038,1037,1021],[1022,1023,1039],[1039,1038,1022],[1023,1024,1040],[1040,1039,1023],[1024,1025,1041],[1041,1040,1024],[1025,1026,1042],[1042,1041,1025],[1026,1027,1043],[1043,1042,1026],[1027,1028,1044],[1044,1043,1027],[1028,1029,1045],[1045,1044,1028],[1029,1030,1046],[1046,1045,1029],[1030,1031,1047],[1047,1046,1030],[1031,1032,1048],[1048,1047,1031],[1032,1033,1049],[1049,1048,1032],[1033,1034,1050],[1050,1049,1033],[1036,1035,1051],[1051,1052,1036],[1035,1037,1053],[1053,1051,1035],[1037,1038,1054],[1054,1053,1037],[1038,1039,1055],[1055,1054,1038],[1039,1040,1056],[1056,1055,1039],[1040,1041,1057],[1057,1056,1040],[1041,1042,1058],[1058,1057,1041],[1042,1043,1059],[1059,1058,1042],[1043,1044,1060],[1060,1059,1043],[1044,1045,1061],[1061,1060,1044],[1045,1046,1062],[1062,1061,1045],[1046,1047,1063],[1063,1062,1046],[1047,1048,1064],[1064,1063,1047],[1048,1049,1065],[1065,1064,1048],[1049,1050,1066],[1066,1065,1049],[1067,1068,1069],[1069,1070,1067],[1068,1071,1072],[1072,1069,1068],[1071,1073,1074],[1074,1072,1071],[1073,1075,1076],[1076,1074,1073],[1075,1077,1078],[1078,1076,1075],[1077,1079,1080],[1080,1078,1077],[1079,1081,1082],[1082,1080,1079],[1081,1083,1084],[1084,1082,1081],[1083,1085,1086],[1086,1084,1083],[1085,1087,1088],[1088,1086,1085],[1087,1089,1090],[1090,1088,1087],[1089,1091,1092],[1092,1090,1089],[1091,1093,1094],[1094,1092,1091],[1093,1095,1096],[1096,1094,1093],[1095,1097,1098],[1098,1096,1095],[1070,1069,1099],[1099,1100,1070],[1069,1072,1101],[1101,1099,1069],[1072,1074,1102],[1102,1101,1072],[1074,1076,1103],[1103,1102,1074],[1076,1078,1104],[1104,1103,1076],[1078,1080,1105],[1105,1104,1078],[1080,1082,1106],[1106,1105,1080],[1082,1084,1107],[1107,1106,1082],[1084,1086,1108],[1108,1107,1084],[1086,1088,1109],[1109,1108,1086],[1088,1090,1110],[1110,1109,1088],[1090,1092,1111],[1111,1110,1090],[1092,1094,1112],[1112,1111,1092],[1094,1096,1113],[1113,1112,1094],[1096,1098,1114],[1114,1113,1096],[1100,1099,1115],[1115,1116,1100],[1099,1101,1117],[1117,1115,1099],[1101,1102,1118],[1118,1117,1101],[1102,1103,1119],[1119,1118,1102],[1103,1104,1120],[1120,1119,1103],[1104,1105,1121],[1121,1120,1104],[1105,1106,1122],[1122,1121,1105],[1106,1107,1123],[1123,1122,1106],[1107,1108,1124],[1124,1123,1107],[1108,1109,1125],[1125,1124,1108],[1109,1110,1126],[1126,1125,1109],[1110,1111,1127],[1127,1126,1110],[1111,1112,1128],[1128,1127,1111],[1112,1113,1129],[1129,1128,1112],[1113,1114,1130],[1130,1129,1113],[1116,1115,1131],[1131,1132,1116],[1115,1117,1133],[1133,1131,1115],[1117,1118,1134],[1134,1133,1117],[1118,1119,1135],[1135,1134,1118],[1119,1120,1136],[1136,1135,1119],[1120,1121,1137],[1137,1136,1120],[1121,1122,1138],[1138,1137,1121],[1122,1123,1139],[1139,1138,1122],[1123,1124,1140],[1140,1139,1123],[1124,1125,1141],[1141,1140,1124],[1125,1126,1142],[1142,1141,1125],[1126,1127,1143],[1143,1142,1126],[1127,1128,1144],[1144,1143,1127],[1128,1129,1145],[1145,1144,1128],[1129,1130,1146],[1146,1145,1129],[1132,1131,1147],[1147,1148,1132],[1131,1133,1149],[1149,1147,1131],[1133,1134,1150],[1150,1149,1133],[1134,1135,1151],[1151,1150,1134],[1135,1136,1152],[1152,1151,1135],[1136,1137,1153],[1153,1152,1136],[1137,1138,1154],[1154,1153,1137],[1138,1139,1155],[1155,1154,1138],[1139,1140,1156],[1156,1155,1139],[1140,1141,1157],[1157,1156,1140],[1141,1142,1158],[1158,1157,1141],[1142,1143,1159],[1159,1158,1142],[1143,1144,1160],[1160,1159,1143],[1144,1145,1161],[1161,1160,1144],[1145,1146,1162],[1162,1161,1145],[1148,1147,1163],[1163,1164,1148],[1147,1149,1165],[1165,1163,1147],[1149,1150,1166],[1166,1165,1149],[1150,1151,1167],[1167,1166,1150],[1151,1152,1168],[1168,1167,1151],[1152,1153,1169],[1169,1168,1152],[1153,1154,1170],[1170,1169,1153],[1154,1155,1171],[1171,1170,1154],[1155,1156,1172],[1172,1171,1155],[1156,1157,1173],[1173,1172,1156],[1157,1158,1174],[1174,1173,1157],[1158,1159,1175],[1175,1174,1158],[1159,1160,1176],[1176,1175,1159],[1160,1161,1177],[1177,1176,1160],[1161,1162,1178],[1178,1177,1161],[1164,1163,1179],[1179,1180,1164],[1163,1165,1181],[1181,1179,1163],[1165,1166,1182],[1182,1181,1165],[1166,1167,1183],[1183,1182,1166],[1167,1168,1184],[1184,1183,1167],[1168,1169,1185],[1185,1184,1168],[1169,1170,1186],[1186,1185,1169],[1170,1171,1187],[1187,1186,1170],[1171,1172,1188],[1188,1187,1171],[1172,1173,1189],[1189,1188,1172],[1173,1174,1190],[1190,1189,1173],[1174,1175,1191],[1191,1190,1174],[1175,1176,1192],[1192,1191,1175],[1176,1177,1193],[1193,1192,1176],[1177,1178,1194],[1194,1193,1177],[1180,1179,1195],[1195,1196,1180],[1179,1181,1197],[1197,1195,1179],[1181,1182,1198],[1198,1197,1181],[1182,1183,1199],[1199,1198,1182],[1183,1184,1200],[1200,1199,1183],[1184,1185,1201],[1201,1200,1184],[1185,1186,1202],[1202,1201,1185],[1186,1187,1203],[1203,1202,1186],[1187,1188,1204],[1204,1203,1187],[1188,1189,1205],[1205,1204,1188],[1189,1190,1206],[1206,1205,1189],[1190,1191,1207],[1207,1206,1190],[1191,1192,1208],[1208,1207,1191],[1192,1193,1209],[1209,1208,1192],[1193,1194,1210],[1210,1209,1193],[1196,1195,1211],[1211,1212,1196],[1195,1197,1213],[1213,1211,1195],[1197,1198,1214],[1214,1213,1197],[1198,1199,1215],[1215,1214,1198],[1199,1200,1216],[1216,1215,1199],[1200,1201,1217],[1217,1216,1200],[1201,1202,1218],[1218,1217,1201],[1202,1203,1219],[1219,1218,1202],[1203,1204,1220],[1220,1219,1203],[1204,1205,1221],[1221,1220,1204],[1205,1206,1222],[1222,1221,1205],[1206,1207,1223],[1223,1222,1206],[1207,1208,1224],[1224,1223,1207],[1208,1209,1225],[1225,1224,1208],[1209,1210,1226],[1226,1225,1209],[1212,1211,1227],[1227,1228,1212],[1211,1213,1229],[1229,1227,1211],[1213,1214,1230],[1230,1229,1213],[1214,1215,1231],[1231,1230,1214],[1215,1216,1232],[1232,1231,1215],[1216,1217,1233],[1233,1232,1216],[1217,1218,1234],[1234,1233,1217],[1218,1219,1235],[1235,1234,1218],[1219,1220,1236],[1236,1235,1219],[1220,1221,1237],[1237,1236,1220],[1221,1222,1238],[1238,1237,1221],[1222,1223,1239],[1239,1238,1222],[1223,1224,1240],[1240,1239,1223],[1224,1225,1241],[1241,1240,1224],[1225,1226,1242],[1242,1241,1225],[1228,1227,1243],[1243,1244,1228],[1227,1229,1245],[1245,1243,1227],[1229,1230,1246],[1246,1245,1229],[1230,1231,1247],[1247,1246,1230],[1231,1232,1248],[1248,1247,1231],[1232,1233,1249],[1249,1248,1232],[1233,1234,1250],[1250,1249,1233],[1234,1235,1251],[1251,1250,1234],[1235,1236,1252],[1252,1251,1235],[1236,1237,1253],[1253,1252,1236],[1237,1238,1254],[1254,1253,1237],[1238,1239,1255],[1255,1254,1238],[1239,1240,1256],[1256,1255,1239],[1240,1241,1257],[1257,1256,1240],[1241,1242,1258],[1258,1257,1241],[1244,1243,1259],[1259,1260,1244],[1243,1245,1261],[1261,1259,1243],[1245,1246,1262],[1262,1261,1245],[1246,1247,1263],[1263,1262,1246],[1247,1248,1264],[1264,1263,1247],[1248,1249,1265],[1265,1264,1248],[1249,1250,1266],[1266,1265,1249],[1250,1251,1267],[1267,1266,1250],[1251,1252,1268],[1268,1267,1251],[1252,1253,1269],[1269,1268,1252],[1253,1254,1270],[1270,1269,1253],[1254,1255,1271],[1271,1270,1254],[1255,1256,1272],[1272,1271,1255],[1256,1257,1273],[1273,1272,1256],[1257,1258,1274],[1274,1273,1257],[1260,1259,1275],[1275,1276,1260],[1259,1261,1277],[1277,1275,1259],[1261,1262,1278],[1278,1277,1261],[1262,1263,1279],[1279,1278,1262],[1263,1264,1280],[1280,1279,1263],[1264,1265,1281],[1281,1280,1264],[1265,1266,1282],[1282,1281,1265],[1266,1267,1283],[1283,1282,1266],[1267,1268,1284],[1284,1283,1267],[1268,1269,1285],[1285,1284,1268],[1269,1270,1286],[1286,1285,1269],[1270,1271,1287],[1287,1286,1270],[1271,1272,1288],[1288,1287,1271],[1272,1273,1289],[1289,1288,1272],[1273,1274,1290],[1290,1289,1273],[1276,1275,1291],[1291,1292,1276],[1275,1277,1293],[1293,1291,1275],[1277,1278,1294],[1294,1293,1277],[1278,1279,1295],[1295,1294,1278],[1279,1280,1296],[1296,1295,1279],[1280,1281,1297],[1297,1296,1280],[1281,1282,1298],[1298,1297,1281],[1282,1283,1299],[1299,1298,1282],[1283,1284,1300],[1300,1299,1283],[1284,1285,1301],[1301,1300,1284],[1285,1286,1302],[1302,1301,1285],[1286,1287,1303],[1303,1302,1286],[1287,1288,1304],[1304,1303,1287],[1288,1289,1305],[1305,1304,1288],[1289,1290,1306],[1306,1305,1289],[1292,1291,1307],[1307,1308,1292],[1291,1293,1309],[1309,1307,1291],[1293,1294,1310],[1310,1309,1293],[1294,1295,1311],[1311,1310,1294],[1295,1296,1312],[1312,1311,1295],[1296,1297,1313],[1313,1312,1296],[1297,1298,1314],[1314,1313,1297],[1298,1299,1315],[1315,1314,1298],[1299,1300,1316],[1316,1315,1299],[1300,1301,1317],[1317,1316,1300],[1301,1302,1318],[1318,1317,1301],[1302,1303,1319],[1319,1318,1302],[1303,1304,1320],[1320,1319,1303],[1304,1305,1321],[1321,1320,1304]]}

/***/ })
/******/ ]);