export class Camera {
  constructor(width, height) {
    this.x = 0;
    this.y = 0;

    this.width = width;
    this.height = height;

    this.levelWidth = 4000;   // şimdilik sabit
    this.levelHeight = 2000;
  }

  follow(target) {
    const targetX =
      target.x + target.width / 2 - this.width / 2;

    // ⭐ LERP
    this.x += (targetX - this.x) * 0.08;

    this.x = Math.max(0, Math.min(this.x, this.levelWidth - this.width));

    this.y = 0;
  }

}
