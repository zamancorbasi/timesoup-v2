import { Input } from "./input.js";
import { Camera } from "./camera.js";
import { CollisionSystem } from "../systems/collisionSystem.js";
import { loadImage } from "./assetLoader.js";
import { createLevel1 } from "../levels/level1.js";
import { createLevel2 } from "../levels/level2.js";

export class Game {
	constructor() {
		// Canvas Kurulumu
		this.canvas = document.getElementById("game");
		this.ctx = this.canvas.getContext("2d");
		this.canvas.width = 1920;
		this.canvas.height = 1080;
		this.ctx.imageSmoothingEnabled = false;

		// Core Sistemler
		this.input = new Input();
		this.camera = new Camera(this.canvas.width, this.canvas.height);
		this.lastTime = 0;

		// Oyun Durumu
		this.gameState = "loading"; // Başlangıçta loading
		this.currentLevel = 0;

		// Assetleri yükle ve oyunu başlat
		this.loadAssets().then(() => {
			this.gameState = "menu"; // Yükleme bitince menüye git
			this.start();
		});
	}

	async loadAssets() {
		try {
			// Tüm sprite'ları asenkron olarak yükle
			this.sprites = {
				player: await loadImage("/assets/player.png"),
				enemy: await loadImage("/assets/enemy.png"),
				platform: await loadImage("/assets/platform.png"),
				bgSky: await loadImage("/assets/bg_sky.png"),
				bgMountains: await loadImage("/assets/bg_mountains.png"),
				bgTrees: await loadImage("/assets/bg_trees.png"),
				bgFront: await loadImage("/assets/bg_front.png"),
			};
		} catch (e) {
			console.error("Assetler yüklenirken hata oluştu:", e);
		}
	}

	loadLevel(levelNum) {
		this.currentLevel = levelNum;
		let levelData;

		if (levelNum === 1) {
			levelData = createLevel1(this.sprites);
		} else if (levelNum === 2) {
			levelData = createLevel2(this.sprites);
		}

		if (levelData) {
			this.player = levelData.player;
			this.platforms = levelData.platforms;
			this.collectables = levelData.collectables;
			this.enemies = levelData.enemies;
			this.flag = levelData.flag;
			this.backgrounds = levelData.backgrounds;

			this.score = 0;
			this.camera.x = 0;
			this.camera.y = 0;

			this.gameState = "play";
		}
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
		// --- 1. MENU DURUMU ---
		if (this.gameState === "menu") {
			// Tuş basımlarını kontrol et
			if (this.input.pressed("1")) {
				console.log("Level 1 yükleniyor..."); // Kontrol için
				this.loadLevel(1);
			} else if (this.input.pressed("2")) {
				console.log("Level 2 yükleniyor..."); // Kontrol için
				this.loadLevel(2);
			}
		}

		// --- 2. OYUN İÇİ (PLAY) DURUMU ---
		else if (this.gameState === "play") {
			this.player.update(this.input, delta, this.canvas.height);
			this.camera.follow(this.player);

			CollisionSystem.resolvePlayerPlatforms(this.player, this.platforms);
			CollisionSystem.checkPlayerCollectables(this.player, this.collectables);

			for (const e of this.enemies) e.update(delta);
			this.enemies = this.enemies.filter(e => !e.remove);

			if (CollisionSystem.checkPlayerEnemies(this.player, this.enemies)) {
				this.gameState = "gameover";
			}

			if (CollisionSystem.checkPlayerFlag(this.player, this.flag)) {
				this.gameState = "win";
			}

			if (this.player.y > 2000) this.gameState = "gameover";
		}

		// --- 3. GAME OVER VEYA WIN DURUMU ---
		else if (this.gameState === "gameover" || this.gameState === "win") {
			if (this.input.pressed("r")) {
				this.gameState = "menu";
			}
		}

		// DİKKAT: input.update() her zaman en sonda kalmalı 
		// ve tüm pressed() kontrollerinden sonra çalışmalı.
		this.input.update();
	}

	draw() {
		const ctx = this.ctx;
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (this.gameState === "menu") {
			this.drawMenu(ctx);
		}
		else if (this.gameState === "play" || this.gameState === "gameover" || this.gameState === "win") {
			this.drawGame(ctx);

			if (this.gameState === "gameover") this.drawOverlay(ctx, "GAME OVER", "Press R for Menu");
			if (this.gameState === "win") this.drawOverlay(ctx, "BÖLÜM TAMAMLANDI!", "Press R for Menu");
		}
	}

	drawGame(ctx) {
		this.drawParallax(ctx);

		ctx.save();
		ctx.translate(-this.camera.x, -this.camera.y);

		for (const p of this.platforms) p.draw(ctx);
		for (const e of this.enemies) e.draw(ctx);
		for (const c of this.collectables) c.draw(ctx);
		this.flag.draw(ctx);
		this.player.draw(ctx);

		ctx.restore();
	}

	drawMenu(ctx) {
		ctx.fillStyle = "#1a1a2e"; // Koyu şık bir arka plan
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		ctx.fillStyle = "white";
		ctx.textAlign = "center";

		ctx.font = "bold 100px Arial";
		ctx.fillText("MACERA OYUNU", this.canvas.width / 2, 300);

		ctx.font = "50px Arial";
		ctx.fillText("Level Seçmek İçin Tuşa Basın:", this.canvas.width / 2, 500);

		ctx.fillStyle = "#4ecca3";
		ctx.fillText("[1] - Level 1 (Orman)", this.canvas.width / 2, 600);
		ctx.fillText("[2] - Level 2 (Mağara)", this.canvas.width / 2, 700);
	}

	drawOverlay(ctx, title, subtitle) {
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.font = "bold 80px Arial";
		ctx.fillText(title, this.canvas.width / 2, this.canvas.height / 2);

		ctx.font = "40px Arial";
		ctx.fillText(subtitle, this.canvas.width / 2, this.canvas.height / 2 + 80);
	}

	drawParallax(ctx) {
		for (const layer of this.backgrounds) {
			const img = layer.img;
			const speed = layer.speed;
			const offset = -this.camera.x * speed;
			const drawWidth = 1920;
			const drawHeight = 1080;
			const y = this.canvas.height - drawHeight;

			for (let x = (offset % drawWidth) - drawWidth; x < this.canvas.width + drawWidth; x += drawWidth) {
				ctx.drawImage(img, x, y, drawWidth, drawHeight);
			}
		}
	}
}