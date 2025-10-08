export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.score = 0;
    }

    preload() {
        this.load.spritesheet("bird", "assets/images/bird-spritesheet.png", {
            frameWidth: 34, frameHeight: 24
        });
        this.load.image("pipe", "assets/images/pipe.png");
    }

    create() {
        // Score reset
        this.score = 0;

        // Bird setup
        this.bird = this.physics.add.sprite(100, 300, "bird");
        this.bird.setCollideWorldBounds(true);

        this.anims.create({
            key: "flap",
            frames: this.anims.generateFrameNumbers("bird", { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.bird.play("flap");

        // Input: mouse or space key
        this.input.on("pointerdown", () => this.flap(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.flap(), this);

        // Pipes group
        this.pipes = this.physics.add.group();

        // Timer for spawning pipes
        this.time.addEvent({
            delay: 1500,
            callback: this.spawnPipe,
            callbackScope: this,
            loop: true
        });

        // Score text
        this.scoreText = this.add.text(20, 20, "Score: 0", {
            fontSize: "24px",
            fill: "#fff"
        });

        // Collision detection
        this.physics.add.overlap(this.bird, this.pipes, this.gameOver, null, this);
    }

    flap() {
        this.bird.setVelocityY(-300);
    }

    spawnPipe() {
        const gap = 130;
        const y = Phaser.Math.Between(150, 450);

        // Top pipe
        let topPipe = this.pipes.create(400, y - gap, "pipe").setOrigin(0, 1);
        topPipe.body.velocity.x = -200;

        // Bottom pipe
        let bottomPipe = this.pipes.create(400, y + gap, "pipe").setOrigin(0, 0);
        bottomPipe.body.velocity.x = -200;

        // Score zone
        let scoreZone = this.add.zone(400, y, 1, this.sys.game.config.height);
        this.physics.world.enable(scoreZone);
        scoreZone.body.setVelocityX(-200);
        this.physics.add.overlap(this.bird, scoreZone, () => {
            this.score++;
            this.scoreText.setText("Score: " + this.score);
            scoreZone.destroy();
        });
    }

    gameOver() {
        this.scene.restart();
    }
}