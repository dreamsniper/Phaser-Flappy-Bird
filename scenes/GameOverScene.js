export default class GameOverScene extends Phaser.Scene {
	constructor() {
		super("GameOverScene");
	}

	init(data) {
		this.level = data.level || 1;
		this.score = data.score || 0;
		this.highscore = localStorage.getItem("flappyHighscore") || 0;
	}

	create() {
		const { width, height } = this.sys.game.config;

		this.add.text(width / 2, height / 3, "Game Over", {
			fontSize: "48px",
			fill: "#ff4444",
		}).setOrigin(0.5);

		this.add.text(width / 2, height / 2 - 20, `Score: ${this.score}`, {
			fontSize: "28px",
			fill: "#fff",
		}).setOrigin(0.5);

		this.add.text(width / 2, height / 2 + 20, `Highscore: ${this.highscore}`, {
			fontSize: "20px",
			fill: "#0f0",
		}).setOrigin(0.5);

		this.add.text(width / 2, height - 120, "Press SPACE to Retry", {
			fontSize: "20px",
			fill: "#fff",
		}).setOrigin(0.5);

		this.add.text(width / 2, height - 80, "Press M to go to Menu", {
			fontSize: "20px",
			fill: "#fff",
		}).setOrigin(0.5);

		this.input.keyboard.on("keydown-SPACE", () => {
			this.scene.start("GameScene", { level: this.level });
		});

		this.input.keyboard.on("keydown-M", () => {
			this.scene.start("StartMenuScene", { level: this.level });
		});
	}
}
