export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.width = 80;
    this.height = 80;

    // physics
    this.vx = 0;
    this.vy = 0;

    this.speed = 700;
    this.jumpForce = 1300;
    this.doubleJumpForce = 800;
    this.gravity = 3500;

    this.onGround = false;
    this.jumpCount = 0;

  }

  update(input, delta) {
    const dt = delta / 1000;

    // ----------------
    // HORIZONTAL
    // ----------------
    this.vx = 0;

    if (input.isDown("a") || input.isDown("arrowleft")) {
        this.vx = -this.speed;
    }

    if (input.isDown("d") || input.isDown("arrowright")) {
        this.vx = this.speed;
    }

    // ----------------
    // JUMP (edge trigger)
    // ----------------
    const jumpPressed =
        input.pressed(" ") ||
        input.pressed("w") ||
        input.pressed("arrowup");

    if (jumpPressed && this.jumpCount < 2) {
        if (this.jumpCount === 0) {
            this.vy = -this.jumpForce;        // ilk
        } else {
            this.vy = -this.doubleJumpForce;  // ikinci
        }

        this.jumpCount++;
    }

    // ----------------
    // GRAVITY
    // ----------------
    this.vy += this.gravity * dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    }


  draw(ctx) {
    ctx.fillStyle = "orange";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
