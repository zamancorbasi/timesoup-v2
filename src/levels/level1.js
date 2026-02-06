import { Platform } from "../entities/platform.js";
import { Collectable } from "../entities/collectable.js";
import { Enemy } from "../entities/enemy.js";
import { FinishFlag } from "../entities/finishFlag.js";
import { Player } from "../entities/player.js";

export const createLevel1 = (sprites) => {
    return {
        player: new Player(300, 100, sprites.player),

        platforms: [
            new Platform(0, 1000, 1920, 80, sprites.platform),
            new Platform(400, 800, 400, 40, sprites.platform),
            new Platform(1100, 650, 350, 40, sprites.platform),
            new Platform(700, 600, 300, 40, sprites.platform),
        ],

        collectables: [
            new Collectable(700, 750),
            new Collectable(1300, 600),
            new Collectable(2100, 850),
        ],

        enemies: [
            new Enemy(900, 940, 300, sprites.enemy),
            new Enemy(1800, 840, 200, sprites.enemy),
        ],

        flag: new FinishFlag(1300, 880),

        backgrounds: [
            { img: sprites.bgSky, speed: 0 },
            { img: sprites.bgMountains, speed: 0.2 },
            { img: sprites.bgTrees, speed: 0.5 },
            { img: sprites.bgFront, speed: 0.8 },
        ]
    };
};