以下のコードですが何をしようとしているかわかりますか？
```
project(vertex : Vertex3D): Vertex2D {
    // 向きのベクトルを得る
    const dx = this.lookAt.x - this.position.x;
    const dy = this.lookAt.y - this.position.y;
    const dz = this.lookAt.z - this.position.z;
    // 向きベクトルから、カメラの回転角を計算する
    const theta = Math.atan2(dx, dy);
    const phi = Math.atan2(dz, dx);
    const psi = Math.atan2(dy, dz);
    // カメラの回転角から、点の座標を逆回転させる => カメラの座標系に変換する
    const rotatedPoint = TODO()

    const ratio = (this.distance / ((rotatedPoint.z - this.position.z) || 1));
    return new Vertex2D(ratio * (rotatedPoint.x - this.position.x), ratio * (rotatedPoint.y - this.position.y));
  }
```
