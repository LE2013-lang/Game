// ============================================================
// Boss Victory Cutscene — knight slays the dragon
// ============================================================

class BossVictoryScene extends Phaser.Scene {
    constructor() {
        super('BossVictory');
    }

    init(data) {
        this.levelData = data; // pass through to LevelComplete
    }

    create() {
        const cx = CONFIG.WIDTH / 2;
        const cy = CONFIG.HEIGHT / 2;

        this.cameras.main.setBackgroundColor(0x1a0808);

        // Lava cavern background
        this.add.tileSprite(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT, 'bg4_cavern')
            .setOrigin(0, 0).setAlpha(0.5);

        // Ground / lava floor
        const ground = this.add.graphics();
        ground.fillStyle(0x2a0808, 1);
        ground.fillRect(0, cy + 100, CONFIG.WIDTH, CONFIG.HEIGHT - cy - 100);
        ground.fillStyle(0x1a0606, 1);
        ground.fillRect(0, cy + 100, CONFIG.WIDTH, 4);

        // ---- Dragon (starts on right, wounded) ----
        this.dragon = this.add.image(cx + 180, cy + 60, 'boss_dragon')
            .setScale(2.5).setOrigin(0.5, 1);

        // Dragon starts with a red hurt tint
        this.dragon.setTint(0xff6666);

        // ---- Knight (starts off-screen left) ----
        this.knight = this.add.image(-60, cy + 60, 'player')
            .setScale(2.5).setOrigin(0.5, 1);

        // ---- Purple Lightsaber (hidden, attached to knight) ----
        this.saber = this.add.graphics().setDepth(10).setAlpha(0);

        // Draw initial saber shape (held at side)
        this._drawSaber(0, 0, 0);

        // ---- Cinematic black bars ----
        this.topBar = this.add.graphics().setDepth(50);
        this.topBar.fillStyle(0x000000, 1);
        this.topBar.fillRect(0, 0, CONFIG.WIDTH, 60);

        this.bottomBar = this.add.graphics().setDepth(50);
        this.bottomBar.fillStyle(0x000000, 1);
        this.bottomBar.fillRect(0, CONFIG.HEIGHT - 60, CONFIG.WIDTH, 60);

        // ---- Begin cutscene sequence ----
        this.cameras.main.fadeIn(800, 26, 8, 8);
        this._playSequence();
    }

    _drawSaber(x, y, angle) {
        this.saber.clear();

        // Save transform
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Saber blade (purple glow)
        const bladeLen = 55;
        const bladeW = 4;

        // Outer glow
        this.saber.lineStyle(8, 0x9b59b6, 0.3);
        this.saber.lineBetween(
            x, y,
            x + cos * bladeLen, y + sin * bladeLen
        );

        // Inner glow
        this.saber.lineStyle(5, 0xbb88ff, 0.6);
        this.saber.lineBetween(
            x, y,
            x + cos * bladeLen, y + sin * bladeLen
        );

        // Core beam
        this.saber.lineStyle(bladeW, 0xddbbff, 1);
        this.saber.lineBetween(
            x, y,
            x + cos * bladeLen, y + sin * bladeLen
        );

        // White-hot center
        this.saber.lineStyle(1.5, 0xffffff, 0.9);
        this.saber.lineBetween(
            x, y,
            x + cos * bladeLen, y + sin * bladeLen
        );

        // Handle
        const handleLen = 14;
        this.saber.lineStyle(5, 0x4a4a5a, 1);
        this.saber.lineBetween(
            x, y,
            x - cos * handleLen, y - sin * handleLen
        );

        // Handle detail
        this.saber.lineStyle(3, 0x6a6a7a, 1);
        this.saber.lineBetween(
            x - cos * 2, y - sin * 2,
            x - cos * 6, y - sin * 6
        );

        // Handle pommel
        this.saber.fillStyle(0x9b59b6, 0.8);
        this.saber.fillCircle(x - cos * handleLen, y - sin * handleLen, 3);
    }

    _playSequence() {
        const cx = CONFIG.WIDTH / 2;
        const cy = CONFIG.HEIGHT / 2;

        // Step 1: Knight walks in from the left (1.5s)
        this.tweens.add({
            targets: this.knight,
            x: cx - 60,
            duration: 1500,
            ease: 'Sine.easeOut',
        });

        // Step 2: At 1.6s — knight stops, saber ignites
        this.time.delayedCall(1600, () => {
            // Ignite saber — appears at knight's hand
            this.saber.setAlpha(1);
            const saberX = this.knight.x + 20;
            const saberY = cy + 10;
            this._drawSaber(saberX, saberY, -0.3); // slight upward angle

            // Screen flash for ignition
            this.cameras.main.flash(200, 155, 88, 255);

            // Ignition glow pulse
            this.tweens.add({
                targets: this.saber,
                alpha: 0.7,
                duration: 150,
                yoyo: true,
                repeat: 2,
                ease: 'Sine.easeInOut',
                onComplete: () => this.saber.setAlpha(1),
            });
        });

        // Step 3: At 2.5s — knight charges toward dragon
        this.time.delayedCall(2500, () => {
            // Camera zoom slightly
            this.cameras.main.zoomTo(1.15, 800, 'Sine.easeInOut');

            this.tweens.add({
                targets: this.knight,
                x: cx + 110,
                duration: 600,
                ease: 'Power3',
                onUpdate: () => {
                    // Update saber position during charge
                    const saberX = this.knight.x + 25;
                    const saberY = cy + 5;
                    this._drawSaber(saberX, saberY, 0); // horizontal thrust
                },
            });
        });

        // Step 4: At 3.1s — STAB! Impact moment
        this.time.delayedCall(3100, () => {
            // Saber thrust into dragon
            const saberX = this.knight.x + 25;
            const saberY = cy + 5;
            this._drawSaber(saberX, saberY, 0);

            // Dragon recoils
            this.tweens.add({
                targets: this.dragon,
                x: this.dragon.x + 25,
                scaleY: 2.3,
                duration: 200,
                ease: 'Power2',
            });

            // BIG screen shake
            this.cameras.main.shake(500, 0.025);

            // Flash
            this.cameras.main.flash(300, 200, 100, 255);

            // Impact particles
            const emitter = this.add.particles(cx + 140, cy + 5, 'particle_purple', {
                speed: { min: 80, max: 250 },
                angle: { min: 0, max: 360 },
                scale: { start: 2, end: 0 },
                alpha: { start: 1, end: 0 },
                lifespan: 600,
                emitting: false,
            }).setDepth(15);
            emitter.explode(25);

            // Red impact sparks
            const redSparks = this.add.particles(cx + 140, cy + 5, 'particle_red', {
                speed: { min: 60, max: 200 },
                angle: { min: -30, max: 30 },
                scale: { start: 1.5, end: 0 },
                alpha: { start: 1, end: 0 },
                lifespan: 500,
                emitting: false,
            }).setDepth(15);
            redSparks.explode(15);
        });

        // Step 5: At 3.8s — dragon dies (fades, falls)
        this.time.delayedCall(3800, () => {
            // Dragon collapses
            this.tweens.add({
                targets: this.dragon,
                alpha: 0,
                y: this.dragon.y + 30,
                scaleX: 2.2,
                scaleY: 1.5,
                angle: 12,
                duration: 1500,
                ease: 'Sine.easeIn',
            });

            // Dragon death particles
            const deathEmitter = this.add.particles(this.dragon.x, cy + 30, 'particle_red', {
                speed: { min: 20, max: 80 },
                angle: { min: 220, max: 320 },
                scale: { start: 1, end: 0 },
                alpha: { start: 0.8, end: 0 },
                lifespan: 1200,
                frequency: 60,
                quantity: 3,
            }).setDepth(15);

            this.time.delayedCall(1500, () => deathEmitter.stop());
        });

        // Step 6: At 5s — knight stands victorious, saber raised
        this.time.delayedCall(5000, () => {
            // Pull saber up in victory pose
            const saberX = this.knight.x + 5;
            const saberY = cy - 20;
            this._drawSaber(saberX, saberY, -Math.PI / 2); // pointing straight up

            this.cameras.main.zoomTo(1.0, 600, 'Sine.easeInOut');

            // Victory text
            const victoryText = this.add.text(cx, 80, 'THE DRAGON LORD IS SLAIN', {
                fontFamily: '"Segoe UI", Arial, sans-serif',
                fontSize: '28px',
                fontStyle: 'bold',
                color: '#ffcc44',
                stroke: '#3a2a00',
                strokeThickness: 4,
            }).setOrigin(0.5).setDepth(55).setAlpha(0);

            this.tweens.add({
                targets: victoryText,
                alpha: 1,
                duration: 800,
                ease: 'Sine.easeIn',
            });

            // Saber glow pulse
            this.tweens.add({
                targets: this.saber,
                alpha: 0.6,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });
        });

        // Step 7: At 7.5s — fade out and go to LevelComplete
        this.time.delayedCall(7500, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.time.delayedCall(1100, () => {
                this.scene.start('LevelComplete', this.levelData);
            });
        });
    }
}
