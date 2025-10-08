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

    // Background
    this.load.image("bg-dawn", "assets/images/background-dawn.png");
}

    create() {
    // Background (tileSprite lets us scroll it)
    this.bg = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, "bg-dawn")
        .setOrigin(0, 0);

    // Bird
    this.bird = this.physics.add.sprite(100, 300, "bird");
    this.bird.setCollideWorldBounds(true);

    this.anims.create({
        key: "flap",
        frames: this.anims.generateFrameNumbers("bird", { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    this.bird.play("flap");

    // Input
    this.input.on("pointerdown", () => this.flap(), this);
    this.input.keyboard.on("keydown-SPACE", () => this.flap(), this);

    // Pipes
    this.pipes = this.physics.add.group();
    this.time.addEvent({
        delay: 1500,
        callback: this.spawnPipe,
        callbackScope: this,
        loop: true
    });

    // Score
    this.score = 0;
    this.scoreText = this.add.text(20, 20, "Score: 0", {
        fontSize: "24px",
        fill: "#fff"
    });

    // Collision
    this.physics.add.overlap(this.bird, this.pipes, this.gameOver, null, this);
}

    flap() {
        this.bird.setVelocityY(-300);
    }

    spawnPipe() {
        const gap = 140;

        // Top pipe
        let topPipe = this.pipes.create(400, y - gap, "pipe").setOrigin(0, 1);
        // Flip the sprite upside down
        topPipe.flipY = true;
        topPipe.body.allowGravity = false;
        topPipe.body.setVelocityX(-200);

        // Bottom pipe
        let bottomPipe = this.pipes.create(400, y + gap, "pipe").setOrigin(0, 0);
        bottomPipe.body.allowGravity = false;
        bottomPipe.body.setVelocityX(-200);

        // Score zone
        let scoreZone = this.add.zone(400, y, 1, gap * 2);
        this.physics.world.enable(scoreZone);
        scoreZone.body.allowGravity = false;
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

    update() {
        // Scroll background
        this.bg.tilePositionX += 1;

        // If bird hits top/bottom
        if (this.bird.y >= 600 || this.bird.y <= 0) {
            this.gameOver();
        }
    }
}