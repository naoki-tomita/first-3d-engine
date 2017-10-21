export class Color {
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
  get(x: number = 1) {
    return `rgba(${Math.floor(this.r * x)},${Math.floor(this.g * x)},${Math.floor(this.b * x)},${this.a})`;
  }
  static red:    Color = new Color(255, 0, 0)
  static green:  Color = new Color(0, 255, 0)
  static blue:   Color = new Color(0, 0, 255)
  static yellow: Color = new Color(255, 255, 0)
  static pink:   Color = new Color(255, 20, 147)
  static orange: Color = new Color(255, 99, 71)
  static cyan:   Color = new Color(0, 255, 255)
  static purple: Color = new Color(255, 0, 255)
}