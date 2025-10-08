import StartMenuScene from "./scenes/StartMenuScene.js";
import GameScene from "./scenes/GameScene.js";
import GameOverScene from "./scenes/GameOverScene.js";

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: [StartMenuScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);
