export class Enemy {
    constructor(x, y, range = 300) {
        this.startX = x;

        this.x = x;
        this.y = y;

        this.width = 60;
        this.height = 60;

        this.speed = 250;
        this.range = range;

        this.dir = 1;
        this.alive = true;

        this.squashed = false;
        this.squashTimer = 0;

    }

    update(delta) {
        const dt = delta / 1000;

        // ⭐ squash animasyonu
        if (this.squashed) {
            this.squashTimer -= dt;

            if (this.squashTimer <= 0) {
                this.alive = false; // tamamen sil
            }

            return;
        }

        if (!this.alive) return;

        // patrol
        this.x += this.speed * this.dir * dt;

        if (this.x > this.startX + this.range) this.dir = -1;
        if (this.x < this.startX - this.range) this.dir = 1;
    }


    draw(ctx) {
        if (!this.alive) return;

        ctx.fillStyle = "crimson";

        if (this.squashed) {
            // ⭐ ezilmiş görünüm
            ctx.fillRect(this.x, this.y + this.height / 2, this.width, this.height / 2);
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }


}
