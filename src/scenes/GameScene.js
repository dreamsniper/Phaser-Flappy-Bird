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
        const gapSize = 150; // vertical gap between pipes
        const minGapY = 100; // don't let the gap start too high
        const maxGapY = this.scale.height - 100 - gapSize;
        
        // Pick a random Y position for the gap start
        const gapY = Phaser.Math.Between(minGapY, maxGapY);

        // ---- TOP PIPE ----
        const topPipe = this.physics.add.image(400, 0, 'pipe')
            .setOrigin(0.5, 0); // anchor at top center
        topPipe.setImmovable(true);
        topPipe.setVelocityX(-200);
        // Flip the sprite upside down
        topPipe.flipY = true;
        // Scale pipe to reach gap start
        topPipe.setDisplaySize(52, gapY);

        // ---- BOTTOM PIPE ----
        const bottomPipe = this.physics.add.image(400, gapY + gapSize, 'pipe')
            .setOrigin(0.5, 0); // anchor at top center
        bottomPipe.setImmovable(true);
        bottomPipe.setVelocityX(-200);
        // Scale pipe to stretch to bottom of screen
        bottomPipe.setDisplaySize(52, this.scale.height - (gapY + gapSize));

        // Add both pipes to the pipes group
        this.pipes.add(topPipe);
        this.pipes.add(bottomPipe);
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