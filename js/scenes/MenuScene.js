// ============================================================
// Menu Scene — title screen
// ============================================================

class MenuScene extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    create() {
        const cx = CONFIG.WIDTH / 2;
        const cy = CONFIG.HEIGHT / 2;

        // Background
        this.cameras.main.setBackgroundColor(CONFIG.BG);

        // Scrolling stars
        this.stars = this.add.tileSprite(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT, 'bg_stars')
            .setOrigin(0, 0).setAlpha(0.7);

        // Moon
        this.add.image(620, 80, 'moon').setAlpha(0.8);

        // Mountains
        this.mountains = this.add.tileSprite(0, 250, CONFIG.WIDTH, 200, 'bg_mountains')
            .setOrigin(0, 0).setAlpha(0.5);

        // Title
        this.add.text(cx, 110, 'SHADOW REALM', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '42px',
            fontStyle: 'bold',
            color: '#e0d0f0',
            stroke: '#2a1040',
            strokeThickness: 4,
        }).setOrigin(0.5).setDepth(2);

        this.add.text(cx, 160, 'R U N N E R', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#9b59b6',
            stroke: '#1a0830',
            strokeThickness: 3,
        }).setOrigin(0.5).setDepth(2);

        // Decorative line
        const line = this.add.graphics().setDepth(2);
        line.lineStyle(2, 0x9b59b6, 0.5);
        line.lineBetween(cx - 120, 185, cx + 120, 185);

        // Animated knight preview
        this.knight = this.add.image(cx, 290, 'player').setOrigin(0.5, 1).setScale(1.8);
        this.tweens.add({
            targets: this.knight,
            y: 285,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Glow behind knight
        const knightGlow = this.add.image(cx, 290, 'player_glow')
            .setOrigin(0.5, 1).setScale(2.1).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.3);
        this.tweens.add({
            targets: knightGlow,
            alpha: 0.15,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Load save data for level unlock info
        const save = SaveManager.load();

        // ---- Endless Mode Button (top-left) ----
        const endlessUnlocked = save.levelsCompleted >= 4;
        const ebg = this.add.graphics();
        if (endlessUnlocked) {
            ebg.fillStyle(0x1a2a40, 0.9);
            ebg.fillRoundedRect(10, 10, 110, 42, 8);
            ebg.lineStyle(2, 0x44aaff, 0.6);
            ebg.strokeRoundedRect(10, 10, 110, 42, 8);
        } else {
            ebg.fillStyle(0x1a1a2a, 0.5);
            ebg.fillRoundedRect(10, 10, 110, 42, 8);
            ebg.lineStyle(1, 0x3a3a5a, 0.4);
            ebg.strokeRoundedRect(10, 10, 110, 42, 8);
        }

        const endlessLabel = this.add.text(65, 22, endlessUnlocked ? '\u221e ENDLESS' : '\uD83D\uDD12 ENDLESS', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '14px',
            fontStyle: 'bold',
            color: endlessUnlocked ? '#44aaff' : '#4a4a6a',
        }).setOrigin(0.5);

        const endlessSub = this.add.text(65, 40, endlessUnlocked ? 'All biomes' : 'Beat the Boss', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '9px',
            color: endlessUnlocked ? '#6688aa' : '#3a3a5a',
        }).setOrigin(0.5);

        const endlessZone = this.add.zone(65, 31, 110, 42)
            .setInteractive({ useHandCursor: endlessUnlocked });

        if (endlessUnlocked) {
            endlessZone.on('pointerover', () => {
                endlessLabel.setColor('#ffffff');
                ebg.clear();
                ebg.fillStyle(0x2a3a55, 0.9);
                ebg.fillRoundedRect(10, 10, 110, 42, 8);
                ebg.lineStyle(2, 0x66ccff, 0.8);
                ebg.strokeRoundedRect(10, 10, 110, 42, 8);
            });
            endlessZone.on('pointerout', () => {
                endlessLabel.setColor('#44aaff');
                ebg.clear();
                ebg.fillStyle(0x1a2a40, 0.9);
                ebg.fillRoundedRect(10, 10, 110, 42, 8);
                ebg.lineStyle(2, 0x44aaff, 0.6);
                ebg.strokeRoundedRect(10, 10, 110, 42, 8);
            });
            endlessZone.on('pointerdown', () => {
                this.cameras.main.fadeOut(400, 10, 6, 26);
                this.time.delayedCall(450, () => {
                    this.scene.start('Game', { levelIndex: 0, isEndless: true });
                });
            });
        }

        // ---- Hard Mode Toggle (below Endless) ----
        const hardUnlocked = save.levelsCompleted >= 4;
        this.hardModeOn = false;

        const hbg = this.add.graphics();
        const _drawHardBtn = (on) => {
            hbg.clear();
            if (!hardUnlocked) {
                hbg.fillStyle(0x1a1a2a, 0.5);
                hbg.fillRoundedRect(10, 58, 110, 42, 8);
                hbg.lineStyle(1, 0x3a3a5a, 0.4);
                hbg.strokeRoundedRect(10, 58, 110, 42, 8);
            } else if (on) {
                hbg.fillStyle(0x3a1a1a, 0.9);
                hbg.fillRoundedRect(10, 58, 110, 42, 8);
                hbg.lineStyle(2, 0xff4444, 0.8);
                hbg.strokeRoundedRect(10, 58, 110, 42, 8);
            } else {
                hbg.fillStyle(0x2a1a1a, 0.7);
                hbg.fillRoundedRect(10, 58, 110, 42, 8);
                hbg.lineStyle(2, 0xff6644, 0.4);
                hbg.strokeRoundedRect(10, 58, 110, 42, 8);
            }
        };
        _drawHardBtn(false);

        const hardLabel = this.add.text(65, 70, hardUnlocked ? '\uD83D\uDD25 HARD MODE' : '\uD83D\uDD12 HARD MODE', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '12px',
            fontStyle: 'bold',
            color: hardUnlocked ? '#ff6644' : '#4a4a6a',
        }).setOrigin(0.5);

        const hardSub = this.add.text(65, 87, hardUnlocked ? 'OFF' : 'Beat the Boss', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '9px',
            color: hardUnlocked ? '#886644' : '#3a3a5a',
        }).setOrigin(0.5);

        const hardZone = this.add.zone(65, 79, 110, 42)
            .setInteractive({ useHandCursor: hardUnlocked });

        if (hardUnlocked) {
            hardZone.on('pointerdown', () => {
                this.hardModeOn = !this.hardModeOn;
                _drawHardBtn(this.hardModeOn);
                hardLabel.setText(this.hardModeOn ? '\uD83D\uDD25 HARD MODE' : '\uD83D\uDD25 HARD MODE');
                hardLabel.setColor(this.hardModeOn ? '#ff4444' : '#ff6644');
                hardSub.setText(this.hardModeOn ? 'ON — 2\u00d7 Speed!' : 'OFF');
                hardSub.setColor(this.hardModeOn ? '#ff6644' : '#886644');
            });
        }

        // ---- Level Select Buttons ----
        const btnStyle = {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#e0d0f0',
        };
        const subStyle = {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '11px',
            color: '#8a7a9a',
        };

        CONFIG.LEVELS.forEach((lvl, idx) => {
            const count = CONFIG.LEVELS.length;
            const spacing = count <= 2 ? 220 : 200;
            const totalW = (count - 1) * spacing;
            const btnX = cx - totalW / 2 + idx * spacing;
            const btnY = 350;
            const isUnlocked = idx === 0 || save.levelsCompleted >= idx;
            const btnScale = count <= 2 ? 1 : 0.75;

            const btn = this.add.image(btnX, btnY, 'button_bg')
                .setScale(btnScale, 1)
                .setInteractive({ useHandCursor: isUnlocked });

            const label = this.add.text(btnX, btnY - 6,
                `Level ${lvl.level}`, btnStyle).setOrigin(0.5);
            if (count > 2) label.setFontSize(15);

            const sub = this.add.text(btnX, btnY + 14,
                `${lvl.label}  •  ${lvl.distance}m`, subStyle).setOrigin(0.5);
            if (count > 2) sub.setFontSize(9);

            if (isUnlocked) {
                if (lvl.isBoss) {
                    btn.setTint(0xcc4444);
                    label.setColor('#ff6644');
                    btn.on('pointerover', () => { btn.setTint(0xff6644); label.setColor('#ffffff'); });
                    btn.on('pointerout', () => { btn.setTint(0xcc4444); label.setColor('#ff6644'); });
                } else {
                    btn.on('pointerover', () => { btn.setTint(0xbb88ee); label.setColor('#ffffff'); });
                    btn.on('pointerout', () => { btn.clearTint(); label.setColor('#e0d0f0'); });
                }
                btn.on('pointerdown', () => {
                    this.cameras.main.fadeOut(400, 10, 6, 26);
                    this.time.delayedCall(450, () => {
                        if (lvl.isBoss) {
                            this.scene.start('BossIntro', { levelIndex: idx, isHardMode: !!this.hardModeOn });
                        } else {
                            this.scene.start('Game', { levelIndex: idx, isHardMode: !!this.hardModeOn });
                        }
                    });
                });

                if (save.levelsCompleted > idx) {
                    // Show checkmark for completed levels
                    const checkOff = count <= 2 ? 80 : 60;
                    this.add.text(btnX + checkOff, btnY - 20, '\u2713', {
                        fontFamily: '"Segoe UI", Arial, sans-serif',
                        fontSize: '16px',
                        fontStyle: 'bold',
                        color: '#44ff88',
                    }).setOrigin(0.5);

                    // Hard mode checkmark (below the first)
                    const hardLevels = save.hardModeLevels || [];
                    if (hardLevels.includes(lvl.level)) {
                        this.add.text(btnX + checkOff, btnY - 5, '\u2713', {
                            fontFamily: '"Segoe UI", Arial, sans-serif',
                            fontSize: '14px',
                            fontStyle: 'bold',
                            color: '#ff4444',
                        }).setOrigin(0.5);
                    }
                }
            } else {
                // Locked styling
                btn.setAlpha(0.4);
                label.setColor('#5a4a6a');
                label.setText(`🔒 Level ${lvl.level}`);
                sub.setColor('#4a3a5a');
                sub.setText('Complete previous level');
            }
        });

        // Speed info labels for unlocked levels
        CONFIG.LEVELS.forEach((lvl, idx) => {
            if (idx === 0 || save.levelsCompleted < idx) return;
            const count = CONFIG.LEVELS.length;
            const spacing = count <= 2 ? 220 : 200;
            const totalW = (count - 1) * spacing;
            const bx = cx - totalW / 2 + idx * spacing;
            this.add.text(bx, 395, `${lvl.speedScale}\u00d7 speed!`, {
                fontFamily: '"Segoe UI", Arial, sans-serif',
                fontSize: '10px',
                fontStyle: 'bold',
                color: '#ffaa66',
            }).setOrigin(0.5);
        });

        // Shop button (top-right)
        const shopBtn = this.add.image(CONFIG.WIDTH - 45, 45, 'icon_shop')
            .setScale(1.6)
            .setInteractive({ useHandCursor: true });
        const shopLabel = this.add.text(CONFIG.WIDTH - 45, 75, 'Shop', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '11px',
            color: '#ddaa44',
        }).setOrigin(0.5);

        shopBtn.on('pointerover', () => { shopBtn.setTint(0xffee88); });
        shopBtn.on('pointerout', () => { shopBtn.clearTint(); });
        shopBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(300, 5, 3, 16);
            this.time.delayedCall(350, () => this.scene.start('Shop'));
        });

        // Total gems display (prominent)
        if (save.totalSouls > 0 || save.totalRuns > 0) {
            this.add.image(cx - 70, 425, 'soul_shard').setScale(1.4);
            this.add.text(cx - 54, 425, `${save.totalSouls.toLocaleString()}`, {
                fontFamily: '"Segoe UI", Arial, sans-serif',
                fontSize: '18px',
                fontStyle: 'bold',
                color: '#bb77ff',
            }).setOrigin(0, 0.5);
            this.add.text(cx + 30, 425, 'Gems', {
                fontFamily: '"Segoe UI", Arial, sans-serif',
                fontSize: '14px',
                color: '#8a7a9a',
            }).setOrigin(0, 0.5);
        }

        // High score
        if (save.highScore > 0) {
            this.add.text(cx, 455, `Best: ${save.highScore.toLocaleString()}m`, {
                fontFamily: '"Segoe UI", Arial, sans-serif',
                fontSize: '14px',
                color: '#9b89b6',
            }).setOrigin(0.5);
        }

        // Stats
        if (save.totalRuns > 0) {
            this.add.text(cx, 475, `Runs: ${save.totalRuns}`, {
                fontFamily: '"Segoe UI", Arial, sans-serif',
                fontSize: '12px',
                color: '#6a5a7a',
            }).setOrigin(0.5);
        }

        // Controls help
        const controlsY = 500;
        this.add.text(cx, controlsY,
            'SPACE Jump  •  SHIFT Slide  •  W/S  ↑/↓ Switch Lane', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '11px',
            color: '#6a5a7a',
        }).setOrigin(0.5);

        this.add.text(cx, controlsY + 18,
            'Touch: Tap = Jump  •  Swipe ↑↓ = Lane  •  Hold = Slide', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '10px',
            color: '#5a4a6a',
        }).setOrigin(0.5);

        // Version
        this.add.text(CONFIG.WIDTH - 10, CONFIG.HEIGHT - 10, 'v1.1', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '10px',
            color: '#3a2a4a',
        }).setOrigin(1, 1);

        // Fade in
        this.cameras.main.fadeIn(500, 10, 6, 26);
    }

    update() {
        // Gentle parallax scroll on menu
        if (this.stars) this.stars.tilePositionX += 0.15;
        if (this.mountains) this.mountains.tilePositionX += 0.3;
    }
}
