// Player.js — 主角：火柴人群、移动、积分、飘字
class Player {
    constructor(scene) {
        this.scene = scene;
        this.x = GAME_W / 2;
        this.y = PLAYER_Y;
        this.count = INITIAL_COUNT;
        this.graphics = scene.add.graphics();
        this.countText = scene.add.text(this.x, this.y - PLAYER_RADIUS - 8, this.count, {
            fontFamily: 'Arial',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#ffffff',
        }).setOrigin(0.5, 1);

        // 输入状态
        this.targetX = null;
        this.isDragging = false;
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.setupInput();
    }

    setupInput() {
        this.scene.input.on('pointerdown', (pointer) => {
            this.isDragging = true;
            this.targetX = pointer.x;
        });
        this.scene.input.on('pointermove', (pointer) => {
            if (this.isDragging) {
                this.targetX = pointer.x;
            }
        });
        this.scene.input.on('pointerup', () => {
            this.isDragging = false;
            this.targetX = null;
        });
        this.scene.input.on('pointerupoutside', () => {
            this.isDragging = false;
            this.targetX = null;
        });
    }

    update(dt) {
        // 键盘优先
        const left = this.cursors.left.isDown || this.keyA.isDown;
        const right = this.cursors.right.isDown || this.keyD.isDown;

        if (left && !right) {
            this.x -= PLAYER_SPEED * dt;
        } else if (right && !left) {
            this.x += PLAYER_SPEED * dt;
        } else if (this.targetX !== null) {
            // 平滑跟随触控位置
            this.x = Phaser.Math.Linear(this.x, this.targetX, 0.25);
        }

        // 限制在跑道内
        this.x = Phaser.Math.Clamp(this.x, TRACK_LEFT + PLAYER_RADIUS, TRACK_RIGHT - PLAYER_RADIUS);

        this.countText.setPosition(this.x, this.y - PLAYER_RADIUS - 8);
        this.countText.setText(this.count);

        this.drawCrowd();
    }

    drawCrowd() {
        this.graphics.clear();
        const size = Math.min(this.count, 50);
        const r = PLAYER_RADIUS + Math.min(size * 0.3, 15);

        // 底座椭圆阴影
        this.graphics.fillStyle(COLORS.player, 0.3);
        this.graphics.fillEllipse(this.x, this.y + 4, (r + 4) * 2, r);

        // 火柴人（合并绘制）
        const drawCount = Math.min(size, 12);
        const colorNum = parseInt(COLORS.playerHex.replace('#', ''), 16);

        for (let i = 0; i < drawCount; i++) {
            const angle = (i / drawCount) * Math.PI * 2;
            const dist = Math.min(i * 2.5, r * 0.6);
            const sx = this.x + Math.cos(angle) * dist;
            const sy = this.y - 2 + Math.sin(angle) * dist * 0.4;
            const scale = 0.7 + Math.min(this.count / 30, 0.5);

            // 头（填充圆）
            const s = 8 * scale;
            this.graphics.fillStyle(colorNum, 1);
            this.graphics.fillCircle(sx, sy - s * 2.2, s * 0.5);

            // 身体+胳膊+腿 合并为一次 beginPath/strokePath
            this.graphics.lineStyle(1.5, colorNum, 1);
            this.graphics.beginPath();
            // 身体
            this.graphics.moveTo(sx, sy - s * 1.7);
            this.graphics.lineTo(sx, sy - s * 0.3);
            // 胳膊
            this.graphics.moveTo(sx - s * 0.7, sy - s * 1.2);
            this.graphics.lineTo(sx + s * 0.7, sy - s * 1.2);
            // 左腿
            this.graphics.moveTo(sx, sy - s * 0.3);
            this.graphics.lineTo(sx - s * 0.5, sy + s * 0.3);
            // 右腿
            this.graphics.moveTo(sx, sy - s * 0.3);
            this.graphics.lineTo(sx + s * 0.5, sy + s * 0.3);
            this.graphics.strokePath();
        }
    }

    popCountText() {
        this.scene.tweens.add({
            targets: this.countText,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 200,
            ease: 'Back.easeOut',
            yoyo: true,
        });
    }

    addCount(delta) {
        this.count = Math.round(this.count + delta);
        if (this.count < 0) this.count = 0;
        const display = delta > 0 ? `+${Math.round(delta)}` : `${Math.round(delta)}`;
        const color = delta > 0 ? COLORS.green : COLORS.red;
        this.showFloatingText(display, color);
        this.popCountText();
    }

    multiplyCount(factor) {
        this.count = Math.round(this.count * factor);
        if (this.count < 0) this.count = 0;
        const display = factor >= 1 ? `\u00d7${factor}` : `\u00f7${Math.round(1 / factor)}`;
        const color = factor >= 1 ? COLORS.green : COLORS.red;
        this.showFloatingText(display, color);
        this.popCountText();
    }

    showFloatingText(text, color) {
        const ft = this.scene.add.text(this.x, this.y - 40, text, {
            fontFamily: 'Arial',
            fontSize: '24px',
            fontStyle: 'bold',
            color: color,
        }).setOrigin(0.5, 0.5);

        this.scene.tweens.add({
            targets: ft,
            y: ft.y - 60,
            alpha: 0,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => ft.destroy(),
        });
    }

    getHitbox() {
        return {
            x: this.x - PLAYER_RADIUS,
            y: this.y - PLAYER_RADIUS,
            w: PLAYER_RADIUS * 2,
            h: PLAYER_RADIUS * 2,
        };
    }

    getX() { return this.x; }
    getY() { return this.y; }
    getCount() { return this.count; }

    destroy() {
        this.graphics.destroy();
        this.countText.destroy();
    }
}
