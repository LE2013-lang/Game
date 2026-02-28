// ============================================================
// Boot Scene — procedural texture generation & preload
// ============================================================

class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    create() {
        this._generateTextures();
        this.scene.start('Menu');
    }

    // ----------------------------------------------------------
    // Generate every texture the game needs (no external assets)
    // ----------------------------------------------------------
    _generateTextures() {
        this._texPlayer();
        this._texPlayerJump();
        this._texPlayerSlide();
        this._texPlayerGlow();
        this._texObstacles();
        this._texObstaclesL2();
        this._texObstaclesL3();
        this._texSoulShard();
        this._texSoulGem();
        this._texSoulCrystal();
        this._texHearts();
        this._texPlatform();
        this._texBackgrounds();
        this._texParticles();
        this._texButton();
        this._texMoon();
        this._texShopIcon();
        this._texClockIcon();
        this._texSlowBtn();
        this._texMagnetIcon();
        this._texMagnetBtn();
        this._texHealIcon();
        this._texHealBtn();
        this._texShadowCloakIcon();
        this._texShadowCloakBtn();
        this._texDoubleGemsIcon();
        this._texDoubleGemsBtn();
        this._texPhoenixIcon();
        this._texPhoenixBtn();
        this._texLightningIcon();
        this._texLightningBtn();
        this._texTripleJumpIcon();
        this._texTripleJumpBtn();
        this._texBoss();
    }

    // ---- PLAYER --------------------------------------------------

    _texPlayer() {
        const g = this.make.graphics({ add: false });
        // Cape
        g.fillStyle(0x6a0dad, 0.75);
        g.fillTriangle(28, 16, 40, 22, 36, 58);
        // Legs
        g.fillStyle(0x4a4a5a);
        g.fillRect(11, 42, 8, 18);
        g.fillRect(21, 42, 8, 18);
        // Boots
        g.fillStyle(0x3a3a4a);
        g.fillRect(9, 55, 12, 5);
        g.fillRect(19, 55, 12, 5);
        // Torso
        g.fillStyle(0x5a5a6a);
        g.fillRect(9, 15, 22, 28);
        // Armor highlights
        g.fillStyle(0x6a6a7a);
        g.fillRect(11, 18, 18, 3);
        g.fillRect(11, 30, 18, 2);
        // Shoulders
        g.fillStyle(0x5a5a6a);
        g.fillRect(4, 15, 8, 7);
        g.fillRect(28, 15, 8, 7);
        // Helmet
        g.fillStyle(0x6a6a7a);
        g.fillRect(10, 2, 20, 14);
        // Crest
        g.fillStyle(0x9b59b6);
        g.fillRect(18, 0, 4, 5);
        // Visor
        g.fillStyle(0xbb88ff);
        g.fillRect(13, 7, 14, 4);
        g.fillStyle(0xddbbff);
        g.fillRect(15, 8, 4, 2);
        g.fillRect(22, 8, 4, 2);
        // Sword blade
        g.fillStyle(0xccccdd);
        g.fillRect(34, 20, 3, 22);
        g.fillStyle(0xeeeeff);
        g.fillRect(35, 20, 1, 22);
        // Guard
        g.fillStyle(0x9b59b6);
        g.fillRect(32, 42, 7, 3);
        // Handle
        g.fillStyle(0x6a4a2a);
        g.fillRect(34, 45, 3, 7);

        g.generateTexture('player', 42, 60);
        g.destroy();
    }

    _texPlayerJump() {
        const g = this.make.graphics({ add: false });
        // Cape billowing up
        g.fillStyle(0x6a0dad, 0.7);
        g.fillTriangle(28, 20, 42, 12, 38, 55);
        // Legs tucked
        g.fillStyle(0x4a4a5a);
        g.fillRect(11, 38, 8, 14);
        g.fillRect(21, 40, 8, 12);
        // Boots
        g.fillStyle(0x3a3a4a);
        g.fillRect(9, 50, 12, 5);
        g.fillRect(19, 50, 12, 5);
        // Torso
        g.fillStyle(0x5a5a6a);
        g.fillRect(9, 12, 22, 27);
        // Shoulders
        g.fillStyle(0x5a5a6a);
        g.fillRect(4, 12, 8, 7);
        g.fillRect(28, 12, 8, 7);
        // Helmet
        g.fillStyle(0x6a6a7a);
        g.fillRect(10, 0, 20, 14);
        g.fillStyle(0x9b59b6);
        g.fillRect(18, 0, 4, 4);
        // Visor
        g.fillStyle(0xbb88ff);
        g.fillRect(13, 5, 14, 4);
        // Sword raised
        g.fillStyle(0xccccdd);
        g.fillRect(35, 8, 3, 22);
        g.fillStyle(0x9b59b6);
        g.fillRect(33, 30, 7, 3);
        g.fillStyle(0x6a4a2a);
        g.fillRect(35, 33, 3, 7);

        g.generateTexture('player_jump', 44, 56);
        g.destroy();
    }

    _texPlayerSlide() {
        const g = this.make.graphics({ add: false });
        // Horizontal sliding pose
        // Body
        g.fillStyle(0x5a5a6a);
        g.fillRect(4, 4, 38, 14);
        // Helmet
        g.fillStyle(0x6a6a7a);
        g.fillRect(0, 4, 14, 12);
        // Visor
        g.fillStyle(0xbb88ff);
        g.fillRect(2, 7, 8, 3);
        // Cape
        g.fillStyle(0x6a0dad, 0.6);
        g.fillRect(34, 0, 14, 18);
        // Legs trailing
        g.fillStyle(0x4a4a5a);
        g.fillRect(32, 14, 16, 6);
        // Sword flat
        g.fillStyle(0xccccdd);
        g.fillRect(0, 18, 24, 2);

        g.generateTexture('player_slide', 50, 24);
        g.destroy();
    }

    _texPlayerGlow() {
        // Soft glow sprite (same size as player, will be drawn additively)
        const g = this.make.graphics({ add: false });
        g.fillStyle(0x9b59b6, 0.3);
        g.fillRect(4, 0, 34, 60);
        g.fillStyle(0x9b59b6, 0.15);
        g.fillRect(0, 5, 42, 50);
        g.generateTexture('player_glow', 42, 60);
        g.destroy();
    }

    // ---- OBSTACLES -----------------------------------------------

    _texObstacles() {
        // LOG
        let g = this.make.graphics({ add: false });
        g.fillStyle(0x6b4226);
        g.fillRoundedRect(0, 4, 60, 22, 6);
        g.fillStyle(0x4a2e18);
        g.fillCircle(3, 15, 8);
        g.fillCircle(57, 15, 8);
        // Bark lines
        g.lineStyle(1, 0x543218);
        g.lineBetween(12, 8, 12, 24);
        g.lineBetween(30, 6, 30, 26);
        g.lineBetween(48, 8, 48, 24);
        g.generateTexture('obs_log', 60, 30);
        g.destroy();

        // THORN
        g = this.make.graphics({ add: false });
        g.fillStyle(0x1a5c32);
        g.fillRect(6, 0, 23, 75);
        g.fillStyle(0x2d8a4e);
        g.fillRect(9, 2, 17, 71);
        // Thorns
        g.fillStyle(0x44bb66);
        g.fillTriangle(0, 15, 9, 20, 9, 10);
        g.fillTriangle(35, 35, 26, 40, 26, 30);
        g.fillTriangle(0, 50, 9, 55, 9, 45);
        g.fillTriangle(35, 60, 26, 65, 26, 55);
        g.generateTexture('obs_thorn', 35, 75);
        g.destroy();

        // BRANCH
        g = this.make.graphics({ add: false });
        g.fillStyle(0x5a3a1a);
        g.fillRect(0, 6, 65, 12);
        g.fillStyle(0x7a5a3a);
        g.fillRect(0, 6, 65, 4);
        // Twigs
        g.fillStyle(0x4a2a10);
        g.fillTriangle(10, 0, 15, 6, 5, 6);
        g.fillTriangle(35, 0, 40, 6, 30, 6);
        g.fillTriangle(55, 0, 60, 6, 50, 6);
        g.fillTriangle(20, 25, 25, 18, 15, 18);
        g.fillTriangle(45, 25, 50, 18, 40, 18);
        g.generateTexture('obs_branch', 65, 25);
        g.destroy();

        // WOLF
        g = this.make.graphics({ add: false });
        // Body
        g.fillStyle(0x2a2a3a);
        g.fillRect(8, 10, 34, 18);
        // Head
        g.fillStyle(0x33334a);
        g.fillRect(0, 5, 16, 16);
        // Ears
        g.fillTriangle(2, 0, 6, 5, 10, 0);
        g.fillTriangle(10, 0, 14, 5, 16, 0);
        // Snout
        g.fillStyle(0x222238);
        g.fillRect(0, 14, 8, 6);
        // Eye
        g.fillStyle(0xff3333);
        g.fillRect(4, 8, 4, 3);
        // Legs
        g.fillStyle(0x22222f);
        g.fillRect(10, 28, 6, 12);
        g.fillRect(20, 28, 6, 12);
        g.fillRect(30, 28, 6, 12);
        g.fillRect(38, 28, 6, 12);
        // Tail
        g.fillStyle(0x2a2a3a);
        g.fillTriangle(42, 10, 50, 5, 50, 15);
        g.generateTexture('obs_wolf', 50, 40);
        g.destroy();
    }

    // ---- LEVEL 2 OBSTACLES (Dragon's Keep) ----------------------

    _texObstaclesL2() {
        let g;

        // LAVA BOULDER (replaces LOG — 60×30)
        g = this.make.graphics({ add: false });
        // Main rock body
        g.fillStyle(0x5a2a0a);
        g.fillRoundedRect(4, 2, 52, 24, 10);
        // Molten cracks
        g.fillStyle(0xff6600);
        g.fillRect(14, 6, 3, 16);
        g.fillRect(28, 4, 2, 18);
        g.fillRect(40, 8, 3, 12);
        // Glowing edges
        g.fillStyle(0xff4400, 0.6);
        g.fillRoundedRect(2, 0, 56, 6, 3);
        g.fillRoundedRect(2, 22, 56, 6, 3);
        // Ember highlights
        g.fillStyle(0xffaa22, 0.8);
        g.fillCircle(10, 10, 3);
        g.fillCircle(50, 18, 2);
        g.fillCircle(32, 8, 2);
        // Hot core glow
        g.fillStyle(0xffcc00, 0.4);
        g.fillCircle(30, 14, 8);
        g.generateTexture('obs2_boulder', 60, 30);
        g.destroy();

        // BONE SPIKE (replaces THORN — 35×75)
        g = this.make.graphics({ add: false });
        // Base bone cluster
        g.fillStyle(0xd4c8a0);
        g.fillRect(8, 50, 19, 25);
        // Main spike
        g.fillStyle(0xe8dcc0);
        g.fillTriangle(17, 0, 8, 55, 27, 55);
        // Side spikes
        g.fillStyle(0xd4c8a0);
        g.fillTriangle(4, 25, 0, 60, 12, 50);
        g.fillTriangle(31, 20, 35, 55, 23, 48);
        // Cracks
        g.lineStyle(1, 0x8a7a5a, 0.6);
        g.lineBetween(15, 10, 17, 40);
        g.lineBetween(20, 15, 18, 50);
        g.lineBetween(12, 30, 23, 45);
        // Blood/marrow highlights
        g.fillStyle(0xcc3333, 0.4);
        g.fillRect(14, 55, 7, 4);
        g.fillCircle(17, 62, 3);
        // Tip highlight
        g.fillStyle(0xfff8ee);
        g.fillTriangle(17, 0, 14, 8, 20, 8);
        g.generateTexture('obs2_spike', 35, 75);
        g.destroy();

        // HANGING CHAIN (replaces BRANCH — 65×25)
        g = this.make.graphics({ add: false });
        // Chain links across
        for (let i = 0; i < 8; i++) {
            const cx = 4 + i * 8;
            // Chain link (alternating orientation)
            g.fillStyle(0x6a6a7a);
            if (i % 2 === 0) {
                g.fillRect(cx, 4, 6, 14);
                g.fillStyle(0x4a4a5a);
                g.fillRect(cx + 2, 6, 2, 10);
            } else {
                g.fillRect(cx, 7, 6, 10);
                g.fillStyle(0x4a4a5a);
                g.fillRect(cx + 2, 9, 2, 6);
            }
        }
        // Hook on left
        g.fillStyle(0x8a8a9a);
        g.fillTriangle(0, 0, 6, 0, 3, 6);
        // Spiked weight on right
        g.fillStyle(0x5a5a6a);
        g.fillRect(56, 2, 9, 18);
        g.fillStyle(0x7a7a8a);
        g.fillTriangle(56, 6, 52, 11, 56, 16);
        g.fillTriangle(65, 6, 69, 11, 65, 16);
        // Rust highlights
        g.fillStyle(0x8a4a2a, 0.3);
        g.fillRect(12, 5, 4, 3);
        g.fillRect(36, 8, 4, 3);
        g.generateTexture('obs2_chain', 65, 25);
        g.destroy();

        // DRAKE — baby dragon (replaces WOLF — 50×40)
        g = this.make.graphics({ add: false });
        // Tail
        g.fillStyle(0x8a2222);
        g.fillTriangle(42, 16, 50, 10, 48, 22);
        // Body
        g.fillStyle(0xaa3333);
        g.fillRoundedRect(10, 12, 30, 16, 5);
        // Belly lighter
        g.fillStyle(0xcc6644);
        g.fillRect(14, 22, 22, 5);
        // Head
        g.fillStyle(0xbb3a3a);
        g.fillRoundedRect(0, 6, 16, 14, 4);
        // Snout
        g.fillStyle(0x992222);
        g.fillRect(0, 12, 6, 6);
        // Nostril flame
        g.fillStyle(0xff6600, 0.8);
        g.fillCircle(2, 14, 2);
        // Eyes
        g.fillStyle(0xffcc00);
        g.fillRect(4, 8, 4, 3);
        g.fillStyle(0x000000);
        g.fillRect(5, 9, 2, 2);
        // Horns
        g.fillStyle(0x664422);
        g.fillTriangle(6, 2, 8, 6, 10, 2);
        g.fillTriangle(12, 0, 13, 6, 16, 2);
        // Wings
        g.fillStyle(0xcc4444, 0.8);
        g.fillTriangle(16, 12, 26, 0, 34, 12);
        g.fillStyle(0xdd5555, 0.6);
        g.fillTriangle(20, 12, 26, 3, 30, 12);
        // Wing membrane lines
        g.lineStyle(1, 0x882222, 0.5);
        g.lineBetween(22, 12, 26, 2);
        g.lineBetween(28, 12, 26, 2);
        // Legs
        g.fillStyle(0x882222);
        g.fillRect(14, 28, 5, 10);
        g.fillRect(28, 28, 5, 10);
        // Claws
        g.fillStyle(0x664422);
        g.fillTriangle(13, 38, 16, 34, 21, 38);
        g.fillTriangle(27, 38, 30, 34, 35, 38);
        // Spine ridges
        g.fillStyle(0xdd5544);
        for (let i = 0; i < 4; i++) {
            const sx = 18 + i * 6;
            g.fillTriangle(sx, 12, sx + 3, 8, sx + 6, 12);
        }
        g.generateTexture('obs2_drake', 50, 40);
        g.destroy();
    }

    _texObstaclesL3() {
        let g;

        // BARREL (replaces LOG — 60×30)
        g = this.make.graphics({ add: false });
        // Barrel body
        g.fillStyle(0x5a3a1a);
        g.fillRoundedRect(4, 2, 52, 26, 6);
        // Metal bands
        g.fillStyle(0x6a6a7a);
        g.fillRect(8, 2, 4, 26);
        g.fillRect(28, 2, 4, 26);
        g.fillRect(48, 2, 4, 26);
        // Wood grain
        g.lineStyle(1, 0x3a2210, 0.4);
        g.lineBetween(14, 4, 14, 26);
        g.lineBetween(22, 4, 22, 26);
        g.lineBetween(36, 4, 36, 26);
        g.lineBetween(44, 4, 44, 26);
        // Highlight
        g.fillStyle(0x8a6a3a, 0.4);
        g.fillRoundedRect(12, 3, 14, 8, 3);
        g.generateTexture('obs3_barrel', 60, 30);
        g.destroy();

        // SWORD (replaces THORN — 35×75)
        g = this.make.graphics({ add: false });
        // Blade
        g.fillStyle(0xb0b8c8);
        g.fillRect(14, 0, 7, 48);
        // Blade edge highlights
        g.fillStyle(0xdde4ee, 0.6);
        g.fillRect(14, 0, 3, 48);
        // Blade tip
        g.fillStyle(0xc0c8d8);
        g.fillTriangle(14, 0, 21, 0, 17, -4);
        // Cross guard
        g.fillStyle(0xccaa33);
        g.fillRect(6, 48, 23, 5);
        g.fillStyle(0xffcc44, 0.5);
        g.fillRect(6, 48, 23, 2);
        // Grip
        g.fillStyle(0x3a2210);
        g.fillRect(15, 53, 5, 14);
        // Leather wrap
        g.fillStyle(0x5a3a1a);
        g.fillRect(15, 55, 5, 3);
        g.fillRect(15, 61, 5, 3);
        // Pommel
        g.fillStyle(0xccaa33);
        g.fillCircle(17, 70, 4);
        g.fillStyle(0xff3333, 0.6);
        g.fillCircle(17, 70, 2);
        g.generateTexture('obs3_sword', 35, 75);
        g.destroy();

        // CHANDELIER (replaces BRANCH — 65×25)
        g = this.make.graphics({ add: false });
        // Chain/rope to ceiling
        g.fillStyle(0x6a6a7a);
        g.fillRect(30, 0, 3, 6);
        // Main ring
        g.lineStyle(2, 0xccaa33, 0.8);
        g.strokeEllipse(32, 12, 56, 10);
        // Candle holders
        for (let i = 0; i < 5; i++) {
            const cx = 6 + i * 14;
            // Holder
            g.fillStyle(0xccaa33);
            g.fillRect(cx, 8, 4, 8);
            // Candle
            g.fillStyle(0xe8dcc0);
            g.fillRect(cx, 3, 4, 6);
            // Flame
            g.fillStyle(0xffaa22, 0.9);
            g.fillCircle(cx + 2, 2, 2);
            g.fillStyle(0xffee66, 0.7);
            g.fillCircle(cx + 2, 1, 1);
        }
        g.generateTexture('obs3_chandelier', 65, 25);
        g.destroy();

        // KNIGHT — enemy suit of armor (replaces WOLF — 50×40)
        g = this.make.graphics({ add: false });
        // Legs
        g.fillStyle(0x4a4a5a);
        g.fillRect(12, 28, 8, 12);
        g.fillRect(28, 28, 8, 12);
        // Boots
        g.fillStyle(0x3a3a4a);
        g.fillRect(10, 36, 12, 4);
        g.fillRect(26, 36, 12, 4);
        // Body armor
        g.fillStyle(0x5a5a6a);
        g.fillRoundedRect(10, 10, 28, 20, 4);
        // Chest plate highlight
        g.fillStyle(0x7a7a8a, 0.5);
        g.fillRoundedRect(14, 12, 20, 8, 3);
        // Helmet
        g.fillStyle(0x6a6a7a);
        g.fillRoundedRect(14, 0, 20, 14, 5);
        // Visor slit
        g.fillStyle(0xff3333, 0.8);
        g.fillRect(18, 5, 12, 3);
        // Helmet crest
        g.fillStyle(0xcc2222);
        g.fillTriangle(24, -2, 20, 2, 28, 2);
        // Shield (left side)
        g.fillStyle(0x4a4a5a);
        g.fillRoundedRect(0, 12, 12, 16, 3);
        g.fillStyle(0xccaa33);
        g.fillRect(3, 14, 6, 1);
        g.fillRect(5, 15, 2, 10);
        // Sword (right side)
        g.fillStyle(0xb0b8c8);
        g.fillRect(40, 4, 3, 26);
        g.fillStyle(0xccaa33);
        g.fillRect(38, 28, 7, 3);
        g.fillStyle(0x3a2210);
        g.fillRect(40, 31, 3, 6);
        g.generateTexture('obs3_knight', 50, 40);
        g.destroy();
    }

    // ---- COLLECTIBLES --------------------------------------------

    _texSoulShard() {
        const g = this.make.graphics({ add: false });
        // Outer glow
        g.fillStyle(0x9944cc, 0.3);
        g.fillCircle(8, 8, 8);
        // Diamond shape
        g.fillStyle(0xbb77ff);
        g.fillTriangle(8, 0, 16, 8, 8, 16);
        g.fillTriangle(8, 0, 0, 8, 8, 16);
        // Inner highlight
        g.fillStyle(0xddaaff);
        g.fillTriangle(8, 3, 12, 8, 8, 13);
        g.generateTexture('soul_shard', 16, 16);
        g.destroy();
    }

    _texSoulGem() {
        const g = this.make.graphics({ add: false });
        // Outer glow (fiery orange)
        g.fillStyle(0xcc6600, 0.3);
        g.fillCircle(8, 8, 8);
        // Diamond shape
        g.fillStyle(0xff8833);
        g.fillTriangle(8, 0, 16, 8, 8, 16);
        g.fillTriangle(8, 0, 0, 8, 8, 16);
        // Inner fire highlight
        g.fillStyle(0xffcc44);
        g.fillTriangle(8, 3, 12, 8, 8, 13);
        // Hot center
        g.fillStyle(0xffee88, 0.7);
        g.fillCircle(8, 8, 2);
        g.generateTexture('soul2_gem', 16, 16);
        g.destroy();
    }

    _texSoulCrystal() {
        const g = this.make.graphics({ add: false });
        // Outer glow (icy blue)
        g.fillStyle(0x4488cc, 0.3);
        g.fillCircle(8, 8, 8);
        // Diamond shape
        g.fillStyle(0x66bbff);
        g.fillTriangle(8, 0, 16, 8, 8, 16);
        g.fillTriangle(8, 0, 0, 8, 8, 16);
        // Inner highlight
        g.fillStyle(0xaaddff);
        g.fillTriangle(8, 3, 12, 8, 8, 13);
        // Sparkle center
        g.fillStyle(0xffffff, 0.8);
        g.fillCircle(8, 7, 2);
        g.generateTexture('soul3_crystal', 16, 16);
        g.destroy();
    }

    // ---- UI ELEMENTS ---------------------------------------------

    _texHearts() {
        // Full heart
        let g = this.make.graphics({ add: false });
        g.fillStyle(0xff4444);
        g.fillCircle(5, 5, 5);
        g.fillCircle(13, 5, 5);
        g.fillTriangle(0, 7, 18, 7, 9, 18);
        g.generateTexture('heart_full', 18, 18);
        g.destroy();

        // Empty heart
        g = this.make.graphics({ add: false });
        g.fillStyle(0x3a2020);
        g.fillCircle(5, 5, 5);
        g.fillCircle(13, 5, 5);
        g.fillTriangle(0, 7, 18, 7, 9, 18);
        g.generateTexture('heart_empty', 18, 18);
        g.destroy();
    }

    _texButton() {
        const g = this.make.graphics({ add: false });
        g.fillStyle(0x3d2a50);
        g.fillRoundedRect(0, 0, 200, 50, 8);
        g.fillStyle(0x9b59b6, 0.6);
        g.fillRoundedRect(2, 2, 196, 3, 2); // top highlight
        g.lineStyle(2, 0x9b59b6, 0.5);
        g.strokeRoundedRect(1, 1, 198, 48, 8);
        g.generateTexture('button_bg', 200, 50);
        g.destroy();
    }

    // ---- PLATFORMS -----------------------------------------------

    _texPlatform() {
        const g = this.make.graphics({ add: false });
        const w = 64, h = 16;
        // Base stone
        g.fillStyle(0x2a1a3a);
        g.fillRect(0, 0, w, h);
        // Top surface (lighter)
        g.fillStyle(0x3d2a50);
        g.fillRect(0, 0, w, 4);
        // Stone cracks
        g.lineStyle(1, 0x1a0e2e, 0.5);
        g.lineBetween(16, 4, 16, h);
        g.lineBetween(32, 4, 34, h);
        g.lineBetween(48, 4, 48, h);
        // Moss accents
        g.fillStyle(0x2d5a3e, 0.4);
        g.fillRect(4, 0, 8, 2);
        g.fillRect(36, 0, 6, 2);
        g.generateTexture('platform', w, h);
        g.destroy();
    }

    // ---- BACKGROUNDS ---------------------------------------------

    _texBackgrounds() {
        let g;

        // Stars layer (small dots on transparent-ish dark)
        g = this.make.graphics({ add: false });
        g.fillStyle(0x0a0616);
        g.fillRect(0, 0, 400, 300);
        for (let i = 0; i < 60; i++) {
            const sx = Phaser.Math.Between(0, 399);
            const sy = Phaser.Math.Between(0, 299);
            const brightness = Phaser.Math.Between(0x666666, 0xffffff);
            g.fillStyle(brightness, Phaser.Math.FloatBetween(0.3, 0.9));
            const size = Math.random() < 0.1 ? 2 : 1;
            g.fillRect(sx, sy, size, size);
        }
        g.generateTexture('bg_stars', 400, 300);
        g.destroy();

        // Mountains silhouette
        g = this.make.graphics({ add: false });
        g.fillStyle(0x1a0e2e);
        g.beginPath();
        g.moveTo(0, 200);
        g.lineTo(40, 100);
        g.lineTo(80, 140);
        g.lineTo(130, 60);
        g.lineTo(180, 110);
        g.lineTo(230, 40);
        g.lineTo(280, 90);
        g.lineTo(330, 50);
        g.lineTo(370, 120);
        g.lineTo(400, 80);
        g.lineTo(400, 200);
        g.closePath();
        g.fillPath();
        // Slightly lighter peaks
        g.fillStyle(0x221444, 0.5);
        g.beginPath();
        g.moveTo(0, 200);
        g.lineTo(60, 130);
        g.lineTo(120, 160);
        g.lineTo(200, 90);
        g.lineTo(300, 130);
        g.lineTo(360, 100);
        g.lineTo(400, 150);
        g.lineTo(400, 200);
        g.closePath();
        g.fillPath();
        g.generateTexture('bg_mountains', 400, 200);
        g.destroy();

        // Tree silhouettes
        g = this.make.graphics({ add: false });
        g.fillStyle(0x0d0820);
        // Tree shapes
        const treePositions = [20, 70, 130, 180, 240, 310, 360];
        treePositions.forEach(tx => {
            const th = Phaser.Math.Between(80, 180);
            const tw = Phaser.Math.Between(25, 50);
            const baseY = 250;
            // Trunk
            g.fillRect(tx + tw / 2 - 4, baseY - th / 3, 8, th / 3);
            // Canopy (triangle)
            g.fillTriangle(tx, baseY - th / 3, tx + tw / 2, baseY - th, tx + tw, baseY - th / 3);
            // Second layer
            g.fillTriangle(tx + 5, baseY - th / 2, tx + tw / 2, baseY - th - 20, tx + tw - 5, baseY - th / 2);
        });
        // Ground connection
        g.fillRect(0, 240, 400, 10);
        g.generateTexture('bg_trees', 400, 250);
        g.destroy();

        // Fog wisps
        g = this.make.graphics({ add: false });
        for (let i = 0; i < 8; i++) {
            const fx = Phaser.Math.Between(0, 350);
            const fy = Phaser.Math.Between(10, 70);
            const fw = Phaser.Math.Between(40, 120);
            g.fillStyle(0x9b59b6, Phaser.Math.FloatBetween(0.03, 0.08));
            g.fillEllipse(fx + fw / 2, fy + 10, fw, 20);
        }
        g.generateTexture('bg_fog', 400, 100);
        g.destroy();

        // ---- LEVEL 2: Dense Forest backgrounds ----
        this._texDenseForestBGs();

        // ---- LEVEL 3: Castle Interior backgrounds ----
        this._texCastleBGs();
    }

    _texDenseForestBGs() {
        let g;

        // Dense canopy sky — dark green tinted sky with leaf gaps
        g = this.make.graphics({ add: false });
        g.fillStyle(0x071a0a);
        g.fillRect(0, 0, 400, 300);
        // Scattered light beams filtering through canopy
        for (let i = 0; i < 12; i++) {
            const bx = Phaser.Math.Between(0, 399);
            const bw = Phaser.Math.Between(2, 6);
            g.fillStyle(0x88cc44, Phaser.Math.FloatBetween(0.02, 0.07));
            g.fillRect(bx, 0, bw, 300);
        }
        // Fireflies
        for (let i = 0; i < 30; i++) {
            const fx = Phaser.Math.Between(0, 399);
            const fy = Phaser.Math.Between(0, 299);
            const c = Math.random() < 0.5 ? 0xaaee44 : 0x66dd88;
            g.fillStyle(c, Phaser.Math.FloatBetween(0.3, 0.8));
            g.fillCircle(fx, fy, Math.random() < 0.15 ? 2 : 1);
        }
        g.generateTexture('bg2_canopy', 400, 300);
        g.destroy();

        // Dense tree layer — many overlapping trees, thick trunks
        g = this.make.graphics({ add: false });
        const densePositions = [0, 22, 50, 75, 100, 125, 148, 175, 200, 228, 255, 280, 305, 330, 355, 378];
        densePositions.forEach(tx => {
            const th = Phaser.Math.Between(120, 220);
            const tw = Phaser.Math.Between(30, 55);
            const baseY = 250;
            // Thick trunk
            g.fillStyle(0x2a1a0a);
            g.fillRect(tx + tw / 2 - 6, baseY - th / 2.5, 12, th / 2.5);
            // Roots
            g.fillStyle(0x1e1208);
            g.fillTriangle(tx + tw/2 - 14, baseY, tx + tw/2, baseY - th/4, tx + tw/2 + 14, baseY);
            // Canopy layers (big overlapping triangles)
            g.fillStyle(0x0d3318);
            g.fillTriangle(tx - 5, baseY - th / 3, tx + tw / 2, baseY - th, tx + tw + 5, baseY - th / 3);
            g.fillStyle(0x0a2a12);
            g.fillTriangle(tx, baseY - th / 2.2, tx + tw / 2, baseY - th - 15, tx + tw, baseY - th / 2.2);
            g.fillStyle(0x0e3d1a);
            g.fillTriangle(tx + 3, baseY - th / 2.8, tx + tw / 2, baseY - th + 10, tx + tw - 3, baseY - th / 2.8);
        });
        // Dense undergrowth
        g.fillStyle(0x0a2210);
        g.fillRect(0, 235, 400, 15);
        g.generateTexture('bg2_trees', 400, 250);
        g.destroy();

        // Bushes / undergrowth layer (foreground)
        g = this.make.graphics({ add: false });
        for (let i = 0; i < 14; i++) {
            const bx = Phaser.Math.Between(0, 380);
            const bw = Phaser.Math.Between(30, 70);
            const bh = Phaser.Math.Between(15, 35);
            const shade = Phaser.Math.Between(0x0a2a10, 0x1a4a20);
            g.fillStyle(shade, 0.7);
            g.fillEllipse(bx + bw / 2, 120 - bh / 2, bw, bh);
        }
        // Ferns
        for (let i = 0; i < 10; i++) {
            const fx = Phaser.Math.Between(0, 390);
            g.fillStyle(0x1a5a28, 0.5);
            g.fillTriangle(fx, 120, fx + 6, 90, fx + 12, 120);
        }
        g.generateTexture('bg2_undergrowth', 400, 120);
        g.destroy();

        // Green fog / mist
        g = this.make.graphics({ add: false });
        for (let i = 0; i < 10; i++) {
            const fx = Phaser.Math.Between(0, 350);
            const fy = Phaser.Math.Between(10, 70);
            const fw = Phaser.Math.Between(50, 140);
            g.fillStyle(0x22aa44, Phaser.Math.FloatBetween(0.03, 0.08));
            g.fillEllipse(fx + fw / 2, fy + 10, fw, 24);
        }
        g.generateTexture('bg2_mist', 400, 100);
        g.destroy();

        // Dense forest platform
        g = this.make.graphics({ add: false });
        const w = 64, h = 16;
        g.fillStyle(0x1a3a1a);
        g.fillRect(0, 0, w, h);
        g.fillStyle(0x2a5a2a);
        g.fillRect(0, 0, w, 4);
        // Moss
        g.fillStyle(0x3a7a3a, 0.6);
        g.fillRect(4, 0, 12, 3);
        g.fillRect(28, 0, 10, 3);
        g.fillRect(48, 0, 8, 2);
        // Root lines
        g.lineStyle(1, 0x0e2a0e, 0.4);
        g.lineBetween(16, 4, 18, h);
        g.lineBetween(32, 4, 30, h);
        g.lineBetween(48, 4, 50, h);
        g.generateTexture('platform2', w, h);
        g.destroy();
    }

    _texCastleBGs() {
        let g;

        // Castle ceiling — dark stone with cracks and torch glow spots
        g = this.make.graphics({ add: false });
        g.fillStyle(0x0e0a14);
        g.fillRect(0, 0, 400, 300);
        // Stone block pattern
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 8; col++) {
                const bx = col * 52 + (row % 2) * 26;
                const by = row * 32;
                const shade = Phaser.Math.Between(0x0c0818, 0x14101e);
                g.fillStyle(shade, 0.5);
                g.fillRect(bx + 1, by + 1, 50, 30);
            }
        }
        // Mortar lines
        for (let row = 0; row <= 10; row++) {
            g.lineStyle(1, 0x1a1424, 0.4);
            g.lineBetween(0, row * 32, 400, row * 32);
        }
        // Torch glow spots on walls
        for (let i = 0; i < 6; i++) {
            const tx = Phaser.Math.Between(30, 370);
            const ty = Phaser.Math.Between(50, 250);
            g.fillStyle(0xffaa22, Phaser.Math.FloatBetween(0.02, 0.06));
            g.fillCircle(tx, ty, Phaser.Math.Between(20, 50));
        }
        // Cobwebs in corners
        g.lineStyle(1, 0x3a3444, 0.2);
        g.lineBetween(0, 0, 40, 30);
        g.lineBetween(0, 0, 30, 40);
        g.lineBetween(0, 0, 50, 15);
        g.lineBetween(400, 0, 360, 30);
        g.lineBetween(400, 0, 370, 40);
        g.generateTexture('bg3_ceiling', 400, 300);
        g.destroy();

        // Castle walls — pillars and arched windows (far layer)
        g = this.make.graphics({ add: false });
        // Base wall
        g.fillStyle(0x1a1424);
        g.fillRect(0, 0, 400, 250);
        // Stone pillars
        for (let i = 0; i < 5; i++) {
            const px = i * 100;
            g.fillStyle(0x22182e);
            g.fillRect(px, 0, 20, 250);
            // Pillar highlight
            g.fillStyle(0x2a2036, 0.6);
            g.fillRect(px + 2, 0, 6, 250);
            // Capital (top detail)
            g.fillStyle(0x2e2438);
            g.fillRect(px - 4, 0, 28, 12);
            g.fillRect(px - 2, 12, 24, 5);
        }
        // Arched windows between pillars
        for (let i = 0; i < 4; i++) {
            const wx = i * 100 + 35;
            // Window arch
            g.fillStyle(0x0a0610);
            g.fillRect(wx, 30, 30, 80);
            // Arch top
            g.fillStyle(0x0a0610);
            g.fillCircle(wx + 15, 30, 15);
            // Moonlight through window
            g.fillStyle(0x4444aa, 0.08);
            g.fillRect(wx + 2, 35, 26, 70);
            // Window frame
            g.lineStyle(1, 0x2a2036, 0.6);
            g.strokeRect(wx, 30, 30, 80);
            // Cross bar
            g.fillStyle(0x22182e);
            g.fillRect(wx + 13, 30, 4, 80);
            g.fillRect(wx, 60, 30, 4);
        }
        // Banner hangings
        for (let i = 0; i < 3; i++) {
            const bx = 70 + i * 130;
            g.fillStyle(0x6a1a1a, 0.5);
            g.fillRect(bx, 120, 16, 50);
            g.fillTriangle(bx, 170, bx + 16, 170, bx + 8, 185);
            // Banner emblem
            g.fillStyle(0xccaa33, 0.3);
            g.fillCircle(bx + 8, 140, 4);
        }
        g.generateTexture('bg3_walls', 400, 250);
        g.destroy();

        // Castle floor detail / carpet runner (foreground)
        g = this.make.graphics({ add: false });
        // Carpet
        g.fillStyle(0x4a1a1a, 0.4);
        g.fillRect(0, 0, 400, 120);
        // Carpet border
        g.fillStyle(0xccaa33, 0.15);
        g.fillRect(0, 0, 400, 4);
        g.fillRect(0, 116, 400, 4);
        // Carpet pattern
        for (let i = 0; i < 8; i++) {
            const px = i * 52 + 10;
            g.fillStyle(0x6a2a2a, 0.3);
            g.fillRect(px, 30, 30, 60);
            g.lineStyle(1, 0xccaa33, 0.1);
            g.strokeRect(px + 4, 34, 22, 52);
        }
        // Scattered debris
        for (let i = 0; i < 12; i++) {
            const dx = Phaser.Math.Between(0, 390);
            const dy = Phaser.Math.Between(5, 115);
            g.fillStyle(0x1a1424, 0.4);
            g.fillRect(dx, dy, Phaser.Math.Between(2, 5), Phaser.Math.Between(2, 4));
        }
        g.generateTexture('bg3_floor', 400, 120);
        g.destroy();

        // Castle dust / haze
        g = this.make.graphics({ add: false });
        for (let i = 0; i < 10; i++) {
            const fx = Phaser.Math.Between(0, 350);
            const fy = Phaser.Math.Between(10, 70);
            const fw = Phaser.Math.Between(50, 130);
            g.fillStyle(0x8877aa, Phaser.Math.FloatBetween(0.02, 0.06));
            g.fillEllipse(fx + fw / 2, fy + 10, fw, 22);
        }
        g.generateTexture('bg3_dust', 400, 100);
        g.destroy();

        // Castle platform — cobblestone
        g = this.make.graphics({ add: false });
        const w = 64, h = 16;
        g.fillStyle(0x1e1828);
        g.fillRect(0, 0, w, h);
        g.fillStyle(0x2a2234);
        g.fillRect(0, 0, w, 4);
        // Stone lines
        g.lineStyle(1, 0x14101e, 0.5);
        g.lineBetween(12, 0, 12, h);
        g.lineBetween(28, 0, 28, h);
        g.lineBetween(44, 0, 44, h);
        // Cracks
        g.lineStyle(1, 0x0e0a14, 0.3);
        g.lineBetween(20, 4, 22, h);
        g.lineBetween(50, 0, 48, 8);
        // Carpet strip
        g.fillStyle(0x4a1a1a, 0.3);
        g.fillRect(0, 0, w, 3);
        g.generateTexture('platform3', w, h);
        g.destroy();
    }

    // ---- PARTICLES -----------------------------------------------

    _texParticles() {
        // Generic white particle
        let g = this.make.graphics({ add: false });
        g.fillStyle(0xffffff);
        g.fillRect(0, 0, 4, 4);
        g.generateTexture('particle', 4, 4);
        g.destroy();

        // Purple soul particle
        g = this.make.graphics({ add: false });
        g.fillStyle(0xbb77ff);
        g.fillRect(0, 0, 4, 4);
        g.generateTexture('particle_purple', 4, 4);
        g.destroy();

        // Red damage particle
        g = this.make.graphics({ add: false });
        g.fillStyle(0xff4444);
        g.fillRect(0, 0, 4, 4);
        g.generateTexture('particle_red', 4, 4);
        g.destroy();

        // Dust particle
        g = this.make.graphics({ add: false });
        g.fillStyle(0x8a7a6a);
        g.fillRect(0, 0, 3, 3);
        g.generateTexture('particle_dust', 3, 3);
        g.destroy();
    }

    // ---- MOON ----------------------------------------------------

    _texMoon() {
        const g = this.make.graphics({ add: false });
        // Glow
        g.fillStyle(0xddddff, 0.15);
        g.fillCircle(25, 25, 25);
        g.fillStyle(0xddddff, 0.25);
        g.fillCircle(25, 25, 18);
        // Moon body
        g.fillStyle(0xccccee);
        g.fillCircle(25, 25, 14);
        // Craters
        g.fillStyle(0xaaaacc, 0.5);
        g.fillCircle(20, 22, 3);
        g.fillCircle(28, 18, 2);
        g.fillCircle(30, 28, 4);
        g.generateTexture('moon', 50, 50);
        g.destroy();
    }

    // ---- SHOP ICON -----------------------------------------------

    _texShopIcon() {
        const g = this.make.graphics({ add: false });
        // Bag body
        g.fillStyle(0xddaa44);
        g.fillRoundedRect(4, 12, 24, 20, 4);
        // Bag top / handle
        g.lineStyle(3, 0xddaa44, 1);
        g.beginPath();
        g.arc(16, 12, 8, Math.PI, 0, false);
        g.strokePath();
        // Gem symbol inside
        g.fillStyle(0x9b59b6);
        g.fillTriangle(16, 16, 22, 22, 16, 28);
        g.fillTriangle(16, 16, 10, 22, 16, 28);
        g.fillStyle(0xbb88ff);
        g.fillTriangle(16, 18, 19, 22, 16, 26);
        g.generateTexture('icon_shop', 32, 32);
        g.destroy();
    }

    // ---- CLOCK ICON (for shop display) ---------------------------

    _texClockIcon() {
        const g = this.make.graphics({ add: false });
        // Outer ring
        g.fillStyle(0x6a6a9a, 0.3);
        g.fillCircle(16, 16, 16);
        g.fillStyle(0x9b89cc);
        g.fillCircle(16, 16, 14);
        g.fillStyle(0x2a1a3a);
        g.fillCircle(16, 16, 12);
        // Hour marks
        g.fillStyle(0x9b89cc);
        g.fillRect(15, 5, 2, 3);
        g.fillRect(15, 24, 2, 3);
        g.fillRect(5, 15, 3, 2);
        g.fillRect(24, 15, 3, 2);
        // Hands
        g.lineStyle(2, 0xbbaadd, 1);
        g.lineBetween(16, 16, 16, 8);
        g.lineBetween(16, 16, 22, 14);
        // Center dot
        g.fillStyle(0xffcc00);
        g.fillCircle(16, 16, 2);
        g.generateTexture('icon_clock', 32, 32);
        g.destroy();
    }

    // ---- TIME-SLOW BUTTON (in-game) ------------------------------

    _texSlowBtn() {
        const g = this.make.graphics({ add: false });
        // Background circle
        g.fillStyle(0x2a1a3a, 0.9);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0x9b59b6, 0.8);
        g.strokeCircle(20, 20, 19);
        // Clock face
        g.fillStyle(0x9b89cc);
        g.fillCircle(20, 20, 14);
        g.fillStyle(0x1a0e2e);
        g.fillCircle(20, 20, 12);
        // Hands
        g.lineStyle(2, 0xbbaadd, 1);
        g.lineBetween(20, 20, 20, 10);
        g.lineBetween(20, 20, 26, 18);
        // Center
        g.fillStyle(0xffcc00);
        g.fillCircle(20, 20, 2);
        g.generateTexture('btn_slow', 40, 40);
        g.destroy();

        // Disabled version (greyed out)
        const g2 = this.make.graphics({ add: false });
        g2.fillStyle(0x1a1a1a, 0.7);
        g2.fillCircle(20, 20, 20);
        g2.lineStyle(2, 0x4a4a4a, 0.5);
        g2.strokeCircle(20, 20, 19);
        g2.fillStyle(0x4a4a5a);
        g2.fillCircle(20, 20, 14);
        g2.fillStyle(0x1a1a1a);
        g2.fillCircle(20, 20, 12);
        g2.lineStyle(2, 0x5a5a6a, 0.6);
        g2.lineBetween(20, 20, 20, 10);
        g2.lineBetween(20, 20, 26, 18);
        g2.fillStyle(0x6a6a6a);
        g2.fillCircle(20, 20, 2);
        g2.generateTexture('btn_slow_off', 40, 40);
        g2.destroy();
    }

    // ---- MAGNET ICON (for shop) ----------------------------------

    _texMagnetIcon() {
        const g = this.make.graphics({ add: false });
        // U-shape magnet body
        g.fillStyle(0xcc3333);
        g.fillRect(4, 2, 8, 22);   // left arm
        g.fillRect(20, 2, 8, 22);  // right arm
        g.fillRoundedRect(4, 18, 24, 10, 5); // bottom curve
        // Tips (silver poles)
        g.fillStyle(0xccccdd);
        g.fillRect(4, 0, 8, 6);
        g.fillRect(20, 0, 8, 6);
        // Magnetic field lines
        g.lineStyle(1, 0x88bbff, 0.5);
        g.beginPath();
        g.arc(16, 4, 20, Math.PI * 1.1, Math.PI * 1.9, false);
        g.strokePath();
        g.lineStyle(1, 0x88bbff, 0.3);
        g.beginPath();
        g.arc(16, 4, 26, Math.PI * 1.15, Math.PI * 1.85, false);
        g.strokePath();
        g.generateTexture('icon_magnet', 32, 32);
        g.destroy();
    }

    // ---- MAGNET BUTTON (in-game) ---------------------------------

    _texMagnetBtn() {
        // Active button
        let g = this.make.graphics({ add: false });
        g.fillStyle(0x2a1a3a, 0.9);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0xcc3333, 0.8);
        g.strokeCircle(20, 20, 19);
        // Magnet U-shape inside
        g.fillStyle(0xcc3333);
        g.fillRect(10, 8, 5, 14);
        g.fillRect(25, 8, 5, 14);
        g.fillRoundedRect(10, 18, 20, 8, 4);
        // Poles
        g.fillStyle(0xccccdd);
        g.fillRect(10, 6, 5, 5);
        g.fillRect(25, 6, 5, 5);
        // Field sparkle
        g.fillStyle(0x88bbff, 0.6);
        g.fillCircle(20, 4, 2);
        g.generateTexture('btn_magnet', 40, 40);
        g.destroy();

        // Disabled version
        g = this.make.graphics({ add: false });
        g.fillStyle(0x1a1a1a, 0.7);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0x4a4a4a, 0.5);
        g.strokeCircle(20, 20, 19);
        g.fillStyle(0x4a4a4a);
        g.fillRect(10, 8, 5, 14);
        g.fillRect(25, 8, 5, 14);
        g.fillRoundedRect(10, 18, 20, 8, 4);
        g.fillStyle(0x5a5a5a);
        g.fillRect(10, 6, 5, 5);
        g.fillRect(25, 6, 5, 5);
        g.generateTexture('btn_magnet_off', 40, 40);
        g.destroy();
    }

    // ---- HEAL ICON (for shop) ------------------------------------

    _texHealIcon() {
        const g = this.make.graphics({ add: false });
        // Heart shape
        g.fillStyle(0x44ff88);
        g.fillCircle(10, 10, 8);
        g.fillCircle(22, 10, 8);
        g.fillTriangle(2, 13, 30, 13, 16, 30);
        // Cross overlay
        g.fillStyle(0xffffff, 0.8);
        g.fillRect(13, 6, 6, 16);
        g.fillRect(8, 11, 16, 6);
        g.generateTexture('icon_heal', 32, 32);
        g.destroy();
    }

    // ---- HEAL BUTTON (in-game) -----------------------------------

    _texHealBtn() {
        // Active button
        let g = this.make.graphics({ add: false });
        g.fillStyle(0x1a2a1a, 0.9);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0x44ff88, 0.8);
        g.strokeCircle(20, 20, 19);
        // Heart
        g.fillStyle(0x44ff88);
        g.fillCircle(15, 14, 5);
        g.fillCircle(25, 14, 5);
        g.fillTriangle(10, 16, 30, 16, 20, 30);
        // Cross
        g.fillStyle(0xffffff, 0.7);
        g.fillRect(17, 10, 6, 14);
        g.fillRect(12, 15, 16, 4);
        g.generateTexture('btn_heal', 40, 40);
        g.destroy();

        // Disabled version
        g = this.make.graphics({ add: false });
        g.fillStyle(0x1a1a1a, 0.7);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0x4a4a4a, 0.5);
        g.strokeCircle(20, 20, 19);
        g.fillStyle(0x4a4a4a);
        g.fillCircle(15, 14, 5);
        g.fillCircle(25, 14, 5);
        g.fillTriangle(10, 16, 30, 16, 20, 30);
        g.fillStyle(0x5a5a5a, 0.5);
        g.fillRect(17, 10, 6, 14);
        g.fillRect(12, 15, 16, 4);
        g.generateTexture('btn_heal_off', 40, 40);
        g.destroy();
    }

    // ---- BOSS FIGHT TEXTURES ------------------------------------

    _texShadowCloakIcon() {
        const g = this.make.graphics({ add: false });
        // Dark cloak/shield shape
        g.fillStyle(0x8844cc);
        g.fillCircle(16, 16, 14);
        g.fillStyle(0x2a0a4a, 0.7);
        g.fillCircle(16, 16, 10);
        // Eye symbol
        g.fillStyle(0xcc88ff);
        g.fillCircle(16, 16, 4);
        g.fillStyle(0xffffff);
        g.fillCircle(16, 15, 2);
        g.generateTexture('icon_cloak', 32, 32);
        g.destroy();
    }

    _texShadowCloakBtn() {
        let g = this.make.graphics({ add: false });
        g.fillStyle(0x1a0a2a, 0.9);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0x8844cc, 0.8);
        g.strokeCircle(20, 20, 19);
        g.fillStyle(0x8844cc);
        g.fillCircle(20, 20, 10);
        g.fillStyle(0x2a0a4a, 0.7);
        g.fillCircle(20, 20, 7);
        g.fillStyle(0xcc88ff);
        g.fillCircle(20, 20, 3);
        g.generateTexture('btn_cloak', 40, 40);
        g.destroy();

        g = this.make.graphics({ add: false });
        g.fillStyle(0x1a1a1a, 0.7);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0x4a4a4a, 0.5);
        g.strokeCircle(20, 20, 19);
        g.fillStyle(0x4a4a4a);
        g.fillCircle(20, 20, 10);
        g.generateTexture('btn_cloak_off', 40, 40);
        g.destroy();
    }

    _texDoubleGemsIcon() {
        const g = this.make.graphics({ add: false });
        // Two gem shapes
        g.fillStyle(0xffcc00);
        g.fillTriangle(8, 6, 16, 22, 0, 22);
        g.fillStyle(0xffaa00);
        g.fillTriangle(24, 6, 32, 22, 16, 22);
        // x2 indicator
        g.fillStyle(0xffffff, 0.9);
        g.fillRect(10, 24, 12, 6);
        g.generateTexture('icon_double_gems', 32, 32);
        g.destroy();
    }

    _texDoubleGemsBtn() {
        let g = this.make.graphics({ add: false });
        g.fillStyle(0x2a2a0a, 0.9);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0xffcc00, 0.8);
        g.strokeCircle(20, 20, 19);
        g.fillStyle(0xffcc00);
        g.fillTriangle(14, 10, 22, 24, 6, 24);
        g.fillStyle(0xffaa00);
        g.fillTriangle(26, 10, 34, 24, 18, 24);
        g.generateTexture('btn_double_gems', 40, 40);
        g.destroy();

        g = this.make.graphics({ add: false });
        g.fillStyle(0x1a1a1a, 0.7);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0x4a4a4a, 0.5);
        g.strokeCircle(20, 20, 19);
        g.fillStyle(0x4a4a4a);
        g.fillTriangle(14, 10, 22, 24, 6, 24);
        g.fillTriangle(26, 10, 34, 24, 18, 24);
        g.generateTexture('btn_double_gems_off', 40, 40);
        g.destroy();
    }

    _texPhoenixIcon() {
        const g = this.make.graphics({ add: false });
        // Fire bird shape  
        g.fillStyle(0xff6600);
        g.fillCircle(16, 14, 8);
        g.fillTriangle(8, 14, 24, 14, 16, 30);
        // Wings
        g.fillStyle(0xffaa00);
        g.fillTriangle(2, 10, 12, 8, 8, 20);
        g.fillTriangle(30, 10, 20, 8, 24, 20);
        // Inner flame
        g.fillStyle(0xffee44);
        g.fillCircle(16, 14, 4);
        g.generateTexture('icon_phoenix', 32, 32);
        g.destroy();
    }

    _texPhoenixBtn() {
        let g = this.make.graphics({ add: false });
        g.fillStyle(0x2a1a0a, 0.9);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0xff6600, 0.8);
        g.strokeCircle(20, 20, 19);
        g.fillStyle(0xff6600);
        g.fillCircle(20, 16, 7);
        g.fillTriangle(13, 16, 27, 16, 20, 30);
        g.fillStyle(0xffee44);
        g.fillCircle(20, 16, 3);
        g.generateTexture('btn_phoenix', 40, 40);
        g.destroy();

        g = this.make.graphics({ add: false });
        g.fillStyle(0x1a1a1a, 0.7);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0x4a4a4a, 0.5);
        g.strokeCircle(20, 20, 19);
        g.fillStyle(0x4a4a4a);
        g.fillCircle(20, 16, 7);
        g.fillTriangle(13, 16, 27, 16, 20, 30);
        g.generateTexture('btn_phoenix_off', 40, 40);
        g.destroy();
    }

    _texLightningIcon() {
        const g = this.make.graphics({ add: false });
        // Lightning bolt
        g.fillStyle(0x44ddff);
        g.fillTriangle(18, 0, 8, 16, 16, 16);
        g.fillTriangle(14, 16, 24, 16, 14, 32);
        // Glow
        g.fillStyle(0xffffff, 0.5);
        g.fillTriangle(16, 4, 10, 14, 15, 14);
        g.generateTexture('icon_lightning', 32, 32);
        g.destroy();
    }

    _texLightningBtn() {
        let g = this.make.graphics({ add: false });
        g.fillStyle(0x0a1a2a, 0.9);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0x44ddff, 0.8);
        g.strokeCircle(20, 20, 19);
        g.fillStyle(0x44ddff);
        g.fillTriangle(22, 4, 12, 20, 20, 20);
        g.fillTriangle(18, 20, 28, 20, 18, 36);
        g.fillStyle(0xffffff, 0.5);
        g.fillTriangle(20, 8, 14, 18, 19, 18);
        g.generateTexture('btn_lightning', 40, 40);
        g.destroy();

        g = this.make.graphics({ add: false });
        g.fillStyle(0x1a1a1a, 0.7);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0x4a4a4a, 0.5);
        g.strokeCircle(20, 20, 19);
        g.fillStyle(0x4a4a4a);
        g.fillTriangle(22, 4, 12, 20, 20, 20);
        g.fillTriangle(18, 20, 28, 20, 18, 36);
        g.generateTexture('btn_lightning_off', 40, 40);
        g.destroy();
    }

    _texTripleJumpIcon() {
        const g = this.make.graphics({ add: false });
        // Three upward arrows
        g.fillStyle(0x44ff88);
        g.fillTriangle(16, 2, 8, 12, 24, 12);
        g.fillStyle(0x33dd77);
        g.fillTriangle(16, 10, 8, 20, 24, 20);
        g.fillStyle(0x22bb66);
        g.fillTriangle(16, 18, 8, 28, 24, 28);
        g.generateTexture('icon_triple_jump', 32, 32);
        g.destroy();
    }

    _texTripleJumpBtn() {
        let g = this.make.graphics({ add: false });
        g.fillStyle(0x0a2a1a, 0.9);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0x44ff88, 0.8);
        g.strokeCircle(20, 20, 19);
        g.fillStyle(0x44ff88);
        g.fillTriangle(20, 6, 12, 16, 28, 16);
        g.fillStyle(0x33dd77);
        g.fillTriangle(20, 14, 12, 24, 28, 24);
        g.fillStyle(0x22bb66);
        g.fillTriangle(20, 22, 12, 32, 28, 32);
        g.generateTexture('btn_triple_jump', 40, 40);
        g.destroy();

        g = this.make.graphics({ add: false });
        g.fillStyle(0x1a1a1a, 0.7);
        g.fillCircle(20, 20, 20);
        g.lineStyle(2, 0x4a4a4a, 0.5);
        g.strokeCircle(20, 20, 19);
        g.fillStyle(0x4a4a4a);
        g.fillTriangle(20, 6, 12, 16, 28, 16);
        g.fillTriangle(20, 14, 12, 24, 28, 24);
        g.fillTriangle(20, 22, 12, 32, 28, 32);
        g.generateTexture('btn_triple_jump_off', 40, 40);
        g.destroy();
    }

    _texBoss() {
        let g;

        // ---- MASSIVE DRAGON (120×160) ----
        g = this.make.graphics({ add: false });
        // Tail
        g.fillStyle(0x8a1111);
        g.fillTriangle(90, 80, 120, 50, 115, 100);
        g.fillTriangle(105, 55, 120, 30, 120, 70);
        // Tail spikes
        g.fillStyle(0x661111);
        g.fillTriangle(110, 45, 115, 35, 118, 50);
        // Body
        g.fillStyle(0xbb2222);
        g.fillRoundedRect(20, 50, 80, 60, 14);
        // Belly
        g.fillStyle(0xdd7744);
        g.fillRoundedRect(30, 80, 55, 25, 8);
        // Belly scales
        g.lineStyle(1, 0xcc5533, 0.4);
        for (let i = 0; i < 5; i++) {
            g.lineBetween(35 + i * 10, 82, 35 + i * 10, 103);
        }
        // Neck
        g.fillStyle(0xaa2020);
        g.fillRoundedRect(5, 35, 35, 40, 8);
        // Head
        g.fillStyle(0xcc2a2a);
        g.fillRoundedRect(0, 15, 40, 30, 8);
        // Jaw
        g.fillStyle(0x991818);
        g.fillRoundedRect(0, 32, 30, 12, 4);
        // Teeth
        g.fillStyle(0xffffff);
        for (let i = 0; i < 5; i++) {
            g.fillTriangle(4 + i * 6, 32, 7 + i * 6, 38, 1 + i * 6, 38);
        }
        // Eyes
        g.fillStyle(0xffcc00);
        g.fillRect(6, 20, 8, 6);
        g.fillRect(20, 20, 8, 6);
        g.fillStyle(0x000000);
        g.fillRect(8, 22, 4, 4);
        g.fillRect(22, 22, 4, 4);
        // Horns
        g.fillStyle(0x553311);
        g.fillTriangle(8, 15, 4, 0, 14, 15);
        g.fillTriangle(26, 15, 22, 2, 32, 15);
        // Crown spines
        g.fillStyle(0x772222);
        g.fillTriangle(14, 15, 18, 5, 22, 15);
        // Nostril fire
        g.fillStyle(0xff6600, 0.9);
        g.fillCircle(4, 35, 4);
        g.fillStyle(0xffaa00, 0.6);
        g.fillCircle(4, 35, 2);
        // Wings (large, behind body)
        g.fillStyle(0xdd3333, 0.7);
        g.fillTriangle(30, 50, 70, 0, 100, 50);
        g.fillTriangle(50, 50, 90, 5, 110, 50);
        // Wing membrane
        g.fillStyle(0xee5544, 0.4);
        g.fillTriangle(40, 50, 70, 8, 85, 50);
        g.fillTriangle(60, 50, 90, 10, 100, 50);
        // Wing veins
        g.lineStyle(1, 0x991111, 0.5);
        g.lineBetween(50, 50, 70, 5);
        g.lineBetween(65, 50, 80, 10);
        g.lineBetween(80, 50, 95, 12);
        // Legs
        g.fillStyle(0x881818);
        g.fillRect(30, 108, 12, 28);
        g.fillRect(65, 108, 12, 28);
        // Claws
        g.fillStyle(0x553311);
        g.fillTriangle(25, 136, 36, 128, 47, 136);
        g.fillTriangle(60, 136, 71, 128, 82, 136);
        // Spine ridges along back
        g.fillStyle(0xee4444);
        for (let i = 0; i < 7; i++) {
            const sx = 25 + i * 10;
            g.fillTriangle(sx, 50, sx + 5, 42, sx + 10, 50);
        }
        g.generateTexture('boss_dragon', 120, 140);
        g.destroy();

        // ---- FIREBALL (24×24) ----
        g = this.make.graphics({ add: false });
        // Outer glow
        g.fillStyle(0xff4400, 0.3);
        g.fillCircle(12, 12, 12);
        // Fire body
        g.fillStyle(0xff6600);
        g.fillCircle(12, 12, 8);
        // Inner hot core
        g.fillStyle(0xffaa22);
        g.fillCircle(12, 12, 5);
        // White-hot center
        g.fillStyle(0xffee88);
        g.fillCircle(12, 12, 2);
        // Trail sparks
        g.fillStyle(0xff4400, 0.6);
        g.fillCircle(20, 10, 3);
        g.fillCircle(22, 14, 2);
        g.fillCircle(19, 16, 2);
        g.generateTexture('fireball', 24, 24);
        g.destroy();

        // ---- BOSS ARENA BACKGROUND (lava cavern) ----
        // Cavern ceiling
        g = this.make.graphics({ add: false });
        g.fillStyle(0x1a0808);
        g.fillRect(0, 0, 400, 300);
        // Stalactites
        for (let i = 0; i < 10; i++) {
            const sx = Phaser.Math.Between(0, 390);
            const sh = Phaser.Math.Between(20, 60);
            g.fillStyle(0x2a1010, 0.8);
            g.fillTriangle(sx, 0, sx + 8, 0, sx + 4, sh);
        }
        // Lava glow from below
        for (let i = 0; i < 8; i++) {
            const gx = Phaser.Math.Between(0, 380);
            const gy = Phaser.Math.Between(150, 280);
            g.fillStyle(0xff4400, Phaser.Math.FloatBetween(0.02, 0.06));
            g.fillCircle(gx, gy, Phaser.Math.Between(30, 70));
        }
        g.generateTexture('bg4_cavern', 400, 300);
        g.destroy();

        // Cavern walls
        g = this.make.graphics({ add: false });
        g.fillStyle(0x1e0a0a);
        g.fillRect(0, 0, 400, 250);
        // Rock formations
        for (let i = 0; i < 6; i++) {
            const rx = i * 70;
            g.fillStyle(0x2a1212);
            g.fillRect(rx, 0, 25, 250);
            g.fillStyle(0x331818, 0.5);
            g.fillRect(rx + 3, 0, 8, 250);
        }
        // Lava flows
        for (let i = 0; i < 4; i++) {
            const lx = Phaser.Math.Between(30, 370);
            g.fillStyle(0xff3300, 0.15);
            g.fillRect(lx, 60, 4, 190);
            g.fillStyle(0xffaa00, 0.08);
            g.fillRect(lx + 1, 80, 2, 150);
        }
        g.generateTexture('bg4_walls', 400, 250);
        g.destroy();

        // Lava floor
        g = this.make.graphics({ add: false });
        g.fillStyle(0x3a0a0a);
        g.fillRect(0, 0, 400, 120);
        // Lava pools
        for (let i = 0; i < 10; i++) {
            const px = Phaser.Math.Between(0, 380);
            const py = Phaser.Math.Between(10, 100);
            const pw = Phaser.Math.Between(20, 50);
            g.fillStyle(0xff4400, Phaser.Math.FloatBetween(0.1, 0.3));
            g.fillEllipse(px, py, pw, 12);
            g.fillStyle(0xffaa00, Phaser.Math.FloatBetween(0.05, 0.15));
            g.fillEllipse(px, py, pw * 0.6, 6);
        }
        g.generateTexture('bg4_lava', 400, 120);
        g.destroy();

        // Heat haze
        g = this.make.graphics({ add: false });
        for (let i = 0; i < 10; i++) {
            const fx = Phaser.Math.Between(0, 350);
            const fy = Phaser.Math.Between(10, 70);
            const fw = Phaser.Math.Between(50, 120);
            g.fillStyle(0xff6622, Phaser.Math.FloatBetween(0.02, 0.05));
            g.fillEllipse(fx + fw / 2, fy + 10, fw, 20);
        }
        g.generateTexture('bg4_haze', 400, 100);
        g.destroy();

        // Boss arena platform
        g = this.make.graphics({ add: false });
        const w = 64, h = 16;
        g.fillStyle(0x2a0e0e);
        g.fillRect(0, 0, w, h);
        g.fillStyle(0x3a1818);
        g.fillRect(0, 0, w, 4);
        // Cracks with lava glow
        g.lineStyle(1, 0xff4400, 0.3);
        g.lineBetween(12, 0, 14, h);
        g.lineBetween(32, 4, 30, h);
        g.lineBetween(50, 0, 48, h);
        // Embers
        g.fillStyle(0xff6600, 0.4);
        g.fillCircle(8, 2, 1);
        g.fillCircle(40, 3, 1);
        g.generateTexture('platform4', w, h);
        g.destroy();
    }
}
