export default class GameOverScene extends Phaser.Scene {
	constructor() {
		super("GameOverScene");
	}

	init(data) {
		this.level = data.level || 1;
		this.score = data.score || 0;
		this.highscore = localStorage.getItem("flappyHighscore") || 0;
	}

	preload() {
		// Load WebFont
		this.load.script("webfont", "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js");
		this.load.image("bg", "assets/images/background-night.png");
	}

	create() {
		const { width, height } = this.sys.game.config;

		WebFont.load({
			google: { families: ["Press Start 2P"] },
			active: () => {
				// Background
				this.add.image(width / 2, height / 2, "bg").setOrigin(0.5);

				// Title: Game Over
				const gameOverText = this.add.text(width / 2, height / 3, "GAME OVER", {
					fontFamily: '"Press Start 2P"',
					fontSize: "32px",
					color: "#FF4444"
				}).setOrigin(0.5);

				// Make it pulse for drama
				this.tweens.add({
					targets: gameOverText,
					scale: { from: 1, to: 1.2 },
					duration: 600,
					yoyo: true,
					repeat: -1
				});

				// Score
				this.add.text(width / 2, height / 2 - 20, `Score: ${this.score}`, {
					fontFamily: '"Press Start 2P"',
					fontSize: "20px",
					color: "#FFFFFF"
				}).setOrigin(0.5);

				// Highscore
				this.add.text(width / 2, height / 2 + 20, `Highscore: ${this.highscore}`, {
					fontFamily: '"Press Start 2P"',
					fontSize: "18px",
					color: "#00FF00"
				}).setOrigin(0.5);

				// Retry instruction (blink)
				const retryText = this.add.text(width / 2, height - 120, ">> PRESS SPACE TO RETRY <<", {
					fontFamily: '"Press Start 2P"',
					fontSize: "16px",
					color: "#FFFF00"
				}).setOrigin(0.5);

				this.tweens.add({
					targets: retryText,
					alpha: { from: 1, to: 0.3 },
					duration: 800,
					yoyo: true,
					repeat: -1
				});

				// Menu instruction
				this.add.text(width / 2, height - 80, "Press M for Menu", {
					fontFamily: '"Press Start 2P"',
					fontSize: "16px",
					color: "#FF00FF"
				}).setOrigin(0.5);

				// Input
				this.input.keyboard.on("keydown-SPACE", () => {
					this.scene.start("GameScene", { level: this.level });
				});

				this.input.keyboard.on("keydown-M", () => {
					this.scene.start("StartMenuScene", { level: this.level });
				});
			}
		});
	}
}
