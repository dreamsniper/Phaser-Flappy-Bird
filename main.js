import StartMenuScene from "./StartMenuScene.js";
import GameScene from "./GameScene.js";

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 600 }, debug: false },
  },
  scene: [StartMenuScene, GameScene],
};

const game = new Phaser.Game(config);