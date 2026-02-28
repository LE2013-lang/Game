// ============================================================
// Player Entity — Phantom Knight
// ============================================================

class Player {

    constructor(scene) {
        this.scene = scene;
        this.currentLane = CONFIG.DEFAULT_LANE;
        this.hp = CONFIG.MAX_HP;
        this.maxHp = CONFIG.MAX_HP;

        // State flags
        this.isOnGround = true;
        this.jumpCount = 0;
        this.isSliding = false;
        this.isChangingLane = false;
        this.isInvincible = false;
        this.isDead = false;

        // Manual Y physics
        this.velocityY = 0;

        // Slide timer reference
        this._slideTimer = null;

        // Create the sprite using Arcade Physics (for overlap detection)
        this.sprite = scene.physics.add.sprite(
            CONFIG.PLAYER_X,
            CONFIG.LANES[this.currentLane],
            'player'
        );
        this.sprite.setOrigin(0.5, 1);
        this.sprite.body.allowGravity = false;
        this.sprite.setDepth(10);

        // Shrink the physics body a little for forgiving collisions
        this.sprite.body.setSize(CONFIG.PLAYER_WIDTH - 8, CONFIG.PLAYER_HEIGHT - 4);
        this.sprite.body.setOffset(4, 4);

        // Keep a back-reference so collision callbacks can access the Player
        this.sprite.playerRef = this;

        // Glow effect (additive blended sprite behind player)
        this.glow = scene.add.sprite(
            CONFIG.PLAYER_X,
            CONFIG.LANES[this.currentLane],
            'player_glow'
        );
        this.glow.setOrigin(0.5, 1);
        this.glow.setBlendMode(Phaser.BlendModes.ADD);
        this.glow.setAlpha(0.35);
        this.glow.setDepth(9);
    }

    // ---- UPDATE --------------------------------------------------

    update(time, delta) {
        if (this.isDead) return;

        const dt = delta / 1000;
        const groundY = CONFIG.LANES[this.currentLane];

        // Gravity / jump arc (only when airborne and not tweening between lanes)
        if (!this.isOnGround && !this.isChangingLane) {
            this.velocityY += CONFIG.GRAVITY * dt;
            this.sprite.y += this.velocityY * dt;

            if (this.sprite.y >= groundY) {
                this.sprite.y = groundY;
                this.velocityY = 0;
                this.isOnGround = true;
                this.jumpCount = 0;

                // Landing dust
                this._emitLandingDust();
            }
        }

        // Texture swap
        if (this.isSliding) {
            this.sprite.setTexture('player_slide');
        } else if (!this.isOnGround) {
            this.sprite.setTexture('player_jump');
        } else {
            this.sprite.setTexture('player');
        }

        // Physics body size (keep full height even while sliding
        // so ground obstacles still hit — only air obstacles are dodged
        // via the slidable check in _onHitObstacle)
        if (this.isSliding) {
            this.sprite.body.setSize(CONFIG.PLAYER_WIDTH + 4, CONFIG.PLAYER_HEIGHT - 4);
            this.sprite.body.setOffset(0, 4);
        } else {
            this.sprite.body.setSize(CONFIG.PLAYER_WIDTH - 8, CONFIG.PLAYER_HEIGHT - 4);
            this.sprite.body.setOffset(4, 4);
        }

        // Invincibility flash
        if (this.isInvincible) {
            this.sprite.alpha = Math.sin(time * 0.015) > 0 ? 1 : 0.25;
            this.glow.alpha = 0.1;
        } else {
            this.glow.alpha = 0.3 + Math.sin(time * 0.003) * 0.1;
        }

        // Sync glow position
        this.glow.setPosition(this.sprite.x, this.sprite.y);
    }

    // ---- ACTIONS -------------------------------------------------

    jump() {
        if (this.isDead || this.isChangingLane) return;
        if (this.isSliding) this.endSlide();

        if (this.jumpCount === 0) {
            this.velocityY = CONFIG.JUMP_VELOCITY;
            this.isOnGround = false;
            this.jumpCount = 1;
        } else if (this.jumpCount === 1) {
            this.velocityY = CONFIG.DOUBLE_JUMP_VELOCITY;
            this.jumpCount = 2;
            this._emitDoubleJumpParticle();
        }
    }

    slide() {
        if (this.isDead || !this.isOnGround || this.isSliding || this.isChangingLane) return;

        this.isSliding = true;

        // Auto-end slide after duration
        if (this._slideTimer) this._slideTimer.remove(false);
        this._slideTimer = this.scene.time.delayedCall(CONFIG.SLIDE_DURATION, () => {
            this.endSlide();
        });
    }

    endSlide() {
        if (!this.isSliding) return;
        this.isSliding = false;
        if (this._slideTimer) {
            this._slideTimer.remove(false);
            this._slideTimer = null;
        }
    }

    switchLane(dir) {  // -1 = up, +1 = down
        if (this.isDead || this.isChangingLane) return;

        const newLane = this.currentLane + dir;
        if (newLane < 0 || newLane >= CONFIG.LANES.length) return;

        if (this.isSliding) this.endSlide();
        this.currentLane = newLane;

        // If airborne, just update target lane — gravity handles the rest
        if (!this.isOnGround) return;

        this.isChangingLane = true;
        this.scene.tweens.add({
            targets: [this.sprite, this.glow],
            y: CONFIG.LANES[newLane],
            duration: CONFIG.LANE_SWITCH_DURATION,
            ease: 'Power2',
            onComplete: () => {
                this.isChangingLane = false;
            },
        });
    }

    // ---- DAMAGE / DEATH ------------------------------------------

    takeDamage() {
        if (this.isDead || this.isInvincible) return;

        this.hp--;
        this.isInvincible = true;

        // Screen shake
        this.scene.cameras.main.shake(180, 0.012);

        // Red flash
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(120, () => {
            if (!this.isDead) this.sprite.clearTint();
        });

        // Damage particles
        this._emitDamageParticles();

        // End invincibility after duration
        this.scene.time.delayedCall(CONFIG.INVINCIBILITY_DURATION, () => {
            this.isInvincible = false;
            if (!this.isDead) this.sprite.alpha = 1;
        });

        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        this.sprite.alpha = 1;
        this.sprite.clearTint();

        // Brief slow-mo
        this.scene.time.timeScale = 0.4;
        this.scene.time.delayedCall(600, () => {
            this.scene.time.timeScale = 1;
        });

        // Death animation
        this.scene.tweens.add({
            targets: [this.sprite, this.glow],
            alpha: 0,
            y: this.sprite.y + 40,
            duration: 700,
            ease: 'Power2',
        });
    }

    // ---- PARTICLE HELPERS ----------------------------------------

    _emitLandingDust() {
        if (!this.scene.dustEmitter) return;
        this.scene.dustEmitter.setPosition(this.sprite.x, this.sprite.y);
        this.scene.dustEmitter.explode(6);
    }

    _emitDoubleJumpParticle() {
        if (!this.scene.jumpEmitter) return;
        this.scene.jumpEmitter.setPosition(this.sprite.x, this.sprite.y - 30);
        this.scene.jumpEmitter.explode(8);
    }

    _emitDamageParticles() {
        if (!this.scene.damageEmitter) return;
        this.scene.damageEmitter.setPosition(this.sprite.x, this.sprite.y - 30);
        this.scene.damageEmitter.explode(15);
    }

    // ---- CLEANUP -------------------------------------------------

    destroy() {
        if (this._slideTimer) this._slideTimer.remove(false);
        this.sprite.destroy();
        this.glow.destroy();
    }
}
