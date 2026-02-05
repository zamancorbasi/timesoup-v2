export class Collectable {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.size = 40;
    this.collected = false;
  }

  draw(ctx) {
    if (this.collected) return;

    ctx.fillStyle = "gold";
    ctx.beginPath();
    ctx.arc(
      this.x + this.size / 2,
      this.y + this.size / 2,
      this.size / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}
