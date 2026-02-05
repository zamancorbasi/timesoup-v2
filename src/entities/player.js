export class Player {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.prevY = y;


    this.width = 96;
    this.height = 96;

    this.hitboxOffsetX = 18;
    this.hitboxOffsetY = 10;
    this.hitboxWidth = this.width - 36;
    this.hitboxHeight = this.height - 20;


    // ⭐ sprite
    this.sprite = sprite;

    // ----------------
    // PHYSICS
    // ----------------
    this.vx = 0;
    this.vy = 0;

    this.speed = 700;
    this.jumpForce = 1300;
    this.doubleJumpForce = 800;
    this.gravity = 3500;

    this.onGround = false;
    this.jumpCount = 0;

    // ----------------
    // ANIMATION
    // ----------------
    this.frameWidth = 32;
    this.frameHeight = 32;

    this.frameX = 0;
    this.frameTimer = 0;
    this.frameInterval = 100;

    this.state = "idle";
    this.flip = false;

    // row-based sheet
    this.animations = {
      idle: { row: 0, frames: 8 },
      run: { row: 2, frames: 8 },
      jump: { row: 3, frames: 4 },
      fall: { row: 3, frames: 4 }, // aynı row kullanabilir
      talk: { row: 4, frames: 8 }
    };
  }

  // ====================================

  update(input, delta) {
    this.prevY = this.y;

    const dt = delta / 1000;

    // ----------------
    // HORIZONTAL INPUT
    // ----------------
    this.vx = 0;

    if (input.isDown("a") || input.isDown("arrowleft")) {
      this.vx = -this.speed;
    }

    if (input.isDown("d") || input.isDown("arrowright")) {
      this.vx = this.speed;
    }

    // yön flip
    if (this.vx > 0) this.flip = false;
    if (this.vx < 0) this.flip = true;

    // ----------------
    // JUMP
    // ----------------
    const jumpPressed =
      input.pressed(" ") ||
      input.pressed("w") ||
      input.pressed("arrowup");

    if (jumpPressed && this.jumpCount < 2) {
      if (this.jumpCount === 0) {
        this.vy = -this.jumpForce;
      } else {
        this.vy = -this.doubleJumpForce;
      }
      this.jumpCount++;
    }

    // ----------------
    // GRAVITY
    // ----------------
    this.vy += this.gravity * dt;

    // ----------------
    // MOVE
    // ----------------
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // ====================================
    // ⭐ STATE (PHYSICS'TEN SONRA!)
    // ====================================
    if (!this.onGround) {
      this.state = this.vy < 0 ? "jump" : "fall";
    }
    else if (Math.abs(this.vx) > 10) {
      this.state = "run";
    }
    else {
      this.state = "idle";
    }

    // ====================================
    // ⭐ FRAME UPDATE
    // ====================================
    this.frameTimer += delta;

    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;

      const anim = this.animations[this.state];

      this.frameX++;
      if (this.frameX >= anim.frames) {
        this.frameX = 0;
      }
    }
  }

  // ====================================

  draw(ctx) {
    const anim = this.animations[this.state];

    const sx = this.frameX * this.frameWidth;
    const sy = anim.row * this.frameHeight;

    ctx.save();

    if (this.flip) {
      ctx.scale(-1, 1);

      ctx.drawImage(
        this.sprite,
        sx, sy,
        this.frameWidth, this.frameHeight,
        -this.x - this.width,
        this.y,
        this.width,
        this.height
      );
    } else {
      ctx.drawImage(
        this.sprite,
        sx, sy,
        this.frameWidth, this.frameHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }

    ctx.restore();
  }
}
