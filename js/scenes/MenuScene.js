// MenuScene.js — 菜单场景
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const cx = GAME_W / 2;

        // 背景
        this.cameras.main.setBackgroundColor(COLORS.bg);

        // 标题
        const title = this.add.text(cx, GAME_H * 0.3, '数量跑酷', {
            fontFamily: 'Arial',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#4a9eff',
        }).setOrigin(0.5).setAlpha(0);

        const subtitle = this.add.text(cx, GAME_H * 0.38, 'Left or Right', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#aaaaaa',
        }).setOrigin(0.5).setAlpha(0);

        // 说明
        const desc1 = this.add.text(cx, GAME_H * 0.5, '选择正确的门来增加人数', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#dddddd',
        }).setOrigin(0.5).setAlpha(0);

        const desc2 = this.add.text(cx, GAME_H * 0.56, '躲避敌人，保持人数 > 0', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#dddddd',
        }).setOrigin(0.5).setAlpha(0);

        // 开始按钮
        const btnX = cx - 80;
        const btnY = GAME_H * 0.68;
        const btnW = 160;
        const btnH = 50;

        const btnGfx = this.add.graphics();
        btnGfx.fillStyle(COLORS.player, 1);
        btnGfx.fillRoundedRect(btnX, btnY, btnW, btnH, 10);
        btnGfx.setAlpha(0);

        const btnText = this.add.text(cx, btnY + btnH / 2, '开始游戏', {
            fontFamily: 'Arial',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#ffffff',
        }).setOrigin(0.5).setAlpha(0);

        // 按钮点击区域
        const btnZone = this.add.zone(cx, btnY + btnH / 2, btnW, btnH).setInteractive();
        btnZone.on('pointerdown', () => {
            // 按下缩放效果
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

        // 操作提示
        const hint = this.add.text(cx, GAME_H * 0.85, '点击/触屏 或 A/D 键操控', {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#888888',
        }).setOrigin(0.5).setAlpha(0);

        // 入场动画：依次滑入 + 淡入
        const slideOffset = 30;
        const elements = [
            { target: title, delay: 0 },
            { target: subtitle, delay: 100 },
            { target: desc1, delay: 200 },
            { target: desc2, delay: 250 },
            { target: btnGfx, delay: 400 },
            { target: btnText, delay: 400 },
            { target: hint, delay: 500 },
        ];

        elements.forEach(({ target, delay }) => {
            const origY = target.y;
            target.y = origY + slideOffset;
            this.tweens.add({
                targets: target,
                y: origY,
                alpha: 1,
                duration: 500,
                delay: delay,
                ease: 'Power2',
            });
        });
    }
}
