// ============================================================
// Game Scene — core gameplay loop
// ============================================================

class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    // ----------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------

    init(data) {
        this.isEndless = !!(data && data.isEndless);
        this.isHardMode = !!(data && data.isHardMode);
        this.isInsaneMode = !!(data && data.isInsaneMode);
        this.levelIndex = (data && data.levelIndex !== undefined) ? data.levelIndex : 0;
        this.levelConfig = this.isEndless
            ? { level: 0, distance: Infinity, speedScale: 1.0, label: 'Endless' }
            : (CONFIG.LEVELS[this.levelIndex] || CONFIG.LEVELS[0]);
    }

    create() {
        // ---- State ----
        this.isGameOver = false;
        this.distancePixels = 0;
        this.distanceMeters = 0;
        this.baseSpeed = CONFIG.BASE_SPEED * this.levelConfig.speedScale;
        if (this.isInsaneMode) this.baseSpeed *= 4;
        else if (this.isHardMode) this.baseSpeed *= 2;
        this.currentSpeed = this.baseSpeed;
        this.speedMultiplier = 1;
        this.soulsCollected = 0;
        this.savedSouls = SaveManager.load().totalSouls;
        this.enemiesDodged = 0;
        this.gameOverTriggered = false;
        this.levelCompleteTriggered = false;
        this.isBossLevel = !!this.levelConfig.isBoss;

        // Endless biome cycling
        this.currentBiome = 0;          // 0=forest, 1=keep, 2=citadel
        this.biomeDistance = 2000;       // meters per biome
        this.lastBiomeIndex = 0;
        this.biomeTransitioning = false;

        // Time-slow ability state
        const save0 = SaveManager.load();
        this.timeSlowerCount = save0.timeSlowerCount || 0;
        this.hasTimeSlower = this.timeSlowerCount > 0;
        this.timeSlowActive = false;
        this.timeSlowUsed = false;  // one use per run
        this.timeSlowRemaining = 0;
        this.timeSlowDuration = 8000; // ms
        this.normalSpeedFactor = 1;   // stores the normal speed factor when slow is active

        // Gem Magnet ability state
        this.gemMagnetCount = save0.gemMagnetCount || 0;
        this.hasMagnet = this.gemMagnetCount > 0;
        this.magnetActive = false;
        this.magnetUsed = false;  // one use per run
        this.magnetRemaining = 0;
        this.magnetDuration = 20000; // 20 seconds

        // Heal ability state
        this.healCount = save0.healCount || 0;
        this.hasHeal = this.healCount > 0;
        this.healUsed = false;  // one use per run

        // Shadow Cloak ability state
        this.shadowCloakCount = save0.shadowCloakCount || 0;
        this.hasShadowCloak = this.shadowCloakCount > 0;
        this.shadowCloakActive = false;
        this.shadowCloakUsed = false;
        this.shadowCloakRemaining = 0;
        this.shadowCloakDuration = 5000; // 5 seconds

        // Double Gems ability state
        this.doubleGemsCount = save0.doubleGemsCount || 0;
        this.hasDoubleGems = this.doubleGemsCount > 0;
        this.doubleGemsActive = false;
        this.doubleGemsUsed = false;
        this.doubleGemsRemaining = 0;
        this.doubleGemsDuration = 15000; // 15 seconds

        // Phoenix Feather ability state
        this.phoenixCount = save0.phoenixCount || 0;
        this.hasPhoenix = this.phoenixCount > 0;
        this.phoenixUsed = false;

        // Lightning Dash ability state
        this.lightningCount = save0.lightningCount || 0;
        this.hasLightning = this.lightningCount > 0;
        this.lightningUsed = false;

        // Triple Jump ability state
        this.tripleJumpCount = save0.tripleJumpCount || 0;
        this.hasTripleJump = this.tripleJumpCount > 0;
        this.tripleJumpActive = false;
        this.tripleJumpUsed = false;
        this.tripleJumpRemaining = 0;
        this.tripleJumpDuration = 20000; // 20 seconds

        this.cameras.main.setBackgroundColor(CONFIG.BG);
        this.cameras.main.fadeIn(400, 10, 6, 26);

        // Build layers bottom-to-top
        this._createBackground();
        this._createPlatforms();
        this._createParticleEmitters();

        // Player
        this.player = new Player(this);

        // World generator (obstacles + collectibles)
        this.worldGen = new WorldGenerator(this, this.levelIndex);

        // Collision detection
        this.physics.add.overlap(
            this.player.sprite,
            this.worldGen.obstacleGroup,
            this._onHitObstacle,
            null,
            this
        );
        this.physics.add.overlap(
            this.player.sprite,
            this.worldGen.soulGroup,
            this._onCollectSoul,
            null,
            this
        );

        // Boss mode setup
        if (this.isBossLevel) {
            this._setupBoss();
        }

        // HUD
        this._createHUD();

        // Input
        this._setupInput();

        // Time-slow button (top-right, below souls)
        if (!this.isBossLevel) this._createSlowButton();

        // Gem Magnet button
        if (!this.isBossLevel) this._createMagnetButton();

        // Heal button
        if (!this.isBossLevel) this._createHealButton();

        // Shadow Cloak button
        if (!this.isBossLevel) this._createCloakButton();

        // Double Gems button
        if (!this.isBossLevel) this._createDoubleGemsButton();

        // Phoenix Feather button
        if (!this.isBossLevel) this._createPhoenixButton();

        // Lightning Dash button
        if (!this.isBossLevel) this._createLightningButton();

        // Triple Jump button
        if (!this.isBossLevel) this._createTripleJumpButton();

        // Speed lines (created after everything)
        this._createSpeedLines();
    }

    // ----------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------

    update(time, delta) {
        if (this.isGameOver) return;

        const dt = delta / 1000;

        // ---- Time-slow countdown ----
        if (this.timeSlowActive) {
            this.timeSlowRemaining -= delta;
            if (this.timeSlowRemaining <= 0) {
                this._endTimeSlow();
            }
            this._updateSlowButton();
        }

        // ---- Gem Magnet countdown & attraction ----
        if (this.magnetActive) {
            this.magnetRemaining -= delta;
            if (this.magnetRemaining <= 0) {
                this._endMagnet();
            } else {
                this._attractSouls(dt);
            }
            this._updateMagnetButton();
        }

        // ---- Shadow Cloak countdown ----
        if (this.shadowCloakActive) {
            this.shadowCloakRemaining -= delta;
            if (this.shadowCloakRemaining <= 0) {
                this._endShadowCloak();
            }
            this._updateCloakButton();
        }

        // ---- Double Gems countdown ----
        if (this.doubleGemsActive) {
            this.doubleGemsRemaining -= delta;
            if (this.doubleGemsRemaining <= 0) {
                this._endDoubleGems();
            }
            this._updateDoubleGemsButton();
        }

        // ---- Triple Jump countdown ----
        if (this.tripleJumpActive) {
            this.tripleJumpRemaining -= delta;
            if (this.tripleJumpRemaining <= 0) {
                this._endTripleJump();
            }
            this._updateTripleJumpButton();
        }

        // ---- Distance & speed ----
        // When time-slow is active, distance accumulates at NORMAL rate
        // In hard mode boss fight, halve distance gain to compensate for 2x speed
        let distanceDt = this.timeSlowActive
            ? dt * 2  // compensate for the halved currentSpeed
            : dt;
        if (this.isInsaneMode && this.isBossLevel) {
            distanceDt *= 0.25;
        } else if (this.isHardMode && this.isBossLevel) {
            distanceDt *= 0.5;
        }
        this.distancePixels += this.currentSpeed * distanceDt;
        this.distanceMeters = Math.floor(this.distancePixels / CONFIG.PIXELS_PER_METER);
        this._updateSpeed();

        // ---- Parallax backgrounds ----
        this._scrollBackground(dt);

        // ---- Platforms ----
        this._scrollPlatforms(dt);

        // ---- Input polling ----
        this._pollInput();

        // ---- Player ----
        this.player.update(time, delta);

        // ---- World generator ----
        if (this.isBossLevel) {
            this._updateBoss(time, dt);
        } else {
            this.worldGen.update(time, dt, this.currentSpeed, this.distanceMeters);
        }

        // ---- HUD ----
        this._updateHUD();

        // ---- Speed lines intensity ----
        this._updateSpeedLines();

        // ---- Endless biome cycling ----
        if (this.isEndless) {
            this._checkBiomeCycle();
        }

        // ---- Check level complete ----
        if (!this.isEndless && !this.levelCompleteTriggered &&
            this.distanceMeters >= this.levelConfig.distance) {
            this.levelCompleteTriggered = true;
            this._triggerLevelComplete();
            return;
        }

        // ---- Check death ----
        if (this.player.isDead && !this.gameOverTriggered) {
            // Phoenix Feather — auto-revive
            if (this.hasPhoenix && !this.phoenixUsed) {
                this.phoenixUsed = true;
                this._activatePhoenixRevive();
                return;
            }
            this.gameOverTriggered = true;
            this._triggerGameOver();
        }
    }

    // ----------------------------------------------------------
    // SPEED
    // ----------------------------------------------------------

    _updateSpeed() {
        const tier = Math.floor(this.distanceMeters / CONFIG.SPEED_TIER_DISTANCE);
        this.speedMultiplier = Math.min(
            1 + tier * CONFIG.SPEED_INCREMENT,
            CONFIG.MAX_SPEED_MULTIPLIER
        );
        let effectiveMultiplier = this.speedMultiplier;

        // Endless mode: extra +0.1 speed every 1000m
        if (this.isEndless) {
            const endlessTier = Math.floor(this.distanceMeters / 1000);
            effectiveMultiplier += endlessTier * 0.1;
        }

        if (this.timeSlowActive) {
            effectiveMultiplier *= 0.5;
        }
        this.currentSpeed = this.baseSpeed * effectiveMultiplier;
    }

    // ----------------------------------------------------------
    // BACKGROUND
    // ----------------------------------------------------------

    _createBackground() {
        const isLevel2 = this.levelIndex === 1;
        const isLevel3 = this.levelIndex === 2;
        const isBoss = this.levelIndex === 3;

        if (isBoss) {
            // Boss arena — lava cavern
            this.cameras.main.setBackgroundColor(0x1a0808);

            this.bgStars = this.add.tileSprite(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT, 'bg4_cavern')
                .setOrigin(0, 0).setDepth(0);

            this.bgMountains = this.add.tileSprite(0, 180, CONFIG.WIDTH, 250, 'bg4_walls')
                .setOrigin(0, 0).setAlpha(0.5).setDepth(1);

            this.bgTrees = this.add.tileSprite(0, 190, CONFIG.WIDTH, 250, 'bg4_walls')
                .setOrigin(0, 0).setAlpha(0.7).setDepth(2);

            this.bgFog = this.add.tileSprite(0, 340, CONFIG.WIDTH, 120, 'bg4_lava')
                .setOrigin(0, 0).setAlpha(0.6).setDepth(3);

            this.bgMist = this.add.tileSprite(0, 280, CONFIG.WIDTH, 100, 'bg4_haze')
                .setOrigin(0, 0).setAlpha(0.4).setDepth(3);

        } else if (isLevel3) {
            // Castle interior background
            this.cameras.main.setBackgroundColor(0x0e0a14);

            // Stone ceiling with cracks
            this.bgStars = this.add.tileSprite(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT, 'bg3_ceiling')
                .setOrigin(0, 0).setDepth(0);

            // Castle walls with pillars and windows (far)
            this.bgMountains = this.add.tileSprite(0, 180, CONFIG.WIDTH, 250, 'bg3_walls')
                .setOrigin(0, 0).setAlpha(0.5).setDepth(1);

            // Castle walls (near, offset)
            this.bgTrees = this.add.tileSprite(0, 190, CONFIG.WIDTH, 250, 'bg3_walls')
                .setOrigin(0, 0).setAlpha(0.7).setDepth(2);

            // Floor detail / carpet
            this.bgFog = this.add.tileSprite(0, 340, CONFIG.WIDTH, 120, 'bg3_floor')
                .setOrigin(0, 0).setAlpha(0.6).setDepth(3);

            // Dust / haze overlay
            this.bgMist = this.add.tileSprite(0, 280, CONFIG.WIDTH, 100, 'bg3_dust')
                .setOrigin(0, 0).setAlpha(0.4).setDepth(3);

        } else if (isLevel2) {
            // Dense forest background
            this.cameras.main.setBackgroundColor(0x071a0a);

            // Canopy sky with fireflies
            this.bgStars = this.add.tileSprite(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT, 'bg2_canopy')
                .setOrigin(0, 0).setDepth(0);

            // No moon in dense forest — hidden by canopy
            // (skip moon)

            // Dense tree silhouettes (far layer)
            this.bgMountains = this.add.tileSprite(0, 180, CONFIG.WIDTH, 250, 'bg2_trees')
                .setOrigin(0, 0).setAlpha(0.5).setDepth(1);

            // Dense tree silhouettes (near layer, offset)
            this.bgTrees = this.add.tileSprite(0, 190, CONFIG.WIDTH, 250, 'bg2_trees')
                .setOrigin(0, 0).setAlpha(0.7).setDepth(2);

            // Undergrowth / bushes
            this.bgFog = this.add.tileSprite(0, 340, CONFIG.WIDTH, 120, 'bg2_undergrowth')
                .setOrigin(0, 0).setAlpha(0.6).setDepth(3);

            // Green mist overlay
            this.bgMist = this.add.tileSprite(0, 280, CONFIG.WIDTH, 100, 'bg2_mist')
                .setOrigin(0, 0).setAlpha(0.45).setDepth(3);
        } else {
            // Level 1 — original dark fantasy background
            this.bgStars = this.add.tileSprite(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT, 'bg_stars')
                .setOrigin(0, 0).setDepth(0);

            this.add.image(650, 70, 'moon').setAlpha(0.7).setDepth(0);

            this.bgMountains = this.add.tileSprite(0, 200, CONFIG.WIDTH, 200, 'bg_mountains')
                .setOrigin(0, 0).setAlpha(0.6).setDepth(1);

            this.bgTrees = this.add.tileSprite(0, 220, CONFIG.WIDTH, 250, 'bg_trees')
                .setOrigin(0, 0).setAlpha(0.45).setDepth(2);

            this.bgFog = this.add.tileSprite(0, 300, CONFIG.WIDTH, 100, 'bg_fog')
                .setOrigin(0, 0).setAlpha(0.5).setDepth(3);

            this.bgMist = null;
        }
    }

    _scrollBackground(dt) {
        const speed = this.currentSpeed;
        this.bgStars.tilePositionX += speed * CONFIG.PARALLAX_STARS * dt;
        this.bgMountains.tilePositionX += speed * CONFIG.PARALLAX_MOUNTAINS * dt;
        this.bgTrees.tilePositionX += speed * CONFIG.PARALLAX_TREES * dt;
        this.bgFog.tilePositionX += speed * CONFIG.PARALLAX_FOG * dt;
        if (this.bgMist) {
            this.bgMist.tilePositionX += speed * 0.18 * dt;
        }
    }

    // ----------------------------------------------------------
    // PLATFORMS (3 lane ground strips)
    // ----------------------------------------------------------

    _createPlatforms() {
        const isLevel2 = this.levelIndex === 1;
        const isLevel3 = this.levelIndex === 2;
        const isBoss = this.levelIndex === 3;
        const platKey = isBoss ? 'platform4' : isLevel3 ? 'platform3' : isLevel2 ? 'platform2' : 'platform';
        const dotColor = isBoss ? 0xff4400 : isLevel3 ? 0xccaa33 : isLevel2 ? 0x44aa44 : 0x9b59b6;
        const solidColor = isBoss ? 0x1a0808 : isLevel3 ? 0x0e0a14 : isLevel2 ? 0x071a0a : 0x0a0616;

        // Solid opaque fill from first lane to bottom of screen
        // so background layers don't bleed into the play area
        this.laneFillGraphics = this.add.graphics().setDepth(3.5);
        const firstLane = CONFIG.LANES[0];
        this.laneFillGraphics.fillStyle(solidColor, 1);
        this.laneFillGraphics.fillRect(0, firstLane, CONFIG.WIDTH, CONFIG.HEIGHT - firstLane);

        this.platforms = [];
        CONFIG.LANES.forEach((laneY, i) => {
            const platform = this.add.tileSprite(0, laneY, CONFIG.WIDTH, 16, platKey)
                .setOrigin(0, 0).setDepth(4);
            this.platforms.push(platform);

            // Lane indicator (small glowing dots at left edge)
            const dot = this.add.graphics().setDepth(5);
            dot.fillStyle(dotColor, 0.4);
            dot.fillCircle(20, laneY + 8, 3);
        });
    }

    _scrollPlatforms(dt) {
        const speed = this.currentSpeed;
        this.platforms.forEach(p => {
            p.tilePositionX += speed * CONFIG.PARALLAX_GROUND * dt;
        });
    }

    // ----------------------------------------------------------
    // PARTICLE EMITTERS
    // ----------------------------------------------------------

    _createParticleEmitters() {
        // Dust on landing
        this.dustEmitter = this.add.particles(0, 0, 'particle_dust', {
            speed: { min: 30, max: 80 },
            angle: { min: 160, max: 200 },
            scale: { start: 1.2, end: 0 },
            alpha: { start: 0.7, end: 0 },
            lifespan: 400,
            gravityY: 100,
            emitting: false,
        }).setDepth(11);

        // Double-jump burst
        this.jumpEmitter = this.add.particles(0, 0, 'particle_purple', {
            speed: { min: 40, max: 120 },
            angle: { min: 200, max: 340 },
            scale: { start: 1, end: 0 },
            alpha: { start: 0.9, end: 0 },
            lifespan: 350,
            emitting: false,
        }).setDepth(11);

        // Damage flash
        this.damageEmitter = this.add.particles(0, 0, 'particle_red', {
            speed: { min: 60, max: 180 },
            angle: { min: 0, max: 360 },
            scale: { start: 1.5, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 500,
            emitting: false,
        }).setDepth(12);

        // Soul collect sparkle
        this.soulEmitter = this.add.particles(0, 0, 'particle_purple', {
            speed: { min: 50, max: 130 },
            angle: { min: 0, max: 360 },
            scale: { start: 1.2, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 400,
            emitting: false,
        }).setDepth(11);
    }

    // ----------------------------------------------------------
    // SPEED LINES
    // ----------------------------------------------------------

    _createSpeedLines() {
        this.speedLines = [];
        for (let i = 0; i < 20; i++) {
            const y = Phaser.Math.Between(40, CONFIG.HEIGHT - 40);
            const line = this.add.rectangle(
                Phaser.Math.Between(0, CONFIG.WIDTH),
                y,
                Phaser.Math.Between(20, 60),
                1,
                0xffffff
            ).setAlpha(0).setDepth(6);
            this.speedLines.push({ obj: line, baseAlpha: 0 });
        }
    }

    _updateSpeedLines() {
        const intensity = Math.max(0, (this.speedMultiplier - 1.2) / 1.3); // 0 at 1.2x, 1 at 2.5x
        this.speedLines.forEach(sl => {
            sl.obj.x -= this.currentSpeed * 0.02;
            if (sl.obj.x < -60) {
                sl.obj.x = CONFIG.WIDTH + Phaser.Math.Between(10, 100);
                sl.obj.y = Phaser.Math.Between(40, CONFIG.HEIGHT - 40);
                sl.obj.width = Phaser.Math.Between(20, 60);
            }
            sl.obj.setAlpha(intensity * Phaser.Math.FloatBetween(0.05, 0.15));
        });
    }

    // ----------------------------------------------------------
    // HUD
    // ----------------------------------------------------------

    _createHUD() {
        const textStyle = {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '16px',
            color: '#e0d0f0',
            stroke: '#0a0616',
            strokeThickness: 3,
        };

        // Hearts
        this.heartIcons = [];
        for (let i = 0; i < CONFIG.MAX_HP; i++) {
            const heart = this.add.image(25 + i * 24, 25, 'heart_full')
                .setDepth(100).setScrollFactor(0);
            this.heartIcons.push(heart);
        }

        // Distance
        this.distanceText = this.add.text(CONFIG.WIDTH / 2, 18, '0m', {
            ...textStyle,
            fontSize: '20px',
            fontStyle: 'bold',
        }).setOrigin(0.5, 0).setDepth(100);

        // Level label & goal
        if (this.isEndless) {
            this.biomeLabel = this.add.text(CONFIG.WIDTH / 2, 42,
                '\u221e ENDLESS  \u2014  Cursed Forest', {
                ...textStyle,
                fontSize: '11px',
                color: '#ffaa66',
            }).setOrigin(0.5, 0).setDepth(100);
        } else {
            this.add.text(CONFIG.WIDTH / 2, 42,
                `Level ${this.levelConfig.level}: ${this.levelConfig.label}  \u2014  Goal: ${this.levelConfig.distance}m`, {
                ...textStyle,
                fontSize: '11px',
                color: '#8a7a9a',
            }).setOrigin(0.5, 0).setDepth(100);
        }

        // Progress bar (not shown in endless mode)
        if (!this.isEndless) {

            // Mode indicator
            if (this.isInsaneMode) {
                this.add.text(CONFIG.WIDTH / 2, 56,
                    '\uD83D\uDCA0 INSANE MODE \u2014 4\u00d7 Speed', {
                    ...textStyle,
                    fontSize: '9px',
                    fontStyle: 'bold',
                    color: '#ff00ff',
                }).setOrigin(0.5, 0).setDepth(100);
            } else if (this.isHardMode) {
                this.add.text(CONFIG.WIDTH / 2, 56,
                    '\uD83D\uDD25 HARD MODE \u2014 2\u00d7 Speed', {
                    ...textStyle,
                    fontSize: '9px',
                    fontStyle: 'bold',
                    color: '#ff4444',
                }).setOrigin(0.5, 0).setDepth(100);
            }

            const barX = CONFIG.WIDTH / 2 - 100;
            const barY = (this.isInsaneMode || this.isHardMode) ? 70 : 58;
            const barW = 200;
            const barH = 10;

            // Background track
            this.progressBg = this.add.graphics().setDepth(100);
            this.progressBg.fillStyle(0x1a0e2e, 0.8);
            this.progressBg.fillRoundedRect(barX, barY, barW, barH, 4);
            this.progressBg.lineStyle(1, 0x3d2a50, 0.8);
            this.progressBg.strokeRoundedRect(barX, barY, barW, barH, 4);

            // Fill bar (drawn each frame)
            this.progressFill = this.add.graphics().setDepth(100);

            // Percentage text
            this.progressText = this.add.text(CONFIG.WIDTH / 2 + 108, barY + barH / 2, '0%', {
                ...textStyle,
                fontSize: '11px',
                color: '#bbaadd',
            }).setOrigin(0, 0.5).setDepth(100);

            // Store bar geometry for updates
            this._progressBarX = barX;
            this._progressBarY = barY;
            this._progressBarW = barW;
            this._progressBarH = barH;
        }

        // Souls (total bank + current run)
        this.soulIcon = this.add.image(CONFIG.WIDTH - 100, 25, 'soul_shard')
            .setDepth(100).setScale(1.2);
        this.soulText = this.add.text(CONFIG.WIDTH - 82, 18,
            this.savedSouls.toLocaleString(), textStyle)
            .setOrigin(0, 0).setDepth(100);
        this.soulRunText = this.add.text(CONFIG.WIDTH - 82, 36,
            '+0', { ...textStyle, fontSize: '11px', color: '#bbaadd' })
            .setOrigin(0, 0).setDepth(100);

        // Speed indicator
        this.speedText = this.add.text(20, CONFIG.HEIGHT - 25, '1.0x', {
            ...textStyle,
            fontSize: '13px',
            color: '#8a7a9a',
        }).setOrigin(0, 1).setDepth(100);

        // Best distance
        const save = SaveManager.load();
        this.bestText = this.add.text(CONFIG.WIDTH - 20, CONFIG.HEIGHT - 25,
            `Best: ${save.highScore.toLocaleString()}m`, {
            ...textStyle,
            fontSize: '13px',
            color: '#6a5a7a',
        }).setOrigin(1, 1).setDepth(100);
    }

    _updateHUD() {
        // Distance
        this.distanceText.setText(`${this.distanceMeters.toLocaleString()}m`);

        // Progress bar (skip in endless)
        if (!this.isEndless) {
            const pct = Math.min(this.distanceMeters / this.levelConfig.distance, 1);
            const fillW = Math.max(0, this._progressBarW * pct);
            this.progressFill.clear();
            if (fillW > 0) {
                // Gradient effect: darker purple → bright purple as progress increases
                const color = pct >= 1 ? 0xffcc00 : 0x9b59b6;
                this.progressFill.fillStyle(color, 0.9);
                this.progressFill.fillRoundedRect(
                    this._progressBarX, this._progressBarY,
                    fillW, this._progressBarH, 4
                );
                // Highlight strip at top
                this.progressFill.fillStyle(0xffffff, 0.2);
                this.progressFill.fillRect(
                    this._progressBarX + 2, this._progressBarY + 1,
                    fillW - 4, 3
                );
            }
            this.progressText.setText(`${Math.floor(pct * 100)}%`);
            if (pct >= 1) {
                this.progressText.setColor('#ffcc00');
            }
        }

        // Souls (bank + run)
        this.soulText.setText((this.savedSouls + this.soulsCollected).toLocaleString());
        this.soulRunText.setText(`+${this.soulsCollected.toLocaleString()}`);

        // Hearts
        for (let i = 0; i < this.heartIcons.length; i++) {
            this.heartIcons[i].setTexture(i < this.player.hp ? 'heart_full' : 'heart_empty');
        }

        // Speed
        this.speedText.setText(`${this.speedMultiplier.toFixed(1)}x`);
        // Tint speed text based on multiplier
        if (this.speedMultiplier >= 2.0) {
            this.speedText.setColor('#ff6666');
        } else if (this.speedMultiplier >= 1.5) {
            this.speedText.setColor('#ffaa66');
        } else {
            this.speedText.setColor('#8a7a9a');
        }
    }

    // ----------------------------------------------------------
    // INPUT
    // ----------------------------------------------------------

    _setupInput() {
        const kb = this.input.keyboard;

        // Register keys via addKey for reliable polling
        this.keys = {
            jump: kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            slide: kb.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
            up: kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down: kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            w: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            s: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            p: kb.addKey(Phaser.Input.Keyboard.KeyCodes.P),
            m: kb.addKey(Phaser.Input.Keyboard.KeyCodes.M),
            h: kb.addKey(Phaser.Input.Keyboard.KeyCodes.H),
            c: kb.addKey(Phaser.Input.Keyboard.KeyCodes.C),
            g: kb.addKey(Phaser.Input.Keyboard.KeyCodes.G),
            l: kb.addKey(Phaser.Input.Keyboard.KeyCodes.L),
            j: kb.addKey(Phaser.Input.Keyboard.KeyCodes.J),
        };

        // Touch / pointer controls
        this._setupTouchControls();
    }

    /** Poll keys every frame for reliable input detection. */
    _pollInput() {
        if (!this.keys) return;

        // Jump
        if (Phaser.Input.Keyboard.JustDown(this.keys.jump)) {
            this.player.jump();
        }

        // Slide
        if (Phaser.Input.Keyboard.JustDown(this.keys.slide)) {
            this.player.slide();
        }

        // Lane up
        if (Phaser.Input.Keyboard.JustDown(this.keys.up) ||
            Phaser.Input.Keyboard.JustDown(this.keys.w)) {
            this.player.switchLane(-1);
        }

        // Lane down
        if (Phaser.Input.Keyboard.JustDown(this.keys.down) ||
            Phaser.Input.Keyboard.JustDown(this.keys.s)) {
            this.player.switchLane(1);
        }

        // Time-slow (P key)
        if (Phaser.Input.Keyboard.JustDown(this.keys.p)) {
            this._activateTimeSlow();
        }

        // Gem Magnet (M key)
        if (Phaser.Input.Keyboard.JustDown(this.keys.m)) {
            this._activateMagnet();
        }

        // Heal (H key)
        if (Phaser.Input.Keyboard.JustDown(this.keys.h)) {
            this._activateHeal();
        }

        // Shadow Cloak (C key)
        if (Phaser.Input.Keyboard.JustDown(this.keys.c)) {
            this._activateShadowCloak();
        }

        // Double Gems (G key)
        if (Phaser.Input.Keyboard.JustDown(this.keys.g)) {
            this._activateDoubleGems();
        }

        // Lightning Dash (L key)
        if (Phaser.Input.Keyboard.JustDown(this.keys.l)) {
            this._activateLightning();
        }

        // Triple Jump (J key)
        if (Phaser.Input.Keyboard.JustDown(this.keys.j)) {
            this._activateTripleJump();
        }
    }

    _setupTouchControls() {
        // Detect touch device
        const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

        if (isTouchDevice) {
            this._createMobileButtons();
        }

        // Keep swipe controls as fallback
        let startX = 0;
        let startY = 0;
        let startTime = 0;

        this.input.on('pointerdown', (pointer) => {
            // Ignore taps on the mobile button area (bottom 180px, sides 110px)
            if (isTouchDevice) {
                if (pointer.y > CONFIG.HEIGHT - 180 && (pointer.x < 110 || pointer.x > CONFIG.WIDTH - 110)) return;
            }
            startX = pointer.x;
            startY = pointer.y;
            startTime = this.time.now;
        });

        this.input.on('pointerup', (pointer) => {
            if (isTouchDevice) {
                if (pointer.y > CONFIG.HEIGHT - 180 && (pointer.x < 110 || pointer.x > CONFIG.WIDTH - 110)) return;
            }
            const dx = pointer.x - startX;
            const dy = pointer.y - startY;
            const dt = this.time.now - startTime;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 40) {
                // Swipe detected
                if (Math.abs(dy) > Math.abs(dx)) {
                    // Vertical swipe
                    if (dy < 0) {
                        this.player.switchLane(-1);
                    } else {
                        if (this.player.isOnGround) {
                            this.player.slide();
                        } else {
                            this.player.switchLane(1);
                        }
                    }
                } else {
                    if (dx > 0) this.player.switchLane(1);
                    else this.player.switchLane(-1);
                }
            } else {
                if (dt < 250) {
                    this.player.jump();
                } else {
                    this.player.slide();
                }
            }
        });
    }

    _createMobileButtons() {
        const btnAlpha = 0.35;
        const btnSize = 76;
        const pad = 14;
        const bottomY = CONFIG.HEIGHT - 20;

        // ---- LEFT SIDE: Lane Up / Lane Down ----
        const leftCenterX = 60;

        // Lane Up button (▲)
        const upBg = this.add.graphics().setDepth(200).setAlpha(btnAlpha);
        upBg.fillStyle(0x3344aa, 1);
        upBg.fillRoundedRect(leftCenterX - btnSize / 2, bottomY - btnSize - pad - btnSize, btnSize, btnSize, 12);
        upBg.lineStyle(2, 0x6688ff, 0.6);
        upBg.strokeRoundedRect(leftCenterX - btnSize / 2, bottomY - btnSize - pad - btnSize, btnSize, btnSize, 12);

        this.add.text(leftCenterX, bottomY - btnSize - pad - btnSize / 2, '▲', {
            fontSize: '30px', fontStyle: 'bold', color: '#ffffff',
        }).setOrigin(0.5).setDepth(201).setAlpha(0.7);

        const upZone = this.add.zone(leftCenterX, bottomY - btnSize - pad - btnSize / 2, btnSize, btnSize)
            .setInteractive().setDepth(202);
        upZone.on('pointerdown', () => {
            this.player.switchLane(-1);
            upBg.setAlpha(0.7);
            this.time.delayedCall(120, () => upBg.setAlpha(btnAlpha));
        });

        // Lane Down button (▼)
        const downBg = this.add.graphics().setDepth(200).setAlpha(btnAlpha);
        downBg.fillStyle(0x3344aa, 1);
        downBg.fillRoundedRect(leftCenterX - btnSize / 2, bottomY - btnSize, btnSize, btnSize, 12);
        downBg.lineStyle(2, 0x6688ff, 0.6);
        downBg.strokeRoundedRect(leftCenterX - btnSize / 2, bottomY - btnSize, btnSize, btnSize, 12);

        this.add.text(leftCenterX, bottomY - btnSize / 2, '▼', {
            fontSize: '30px', fontStyle: 'bold', color: '#ffffff',
        }).setOrigin(0.5).setDepth(201).setAlpha(0.7);

        const downZone = this.add.zone(leftCenterX, bottomY - btnSize / 2, btnSize, btnSize)
            .setInteractive().setDepth(202);
        downZone.on('pointerdown', () => {
            this.player.switchLane(1);
            downBg.setAlpha(0.7);
            this.time.delayedCall(120, () => downBg.setAlpha(btnAlpha));
        });

        // ---- RIGHT SIDE: Jump / Slide ----
        const rightCenterX = CONFIG.WIDTH - 60;

        // Jump button (top-right)
        const jumpBg = this.add.graphics().setDepth(200).setAlpha(btnAlpha);
        jumpBg.fillStyle(0x338833, 1);
        jumpBg.fillRoundedRect(rightCenterX - btnSize / 2, bottomY - btnSize - pad - btnSize, btnSize, btnSize, 12);
        jumpBg.lineStyle(2, 0x66ff66, 0.6);
        jumpBg.strokeRoundedRect(rightCenterX - btnSize / 2, bottomY - btnSize - pad - btnSize, btnSize, btnSize, 12);

        this.add.text(rightCenterX, bottomY - btnSize - pad - btnSize / 2, 'JUMP', {
            fontSize: '15px', fontStyle: 'bold', color: '#ffffff',
        }).setOrigin(0.5).setDepth(201).setAlpha(0.7);

        const jumpZone = this.add.zone(rightCenterX, bottomY - btnSize - pad - btnSize / 2, btnSize, btnSize)
            .setInteractive().setDepth(202);
        jumpZone.on('pointerdown', () => {
            this.player.jump();
            jumpBg.setAlpha(0.7);
            this.time.delayedCall(120, () => jumpBg.setAlpha(btnAlpha));
        });

        // Slide button (bottom-right)
        const slideBg = this.add.graphics().setDepth(200).setAlpha(btnAlpha);
        slideBg.fillStyle(0xaa6633, 1);
        slideBg.fillRoundedRect(rightCenterX - btnSize / 2, bottomY - btnSize, btnSize, btnSize, 12);
        slideBg.lineStyle(2, 0xffaa44, 0.6);
        slideBg.strokeRoundedRect(rightCenterX - btnSize / 2, bottomY - btnSize, btnSize, btnSize, 12);

        this.add.text(rightCenterX, bottomY - btnSize / 2, 'SLIDE', {
            fontSize: '15px', fontStyle: 'bold', color: '#ffffff',
        }).setOrigin(0.5).setDepth(201).setAlpha(0.7);

        const slideZone = this.add.zone(rightCenterX, bottomY - btnSize / 2, btnSize, btnSize)
            .setInteractive().setDepth(202);
        slideZone.on('pointerdown', () => {
            this.player.slide();
            slideBg.setAlpha(0.7);
            this.time.delayedCall(120, () => slideBg.setAlpha(btnAlpha));
        });

        // Store refs for cleanup
        this.mobileButtons = [upBg, downBg, jumpBg, slideBg, upZone, downZone, jumpZone, slideZone];
    }

    // ----------------------------------------------------------
    // COLLISION CALLBACKS
    // ----------------------------------------------------------

    _onHitObstacle(playerSprite, obstacleSprite) {
        if (!obstacleSprite.active) return;
        const player = playerSprite.playerRef;
        if (!player || player.isDead || player.isInvincible) return;

        // Shadow Cloak — pass through obstacles
        if (this.shadowCloakActive) return;

        // Check if sliding under an air obstacle
        if (obstacleSprite.obstacleType && obstacleSprite.obstacleType.slidable && player.isSliding) {
            return; // Dodged!
        }

        player.takeDamage();
    }

    _onCollectSoul(playerSprite, soulSprite) {
        if (!soulSprite.active) return;

        soulSprite.setActive(false).setVisible(false);
        soulSprite.body.enable = false;

        this.soulsCollected += CONFIG.SOUL_VALUE * (this.doubleGemsActive ? 2 : 1);

        // Particle burst
        if (this.soulEmitter) {
            this.soulEmitter.setPosition(soulSprite.x, soulSprite.y);
            this.soulEmitter.explode(6);
        }

        // Brief scale-pop on soul counter
        this.tweens.add({
            targets: this.soulText,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 100,
            yoyo: true,
            ease: 'Power2',
        });
    }

    // ----------------------------------------------------------
    // TIME-SLOW ABILITY
    // ----------------------------------------------------------

    _createSlowButton() {
        const btnX = CONFIG.WIDTH - 35;
        const btnY = CONFIG.HEIGHT - 50;

        if (!this.hasTimeSlower) {
            this.slowBtn = null;
            return;
        }

        this.slowBtn = this.add.image(btnX, btnY, 'btn_slow')
            .setDepth(100).setScrollFactor(0)
            .setInteractive({ useHandCursor: true });

        this.slowLabel = this.add.text(btnX, btnY + 26, 'P', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '10px',
            color: '#8a7a9a',
        }).setOrigin(0.5).setDepth(100);

        this.slowTimerText = this.add.text(btnX, btnY, '', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#ffcc00',
        }).setOrigin(0.5).setDepth(101).setVisible(false);

        this.slowBtn.on('pointerdown', () => {
            this._activateTimeSlow();
        });
    }

    _activateTimeSlow() {
        if (!this.hasTimeSlower || this.timeSlowUsed || this.timeSlowActive || this.isGameOver) return;

        this.timeSlowActive = true;
        this.timeSlowUsed = true;
        this.timeSlowRemaining = this.timeSlowDuration;

        // Consume one from inventory
        const data = SaveManager.load();
        data.timeSlowerCount = Math.max(0, (data.timeSlowerCount || 0) - 1);
        SaveManager.save(data);

        this.cameras.main.flash(300, 155, 89, 182, false);

        if (this.slowTimerText) this.slowTimerText.setVisible(true);
        this._updateSlowButton();

        this.slowHudText = this.add.text(CONFIG.WIDTH / 2, 78, '⏱ TIME SLOW', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#ffcc00',
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: this.slowHudText,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }

    _endTimeSlow() {
        this.timeSlowActive = false;
        this.timeSlowRemaining = 0;

        if (this.slowHudText) {
            this.slowHudText.destroy();
            this.slowHudText = null;
        }

        if (this.slowBtn) {
            this.slowBtn.setTexture('btn_slow_off');
            this.slowBtn.removeInteractive();
        }
        if (this.slowTimerText) this.slowTimerText.setVisible(false);
        if (this.slowLabel) this.slowLabel.setText('USED');
    }

    _updateSlowButton() {
        if (!this.slowTimerText) return;
        if (this.timeSlowActive) {
            const secs = Math.ceil(this.timeSlowRemaining / 1000);
            this.slowTimerText.setText(`${secs}s`);
        }
    }

    // ----------------------------------------------------------
    // GEM MAGNET ABILITY
    // ----------------------------------------------------------

    _createMagnetButton() {
        const btnX = CONFIG.WIDTH - 35;
        const btnY = CONFIG.HEIGHT - 100;

        if (!this.hasMagnet) {
            this.magnetBtn = null;
            return;
        }

        this.magnetBtn = this.add.image(btnX, btnY, 'btn_magnet')
            .setDepth(100).setScrollFactor(0)
            .setInteractive({ useHandCursor: true });

        this.magnetLabel = this.add.text(btnX, btnY + 26, 'M', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '10px',
            color: '#8a7a9a',
        }).setOrigin(0.5).setDepth(100);

        this.magnetTimerText = this.add.text(btnX, btnY, '', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#ff4444',
        }).setOrigin(0.5).setDepth(101).setVisible(false);

        this.magnetBtn.on('pointerdown', () => {
            this._activateMagnet();
        });
    }

    _activateMagnet() {
        if (!this.hasMagnet || this.magnetUsed || this.magnetActive || this.isGameOver) return;

        this.magnetActive = true;
        this.magnetUsed = true;
        this.magnetRemaining = this.magnetDuration;

        // Consume one from inventory
        const data = SaveManager.load();
        data.gemMagnetCount = Math.max(0, (data.gemMagnetCount || 0) - 1);
        SaveManager.save(data);

        this.cameras.main.flash(300, 200, 60, 60, false);

        if (this.magnetTimerText) this.magnetTimerText.setVisible(true);
        this._updateMagnetButton();

        this.magnetHudText = this.add.text(CONFIG.WIDTH / 2, 96, '\uD83E\uDDF2 GEM MAGNET', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#ff4444',
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: this.magnetHudText,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }

    _endMagnet() {
        this.magnetActive = false;
        this.magnetRemaining = 0;

        if (this.magnetHudText) {
            this.magnetHudText.destroy();
            this.magnetHudText = null;
        }

        if (this.magnetBtn) {
            this.magnetBtn.setTexture('btn_magnet_off');
            this.magnetBtn.removeInteractive();
        }
        if (this.magnetTimerText) this.magnetTimerText.setVisible(false);
        if (this.magnetLabel) this.magnetLabel.setText('USED');
    }

    _updateMagnetButton() {
        if (!this.magnetTimerText) return;
        if (this.magnetActive) {
            const secs = Math.ceil(this.magnetRemaining / 1000);
            this.magnetTimerText.setText(`${secs}s`);
        }
    }

    /** Attract active souls toward the player's lane */
    _attractSouls(dt) {
        const targetY = CONFIG.LANES[this.player.currentLane] - 30;
        const lerpSpeed = 4; // lanes per second — fast enough to pull across

        this.worldGen.soulGroup.getChildren().forEach(soul => {
            if (!soul.active) return;
            const diff = targetY - soul.baseY;
            if (Math.abs(diff) < 2) {
                soul.baseY = targetY;
            } else {
                soul.baseY += diff * lerpSpeed * dt;
            }
        });
    }

    // ----------------------------------------------------------
    // HEAL ABILITY
    // ----------------------------------------------------------

    _createHealButton() {
        const btnX = CONFIG.WIDTH - 35;
        const btnY = CONFIG.HEIGHT - 150;

        if (!this.hasHeal) {
            this.healBtn = null;
            return;
        }

        this.healBtn = this.add.image(btnX, btnY, 'btn_heal')
            .setDepth(100).setScrollFactor(0)
            .setInteractive({ useHandCursor: true });

        this.healLabel = this.add.text(btnX, btnY + 26, 'H', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '10px',
            color: '#8a7a9a',
        }).setOrigin(0.5).setDepth(100);

        this.healBtn.on('pointerdown', () => {
            this._activateHeal();
        });
    }

    _activateHeal() {
        if (!this.hasHeal || this.healUsed || this.isGameOver) return;
        if (this.player.hp >= this.player.maxHp) return; // already full

        this.healUsed = true;

        // Consume one from inventory
        const data = SaveManager.load();
        data.healCount = Math.max(0, (data.healCount || 0) - 1);
        SaveManager.save(data);

        // Heal the player
        this.player.hp = Math.min(this.player.hp + 1, this.player.maxHp);

        // Green flash
        this.cameras.main.flash(300, 40, 255, 80, false);

        // Heart pop animation
        if (this.heartIcons) {
            this.heartIcons.forEach(h => {
                this.tweens.add({
                    targets: h,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    duration: 150,
                    yoyo: true,
                    ease: 'Power2',
                });
            });
        }

        // HUD indicator
        const healText = this.add.text(CONFIG.WIDTH / 2, 96, '\u2764 HEALED', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#44ff88',
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: healText,
            alpha: 0,
            y: 80,
            duration: 1200,
            ease: 'Sine.easeIn',
            onComplete: () => healText.destroy(),
        });

        // Disable button
        if (this.healBtn) {
            this.healBtn.setTexture('btn_heal_off');
            this.healBtn.removeInteractive();
        }
        if (this.healLabel) this.healLabel.setText('USED');
    }

    // ----------------------------------------------------------
    // SHADOW CLOAK ABILITY
    // ----------------------------------------------------------

    _createCloakButton() {
        const btnX = 35;
        const btnY = CONFIG.HEIGHT - 50;

        if (!this.hasShadowCloak) { this.cloakBtn = null; return; }

        this.cloakBtn = this.add.image(btnX, btnY, 'btn_cloak')
            .setDepth(100).setScrollFactor(0)
            .setInteractive({ useHandCursor: true });

        this.cloakLabel = this.add.text(btnX, btnY + 26, 'C', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '10px', color: '#8a7a9a',
        }).setOrigin(0.5).setDepth(100);

        this.cloakTimerText = this.add.text(btnX, btnY, '', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '13px', fontStyle: 'bold', color: '#cc88ff',
        }).setOrigin(0.5).setDepth(101).setVisible(false);

        this.cloakBtn.on('pointerdown', () => this._activateShadowCloak());
    }

    _activateShadowCloak() {
        if (!this.hasShadowCloak || this.shadowCloakUsed || this.shadowCloakActive || this.isGameOver) return;

        this.shadowCloakActive = true;
        this.shadowCloakUsed = true;
        this.shadowCloakRemaining = this.shadowCloakDuration;

        const data = SaveManager.load();
        data.shadowCloakCount = Math.max(0, (data.shadowCloakCount || 0) - 1);
        SaveManager.save(data);

        // Make player ghostly
        this.player.isInvincible = true;
        this.player.sprite.setAlpha(0.4);
        if (this.player.glow) this.player.glow.setAlpha(0.8);

        this.cameras.main.flash(300, 136, 68, 204, false);

        if (this.cloakTimerText) this.cloakTimerText.setVisible(true);

        this.cloakHudText = this.add.text(CONFIG.WIDTH / 2, 114, '\uD83D\uDC7B SHADOW CLOAK', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '14px', fontStyle: 'bold', color: '#cc88ff',
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: this.cloakHudText, alpha: 0.5,
            duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
    }

    _endShadowCloak() {
        this.shadowCloakActive = false;
        this.shadowCloakRemaining = 0;
        this.player.isInvincible = false;
        this.player.sprite.setAlpha(1);
        if (this.player.glow) this.player.glow.setAlpha(0.3);

        if (this.cloakHudText) { this.cloakHudText.destroy(); this.cloakHudText = null; }
        if (this.cloakBtn) { this.cloakBtn.setTexture('btn_cloak_off'); this.cloakBtn.removeInteractive(); }
        if (this.cloakTimerText) this.cloakTimerText.setVisible(false);
        if (this.cloakLabel) this.cloakLabel.setText('USED');
    }

    _updateCloakButton() {
        if (!this.cloakTimerText) return;
        if (this.shadowCloakActive) {
            this.cloakTimerText.setText(`${Math.ceil(this.shadowCloakRemaining / 1000)}s`);
        }
    }

    // ----------------------------------------------------------
    // DOUBLE GEMS ABILITY
    // ----------------------------------------------------------

    _createDoubleGemsButton() {
        const btnX = 35;
        const btnY = CONFIG.HEIGHT - 100;

        if (!this.hasDoubleGems) { this.doubleGemsBtn = null; return; }

        this.doubleGemsBtn = this.add.image(btnX, btnY, 'btn_double_gems')
            .setDepth(100).setScrollFactor(0)
            .setInteractive({ useHandCursor: true });

        this.doubleGemsLabel = this.add.text(btnX, btnY + 26, 'G', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '10px', color: '#8a7a9a',
        }).setOrigin(0.5).setDepth(100);

        this.doubleGemsTimerText = this.add.text(btnX, btnY, '', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '13px', fontStyle: 'bold', color: '#ffcc00',
        }).setOrigin(0.5).setDepth(101).setVisible(false);

        this.doubleGemsBtn.on('pointerdown', () => this._activateDoubleGems());
    }

    _activateDoubleGems() {
        if (!this.hasDoubleGems || this.doubleGemsUsed || this.doubleGemsActive || this.isGameOver) return;

        this.doubleGemsActive = true;
        this.doubleGemsUsed = true;
        this.doubleGemsRemaining = this.doubleGemsDuration;

        const data = SaveManager.load();
        data.doubleGemsCount = Math.max(0, (data.doubleGemsCount || 0) - 1);
        SaveManager.save(data);

        this.cameras.main.flash(300, 255, 200, 0, false);

        if (this.doubleGemsTimerText) this.doubleGemsTimerText.setVisible(true);

        this.doubleGemsHudText = this.add.text(CONFIG.WIDTH / 2, 132, '\uD83D\uDCB0 DOUBLE GEMS', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '14px', fontStyle: 'bold', color: '#ffcc00',
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: this.doubleGemsHudText, alpha: 0.5,
            duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
    }

    _endDoubleGems() {
        this.doubleGemsActive = false;
        this.doubleGemsRemaining = 0;

        if (this.doubleGemsHudText) { this.doubleGemsHudText.destroy(); this.doubleGemsHudText = null; }
        if (this.doubleGemsBtn) { this.doubleGemsBtn.setTexture('btn_double_gems_off'); this.doubleGemsBtn.removeInteractive(); }
        if (this.doubleGemsTimerText) this.doubleGemsTimerText.setVisible(false);
        if (this.doubleGemsLabel) this.doubleGemsLabel.setText('USED');
    }

    _updateDoubleGemsButton() {
        if (!this.doubleGemsTimerText) return;
        if (this.doubleGemsActive) {
            this.doubleGemsTimerText.setText(`${Math.ceil(this.doubleGemsRemaining / 1000)}s`);
        }
    }

    // ----------------------------------------------------------
    // PHOENIX FEATHER ABILITY (auto-revive)
    // ----------------------------------------------------------

    _createPhoenixButton() {
        const btnX = 35;
        const btnY = CONFIG.HEIGHT - 150;

        if (!this.hasPhoenix) { this.phoenixBtn = null; return; }

        this.phoenixBtn = this.add.image(btnX, btnY, 'btn_phoenix')
            .setDepth(100).setScrollFactor(0);

        this.phoenixLabel = this.add.text(btnX, btnY + 26, 'AUTO', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '8px', color: '#ff8844',
        }).setOrigin(0.5).setDepth(100);
    }

    _activatePhoenixRevive() {
        // Consume from inventory
        const data = SaveManager.load();
        data.phoenixCount = Math.max(0, (data.phoenixCount || 0) - 1);
        SaveManager.save(data);

        // Revive the player
        this.player.isDead = false;
        this.player.hp = this.player.maxHp;
        this.player.isInvincible = true;
        this.player.sprite.setAlpha(1);
        this.player.sprite.clearTint();
        if (this.player.glow) this.player.glow.setAlpha(0.3);

        // Reset time scale from death slow-mo
        this.time.timeScale = 1;

        // Brief invincibility after revive
        this.time.delayedCall(2000, () => {
            if (this.player && !this.player.isDead) {
                this.player.isInvincible = false;
            }
        });

        // Orange flash
        this.cameras.main.flash(500, 255, 100, 0, false);

        // HUD indicator
        const phoenixText = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 40, '\uD83D\uDD25 PHOENIX REVIVE!', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '24px', fontStyle: 'bold', color: '#ff8800',
            stroke: '#4a2a00', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(200);

        this.tweens.add({
            targets: phoenixText, alpha: 0, y: CONFIG.HEIGHT / 2 - 80,
            duration: 1500, ease: 'Sine.easeIn',
            onComplete: () => phoenixText.destroy(),
        });

        // Disable button visual
        if (this.phoenixBtn) { this.phoenixBtn.setTexture('btn_phoenix_off'); }
        if (this.phoenixLabel) this.phoenixLabel.setText('USED');

        // Update hearts HUD
        this._updateHUD_hearts();
    }

    _updateHUD_hearts() {
        if (!this.heartIcons) return;
        for (let i = 0; i < this.heartIcons.length; i++) {
            this.heartIcons[i].setTexture(i < this.player.hp ? 'heart_full' : 'heart_empty');
        }
    }

    // ----------------------------------------------------------
    // LIGHTNING DASH ABILITY
    // ----------------------------------------------------------

    _createLightningButton() {
        const btnX = 35;
        const btnY = CONFIG.HEIGHT - 200;

        if (!this.hasLightning) { this.lightningBtn = null; return; }

        this.lightningBtn = this.add.image(btnX, btnY, 'btn_lightning')
            .setDepth(100).setScrollFactor(0)
            .setInteractive({ useHandCursor: true });

        this.lightningLabel = this.add.text(btnX, btnY + 26, 'L', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '10px', color: '#8a7a9a',
        }).setOrigin(0.5).setDepth(100);

        this.lightningBtn.on('pointerdown', () => this._activateLightning());
    }

    _activateLightning() {
        if (!this.hasLightning || this.lightningUsed || this.isGameOver) return;

        this.lightningUsed = true;

        const data = SaveManager.load();
        data.lightningCount = Math.max(0, (data.lightningCount || 0) - 1);
        SaveManager.save(data);

        // Warp forward 500m
        this.distancePixels += 500 * CONFIG.PIXELS_PER_METER;
        this.distanceMeters = Math.floor(this.distancePixels / CONFIG.PIXELS_PER_METER);

        // Clear all on-screen obstacles
        if (this.worldGen && this.worldGen.obstacleGroup) {
            this.worldGen.obstacleGroup.getChildren().forEach(obs => {
                if (obs.active) { obs.setActive(false).setVisible(false); obs.body.enable = false; }
            });
        }

        // Electric flash
        this.cameras.main.flash(400, 68, 220, 255, false);

        // Brief invincibility during dash
        this.player.isInvincible = true;
        this.time.delayedCall(1000, () => {
            if (this.player && !this.player.isDead) this.player.isInvincible = false;
        });

        // HUD indicator
        const dashText = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 40, '\u26A1 LIGHTNING DASH!', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '22px', fontStyle: 'bold', color: '#44ddff',
            stroke: '#0a2a4a', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(200);

        this.tweens.add({
            targets: dashText, alpha: 0, y: CONFIG.HEIGHT / 2 - 80,
            duration: 1200, ease: 'Sine.easeIn',
            onComplete: () => dashText.destroy(),
        });

        // Disable button
        if (this.lightningBtn) { this.lightningBtn.setTexture('btn_lightning_off'); this.lightningBtn.removeInteractive(); }
        if (this.lightningLabel) this.lightningLabel.setText('USED');
    }

    // ----------------------------------------------------------
    // TRIPLE JUMP ABILITY
    // ----------------------------------------------------------

    _createTripleJumpButton() {
        const btnX = 35;
        const btnY = CONFIG.HEIGHT - 250;

        if (!this.hasTripleJump) { this.tripleJumpBtn = null; return; }

        this.tripleJumpBtn = this.add.image(btnX, btnY, 'btn_triple_jump')
            .setDepth(100).setScrollFactor(0)
            .setInteractive({ useHandCursor: true });

        this.tripleJumpLabel = this.add.text(btnX, btnY + 26, 'J', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '10px', color: '#8a7a9a',
        }).setOrigin(0.5).setDepth(100);

        this.tripleJumpTimerText = this.add.text(btnX, btnY, '', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '13px', fontStyle: 'bold', color: '#44ff88',
        }).setOrigin(0.5).setDepth(101).setVisible(false);

        this.tripleJumpBtn.on('pointerdown', () => this._activateTripleJump());
    }

    _activateTripleJump() {
        if (!this.hasTripleJump || this.tripleJumpUsed || this.tripleJumpActive || this.isGameOver) return;

        this.tripleJumpActive = true;
        this.tripleJumpUsed = true;
        this.tripleJumpRemaining = this.tripleJumpDuration;

        const data = SaveManager.load();
        data.tripleJumpCount = Math.max(0, (data.tripleJumpCount || 0) - 1);
        SaveManager.save(data);

        this.cameras.main.flash(300, 40, 255, 130, false);

        if (this.tripleJumpTimerText) this.tripleJumpTimerText.setVisible(true);

        this.tripleJumpHudText = this.add.text(CONFIG.WIDTH / 2, 150, '\u2B06 TRIPLE JUMP', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '14px', fontStyle: 'bold', color: '#44ff88',
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: this.tripleJumpHudText, alpha: 0.5,
            duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
    }

    _endTripleJump() {
        this.tripleJumpActive = false;
        this.tripleJumpRemaining = 0;

        if (this.tripleJumpHudText) { this.tripleJumpHudText.destroy(); this.tripleJumpHudText = null; }
        if (this.tripleJumpBtn) { this.tripleJumpBtn.setTexture('btn_triple_jump_off'); this.tripleJumpBtn.removeInteractive(); }
        if (this.tripleJumpTimerText) this.tripleJumpTimerText.setVisible(false);
        if (this.tripleJumpLabel) this.tripleJumpLabel.setText('USED');
    }

    _updateTripleJumpButton() {
        if (!this.tripleJumpTimerText) return;
        if (this.tripleJumpActive) {
            this.tripleJumpTimerText.setText(`${Math.ceil(this.tripleJumpRemaining / 1000)}s`);
        }
    }

    // ----------------------------------------------------------
    // ENDLESS BIOME CYCLING
    // ----------------------------------------------------------

    _checkBiomeCycle() {
        const newBiome = Math.floor(this.distanceMeters / this.biomeDistance) % 3;
        if (newBiome !== this.currentBiome && !this.biomeTransitioning) {
            this._transitionBiome(newBiome);
        }
    }

    _getBiomeConfig(biome) {
        // biome 0 = Cursed Forest (L1), 1 = Dragon's Keep (L2), 2 = Shadow Citadel (L3)
        const configs = [
            {
                bgColor: 0x0a0616,
                stars: { key: 'bg_stars', y: 0, h: CONFIG.HEIGHT, alpha: 1 },
                mountains: { key: 'bg_mountains', y: 200, h: 200, alpha: 0.6 },
                trees: { key: 'bg_trees', y: 220, h: 250, alpha: 0.45 },
                fog: { key: 'bg_fog', y: 300, h: 100, alpha: 0.5 },
                mist: null,
                platKey: 'platform',
                dotColor: 0x9b59b6,
                solidColor: 0x0a0616,
                soulTex: 'soul_shard',
                obstacleTable: OBSTACLE_TYPES,
                allKeys: ALL_OBSTACLE_KEYS,
                groundKeys: GROUND_OBSTACLE_KEYS,
                label: 'Cursed Forest',
            },
            {
                bgColor: 0x071a0a,
                stars: { key: 'bg2_canopy', y: 0, h: CONFIG.HEIGHT, alpha: 1 },
                mountains: { key: 'bg2_trees', y: 180, h: 250, alpha: 0.5 },
                trees: { key: 'bg2_trees', y: 190, h: 250, alpha: 0.7 },
                fog: { key: 'bg2_undergrowth', y: 340, h: 120, alpha: 0.6 },
                mist: { key: 'bg2_mist', y: 280, h: 100, alpha: 0.45 },
                platKey: 'platform2',
                dotColor: 0x44aa44,
                solidColor: 0x071a0a,
                soulTex: 'soul2_gem',
                obstacleTable: OBSTACLE_TYPES_L2,
                allKeys: ALL_OBSTACLE_KEYS_L2,
                groundKeys: GROUND_OBSTACLE_KEYS_L2,
                label: "Dragon's Keep",
            },
            {
                bgColor: 0x0e0a14,
                stars: { key: 'bg3_ceiling', y: 0, h: CONFIG.HEIGHT, alpha: 1 },
                mountains: { key: 'bg3_walls', y: 180, h: 250, alpha: 0.5 },
                trees: { key: 'bg3_walls', y: 190, h: 250, alpha: 0.7 },
                fog: { key: 'bg3_floor', y: 340, h: 120, alpha: 0.6 },
                mist: { key: 'bg3_dust', y: 280, h: 100, alpha: 0.4 },
                platKey: 'platform3',
                dotColor: 0xccaa33,
                solidColor: 0x0e0a14,
                soulTex: 'soul3_crystal',
                obstacleTable: OBSTACLE_TYPES_L3,
                allKeys: ALL_OBSTACLE_KEYS_L3,
                groundKeys: GROUND_OBSTACLE_KEYS_L3,
                label: 'Shadow Citadel',
            },
        ];
        return configs[biome];
    }

    _transitionBiome(newBiome) {
        this.biomeTransitioning = true;
        const bc = this._getBiomeConfig(newBiome);
        const fadeDur = 1200;

        // ---- Fade out old backgrounds ----
        const oldLayers = [this.bgStars, this.bgMountains, this.bgTrees, this.bgFog, this.bgMist].filter(Boolean);
        oldLayers.forEach(layer => {
            this.tweens.add({ targets: layer, alpha: 0, duration: fadeDur, ease: 'Sine.easeInOut' });
        });

        // ---- Create new background layers (start invisible) ----
        const newStars = this.add.tileSprite(0, bc.stars.y, CONFIG.WIDTH, bc.stars.h, bc.stars.key)
            .setOrigin(0, 0).setDepth(0).setAlpha(0);
        const newMountains = this.add.tileSprite(0, bc.mountains.y, CONFIG.WIDTH, bc.mountains.h, bc.mountains.key)
            .setOrigin(0, 0).setDepth(1).setAlpha(0);
        const newTrees = this.add.tileSprite(0, bc.trees.y, CONFIG.WIDTH, bc.trees.h, bc.trees.key)
            .setOrigin(0, 0).setDepth(2).setAlpha(0);
        const newFog = this.add.tileSprite(0, bc.fog.y, CONFIG.WIDTH, bc.fog.h, bc.fog.key)
            .setOrigin(0, 0).setDepth(3).setAlpha(0);
        let newMist = null;
        if (bc.mist) {
            newMist = this.add.tileSprite(0, bc.mist.y, CONFIG.WIDTH, bc.mist.h, bc.mist.key)
                .setOrigin(0, 0).setDepth(3).setAlpha(0);
        }

        // Copy tile position from old layers so scrolling is seamless
        newStars.tilePositionX = this.bgStars.tilePositionX;
        newMountains.tilePositionX = this.bgMountains.tilePositionX;
        newTrees.tilePositionX = this.bgTrees.tilePositionX;
        newFog.tilePositionX = this.bgFog.tilePositionX;
        if (newMist && this.bgMist) newMist.tilePositionX = this.bgMist.tilePositionX;

        // ---- Fade in new backgrounds ----
        this.tweens.add({ targets: newStars, alpha: bc.stars.alpha, duration: fadeDur, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: newMountains, alpha: bc.mountains.alpha, duration: fadeDur, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: newTrees, alpha: bc.trees.alpha, duration: fadeDur, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: newFog, alpha: bc.fog.alpha, duration: fadeDur, ease: 'Sine.easeInOut' });
        if (newMist) {
            this.tweens.add({ targets: newMist, alpha: bc.mist.alpha, duration: fadeDur, ease: 'Sine.easeInOut' });
        }

        // ---- Crossfade platforms ----
        this.platforms.forEach(p => {
            this.tweens.add({ targets: p, alpha: 0, duration: fadeDur, ease: 'Sine.easeInOut' });
        });
        const newPlatforms = [];
        CONFIG.LANES.forEach(laneY => {
            const plat = this.add.tileSprite(0, laneY, CONFIG.WIDTH, 16, bc.platKey)
                .setOrigin(0, 0).setDepth(4).setAlpha(0);
            plat.tilePositionX = this.platforms[0].tilePositionX;
            this.tweens.add({ targets: plat, alpha: 1, duration: fadeDur, ease: 'Sine.easeInOut' });
            newPlatforms.push(plat);
        });

        // ---- Crossfade lane fill ----
        if (this.laneFillGraphics) {
            this.tweens.add({ targets: this.laneFillGraphics, alpha: 0, duration: fadeDur, ease: 'Sine.easeInOut' });
        }
        const newFill = this.add.graphics().setDepth(3.5).setAlpha(0);
        const firstLane = CONFIG.LANES[0];
        newFill.fillStyle(bc.solidColor, 1);
        newFill.fillRect(0, firstLane, CONFIG.WIDTH, CONFIG.HEIGHT - firstLane);
        this.tweens.add({ targets: newFill, alpha: 1, duration: fadeDur, ease: 'Sine.easeInOut' });

        // ---- After fade, clean up old and swap refs ----
        this.time.delayedCall(fadeDur + 100, () => {
            oldLayers.forEach(l => l.destroy());
            this.platforms.forEach(p => p.destroy());
            if (this.laneFillGraphics) this.laneFillGraphics.destroy();

            this.bgStars = newStars;
            this.bgMountains = newMountains;
            this.bgTrees = newTrees;
            this.bgFog = newFog;
            this.bgMist = newMist;
            this.platforms = newPlatforms;
            this.laneFillGraphics = newFill;

            // Swap obstacle types in WorldGenerator
            this.worldGen.obstacleTable = bc.obstacleTable;
            this.worldGen.allKeys = bc.allKeys;
            this.worldGen.groundKeys = bc.groundKeys;
            this.worldGen.soulTexture = bc.soulTex;

            this.currentBiome = newBiome;
            this.biomeTransitioning = false;

            // Update biome label
            if (this.biomeLabel) {
                this.biomeLabel.setText('\u221e ENDLESS  \u2014  ' + bc.label);
            }
        });
    }

    // ----------------------------------------------------------
    // BOSS FIGHT
    // ----------------------------------------------------------

    _setupBoss() {
        // Dragon sprite on the right side
        this.bossDragon = this.add.image(CONFIG.WIDTH - 80, 140, 'boss_dragon')
            .setScale(2).setDepth(8);

        // Breathing animation
        this.tweens.add({
            targets: this.bossDragon,
            scaleX: 2.05,
            scaleY: 1.95,
            y: 135,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Fireball physics group
        this.fireballGroup = this.physics.add.group();

        // Collision: fireballs hit player
        this.physics.add.overlap(
            this.player.sprite,
            this.fireballGroup,
            this._onHitFireball,
            null,
            this
        );

        // Fireball timing
        this.lastFireballTime = 0;
        this.fireballInterval = 800; // ms between volleys
        this.fireballSpeed = 450;    // px/s
        this.lastFireballWasAllLanes = false; // prevent consecutive 3-lane volleys

        // Boss HUD label
        this.bossLabel = this.add.text(CONFIG.WIDTH / 2, 68, '\uD83D\uDD25 DRAGON LORD \uD83D\uDD25', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#ff6644',
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: this.bossLabel,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }

    _updateBoss(time, dt) {
        if (!this.fireballGroup) return;

        // Spawn fireballs at intervals
        if (time - this.lastFireballTime >= this.fireballInterval) {
            this._spawnFireball();
            this.lastFireballTime = time;

            // Increase difficulty over time: faster fireballs, shorter intervals
            const progress = this.distanceMeters / this.levelConfig.distance;
            this.fireballInterval = Math.max(350, 800 - progress * 400);
            this.fireballSpeed = 450 + progress * 200;
        }

        // Move fireballs left and recycle off-screen ones
        this.fireballGroup.getChildren().forEach(fb => {
            if (!fb.active) return;
            fb.x -= this.fireballSpeed * dt;
            // Slight vertical wobble
            fb.y = fb.baseY + Math.sin(fb.x * 0.05) * 4;
            if (fb.x < -30) {
                fb.setActive(false).setVisible(false);
                fb.body.enable = false;
            }
        });

        // Dragon mouth flash when shooting
        if (time - this.lastFireballTime < 100) {
            this.bossDragon.setTint(0xffaa44);
        } else {
            this.bossDragon.clearTint();
        }
    }

    _spawnFireball() {
        // Random pattern: 1 fireball or 2 fireballs (never all 3 lanes)
        const r = Math.random();

        let lanesToFire;
        if (r < 0.45) {
            // Single fireball
            lanesToFire = [Phaser.Math.Between(0, 2)];
        } else {
            // Two fireballs — pick 2 random lanes
            const all = [0, 1, 2];
            const skip = Phaser.Math.Between(0, 2);
            lanesToFire = all.filter(l => l !== skip);
        }

        lanesToFire.forEach((lane, i) => {
            const laneY = CONFIG.LANES[lane] - 12;
            const startX = CONFIG.WIDTH + 20 + i * 60; // stagger slightly

            // Reuse or create
            let fb = this.fireballGroup.getFirstDead(false);
            if (!fb) {
                fb = this.fireballGroup.create(startX, laneY, 'fireball');
                fb.setDepth(7);
                fb.body.setSize(16, 16);
                fb.body.setOffset(4, 4);
            } else {
                fb.setPosition(startX, laneY);
                fb.setActive(true).setVisible(true);
                fb.body.enable = true;
            }
            fb.baseY = laneY;
        });

        // Camera micro-shake for impact feel
        this.cameras.main.shake(80, 0.003);
    }

    _onHitFireball(playerSprite, fireballSprite) {
        if (!fireballSprite.active) return;
        const player = playerSprite.playerRef;
        if (!player || player.isDead || player.isInvincible) return;
        if (this.shadowCloakActive) return;

        // Destroy the fireball
        fireballSprite.setActive(false).setVisible(false);
        fireballSprite.body.enable = false;

        // Damage player
        player.takeDamage();

        // Explosion particles
        if (this.damageEmitter) {
            this.damageEmitter.setPosition(fireballSprite.x, fireballSprite.y);
            this.damageEmitter.explode(10);
        }
    }

    // ----------------------------------------------------------
    // GAME OVER
    // ----------------------------------------------------------

    _triggerLevelComplete() {
        this.isGameOver = true;

        // Slow-mo celebration
        this.time.timeScale = 0.5;

        // Flash the distance text gold
        this.distanceText.setColor('#ffcc00');
        this.tweens.add({
            targets: this.distanceText,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 300,
            yoyo: true,
            ease: 'Power2',
        });

        this.time.delayedCall(1200, () => {
            this.time.timeScale = 1;

            const completeData = {
                level: this.levelConfig.level,
                levelIndex: this.levelIndex,
                distance: this.distanceMeters,
                souls: this.soulsCollected,
                enemies: this.enemiesDodged,
                isHardMode: this.isHardMode,
                isInsaneMode: this.isInsaneMode,
            };

            // Boss kill cutscene before victory screen
            if (this.isBossLevel) {
                this.scene.start('BossVictory', completeData);
            } else {
                this.scene.start('LevelComplete', completeData);
            }
        });
    }

    _triggerGameOver() {
        this.isGameOver = true;

        // Save run data
        const isNew = SaveManager.submitRun(this.distanceMeters, this.soulsCollected);

        // Delay transition for death animation
        this.time.delayedCall(1200, () => {
            this.scene.start('GameOver', {
                distance: this.distanceMeters,
                souls: this.soulsCollected,
                enemies: this.enemiesDodged,
                isNewHighScore: isNew,
                levelIndex: this.levelIndex,
                isEndless: this.isEndless,
                isHardMode: this.isHardMode,
                isInsaneMode: this.isInsaneMode,
            });
        });
    }

    // ----------------------------------------------------------
    // CLEANUP
    // ----------------------------------------------------------

    shutdown() {
        if (this.player) this.player.destroy();
        if (this.worldGen) this.worldGen.destroy();
    }
}
