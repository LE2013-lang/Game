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
        this.add.text(cx, 40, 'SHOP', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '34px',
            fontStyle: 'bold',
            color: '#ffcc00',
            stroke: '#4a3a00',
            strokeThickness: 5,
        }).setOrigin(0.5);

        // Decorative line
        const line = this.add.graphics();
        line.lineStyle(2, 0xffcc00, 0.4);
        line.lineBetween(cx - 80, 65, cx + 80, 65);

        // Current gems
        const save = SaveManager.load();
        this.gemsAvailable = save.totalSouls;

        this.add.image(cx - 60, 90, 'soul_shard').setScale(1.4);
        this.add.text(cx - 42, 90, `${this.gemsAvailable.toLocaleString()} Gems`, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#bb77ff',
        }).setOrigin(0, 0.5);

        // ============================================================
        // ITEM 1: Time Slower
        // ============================================================
        this._createItemPanel({
            y: 115,
            icon: 'icon_clock',
            name: 'Time Slower',
            stock: save.timeSlowerCount || 0,
            desc: 'Halves game speed for 8s.\nDistance still counts normally.',
            hint: 'Press P or tap \u23F1 in-game',
            cost: 2000,
            saveKey: 'timeSlowerCount',
        });

        // ============================================================
        // ITEM 2: Gem Magnet
        // ============================================================
        this._createItemPanel({
            y: 230,
            icon: 'icon_magnet',
            name: 'Gem Magnet',
            stock: save.gemMagnetCount || 0,
            desc: 'Pulls gems from all lanes\nto you for 20 seconds.',
            hint: 'Press M or tap \uD83E\uDDF2 in-game',
            cost: 800,
            saveKey: 'gemMagnetCount',
        });

        // ============================================================
        // ITEM 3: Heal
        // ============================================================
        this._createItemPanel({
            y: 345,
            icon: 'icon_heal',
            name: 'Heal',
            stock: save.healCount || 0,
            desc: 'Restores one heart.\nSingle use per run.',
            hint: 'Press H or tap \u2764 in-game',
            cost: 1000,
            saveKey: 'healCount',
        });

        // ---- Promo Code Box ----
        const codeY = 475;

        this.add.text(cx, codeY - 14, 'REDEEM CODE', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '11px',
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
            padding: 5px 8px;
            font-family: "Segoe UI", Arial, sans-serif;
            font-size: 13px;
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
            inputEl.style.fontSize = `${13 * scaleY}px`;
        };
        this._positionCodeInput();
        window.addEventListener('resize', this._positionCodeInput);

        // Redeem button
        const redeemBg = this.add.graphics();
        redeemBg.fillStyle(0x3d2a50, 1);
        redeemBg.fillRoundedRect(cx + 95, codeY - 4, 65, 26, 6);
        redeemBg.lineStyle(1, 0x9b59b6, 0.6);
        redeemBg.strokeRoundedRect(cx + 95, codeY - 4, 65, 26, 6);

        const redeemTxt = this.add.text(cx + 127, codeY + 9, 'Redeem', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '12px',
            fontStyle: 'bold',
            color: '#bbaadd',
        }).setOrigin(0.5);

        const redeemZone = this.add.zone(cx + 127, codeY + 9, 65, 26)
            .setInteractive({ useHandCursor: true });

        this.codeFeedback = this.add.text(cx, codeY + 30, '', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '12px',
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
        const backBtn = this.add.image(cx, 560, 'button_bg')
            .setInteractive({ useHandCursor: true });
        const backTxt = this.add.text(cx, 560, '\u2190 BACK', {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '18px',
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

    // ---- REUSABLE ITEM PANEL -------------------------------------

    _createItemPanel({ y, icon, name, stock, desc, hint, cost, saveKey }) {
        const cx = CONFIG.WIDTH / 2;

        // Panel background
        const panel = this.add.graphics();
        panel.fillStyle(0x1a0e2e, 0.85);
        panel.fillRoundedRect(cx - 180, y, 360, 105, 10);
        panel.lineStyle(2, 0x9b59b6, 0.4);
        panel.strokeRoundedRect(cx - 180, y, 360, 105, 10);

        // Icon
        this.add.image(cx - 130, y + 35, icon).setScale(2);

        // Name
        this.add.text(cx - 70, y + 8, name, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#e0d0f0',
        }).setOrigin(0, 0);

        // Stock
        this.add.text(cx + 80, y + 10, `Owned: ${stock}`, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '11px',
            fontStyle: 'bold',
            color: stock > 0 ? '#44ff88' : '#6a5a7a',
        }).setOrigin(0, 0);

        // Description
        this.add.text(cx - 70, y + 28, desc, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '10px',
            color: '#8a7a9a',
            lineSpacing: 2,
        }).setOrigin(0, 0);

        // Controls hint
        this.add.text(cx - 70, y + 56, hint, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '9px',
            fontStyle: 'italic',
            color: '#6a5a7a',
        }).setOrigin(0, 0);

        // Buy button
        const btnX = cx + 80;
        const btnY = y + 80;
        const canAfford = this.gemsAvailable >= cost;

        const buyBg = this.add.graphics();
        buyBg.fillStyle(canAfford ? 0x3d2a50 : 0x2a1a30, 1);
        buyBg.fillRoundedRect(btnX - 55, btnY - 14, 110, 28, 6);
        buyBg.lineStyle(2, canAfford ? 0xffcc00 : 0x5a4a6a, 0.6);
        buyBg.strokeRoundedRect(btnX - 55, btnY - 14, 110, 28, 6);

        const buyText = this.add.text(btnX, btnY, `\uD83D\uDCB0 ${cost.toLocaleString()}`, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '14px',
            fontStyle: 'bold',
            color: canAfford ? '#ffcc00' : '#5a4a6a',
        }).setOrigin(0.5);

        if (canAfford) {
            const hitZone = this.add.zone(btnX, btnY, 110, 28)
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
        } else {
            this.add.text(btnX, btnY + 18, 'Not enough gems', {
                fontFamily: '"Segoe UI", Arial, sans-serif',
                fontSize: '9px',
                color: '#5a3a3a',
            }).setOrigin(0.5);
        }
    }
}
