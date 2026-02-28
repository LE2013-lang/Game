// ============================================================
// Boss Intro Scene — dramatic reveal before boss fight
// ============================================================

class BossIntroScene extends Phaser.Scene {
    constructor() {
        super('BossIntro');
    }

    init(data) {
        this.levelIndex = data.levelIndex;
        this.isHardMode = !!data.isHardMode;
    }

    create() {
        const cx = CONFIG.WIDTH / 2;
        const cy = CONFIG.HEIGHT / 2;

        this.cameras.main.setBackgroundColor(0x1a0808);

        // Lava cavern BG
        this.add.tileSprite(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT, 'bg4_cavern')
            .setOrigin(0, 0).setAlpha(0.6);

        // Ominous title
        this.add.text(cx, 80, 'BOSS FIGHT', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '40px',
            fontStyle: 'bold',
            color: '#ff4400',
            stroke: '#3a0a00',
            strokeThickness: 6,
        }).setOrigin(0.5);

        this.add.text(cx, 130, 'THE DRAGON LORD', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#ffaa44',
            stroke: '#2a0800',
            strokeThickness: 3,
        }).setOrigin(0.5);

        // Decorative line
        const line = this.add.graphics();
        line.lineStyle(2, 0xff4400, 0.5);
        line.lineBetween(cx - 100, 155, cx + 100, 155);

        // Dragon sprite — start off-screen right, slide in
        this.dragon = this.add.image(CONFIG.WIDTH + 100, cy + 30, 'boss_dragon')
            .setScale(3);

        this.tweens.add({
            targets: this.dragon,
            x: cx,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                // Dragon breathes
                this.tweens.add({
                    targets: this.dragon,
                    scaleX: 3.1,
                    scaleY: 2.9,
                    duration: 800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut',
                });

                // Camera shake
                this.cameras.main.shake(300, 0.01);

                // Show info text
                this.add.text(cx, cy + 130, 'Survive 3,000m of fireballs!', {
                    fontFamily: '"Segoe UI", Arial, sans-serif',
                    fontSize: '16px',
                    fontStyle: 'bold',
                    color: '#ddaa66',
                }).setOrigin(0.5);

                this.add.text(cx, cy + 155, 'Dodge fireballs by switching lanes and jumping', {
                    fontFamily: '"Segoe UI", Arial, sans-serif',
                    fontSize: '12px',
                    color: '#8a6a4a',
                }).setOrigin(0.5);

                this.add.text(cx, cy + 180, '⚠ Power-ups are disabled during the boss fight', {
                    fontFamily: '"Segoe UI", Arial, sans-serif',
                    fontSize: '11px',
                    fontStyle: 'italic',
                    color: '#aa5533',
                }).setOrigin(0.5);

                // READY button
                this._createReadyButton(cx, cy + 225);
            },
        });

        // Fade in
        this.cameras.main.fadeIn(600, 26, 8, 8);
    }

    _createReadyButton(x, y) {
        const bg = this.add.graphics();
        bg.fillStyle(0x881111, 1);
        bg.fillRoundedRect(x - 90, y - 25, 180, 50, 12);
        bg.lineStyle(3, 0xff4400, 0.8);
        bg.strokeRoundedRect(x - 90, y - 25, 180, 50, 12);

        const txt = this.add.text(x, y, '\u2694 READY \u2694', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ffcc44',
        }).setOrigin(0.5);

        const zone = this.add.zone(x, y, 180, 50)
            .setInteractive({ useHandCursor: true });

        // Pulse animation
        this.tweens.add({
            targets: txt,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        zone.on('pointerover', () => txt.setColor('#ffffff'));
        zone.on('pointerout', () => txt.setColor('#ffcc44'));
        zone.on('pointerdown', () => {
            this.cameras.main.flash(400, 255, 68, 0);
            this.cameras.main.fadeOut(600, 26, 8, 8);
            this.time.delayedCall(700, () => {
                this.scene.start('Game', { levelIndex: this.levelIndex, isHardMode: this.isHardMode });
            });
        });
    }
}
