var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: function() {
            this.load.image('background', 'assets/background.png');
            this.load.image('spaceship', 'assets/spaceship.png');
            this.load.image('asteroid', 'assets/asteroid.png');
            this.load.audio('backgroundMusic', 'assets/SpaceTripByErik.m4a'); // Load the music file
        },
        create: function() {
            // Create a button in your create function
            this.lives = 3;
            this.bg = this.add.tileSprite(400, 300, 800, 600, 'background');

            this.livesText = this.add.text(16, 16, 'Lives: ' + this.lives, { fontSize: '32px', fill: '#FFF' });

            this.spaceship = this.physics.add.sprite(400, 550, 'spaceship');
            this.spaceship.setScale(0.3);
            this.spaceship.setCollideWorldBounds(true);

            this.cursors = this.input.keyboard.createCursorKeys();

            this.music = this.sound.add('backgroundMusic'); // Add the music

            this.startButton = this.add.text(400, 300, 'Start', { fontSize: '32px', fill: '#FFF' })
                .setOrigin(0.5, 0.5) // Center the text
                .setInteractive(); // Make the text clickable

            this.startButton.on('pointerdown', () => {
                this.music.play({ loop: true }); // Play the music in a loop
                this.startButton.destroy(); // Remove the start button after it is clicked
            });

            this.asteroids = this.physics.add.group({
                key: 'asteroid',
                repeat: 5,
                setXY: { x: Phaser.Math.Between(50, 750), y: Phaser.Math.Between(-600, 0), stepX: Phaser.Math.Between(0, 800) }
            });

            this.asteroids.children.iterate(function (asteroid) {
                asteroid.setVelocityY(Phaser.Math.Between(100, 200));
                asteroid.setScale(0.3);
                asteroid.body.enable = true;  // Enable body
            });

            this.physics.add.overlap(this.spaceship, this.asteroids, this.hitAsteroid, null, this);  // Add overlap check here
        },
        update: function() {
            this.bg.tilePositionY -= 2;

            this.spaceship.setVelocity(0);

            if (this.cursors.left.isDown) {
                this.spaceship.setVelocityX(-200);
            } else if (this.cursors.right.isDown) {
                this.spaceship.setVelocityX(200);
            }

            if (this.cursors.up.isDown) {
                this.spaceship.setVelocityY(-200);
            } else if (this.cursors.down.isDown) {
                this.spaceship.setVelocityY(200);
            }

            this.asteroids.children.iterate(function (asteroid) {
                if (asteroid.y > 600) {
                    asteroid.y = Phaser.Math.Between(-600, 0);
                    asteroid.x = Phaser.Math.Between(50, 750);
                    asteroid.setVelocityY(Phaser.Math.Between(100, 200));
                }
            });
        },
        hitAsteroid: function(spaceship, asteroid) {
            asteroid.y = Phaser.Math.Between(-600, 0);
            asteroid.x = Phaser.Math.Between(50, 750);
            asteroid.setVelocityY(Phaser.Math.Between(100, 200));

            this.lives--;
            this.livesText.setText('Lives: ' + this.lives);
        }
    }
};

var game = new Phaser.Game(config);
