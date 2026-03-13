
class Brush {
  constructor(color, size) {
    this.color = color;
    this.size = size;
  }

  update(color, size) {
    this.color = color;
    this.size = size;
  }

  draw(x, y) {
    noStroke();
    fill(this.color);
    ellipse(x, y, this.size, this.size);
  }
}
