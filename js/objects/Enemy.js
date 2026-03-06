// Enemy.js — 敌人：全跑道宽度，强制碰撞
class Enemy {
    constructor(scene, y, count) {
        this.scene = scene;
        this.y = y;
        this.count = count;
        this.alive = true;
        this.flash = 0;

        this.graphics = scene.add.graphics();
        this.countText = scene.add.text(
            TRACK_LEFT + TRACK_WIDTH / 2, this.y - 4, this.count,
            { fontFamily: 'Arial', fontSize: '18px', fontStyle: 'bold', color: '#ffffff' }
        ).setOrigin(0.5, 1);
    }

    update(dt, scrollSpeed) {
        this.y += scrollSpeed * dt;
        if (this.flash > 0) this.flash -= dt * 3;
        this.countText.setPosition(TRACK_LEFT + TRACK_WIDTH / 2, this.y - 4);
        this.draw();
    }

    draw() {
        this.graphics.clear();
        if (!this.alive) return;

        const x = TRACK_LEFT;
        const w = TRACK_WIDTH;

        // 红色横条背景
        this.graphics.fillStyle(COLORS.enemyBg, 0.6);
        this.graphics.fillRect(x, this.y, w, ENEMY_HEIGHT);

        // 边框
        this.graphics.lineStyle(2, COLORS.enemy, 1);
        this.graphics.strokeRect(x, this.y, w, ENEMY_HEIGHT);

        // 闪光
        if (this.flash > 0) {
            this.graphics.fillStyle(0xffffff, this.flash * 0.5);
            this.graphics.fillRect(x, this.y, w, ENEMY_HEIGHT);
        }

        // 小火柴人（合并绘制）
        const cx = TRACK_LEFT + TRACK_WIDTH / 2;
        const cy = this.y + ENEMY_HEIGHT / 2;
        const drawCount = Math.min(this.count, 10);
        const spacing = Math.min(w / (drawCount + 1), 30);
        const startX = cx - (drawCount - 1) * spacing / 2;
        const color = parseInt(COLORS.enemyStickman.replace('#', ''), 16);

        for (let j = 0; j < drawCount; j++) {
            const sx = startX + j * spacing;
            const sy = cy;
            const s = 7 * 0.55;

            // 头
            this.graphics.fillStyle(color, 1);
            this.graphics.fillCircle(sx, sy - s * 2.2, s * 0.5);

            // 身体+胳膊+腿 合并
            this.graphics.lineStyle(1.5, color, 1);
            this.graphics.beginPath();
            this.graphics.moveTo(sx, sy - s * 1.7);
            this.graphics.lineTo(sx, sy - s * 0.3);
            this.graphics.moveTo(sx - s * 0.7, sy - s * 1.2);
            this.graphics.lineTo(sx + s * 0.7, sy - s * 1.2);
            this.graphics.moveTo(sx, sy - s * 0.3);
            this.graphics.lineTo(sx - s * 0.5, sy + s * 0.3);
            this.graphics.moveTo(sx, sy - s * 0.3);
            this.graphics.lineTo(sx + s * 0.5, sy + s * 0.3);
            this.graphics.strokePath();
        }
    }

    checkCollision(player) {
        if (!this.alive) return;
        const ph = player.getHitbox();
        const py = ph.y + ph.h / 2;

        if (py >= this.y && py <= this.y + ENEMY_HEIGHT) {
            this.alive = false;
            this.flash = 1;
            player.addCount(-this.count);

            // 震屏 + 红闪
            const cam = this.scene.cameras.main;
            cam.shake(150, 0.012);
            cam.flash(150, 100, 25, 25, true);

            // 红色粒子爆发
            this.emitParticles(player.getX(), this.y + ENEMY_HEIGHT / 2);
        }
    }

    emitParticles(x, y) {
        if (!this.scene.textures.exists('particle')) return;
        const emitter = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 60, max: 160 },
            scale: { start: 0.7, end: 0 },
            lifespan: 350,
            tint: 0xff4e4e,
            quantity: 12,
            duration: 50,
        });
        this.scene.time.delayedCall(450, () => emitter.destroy());
    }

    isOffScreen() {
        return this.y > GAME_H + 100;
    }

    destroy() {
        this.graphics.destroy();
        this.countText.destroy();
    }

    static spawn(scene, playerCount) {
        const maxVal = Math.max(1, Math.floor(playerCount * 0.6));
        const count = Math.floor(Math.random() * maxVal) + 1;
        return new Enemy(scene, -80, count);
    }
}
