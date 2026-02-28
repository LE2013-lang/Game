// ============================================================
// Game Over Scene
// ============================================================

class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.finalDistance = data.distance || 0;
        this.soulsEarned = data.souls || 0;
        this.enemiesKilled = data.enemies || 0;
        this.isNewHighScore = data.isNewHighScore || false;
        this.levelIndex = (data.levelIndex !== undefined) ? data.levelIndex : 0;
        this.isEndless = !!data.isEndless;
        this.isHardMode = !!data.isHardMode;
        this.isInsaneMode = !!data.isInsaneMode;
    }

    create() {
        const cx = CONFIG.WIDTH / 2;
        this.cameras.main.setBackgroundColor(0x050310);

        // Semi-transparent overlay with stars
        this.add.tileSprite(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT, 'bg_stars')
            .setOrigin(0, 0).setAlpha(0.3);

        // Game Over title
        this.add.text(cx, 80, 'GAME OVER', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '40px',
            fontStyle: 'bold',
            color: '#e0d0f0',
            stroke: '#2a1040',
            strokeThickness: 4,
        }).setOrigin(0.5);

        // New high score banner
        if (this.isNewHighScore) {
            const banner = this.add.text(cx, 125, '★ NEW HIGH SCORE ★', {
                fontFamily: '"Segoe UI", Arial, sans-serif',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#ffcc00',
                stroke: '#4a3a00',
                strokeThickness: 3,
            }).setOrigin(0.5);

            this.tweens.add({
                targets: banner,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 600,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });
        }

        // Stats panel
        const panelY = 175;
        const panelH = 160;

        const panel = this.add.graphics();
        panel.fillStyle(0x1a0e2e, 0.8);
        panel.fillRoundedRect(cx - 160, panelY, 320, panelH, 10);
        panel.lineStyle(2, 0x9b59b6, 0.4);
        panel.strokeRoundedRect(cx - 160, panelY, 320, panelH, 10);

        const statStyle = {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '18px',
            color: '#c0b0d0',
        };
        const valStyle = {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#e0d0f0',
        };

        // Distance
        this.add.text(cx - 130, panelY + 20, 'Distance', statStyle);
        this.add.text(cx + 130, panelY + 20, `${this.finalDistance.toLocaleString()}m`, valStyle).setOrigin(1, 0);

        // Souls earned this run
        this.add.text(cx - 130, panelY + 55, 'Gems Earned', statStyle);
        this.add.text(cx + 130, panelY + 55, `+${this.soulsEarned.toLocaleString()}`, {
            ...valStyle, color: '#44ff88'
        }).setOrigin(1, 0);

        // Total gems (already saved by submitRun)
        const save2 = SaveManager.load();
        this.add.text(cx - 130, panelY + 90, 'Total Gems', statStyle);
        this.add.text(cx + 130, panelY + 90, `${save2.totalSouls.toLocaleString()}`, {
            ...valStyle, color: '#ffcc00'
        }).setOrigin(1, 0);

        // Speed reached
        const speedTier = Math.floor(this.finalDistance / CONFIG.SPEED_TIER_DISTANCE);
        const speedMult = Math.min(1 + speedTier * CONFIG.SPEED_INCREMENT, CONFIG.MAX_SPEED_MULTIPLIER);
        this.add.text(cx - 130, panelY + 125, 'Max Speed', statStyle);
        this.add.text(cx + 130, panelY + 125, `${speedMult.toFixed(1)}x`, valStyle).setOrigin(1, 0);

        // Buttons
        const btnY = 400;
        const btnGap = 110;

        // Retry
        const retryBtn = this.add.image(cx - btnGap, btnY, 'button_bg').setInteractive({ useHandCursor: true });
        const retryTxt = this.add.text(cx - btnGap, btnY, '↻ RETRY', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#e0d0f0',
        }).setOrigin(0.5);

        retryBtn.on('pointerover', () => { retryBtn.setTint(0xbb88ee); retryTxt.setColor('#ffffff'); });
        retryBtn.on('pointerout', () => { retryBtn.clearTint(); retryTxt.setColor('#e0d0f0'); });
        retryBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(300, 5, 3, 16);
            this.time.delayedCall(350, () => this.scene.start('Game', {
                levelIndex: this.levelIndex,
                isEndless: this.isEndless,
                isHardMode: this.isHardMode,
                isInsaneMode: this.isInsaneMode,
            }));
        });

        // Menu
        const menuBtn = this.add.image(cx + btnGap, btnY, 'button_bg').setInteractive({ useHandCursor: true });
        const menuTxt = this.add.text(cx + btnGap, btnY, '☰ MENU', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#e0d0f0',
        }).setOrigin(0.5);

        menuBtn.on('pointerover', () => { menuBtn.setTint(0xbb88ee); menuTxt.setColor('#ffffff'); });
        menuBtn.on('pointerout', () => { menuBtn.clearTint(); menuTxt.setColor('#e0d0f0'); });
        menuBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(300, 5, 3, 16);
            this.time.delayedCall(350, () => this.scene.start('Menu'));
        });

        // Load & display all-time stats
        const save = SaveManager.load();
        this.add.text(cx, 480, `All-time Best: ${save.highScore.toLocaleString()}m  |  Total Runs: ${save.totalRuns}`, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '13px',
            color: '#6a5a7a',
        }).setOrigin(0.5);

        // Tip
        const tips = [
            'Tip: Double-jump to clear tall obstacles!',
            'Tip: Slide under branches with SHIFT or ↓',
            'Tip: Switch lanes early to dodge wall combos',
            'Tip: Soul shards often follow obstacles — risk for reward!',
            'Tip: Speed increases every 500m — stay alert!',
        ];
        this.add.text(cx, 530, Phaser.Utils.Array.GetRandom(tips), {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '12px',
            fontStyle: 'italic',
            color: '#5a4a6a',
        }).setOrigin(0.5);

        // Fade in
        this.cameras.main.fadeIn(400, 5, 3, 16);

        // Keyboard shortcuts
        this.input.keyboard.on('keydown-SPACE', () => retryBtn.emit('pointerdown'));
        this.input.keyboard.on('keydown-ENTER', () => retryBtn.emit('pointerdown'));
        this.input.keyboard.on('keydown-ESC', () => menuBtn.emit('pointerdown'));
    }
}
