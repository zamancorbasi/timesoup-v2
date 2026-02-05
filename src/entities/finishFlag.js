export class FinishFlag {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.width = 60;
        this.height = 120;
    }

    draw(ctx) {
        // direk
        ctx.fillStyle = "white";
        ctx.fillRect(this.x + 25, this.y, 10, this.height);

        // bayrak
        ctx.fillStyle = "lime";
        ctx.fillRect(this.x + 35, this.y, 50, 40);
    }
}
