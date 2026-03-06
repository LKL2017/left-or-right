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

        // 重新开始按钮 — draw centered at origin, position at button center
        const btnW = 160;
        const btnH = 50;
        const btnCX = cx;
        const btnCY = GAME_H * 0.58 + btnH / 2;

        const btnGfx = this.add.graphics();
        btnGfx.setPosition(btnCX, btnCY);
        this.drawBtnRect(btnGfx, btnW, btnH, COLORS.player);
        btnGfx.setAlpha(0);

        const btnText = this.add.text(btnCX, btnCY, '再来一次', {
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

        // 按钮点击区域 — 延迟激活，避免入场动画期间误触
        const btnZone = this.add.zone(btnCX, btnCY, btnW, btnH);
        this.time.delayedCall(900, () => btnZone.setInteractive());

        btnZone.on('pointerdown', () => {
            btnZone.disableInteractive();
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
            this.drawBtnRect(btnGfx, btnW, btnH, 0x6ab5ff);
        });
        btnZone.on('pointerout', () => {
            this.drawBtnRect(btnGfx, btnW, btnH, COLORS.player);
        });
    }

    drawBtnRect(gfx, w, h, color) {
        gfx.clear();
        gfx.fillStyle(color, 1);
        gfx.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
    }
}
