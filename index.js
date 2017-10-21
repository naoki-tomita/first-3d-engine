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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vertex3D_1 = __webpack_require__(1);
exports.Vertex3D = Vertex3D_1.Vertex3D;
var Vertex2D_1 = __webpack_require__(5);
exports.Vertex2D = Vertex2D_1.Vertex2D;
var Matrix_1 = __webpack_require__(2);
exports.Matrix = Matrix_1.Matrix;
var Vector_1 = __webpack_require__(3);
exports.Vector = Vector_1.Vector;
var Color_1 = __webpack_require__(7);
exports.Color = Color_1.Color;
var Stage_1 = __webpack_require__(8);
exports.Stage = Stage_1.Stage;
var Model_1 = __webpack_require__(9);
exports.Model = Model_1.Model;
var Face_1 = __webpack_require__(10);
exports.Face = Face_1.Face;
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
// dx, dy は 画面の中心を設定する。そこを中心に画像が生成される
function render(options) {
    var stage = options.stage, context = options.context, canvasSize = options.canvasSize, _a = options.light, light = _a === void 0 ? new Vector_1.Vector(1, -1, 1) : _a, _b = options.projectMethod, project = _b === void 0 ? exports.perspectiveViewProjection : _b;
    clear(context, canvasSize);
    stage.zsort()
        .forEach(function (obj) {
        return obj.zsort()
            .forEach(function (face) {
            var color = face.color.get(1 - ((Matrix_1.Matrix.vectorAngle(face.getNormalVector(), light) + 1) / 2));
            var v1 = project(face.vertex1), v2 = project(face.vertex2), v3 = project(face.vertex3);
            // if (face.getNormalVector().z > 0) {
            //   return;
            // }
            draw(context, v1, v2, v3, color, canvasSize);
        });
    });
}
exports.render = render;
function clear(context, canvasSize) {
    var width = canvasSize.width, height = canvasSize.height;
    context.clearRect(0, 0, width, height);
}
function draw(context, v1, v2, v3, color, canvasSize) {
    var dx = canvasSize.width / 2;
    var dy = canvasSize.height / 2;
    context.beginPath();
    context.moveTo(v1.x + dx, -v1.y + dy);
    context.lineTo(v2.x + dx, -v2.y + dy);
    context.lineTo(v3.x + dx, -v3.y + dy);
    context.closePath();
    context.strokeStyle = color;
    context.stroke();
    context.fillStyle = color;
    context.fill();
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vertex3D = /** @class */ (function () {
    function Vertex3D(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return Vertex3D;
}());
exports.Vertex3D = Vertex3D;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vertex3D_1 = __webpack_require__(1);
var Matrix = /** @class */ (function () {
    function Matrix() {
    }
    // 内積をとる
    Matrix.dotProduct = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.x * v2.y;
    };
    // 外積をとる
    Matrix.crossProduct = function (v1, v2) {
        return new Vertex3D_1.Vertex3D(v1.y * v2.z - v1.z * v2.y, v1.x * v2.z - v1.z * v2.x, v1.x * v2.y - v1.y * v2.x);
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isNumber_1 = __webpack_require__(6);
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
    return Vector;
}());
exports.Vector = Vector;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Engine_1 = __webpack_require__(0);
var Models_1 = __webpack_require__(11);
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
var cube = new Models_1.Cube(new Engine_1.Vertex3D(30, 80, 100), 60, 60, 60, Engine_1.Color.red);
var plane = new Models_1.Plane(new Engine_1.Vertex3D(100, -100, 120), 100, 100, Engine_1.Color.blue);
var objects = [
    cube,
    plane,
];
var stage = new Engine_1.Stage(objects);
function autorotate() {
    objects[0].rotate(Math.PI / 360, Math.PI / 720);
    Engine_1.render({
        stage: stage,
        context: c,
        canvasSize: {
            width: 500,
            height: 500,
        },
        projectMethod: Engine_1.orthographicViewProjection,
    });
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
    objects[1].move(dx, dy, dz);
    setTimeout(keymove, 1000 / 30);
}
keymove();


/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isNumber(arg) {
    return typeof arg === "number";
}
exports.isNumber = isNumber;


/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Stage = /** @class */ (function () {
    function Stage(objects) {
        if (objects === void 0) { objects = []; }
        this.objects = objects;
    }
    Stage.prototype.appear = function (objects) {
        this.objects = this.objects.concat(objects);
    };
    Stage.prototype.zsort = function () {
        return this.objects.slice().sort(function (a, b) { return b.getCenter().z - a.getCenter().z; });
    };
    return Stage;
}());
exports.Stage = Stage;


/***/ }),
/* 9 */
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
    Model.prototype.zsort = function () {
        return this.faces.slice().sort(function (a, b) { return b.getCenter().z - a.getCenter().z; });
    };
    return Model;
}());
exports.Model = Model;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vertex3D_1 = __webpack_require__(1);
var Vector_1 = __webpack_require__(3);
var Matrix_1 = __webpack_require__(2);
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
        return Matrix_1.Matrix.crossProduct(new Vector_1.Vector(this.vertex1, this.vertex2), new Vector_1.Vector(this.vertex2, this.vertex3));
    };
    return Face;
}());
exports.Face = Face;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Cube_1 = __webpack_require__(12);
exports.Cube = Cube_1.Cube;
var Plane_1 = __webpack_require__(13);
exports.Plane = Plane_1.Plane;


/***/ }),
/* 12 */
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
            new Engine_2.Face(v[0], v[1], v[2], color),
            new Engine_2.Face(v[1], v[3], v[2], color),
            new Engine_2.Face(v[2], v[3], v[6], color),
            new Engine_2.Face(v[6], v[3], v[7], color),
            new Engine_2.Face(v[1], v[5], v[3], color),
            new Engine_2.Face(v[5], v[7], v[3], color),
            new Engine_2.Face(v[4], v[6], v[5], color),
            new Engine_2.Face(v[5], v[6], v[7], color),
            new Engine_2.Face(v[0], v[2], v[6], color),
            new Engine_2.Face(v[0], v[6], v[4], color),
            new Engine_2.Face(v[0], v[4], v[1], color),
            new Engine_2.Face(v[1], v[4], v[5], color),
        ];
        _this = _super.call(this, v, f) || this;
        return _this;
    }
    return Cube;
}(Engine_1.Model));
exports.Cube = Cube;


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


/***/ })
/******/ ]);