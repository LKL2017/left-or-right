// GameOverScene.js — 结束场景
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        const cx = GAME_W / 2;

        // 背景色
        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(300);

        const bg = this.add.graphics();
        bg.fillStyle(COLORS.bg, 1);
        bg.fillRect(0, 0, GAME_W, GAME_H);
        bg.fillStyle(0x000000, 0.6);
        bg.fillRect(0, 0, GAME_W, GAME_H);

        // 游戏结束文字 — scale 弹跳入场
        const gameOverText = this.add.text(cx, GAME_H * 0.33, '游戏结束', {
            fontFamily: 'Arial',
            fontSize: '40px',
            fontStyle: 'bold',
            color: '#ff4e4e',
        }).setOrigin(0.5).setScale(0);

        this.tweens.add({
            targets: gameOverText,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut',
        });

        // 分数 — 淡入
        const scoreText = this.add.text(cx, GAME_H * 0.45, `最终距离: ${this.finalScore}`, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: scoreText,
            alpha: 1,
            duration: 400,
            delay: 300,
            ease: 'Power2',
        });

        // 重新开始按钮
        const btnX = cx - 80;
        const btnY = GAME_H * 0.58;
        const btnW = 160;
        const btnH = 50;

        const btnGfx = this.add.graphics();
        btnGfx.fillStyle(COLORS.player, 1);
        btnGfx.fillRoundedRect(btnX, btnY, btnW, btnH, 10);
        btnGfx.setAlpha(0);

        const btnText = this.add.text(cx, btnY + btnH / 2, '再来一次', {
            fontFamily: 'Arial',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#ffffff',
        }).setOrigin(0.5).setAlpha(0);

        // 按钮入场
        this.tweens.add({
            targets: [btnGfx, btnText],
            alpha: 1,
            duration: 400,
            delay: 500,
            ease: 'Power2',
        });

        // 按钮点击区域
        const btnZone = this.add.zone(cx, btnY + btnH / 2, btnW, btnH).setInteractive();
        btnZone.on('pointerdown', () => {
            this.tweens.add({
                targets: [btnGfx, btnText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 80,
                yoyo: true,
                ease: 'Power2',
                onComplete: () => {
                    this.cameras.main.fadeOut(300, 0, 0, 0);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('PlayScene');
                    });
                },
            });
        });
        btnZone.on('pointerover', () => {
            btnGfx.clear();
            btnGfx.fillStyle(0x6ab5ff, 1);
            btnGfx.fillRoundedRect(btnX, btnY, btnW, btnH, 10);
        });
        btnZone.on('pointerout', () => {
            btnGfx.clear();
            btnGfx.fillStyle(COLORS.player, 1);
            btnGfx.fillRoundedRect(btnX, btnY, btnW, btnH, 10);
        });
    }
}
