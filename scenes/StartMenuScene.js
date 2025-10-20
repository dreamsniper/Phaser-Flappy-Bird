import levels from "../data/levels.js";

export default class StartMenuScene extends Phaser.Scene {
  constructor() {
    super("StartMenuScene");
  }

  init(data) {
    this.level = data.level || 1;
    this.highscore = localStorage.getItem("flappyHighscore") || 0;
    this.levels = levels.map(l => ({ name: l.name, pointsNeeded: l.pointsNeeded }));
  }

  preload() {
    // Load webfont
    this.load.script("webfont", "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js");
    this.load.image("bg", "assets/images/background-night.png");
  }

  create() {
    const { width, height } = this.sys.game.config;
    const currentLevel = this.levels[this.level - 1];

    // Load font
    WebFont.load({
      google: { families: ["Press Start 2P"] },
      active: () => {
        // Background
        this.add.image(width / 2, height / 2, "bg").setOrigin(0.5);

        // Title
        this.add.text(width / 2, height / 4, "FLAPPY BIRD\nJOURNEY", {
          fontFamily: '"Press Start 2P"',
          fontSize: "32px",
          color: "#FFD700",
          align: "center"
        }).setOrigin(0.5);

        // Level info
        this.add.text(width / 2, height / 2 - 60, `Level ${this.level}: ${currentLevel.name}`, {
          fontFamily: '"Press Start 2P"',
          fontSize: "20px",
          color: "#00FFFF"
        }).setOrigin(0.5);

        // Score needed
        this.add.text(width / 2, height / 2 - 20, `Points Needed: ${currentLevel.pointsNeeded}`, {
          fontFamily: '"Press Start 2P"',
          fontSize: "18px",
          color: "#FFFFFF"
        }).setOrigin(0.5);

        // Highscore
        this.add.text(width / 2, height / 2 + 20, `Highscore: ${this.highscore}`, {
          fontFamily: '"Press Start 2P"',
          fontSize: "18px",
          color: "#00FF00"
        }).setOrigin(0.5);

        // Blinking start text
        const pressText = this.add.text(width / 2, height - 80, ">> PRESS SPACE TO START <<", {
          fontFamily: '"Press Start 2P"',
          fontSize: "18px",
          color: "#FF00FF"
        }).setOrigin(0.5);

        this.tweens.add({
          targets: pressText,
          alpha: { from: 1, to: 0.3 },
          duration: 800,
          yoyo: true,
          repeat: -1
        });

        // Mute button: read stored state
        const muteRaw = localStorage.getItem('flappyMute');
        this.isMuted = muteRaw === '1';
        this.muteBtn = this.add.text(width - 20, 20, this.isMuted ? '🔈' : '🔊', {
          fontFamily: '"Press Start 2P"',
          fontSize: '14px',
          color: '#FFFFFF',
          backgroundColor: 'rgba(0,0,0,0.4)',
          padding: { x: 6, y: 4 }
        }).setOrigin(1, 0).setInteractive();

        this.muteBtn.on('pointerdown', () => {
          this.isMuted = !this.isMuted;
          localStorage.setItem('flappyMute', this.isMuted ? '1' : '0');
          this.muteBtn.setText(this.isMuted ? '🔈' : '🔊');
        });

        // Input (keyboard and pointer/touch)
        this._startHandler = () => this.scene.start("GameScene", { level: this.level });
        this.input.keyboard.on("keydown-SPACE", this._startHandler, this);
        this.input.on("pointerdown", this._startHandler, this);
      }
    });
  }
}
