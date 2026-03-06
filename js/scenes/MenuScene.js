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
        this.add.text(cx, GAME_H * 0.3, '数量跑酷', {
            fontFamily: 'Arial',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#4a9eff',
        }).setOrigin(0.5);

        this.add.text(cx, GAME_H * 0.38, 'Left or Right', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#aaaaaa',
        }).setOrigin(0.5);

        // 说明
        this.add.text(cx, GAME_H * 0.5, '选择正确的门来增加人数', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#dddddd',
        }).setOrigin(0.5);

        this.add.text(cx, GAME_H * 0.56, '躲避敌人，保持人数 > 0', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#dddddd',
        }).setOrigin(0.5);

        // 开始按钮
        const btnX = cx - 80;
        const btnY = GAME_H * 0.68;
        const btnW = 160;
        const btnH = 50;

        const btnGfx = this.add.graphics();
        btnGfx.fillStyle(COLORS.player, 1);
        btnGfx.fillRoundedRect(btnX, btnY, btnW, btnH, 10);

        this.add.text(cx, btnY + btnH / 2, '开始游戏', {
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

        // 操作提示
        this.add.text(cx, GAME_H * 0.85, '点击/触屏 或 A/D 键操控', {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#888888',
        }).setOrigin(0.5);
    }
}
