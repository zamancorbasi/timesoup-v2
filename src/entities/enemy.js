export class Enemy {
    constructor(x, y, range, sprite) {

        this.x = x;
        this.y = y;

        this.startX = x;
        this.range = range;

        this.width = 80;
        this.height = 80;

        this.vx = 150;

        // ⭐ sprite
        this.sprite = sprite;

        this.frameWidth = 32;
        this.frameHeight = 32;

        this.frameX = 0;
        this.frameTimer = 0;
        this.frameInterval = 120;

        // ⭐ state
        this.alive = true;
        this.squashed = false;
        this.squashTimer = 0;
        this.remove = false;

        this.flip = false;

        // ⭐ hitbox (daha dar)
        this.hitboxOffsetX = 14;
        this.hitboxOffsetY = 18;
        this.hitboxWidth = 52;
        this.hitboxHeight = 50;
    }


    // ====================================
    update(delta) {
        const dt = delta / 1000;

        // ======================
        // SQUASH
        // ======================
        if (this.squashed) {
            this.squashTimer -= dt;

            if (this.squashTimer <= 0) {
                this.remove = true;
            }

            return;
        }

        // ======================
        // HAREKET
        // ======================
        this.x += this.vx * dt;

        // ⭐ DAHA GÜVENLİ SINIR KONTROLÜ
        const rightLimit = this.startX + this.range;
        const leftLimit = this.startX - this.range;

        if (this.x >= rightLimit) {
            this.x = rightLimit;
            this.vx = -Math.abs(this.vx);
        }

        if (this.x <= leftLimit) {
            this.x = leftLimit;
            this.vx = Math.abs(this.vx);
        }

        this.flip = this.vx < 0;

        // ======================
        // ANİMASYON
        // ======================
        this.frameTimer += delta;

        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;

            this.frameX++;
            if (this.frameX >= 3) this.frameX = 0;
        }
    }



    // ====================================
    draw(ctx) {
        if (!this.sprite) return;

        ctx.save();

        if (this.flip) ctx.scale(-1, 1);

        let sx, sy;

        // ⭐ squash frame (row1 col1)
        if (this.squashed) {
            sx = this.frameWidth;   // col 1
            sy = this.frameHeight;  // row 1
        }
        else {
            // ⭐ idle animasyon (0,0 → 0,1 → 1,0)
            const frames = [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 1 }
            ];

            const f = frames[this.frameX];

            sx = f.x * this.frameWidth;
            sy = f.y * this.frameHeight;
        }

        ctx.drawImage(
            this.sprite,
            sx, sy,
            this.frameWidth, this.frameHeight,
            this.flip ? -this.x - this.width : this.x,
            this.y,
            this.width,
            this.height
        );

        ctx.restore();
    }

}
