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

        // 半透明黑色遮罩背景
        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.setAlpha(1);

        // 背景色
        const bg = this.add.graphics();
        bg.fillStyle(COLORS.bg, 1);
        bg.fillRect(0, 0, GAME_W, GAME_H);
        bg.fillStyle(0x000000, 0.6);
        bg.fillRect(0, 0, GAME_W, GAME_H);

        // 游戏结束文字
        this.add.text(cx, GAME_H * 0.33, '游戏结束', {
            fontFamily: 'Arial',
            fontSize: '40px',
            fontStyle: 'bold',
            color: '#ff4e4e',
        }).setOrigin(0.5);

        // 分数
        this.add.text(cx, GAME_H * 0.45, `最终距离: ${this.finalScore}`, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
        }).setOrigin(0.5);

        // 重新开始按钮
        const btnX = cx - 80;
        const btnY = GAME_H * 0.58;
        const btnW = 160;
        const btnH = 50;

        const btnGfx = this.add.graphics();
        btnGfx.fillStyle(COLORS.player, 1);
        btnGfx.fillRoundedRect(btnX, btnY, btnW, btnH, 10);

        this.add.text(cx, btnY + btnH / 2, '再来一次', {
            fontFamily: 'Arial',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#ffffff',
        }).setOrigin(0.5);

        // 按钮点击区域
        const btnZone = this.add.zone(cx, btnY + btnH / 2, btnW, btnH).setInteractive();
        btnZone.on('pointerdown', () => {
            this.scene.start('PlayScene');
        });
    }
}
