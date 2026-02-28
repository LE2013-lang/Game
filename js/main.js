// ============================================================
// Main — Phaser Game Configuration & Bootstrap
// ============================================================

window.addEventListener('load', () => {

    const config = {
        type: Phaser.AUTO,
        width: CONFIG.WIDTH,
        height: CONFIG.HEIGHT,
        parent: 'game-container',
        backgroundColor: '#0a0616',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },  // We manage gravity manually per entity
                debug: false,
            },
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: [BootScene, MenuScene, GameScene, GameOverScene, LevelCompleteScene, ShopScene, BossIntroScene, BossVictoryScene],
        pixelArt: true,
        roundPixels: true,
        input: {
            activePointers: 2,
        },
    };

    const game = new Phaser.Game(config);
});
