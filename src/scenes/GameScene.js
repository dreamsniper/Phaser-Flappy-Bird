preload() {
    this.load.spritesheet("bird", "assets/images/bird-spritesheet.png", {
        frameWidth: 34, frameHeight: 24
    });
    this.load.image("pipe", "assets/images/pipe.png");

    // Background
    this.load.image("bg-dawn", "assets/images/background-dawn.png");
    console.log(this.textures.exists("bg-dawn"));
}

create() {
    // Background (added FIRST so it sits behind everything)
    this.bg = this.add.tileSprite(
        0,
        0,
        this.sys.game.config.width,
        this.sys.game.config.height,
        "bg-dawn"
    ).setOrigin(0, 0);

    // Make sure it resizes to fill screen
    this.bg.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

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

update() {
    // Scroll background
    this.bg.tilePositionX += 1;

    // If bird hits top/bottom
    if (this.bird.y >= 600 || this.bird.y <= 0) {
        this.gameOver();
    }
}
