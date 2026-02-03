export class Game {
  constructor() {
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = 1920;
    this.canvas.height = 1080;


    this.lastTime = 0;
  }

  start() {
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(timestamp) {
    const delta = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(delta);
    this.draw();

    requestAnimationFrame(this.loop.bind(this));
  }

  update(delta) {}

  draw() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
