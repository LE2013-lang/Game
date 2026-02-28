// ============================================================
// Level Complete Scene
// ============================================================

class LevelCompleteScene extends Phaser.Scene {
    constructor() {
        super('LevelComplete');
    }

    init(data) {
        this.level = data.level || 1;
        this.levelIndex = data.levelIndex || 0;
        this.finalDistance = data.distance || 0;
        this.soulsEarned = data.souls || 0;
        this.enemiesDodged = data.enemies || 0;
        this.isHardMode = !!data.isHardMode;
    }

    create() {
        const cx = CONFIG.WIDTH / 2;
        const cy = CONFIG.HEIGHT / 2;

        this.cameras.main.setBackgroundColor(0x050310);

        // Stars background
        this.add.tileSprite(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT, 'bg_stars')
            .setOrigin(0, 0).setAlpha(0.4);

        // Moon
        this.add.image(620, 80, 'moon').setAlpha(0.6);

        // ---- Celebratory particles ----
        this.celebEmitter = this.add.particles(cx, -20, 'particle_purple', {
            speed: { min: 40, max: 160 },
            angle: { min: 70, max: 110 },
            scale: { start: 1.5, end: 0 },
            alpha: { start: 1, end: 0.2 },
            lifespan: 2500,
            gravityY: 50,
            frequency: 80,
            quantity: 2,
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(-300, 0, 600, 10) },
            tint: [0xbb77ff, 0xffcc00, 0x44bbff, 0xff77aa],
        }).setDepth(1);

        // ---- Animated knight ----
        const knight = this.add.image(cx, 290, 'player').setOrigin(0.5, 1).setScale(3);
        this.tweens.add({
            targets: knight,
            y: 285,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Glow behind knight
        const glow = this.add.image(cx, 290, 'player_glow')
            .setOrigin(0.5, 1).setScale(3.5)
            .setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.4);
        this.tweens.add({
            targets: glow,
            alpha: 0.2,
            scaleX: 3.8,
            scaleY: 3.8,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // ---- Title: LEVEL COMPLETE ----
        const titleText = this.add.text(cx, 60, 'LEVEL COMPLETE', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '38px',
            fontStyle: 'bold',
            color: '#ffcc00',
            stroke: '#4a3a00',
            strokeThickness: 5,
        }).setOrigin(0.5).setScale(0);

        // Pop-in animation
        this.tweens.add({
            targets: titleText,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut',
        });

        // Level number
        const levelLabel = this.add.text(cx, 108, `— Level ${this.level} —`, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#e0d0f0',
            stroke: '#2a1040',
            strokeThickness: 3,
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: levelLabel,
            alpha: 1,
            delay: 400,
            duration: 500,
        });

        // Decorative line
        const line = this.add.graphics();
        line.lineStyle(2, 0xffcc00, 0.4);
        line.lineBetween(cx - 100, 132, cx + 100, 132);

        // ---- Stats panel ----
        const panelY = 320;
        const panelH = 130;

        const panel = this.add.graphics();
        panel.fillStyle(0x1a0e2e, 0.85);
        panel.fillRoundedRect(cx - 150, panelY, 300, panelH, 10);
        panel.lineStyle(2, 0xffcc00, 0.3);
        panel.strokeRoundedRect(cx - 150, panelY, 300, panelH, 10);

        const statStyle = {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '16px',
            color: '#c0b0d0',
        };
        const valStyle = {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#ffcc00',
        };

        // Distance
        this.add.text(cx - 120, panelY + 18, 'Distance', statStyle);
        this.add.text(cx + 120, panelY + 18, `${this.finalDistance.toLocaleString()}m`, valStyle).setOrigin(1, 0);

        // Gems earned this run
        this.add.text(cx - 120, panelY + 50, 'Gems Earned', statStyle);
        this.add.text(cx + 120, panelY + 50, `+${this.soulsEarned.toLocaleString()}`, {
            ...valStyle, color: '#44ff88'
        }).setOrigin(1, 0);

        // Total gems (already saved by submitRun below)
        // We peek at what the total will be after save
        const previewSave = SaveManager.load();
        const totalAfterRun = previewSave.totalSouls + this.soulsEarned;
        this.add.text(cx - 120, panelY + 82, 'Total Gems', statStyle);
        this.add.text(cx + 120, panelY + 82, `${totalAfterRun.toLocaleString()}`, valStyle).setOrigin(1, 0);

        // ---- Buttons ----
        const btnY = 510;

        // Continue button
        const continueBtn = this.add.image(cx, btnY, 'button_bg')
            .setInteractive({ useHandCursor: true });
        const continueTxt = this.add.text(cx, btnY, '► CONTINUE', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#ffcc00',
        }).setOrigin(0.5);

        continueBtn.on('pointerover', () => {
            continueBtn.setTint(0xffdd44);
            continueTxt.setColor('#ffffff');
        });
        continueBtn.on('pointerout', () => {
            continueBtn.clearTint();
            continueTxt.setColor('#ffcc00');
        });
        continueBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(400, 10, 6, 26);
            this.time.delayedCall(450, () => {
                this.scene.start('Menu');
            });
        });

        // Subtitle
        this.add.text(cx, 560, 'Return to menu to select your next level!', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '12px',
            fontStyle: 'italic',
            color: '#6a5a7a',
        }).setOrigin(0.5);

        // Save the run & mark level as completed
        SaveManager.submitRun(this.finalDistance, this.soulsEarned);
        const save = SaveManager.load();
        if (this.level > save.levelsCompleted) {
            SaveManager.update({ levelsCompleted: this.level });
        }

        // Save hard mode completion
        if (this.isHardMode) {
            const hSave = SaveManager.load();
            const hardLevels = hSave.hardModeLevels || [];
            if (!hardLevels.includes(this.level)) {
                hardLevels.push(this.level);
                SaveManager.update({ hardModeLevels: hardLevels });
            }
        }

        // Fade in
        this.cameras.main.fadeIn(500, 5, 3, 16);

        // Keyboard shortcuts
        this.input.keyboard.on('keydown-SPACE', () => continueBtn.emit('pointerdown'));
        this.input.keyboard.on('keydown-ENTER', () => continueBtn.emit('pointerdown'));
    }
}
