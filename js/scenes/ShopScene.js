// ============================================================
// Shop Scene — purchase power-ups with gems
// ============================================================

class ShopScene extends Phaser.Scene {
    constructor() {
        super('Shop');
    }

    create() {
        const cx = CONFIG.WIDTH / 2;

        this.cameras.main.setBackgroundColor(0x050310);

        // Stars
        this.add.tileSprite(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT, 'bg_stars')
            .setOrigin(0, 0).setAlpha(0.4);

        // Title
        this.add.text(cx, 30, 'SHOP', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '30px',
            fontStyle: 'bold',
            color: '#ffcc00',
            stroke: '#4a3a00',
            strokeThickness: 4,
        }).setOrigin(0.5);

        // Decorative line
        const line = this.add.graphics();
        line.lineStyle(2, 0xffcc00, 0.4);
        line.lineBetween(cx - 80, 50, cx + 80, 50);

        // Current gems
        const save = SaveManager.load();
        this.gemsAvailable = save.totalSouls;

        this.add.image(cx - 60, 68, 'soul_shard').setScale(1.2);
        this.add.text(cx - 44, 68, `${this.gemsAvailable.toLocaleString()} Gems`, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#bb77ff',
        }).setOrigin(0, 0.5);

        // ============================================================
        // SHOP ITEMS — 2 columns, 4 rows
        // ============================================================
        const items = [
            { icon: 'icon_clock', name: 'Time Slower', stock: save.timeSlowerCount || 0,
              desc: 'Halves speed 8s', hint: 'Key: P', cost: 2000, saveKey: 'timeSlowerCount' },
            { icon: 'icon_magnet', name: 'Gem Magnet', stock: save.gemMagnetCount || 0,
              desc: 'Pull gems 20s', hint: 'Key: M', cost: 600, saveKey: 'gemMagnetCount' },
            { icon: 'icon_heal', name: 'Heal', stock: save.healCount || 0,
              desc: 'Restore 1 heart', hint: 'Key: H', cost: 1000, saveKey: 'healCount' },
            { icon: 'icon_cloak', name: 'Shadow Cloak', stock: save.shadowCloakCount || 0,
              desc: 'Invincible 5s', hint: 'Key: C', cost: 2200, saveKey: 'shadowCloakCount' },
            { icon: 'icon_double_gems', name: 'Double Gems', stock: save.doubleGemsCount || 0,
              desc: '2\u00d7 gems 15s', hint: 'Key: G', cost: 600, saveKey: 'doubleGemsCount' },
            { icon: 'icon_phoenix', name: 'Phoenix Feather', stock: save.phoenixCount || 0,
              desc: 'Auto-revive once', hint: 'Auto', cost: 5000, saveKey: 'phoenixCount' },
            { icon: 'icon_lightning', name: 'Lightning Dash', stock: save.lightningCount || 0,
              desc: 'Warp +500m', hint: 'Key: L', cost: 1800, saveKey: 'lightningCount' },
            { icon: 'icon_triple_jump', name: 'Triple Jump', stock: save.tripleJumpCount || 0,
              desc: '3rd jump 20s', hint: 'Key: J', cost: 1200, saveKey: 'tripleJumpCount' },
        ];

        const colW = 370;
        const panelW = 350;
        const panelH = 88;
        const startY = 88;
        const rowGap = 4;

        items.forEach((item, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const px = col === 0 ? cx - colW / 2 : cx + colW / 2;
            const py = startY + row * (panelH + rowGap);

            this._createItemPanel({
                x: px,
                y: py,
                w: panelW,
                h: panelH,
                ...item,
            });
        });

        // ---- Promo Code Box ----
        const codeY = startY + 4 * (panelH + rowGap) + 8;

        this.add.text(cx, codeY - 8, 'REDEEM CODE', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '10px',
            fontStyle: 'bold',
            color: '#8a7a9a',
        }).setOrigin(0.5);

        const inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.placeholder = 'Enter code...';
        inputEl.maxLength = 20;
        inputEl.style.cssText = `
            position: absolute;
            width: 160px;
            padding: 4px 8px;
            font-family: "Segoe UI", Arial, sans-serif;
            font-size: 12px;
            color: #e0d0f0;
            background: #1a0e2e;
            border: 2px solid #9b59b6;
            border-radius: 6px;
            outline: none;
            text-align: center;
            z-index: 10;
        `;
        const container = document.getElementById('game-container');
        container.style.position = 'relative';
        container.appendChild(inputEl);

        this._codeInput = inputEl;
        this._positionCodeInput = () => {
            const canvas = this.game.canvas;
            const rect = canvas.getBoundingClientRect();
            const scaleX = rect.width / CONFIG.WIDTH;
            const scaleY = rect.height / CONFIG.HEIGHT;
            inputEl.style.left = `${rect.left + (cx - 80) * scaleX}px`;
            inputEl.style.top = `${rect.top + codeY * scaleY}px`;
            inputEl.style.width = `${160 * scaleX}px`;
            inputEl.style.fontSize = `${12 * scaleY}px`;
        };
        this._positionCodeInput();
        window.addEventListener('resize', this._positionCodeInput);

        // Redeem button
        const redeemBg = this.add.graphics();
        redeemBg.fillStyle(0x3d2a50, 1);
        redeemBg.fillRoundedRect(cx + 95, codeY - 4, 65, 24, 6);
        redeemBg.lineStyle(1, 0x9b59b6, 0.6);
        redeemBg.strokeRoundedRect(cx + 95, codeY - 4, 65, 24, 6);

        const redeemTxt = this.add.text(cx + 127, codeY + 8, 'Redeem', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '11px',
            fontStyle: 'bold',
            color: '#bbaadd',
        }).setOrigin(0.5);

        const redeemZone = this.add.zone(cx + 127, codeY + 8, 65, 24)
            .setInteractive({ useHandCursor: true });

        this.codeFeedback = this.add.text(cx, codeY + 24, '', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '11px',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        const redeemCode = () => {
            const code = inputEl.value.trim().toLowerCase();
            if (code === 'g500') {
                const data = SaveManager.load();
                data.totalSouls += 1000;
                SaveManager.save(data);
                inputEl.value = '';
                this.codeFeedback.setText('+1,000 Gems!').setColor('#44ff88');
                this.time.delayedCall(800, () => this.scene.restart());
            } else {
                this.codeFeedback.setText('Invalid code').setColor('#ff4444');
            }
        };

        redeemZone.on('pointerover', () => redeemTxt.setColor('#ffffff'));
        redeemZone.on('pointerout', () => redeemTxt.setColor('#bbaadd'));
        redeemZone.on('pointerdown', redeemCode);

        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') redeemCode();
            e.stopPropagation();
        });

        // ---- Back button ----
        const backY = codeY + 48;
        const backBtn = this.add.image(cx, backY, 'button_bg')
            .setInteractive({ useHandCursor: true }).setScale(0.8, 0.8);
        const backTxt = this.add.text(cx, backY, '\u2190 BACK', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#e0d0f0',
        }).setOrigin(0.5);

        backBtn.on('pointerover', () => { backBtn.setTint(0xbb88ee); backTxt.setColor('#ffffff'); });
        backBtn.on('pointerout', () => { backBtn.clearTint(); backTxt.setColor('#e0d0f0'); });
        backBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(300, 5, 3, 16);
            this.time.delayedCall(350, () => this.scene.start('Menu'));
        });

        // Clean up HTML input when leaving
        this.events.on('shutdown', () => {
            window.removeEventListener('resize', this._positionCodeInput);
            if (this._codeInput && this._codeInput.parentNode) {
                this._codeInput.parentNode.removeChild(this._codeInput);
            }
        });

        // Fade in
        this.cameras.main.fadeIn(400, 5, 3, 16);

        // Keyboard shortcut
        this.input.keyboard.on('keydown-ESC', () => backBtn.emit('pointerdown'));
    }

    // ---- REUSABLE ITEM PANEL (compact, centered at x) ----------------

    _createItemPanel({ x, y, w, h, icon, name, stock, desc, hint, cost, saveKey }) {
        const halfW = w / 2;

        // Panel background
        const panel = this.add.graphics();
        panel.fillStyle(0x1a0e2e, 0.85);
        panel.fillRoundedRect(x - halfW, y, w, h, 8);
        panel.lineStyle(2, 0x9b59b6, 0.3);
        panel.strokeRoundedRect(x - halfW, y, w, h, 8);

        // Icon
        this.add.image(x - halfW + 28, y + 28, icon).setScale(1.6);

        // Name
        this.add.text(x - halfW + 52, y + 6, name, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '12px',
            fontStyle: 'bold',
            color: '#e0d0f0',
        }).setOrigin(0, 0);

        // Stock
        this.add.text(x + halfW - 8, y + 8, `\u00d7${stock}`, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '10px',
            fontStyle: 'bold',
            color: stock > 0 ? '#44ff88' : '#5a4a6a',
        }).setOrigin(1, 0);

        // Description
        this.add.text(x - halfW + 52, y + 22, desc, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '9px',
            color: '#8a7a9a',
        }).setOrigin(0, 0);

        // Hint
        this.add.text(x - halfW + 52, y + 36, hint, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '8px',
            fontStyle: 'italic',
            color: '#6a5a7a',
        }).setOrigin(0, 0);

        // Buy button
        const btnX = x;
        const btnY = y + h - 18;
        const canAfford = this.gemsAvailable >= cost;

        const buyBg = this.add.graphics();
        buyBg.fillStyle(canAfford ? 0x3d2a50 : 0x2a1a30, 1);
        buyBg.fillRoundedRect(btnX - 50, btnY - 11, 100, 22, 5);
        buyBg.lineStyle(1.5, canAfford ? 0xffcc00 : 0x5a4a6a, 0.5);
        buyBg.strokeRoundedRect(btnX - 50, btnY - 11, 100, 22, 5);

        const buyText = this.add.text(btnX, btnY, `\uD83D\uDCB0 ${cost.toLocaleString()}`, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '11px',
            fontStyle: 'bold',
            color: canAfford ? '#ffcc00' : '#5a4a6a',
        }).setOrigin(0.5);

        if (canAfford) {
            const hitZone = this.add.zone(btnX, btnY, 100, 22)
                .setInteractive({ useHandCursor: true });

            hitZone.on('pointerover', () => buyText.setColor('#ffffff'));
            hitZone.on('pointerout', () => buyText.setColor('#ffcc00'));
            hitZone.on('pointerdown', () => {
                const data = SaveManager.load();
                data.totalSouls -= cost;
                data[saveKey] = (data[saveKey] || 0) + 1;
                SaveManager.save(data);
                this.scene.restart();
            });
        }
    }
}
