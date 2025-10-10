import levels from "../data/levels.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.score = 0;
  }

  init(data) {
    this.level = data.level || 1;
    this.levels = levels;
    this.currentLevel = this.levels[this.level - 1];
    // reset game over flag for scene restarts
    this.isGameOver = false;
  }

  preload() {
    this.load.spritesheet("bird", "assets/images/bird-spritesheet.png", {
      frameWidth: 34,
      frameHeight: 24,
    });
    this.load.image("pipe", "assets/images/pipe.png");

    // Backgrounds
    this.load.image("bg-morning", "assets/images/background-dawn.png");
    this.load.image("bg-afternoon", "assets/images/background-afternoon.png");
    this.load.image("bg-evening", "assets/images/background-evening.png");
    this.load.image("bg-night", "assets/images/background-night.png");

    // Load webfont
    this.load.script("webfont", "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js");
  }

  create() {
    const { width, height } = this.sys.game.config;
    const bgKey =
      this.currentLevel.bgKey ||
      ["bg-morning", "bg-afternoon", "bg-evening", "bg-night"][this.level - 1];

    // Background
    this.bg = this.add.tileSprite(0, 0, width, height, bgKey).setOrigin(0, 0);

    // Bird
    this.bird = this.physics.add
      .sprite(100, 300, "bird")
      .setCollideWorldBounds(true);

    this.anims.create({
      key: "flap",
      frames: this.anims.generateFrameNumbers("bird", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
    this.bird.play("flap");

  // Input
  // store handler so we can remove only this listener on game over
  this._spaceHandler = () => this.flap();
  this.input.keyboard.on("keydown-SPACE", this._spaceHandler, this);

    // Pipes
    this.pipes = this.physics.add.group();
    this.spawnEvent = this.time.addEvent({
      delay: 1500,
      callback: this.spawnPipe,
      callbackScope: this,
      loop: true,
    });

    // Score (using arcade font)
    WebFont.load({
      google: { families: ["Press Start 2P"] },
      active: () => {
        this.score = 0;
        this.scoreText = this.add.text(20, 20, "SCORE: 0", {
          fontFamily: '"Press Start 2P"',
          fontSize: "18px",
          color: "#FFFF00",
          backgroundColor: "rgba(0,0,0,0.3)", // subtle box behind text
          padding: { x: 6, y: 4 }
        }).setOrigin(0, 0);

        // Optional: add level indicator
        this.levelText = this.add.text(width - 20, 20, `LEVEL: ${this.level}`, {
          fontFamily: '"Press Start 2P"',
          fontSize: "14px",
          color: "#00FFFF",
          backgroundColor: "rgba(0,0,0,0.3)",
          padding: { x: 6, y: 4 }
        }).setOrigin(1, 0);
      }
    });

  // Collision (use collider so pipes physically interact and trigger game over)
  this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  flap() {
    this.bird.setVelocityY(-300);
  }

  spawnPipe() {
    const gap = 60;
    const minY = gap + 50;
    const maxY = this.sys.game.config.height - gap - 50;
    const y = Phaser.Math.Between(minY, maxY);

    // Top pipe
    const topPipe = this.pipes.create(400, y - gap, "pipe").setOrigin(0, 1);
    topPipe.flipY = true;
    topPipe.body.allowGravity = false;
    topPipe.body.setVelocityX(this.currentLevel.pipeSpeed);

    // Bottom pipe
    const bottomPipe = this.pipes.create(400, y + gap, "pipe").setOrigin(0, 0);
    bottomPipe.body.allowGravity = false;
    bottomPipe.body.setVelocityX(this.currentLevel.pipeSpeed);

    // Score zone
    const scoreZone = this.add.zone(400, y, 1, gap * 2);
    this.physics.world.enable(scoreZone);
    scoreZone.body.allowGravity = false;
    scoreZone.body.setVelocityX(this.currentLevel.pipeSpeed);

    // Single overlap handler: increment score, show floating +1, and check level complete
    this.physics.add.overlap(this.bird, scoreZone, (bird, zone) => {
      // prevent double-scoring if handler somehow fires twice
      if (!zone.active) return;

      this.score++;
      if (this.scoreText) {
        this.scoreText.setText("SCORE: " + this.score);
      }

      // Floating +1 popup above the bird
      const popup = this.add.text(bird.x, bird.y - 20, "+1", {
        fontFamily: '"Press Start 2P"',
        fontSize: "16px",
        color: "#00FF00",
        stroke: "#003300",
        strokeThickness: 2
      }).setOrigin(0.5);

      this.tweens.add({
        targets: popup,
        y: popup.y - 40,
        alpha: 0,
        duration: 800,
        ease: "Cubic.easeOut",
        onComplete: () => popup.destroy()
      });

      // destroy the zone so it can't score again
      zone.destroy();

      // Level win condition
      if (this.score >= this.currentLevel.pointsNeeded) {
        this.levelComplete();
      }
    });

  }

  levelComplete() {
    const highscore = localStorage.getItem("flappyHighscore") || 0;
    if (this.score > highscore) {
      localStorage.setItem("flappyHighscore", this.score);
    }

    if (this.level < this.levels.length) {
      this.scene.start("StartMenuScene", { level: this.level + 1 });
    } else {
      this.scene.start("StartMenuScene", { level: 1 });
    }
  }

  gameOver() {
    // Prevent multiple gameOver sequences
    if (this.isGameOver) return;
    this.isGameOver = true;

    // Save highscore (ensure numeric comparison)
    const highscoreRaw = localStorage.getItem("flappyHighscore");
    const highscore = highscoreRaw ? Number(highscoreRaw) : 0;
    if (this.score > highscore) {
      localStorage.setItem("flappyHighscore", String(this.score));
    }

    // Stop spawning new pipes
    if (this.spawnEvent) this.spawnEvent.remove(false);

    // Optionally freeze existing pipes so they don't keep moving while shaking
    // Clear existing pipes so they don't persist into the next scene
    if (this.pipes) {
      this.pipes.clear(true, true);
    }

    // Disable bird physics and input during shake
    this.bird.body.enable = false;
    // remove only the space handler we added (avoids removing other scenes' listeners)
    if (this._spaceHandler) {
      this.input.keyboard.off("keydown-SPACE", this._spaceHandler, this);
    }

    // Shake camera for 500ms then go to GameOverScene
    this.cameras.main.shake(500, 0.01);

    this.time.delayedCall(500, () => {
      this.scene.start("GameOverScene", { level: this.level, score: this.score });
    });
  }

  update() {
    this.bg.tilePositionX += 1;
    if (this.bird.y >= 600 || this.bird.y <= 0) {
      this.gameOver();
    }
    this.pipes.children.each(pipe => {
      if (pipe.x < -50) pipe.destroy();
    });
  }
}
