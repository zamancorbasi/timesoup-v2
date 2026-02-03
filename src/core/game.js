import { Input } from "./input.js";
import { Player } from "../entities/player.js";
import { Platform } from "../entities/platform.js";
import { CollisionSystem } from "../systems/collisionSystem.js";
import { Camera } from "./camera.js";


export class Game {
  constructor() {
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");

    // Landscape resolution
    this.canvas.width = 1920;
    this.canvas.height = 1080;

    this.lastTime = 0;

    this.input = new Input();
    this.player = new Player(300, 100);

    this.platforms = [
    new Platform(0, 1000, 1920, 80),   // zemin
    new Platform(400, 800, 400, 40),
    new Platform(1100, 650, 350, 40),
    new Platform(700, 600, 300, 40),
    ];
    this.camera = new Camera(this.canvas.width, this.canvas.height);


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

  update(delta) {
    this.player.update(this.input, delta, this.canvas.height);

    CollisionSystem.resolvePlayerPlatforms(
    this.player,
    this.platforms
    );

    this.input.update();
    this.camera.follow(this.player);



  }

  draw() {
  const ctx = this.ctx;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  ctx.save();

  // ⭐ dünya kaydırma
  ctx.translate(-this.camera.x, -this.camera.y);

  // platformlar
  for (const p of this.platforms) {
    p.draw(ctx);
  }

  // player
  this.player.draw(ctx);

  ctx.restore();
}


}
