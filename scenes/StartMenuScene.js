export default class StartMenuScene extends Phaser.Scene {
  constructor() {
    super("StartMenuScene");
  }

  init(data) {
    // Store persistent data (level, highscore, etc.)
    this.level = data.level || 1;
    this.highscore = localStorage.getItem("flappyHighscore") || 0;

    // Level names + score requirements
    this.levels = [
      { name: "Morning", pointsNeeded: 5 },
      { name: "Afternoon", pointsNeeded: 10 },
      { name: "Evening", pointsNeeded: 15 },
      { name: "Night", pointsNeeded: 20 },
    ];
  }

  create() {
    const { width, height } = this.sys.game.config;
    const currentLevel = this.levels[this.level - 1];

    // Title
    this.add.text(width / 2, height / 4, "Flappy Bird Journey", {
      fontSize: "40px",
      fill: "#fff",
    }).setOrigin(0.5);

    // Level info
    this.add.text(width / 2, height / 2 - 40, `Level ${this.level}: ${currentLevel.name}`, {
      fontSize: "28px",
      fill: "#ff0",
    }).setOrigin(0.5);

    // Score needed
    this.add.text(width / 2, height / 2, `Points Needed: ${currentLevel.pointsNeeded}`, {
      fontSize: "24px",
      fill: "#fff",
    }).setOrigin(0.5);

    // Highscore
    this.add.text(width / 2, height / 2 + 40, `Highscore: ${this.highscore}`, {
      fontSize: "24px",
      fill: "#0f0",
    }).setOrigin(0.5);

    // Instructions
    this.add.text(width / 2, height - 100, "Press SPACE to Start", {
      fontSize: "24px",
      fill: "#fff",
    }).setOrigin(0.5);

    // Input
    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.start("GameScene", { level: this.level });
    });
  }
}