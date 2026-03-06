// Gate.js — 功能门：生成、渲染、碰撞检测、运算执行
class Gate {
    constructor(scene, y, leftOp, rightOp) {
        this.scene = scene;
        this.y = y;
        this.leftOp = leftOp;
        this.rightOp = rightOp;
        this.passed = false;
        this.flash = 0;

        this.graphics = scene.add.graphics();
        this.leftText = scene.add.text(0, 0, leftOp.label, {
            fontFamily: 'Arial', fontSize: '22px', fontStyle: 'bold', color: '#ffffff',
        }).setOrigin(0.5, 0.5);
        this.rightText = scene.add.text(0, 0, rightOp.label, {
            fontFamily: 'Arial', fontSize: '22px', fontStyle: 'bold', color: '#ffffff',
        }).setOrigin(0.5, 0.5);

        this.updatePositions();
    }

    updatePositions() {
        const mid = TRACK_LEFT + GATE_HALF_W;
        this.leftText.setPosition(TRACK_LEFT + GATE_HALF_W / 2, this.y + GATE_HEIGHT / 2);
        this.rightText.setPosition(mid + GATE_HALF_W / 2, this.y + GATE_HEIGHT / 2);
    }

    update(dt, scrollSpeed) {
        this.y += scrollSpeed * dt;
        if (this.flash > 0) this.flash -= dt * 3;
        this.updatePositions();
        this.draw();
    }

    draw() {
        this.graphics.clear();
        const mid = TRACK_LEFT + GATE_HALF_W;

        // 左门
        this.drawHalf(TRACK_LEFT, this.y, GATE_HALF_W, GATE_HEIGHT, this.leftOp);
        // 右门
        this.drawHalf(mid, this.y, GATE_HALF_W, GATE_HEIGHT, this.rightOp);

        // 闪光效果
        if (this.flash > 0) {
            this.graphics.fillStyle(0xffffff, this.flash * 0.5);
            this.graphics.fillRect(TRACK_LEFT, this.y, TRACK_WIDTH, GATE_HEIGHT);
        }

        // 中间分隔线
        this.graphics.lineStyle(2, COLORS.border, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(mid, this.y);
        this.graphics.lineTo(mid, this.y + GATE_HEIGHT);
        this.graphics.strokePath();
    }

    drawHalf(x, y, w, h, op) {
        const bgColor = op.favorable ? COLORS.favorableBg : COLORS.unfavorableBg;
        const borderColor = op.favorable ? COLORS.favorable : COLORS.unfavorable;

        this.graphics.fillStyle(bgColor, 0.7);
        this.graphics.fillRect(x, y, w, h);
        this.graphics.lineStyle(2, borderColor, 1);
        this.graphics.strokeRect(x, y, w, h);
    }

    checkCollision(player) {
        if (this.passed) return;
        const ph = player.getHitbox();
        const py = ph.y + ph.h / 2;
        const px = ph.x + ph.w / 2;

        if (py >= this.y && py <= this.y + GATE_HEIGHT) {
            this.passed = true;
            this.flash = 1;
            const mid = TRACK_LEFT + GATE_HALF_W;
            const op = px < mid ? this.leftOp : this.rightOp;
            Gate.applyOp(op, player);
        }
    }

    static applyOp(op, player) {
        const oldCount = player.getCount();
        const newCount = op.apply(oldCount);
        const delta = newCount - oldCount;

        if (op.label.startsWith('\u00d7') || op.label.startsWith('\u00f7')) {
            player.multiplyCount(newCount / oldCount);
        } else {
            player.addCount(delta);
        }
    }

    isOffScreen() {
        return this.y > GAME_H + 100;
    }

    destroy() {
        this.graphics.destroy();
        this.leftText.destroy();
        this.rightText.destroy();
    }

    static generateOp(playerCount) {
        const base = Math.max(1, Math.floor(playerCount * 0.3));
        const type = Math.floor(Math.random() * 4);

        switch (type) {
            case 0: {
                const n = Math.floor(Math.random() * base) + 1;
                return { label: `+${n}`, apply: (c) => c + n, favorable: true };
            }
            case 1: {
                const n = Math.floor(Math.random() * Math.max(1, base * 0.6)) + 1;
                return { label: `-${n}`, apply: (c) => c - n, favorable: false };
            }
            case 2: {
                const n = Math.floor(Math.random() * 2) + 2;
                return { label: `\u00d7${n}`, apply: (c) => c * n, favorable: true };
            }
            case 3: {
                const n = Math.floor(Math.random() * 2) + 2;
                return { label: `\u00f7${n}`, apply: (c) => Math.floor(c / n), favorable: false };
            }
        }
    }

    static spawn(scene, playerCount) {
        const left = Gate.generateOp(playerCount);
        let right = Gate.generateOp(playerCount);
        if (left.label === right.label) {
            const n = Math.floor(Math.random() * 3) + 1;
            right = { label: `+${n}`, apply: (c) => c + n, favorable: true };
        }
        return new Gate(scene, -80, left, right);
    }
}
