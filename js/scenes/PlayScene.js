// PlayScene.js — 游戏主场景
class PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor(COLORS.bg);

        // 生成粒子纹理（8x8 白色圆形）
        if (!this.textures.exists('particle')) {
            const gfx = this.make.graphics({ x: 0, y: 0, add: false });
            gfx.fillStyle(0xffffff, 1);
            gfx.fillCircle(4, 4, 4);
            gfx.generateTexture('particle', 8, 8);
            gfx.destroy();
        }

        // 场景 fadeIn
        this.cameras.main.fadeIn(400);

        // 状态
        this.scrollDistance = 0;
        this.scrollSpeed = INITIAL_SCROLL_SPEED;
        this.nextEventDist = INITIAL_EVENT_DIST;
        this.eventToggle = false;
        this.difficulty = 1;
        this.score = 0;
        this.dying = false;
        this.displayedCount = INITIAL_COUNT;
        this.countHudTarget = INITIAL_COUNT;

        // 创建对象
        this.track = new Track(this);
        this.gates = [];
        this.enemies = [];
        this.player = new Player(this);

        // HUD
        this.createHUD();
    }

    createHUD() {
        const hudBg = this.add.graphics();
        hudBg.fillStyle(0x000000, 0.4);
        hudBg.fillRect(0, 0, GAME_W, 36);
        hudBg.setDepth(10);

        this.distText = this.add.text(12, 18, '距离: 0', {
            fontFamily: 'Arial',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#ffffff',
        }).setOrigin(0, 0.5).setDepth(11);

        this.countHudText = this.add.text(GAME_W - 12, 18, `人数: ${INITIAL_COUNT}`, {
            fontFamily: 'Arial',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#ffffff',
        }).setOrigin(1, 0.5).setDepth(11);
    }

    animateCountHUD(newCount) {
        const from = this.displayedCount;
        const to = newCount;
        if (from === to) return;
        this.countHudTarget = to;

        // 弹跳效果
        this.tweens.add({
            targets: this.countHudText,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 100,
            yoyo: true,
            ease: 'Back.easeOut',
        });

        // 数字滚动
        this.tweens.addCounter({
            from: from,
            to: to,
            duration: 300,
            ease: 'Power2',
            onUpdate: (tween) => {
                this.displayedCount = Math.round(tween.getValue());
                this.countHudText.setText(`人数: ${this.displayedCount}`);
            },
            onComplete: () => {
                this.displayedCount = to;
                this.countHudText.setText(`人数: ${to}`);
            },
        });
    }

    update(time, delta) {
        if (this.dying) return;

        const dt = delta / 1000;

        // 滚动
        this.scrollDistance += this.scrollSpeed * dt;
        this.track.update(dt, this.scrollSpeed);

        // 难度渐进
        this.difficulty = 1 + this.scrollDistance / 3000;
        this.scrollSpeed = 200 + this.difficulty * 20;

        // 事件生成
        if (this.scrollDistance >= this.nextEventDist) {
            this.spawnEvent();
            const gap = Math.max(120, 300 - this.difficulty * 15);
            this.nextEventDist = this.scrollDistance + gap + Math.random() * 100;
        }

        // 更新玩家
        this.player.update(dt);

        // 更新门
        for (let i = this.gates.length - 1; i >= 0; i--) {
            const g = this.gates[i];
            g.update(dt, this.scrollSpeed);
            g.checkCollision(this.player);
            if (g.isOffScreen()) {
                g.destroy();
                this.gates.splice(i, 1);
            }
        }

        // 更新敌人
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            e.update(dt, this.scrollSpeed);
            e.checkCollision(this.player);
            if (e.isOffScreen()) {
                e.destroy();
                this.enemies.splice(i, 1);
            }
        }

        // HUD
        this.score = Math.max(this.score, Math.floor(this.scrollDistance / 10));
        this.distText.setText(`距离: ${this.score}`);

        const currentCount = this.player.getCount();
        if (currentCount !== this.countHudTarget) {
            this.animateCountHUD(currentCount);
        }

        // Game Over — 延迟 + fadeOut
        if (currentCount <= 0) {
            this.dying = true;
            this.cameras.main.shake(200, 0.015);
            this.time.delayedCall(800, () => {
                this.cameras.main.fadeOut(400, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('GameOverScene', { score: this.score });
                });
            });
        }
    }

    spawnEvent() {
        if (this.eventToggle) {
            this.enemies.push(Enemy.spawn(this, this.player.getCount()));
        } else {
            this.gates.push(Gate.spawn(this, this.player.getCount()));
        }
        this.eventToggle = !this.eventToggle;
    }
}
