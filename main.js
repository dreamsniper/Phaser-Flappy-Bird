import GameScene from "./scenes/GameScene.js";

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: {
        default: "arcade",
        arcade: { gravity: { y: 900 }, debug: false }
    },
    scene: [GameScene]
};

new Phaser.Game(config);
