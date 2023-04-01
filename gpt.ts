以下のコードを完成させてください。3D上のカメラの座標と注視点をもとに、指定したvertexを2Dに投影したいです。
なお、すべての計算はこの関数内で行なってください。Mathは使用できるものとします。

```
type Vertex3D = {
  x: number;
  y: number;
  z: number;
}
type Vertex2D = {
  x: number;
  y: number;
}

function project(cameraPosition: Vertex3D, cameraLookAt: Vertex3D, vertex: Vertex3D): Vertex2D {

}
```
