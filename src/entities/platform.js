export class Platform {
  constructor(x, y, width, height, sprite) {
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;

    this.sprite = sprite;

    this.tileSize = 32;
  }


  draw(ctx) {
    if (!this.sprite) return;

    

    const tiles = Math.floor(this.width / this.tileSize);

    const rows = Math.floor(this.height / this.tileSize);

    // =========================
    // ZEMİN PLATFORM (GROUND)
    // =========================
    const isGround = this.height > this.tileSize;

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < tiles; i++) {

        let sx = 0;
        let sy = 0;

        // ⭐ GROUND
        if (isGround) {
          sx = 1 * this.tileSize; // [0][1]
          sy = 0 * this.tileSize;
        }

        // ⭐ HAVADA PLATFORM
        else {

          // sol
          if (i === 0) {
            sx = 0 * this.tileSize; // [3][0]
            sy = 3 * this.tileSize;
          }

          // sağ
          else if (i === tiles - 1) {
            sx = 2 * this.tileSize; // [3][2]
            sy = 3 * this.tileSize;
          }

          // orta
          else {
            sx = 1 * this.tileSize; // [3][1]
            sy = 3 * this.tileSize;
          }
        }

        ctx.drawImage(
          this.sprite,
          sx, sy,
          this.tileSize, this.tileSize,
          this.x + i * this.tileSize,
          this.y + j * this.tileSize,
          this.tileSize, this.tileSize
        );
      }
    }

    
  }
}
