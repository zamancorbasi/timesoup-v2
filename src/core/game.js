import { Input } from "./input.js";
import { Player } from "../entities/player.js";
import { Platform } from "../entities/platform.js";
import { CollisionSystem } from "../systems/collisionSystem.js";
import { Camera } from "./camera.js";
import { Collectable } from "../entities/collectable.js";
import { Enemy } from "../entities/enemy.js";
import { FinishFlag } from "../entities/finishFlag.js";
import { loadImage } from "./assetLoader.js";
import { createLevel1 } from "../levels/level1.js";



export class Game {
	constructor() {
		this.canvas = document.getElementById("game");
		this.ctx = this.canvas.getContext("2d");

		this.canvas.width = 1920;
		this.canvas.height = 1080;

		this.lastTime = 0;

		this.input = new Input();
		this.camera = new Camera(this.canvas.width, this.canvas.height);

		// ⭐ TÜM GAME STATE BURADA
		this.loadAssets();
		this.ctx.imageSmoothingEnabled = false;


	}

	// ====================================
	// ⭐ TÜM BAŞLANGIÇ DEĞERLERİ
	// ====================================
	/**
	 * 
	 */
	initialize() {
		// Sprite'ları bir paket halinde gönderiyoruz
		const sprites = {
			player: this.playerSprite,
			enemy: this.enemySprite,
			platform: this.platformSprite,
			bgSky: this.bgSky,
			bgMountains: this.bgMountains,
			bgTrees: this.bgTrees,
			bgFront: this.bgFront
		};

		// Level verisini alıyoruz
		const levelData = createLevel1(sprites);

		// Game class'ındaki değişkenlere atıyoruz
		this.player = levelData.player;
		this.platforms = levelData.platforms;
		this.collectables = levelData.collectables;
		this.enemies = levelData.enemies;
		this.flag = levelData.flag;
		this.backgrounds = levelData.backgrounds;

		this.score = 0;
		this.gameState = "play";
	}

	async loadAssets() {
		try {
			this.playerSprite = await loadImage("/assets/player.png");
			this.enemySprite = await loadImage("/assets/enemy.png");
			this.platformSprite = await loadImage("/assets/platform.png");
			this.bgSky = await loadImage("/assets/bg_sky.png");
			this.bgMountains = await loadImage("/assets/bg_mountains.png");
			this.bgTrees = await loadImage("/assets/bg_trees.png");
			this.bgFront = await loadImage("/assets/bg_front.png");

		} catch (e) {
			console.error(e);
		}

		this.initialize();
		this.start();
	}


	// ====================================

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

	// ====================================

	update(delta) {
		// STATE
		if (this.gameState !== "play") {
			if (this.input.pressed("r")) this.restart();
			this.input.update();
			return;
		}

		// PLAYER
		this.player.update(this.input, delta, this.canvas.height);

		CollisionSystem.resolvePlayerPlatforms(
			this.player,
			this.platforms
		);

		// CAMERA
		this.camera.follow(this.player);

		// COLLECTABLE
		CollisionSystem.checkPlayerCollectables(
			this.player,
			this.collectables
		);

		//this.score = this.collectables.filter(c => c.collected).length;

		// FALL DEATH
		if (this.player.y > 2000) {
			this.gameState = "gameover";
		}

		// ENEMIES
		for (const e of this.enemies) {
			e.update(delta);
		}
		// ⭐ ölü enemyleri temizle
		this.enemies = this.enemies.filter(e => !e.remove);


		if (CollisionSystem.checkPlayerEnemies(this.player, this.enemies)) {
			this.gameState = "gameover";
		}

		// FLAG
		if (CollisionSystem.checkPlayerFlag(this.player, this.flag)) {
			this.gameState = "win";
		}

		this.input.update();
	}

	// ====================================

	draw() {
		const ctx = this.ctx;

		//ctx.fillStyle = "black";
		//ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.drawParallax(ctx);

		ctx.save();
		ctx.translate(-this.camera.x, -this.camera.y);

		for (const p of this.platforms) p.draw(ctx);
		for (const e of this.enemies) e.draw(ctx);
		for (const c of this.collectables) c.draw(ctx);

		this.flag.draw(ctx);
		this.player.draw(ctx);

		ctx.restore();

		// UI
		ctx.fillStyle = "white";
		ctx.font = "30px Arial";
		//ctx.fillText(`Score: ${this.score}`, 20, 40);

		// GAME STATE TEXT
		if (this.gameState === "gameover") {
			ctx.font = "80px Arial";
			ctx.textAlign = "center";
			ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2);
			ctx.fillText("Press R to Restart", this.canvas.width / 2, this.canvas.height / 2 + 80);
		}

		if (this.gameState === "win") {
			ctx.font = "80px Arial";
			ctx.textAlign = "center";
			ctx.fillText("YOU WIN!", this.canvas.width / 2, this.canvas.height / 2);
			ctx.fillText("Press R to Restart", this.canvas.width / 2, this.canvas.height / 2 + 80);
		}
	}

	drawParallax(ctx) {

		for (const layer of this.backgrounds) {

			const img = layer.img;
			const speed = layer.speed;

			const offset = -this.camera.x * speed;

			// ⭐ istediğimiz çizim boyutu
			const drawWidth = 1920;
			const drawHeight = 1080;

			// ⭐ zemine yasla
			const y = this.canvas.height - drawHeight;

			ctx.imageSmoothingEnabled = false;

			// ⭐ repeat draw (scale'li)
			for (let x = offset % drawWidth - drawWidth; x < this.canvas.width + drawWidth; x += drawWidth) {

				ctx.drawImage(
					img,
					x,
					y,
					drawWidth,
					drawHeight
				);
			}
		}
	}



	// ====================================

	restart() {
		this.initialize();
	}
}
