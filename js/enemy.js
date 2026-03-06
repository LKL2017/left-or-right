// enemy.js — 敌人：生成、碰撞、渲染（全跑道宽度，强制碰撞）
const Enemy = (() => {
    const HEIGHT = 40;

    let enemies = [];  // [{y, count, alive, flash}]

    function spawn(y, playerCount) {
        // 敌人数值：基于玩家积分动态调整，不超过玩家积分的 60%
        const maxVal = Math.max(1, Math.floor(playerCount * 0.6));
        const count = Math.floor(Math.random() * maxVal) + 1;

        enemies.push({ y, count, alive: true, flash: 0 });
    }

    function update(dt, scrollSpeed) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const e = enemies[i];
            e.y += scrollSpeed * dt;
            if (e.flash > 0) e.flash -= dt * 3;

            // 碰撞检测：全跑道宽度，玩家中心 y 进入敌人区域即触发
            if (e.alive) {
                const ph = Player.getHitbox();
                const py = ph.y + ph.h / 2;

                if (py >= e.y && py <= e.y + HEIGHT) {
                    e.alive = false;
                    e.flash = 1;
                    Player.addCount(-e.count);
                }
            }

            // 移除出屏
            if (e.y > Track.LOGICAL_H + 100) {
                enemies.splice(i, 1);
            }
        }
    }

    function render(ctx) {
        for (const e of enemies) {
            if (!e.alive) continue;

            const x = Track.TRACK_LEFT;
            const w = Track.TRACK_WIDTH;

            // 红色横条背景
            ctx.fillStyle = 'rgba(200, 40, 40, 0.6)';
            ctx.fillRect(x, e.y, w, HEIGHT);

            // 边框
            ctx.strokeStyle = '#ff4e4e';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, e.y, w, HEIGHT);

            // 在横条内画多个红色小火柴人
            const cx = Track.TRACK_LEFT + Track.TRACK_WIDTH / 2;
            const cy = e.y + HEIGHT / 2;
            const drawCount = Math.min(e.count, 10);
            const spacing = Math.min(w / (drawCount + 1), 30);
            const startX = cx - (drawCount - 1) * spacing / 2;

            for (let j = 0; j < drawCount; j++) {
                const sx = startX + j * spacing;
                drawRedStickman(ctx, sx, cy, 0.55);
            }

            // 数值
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(e.count, cx, e.y - 4);
        }
    }

    function drawRedStickman(ctx, sx, sy, scale) {
        const s = 7 * scale;
        ctx.strokeStyle = '#ff9999';
        ctx.fillStyle = '#ff9999';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.arc(sx, sy - s * 2.2, s * 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(sx, sy - s * 1.7);
        ctx.lineTo(sx, sy - s * 0.3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(sx - s * 0.7, sy - s * 1.2);
        ctx.lineTo(sx + s * 0.7, sy - s * 1.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(sx, sy - s * 0.3);
        ctx.lineTo(sx - s * 0.5, sy + s * 0.3);
        ctx.moveTo(sx, sy - s * 0.3);
        ctx.lineTo(sx + s * 0.5, sy + s * 0.3);
        ctx.stroke();
    }

    function reset() {
        enemies = [];
    }

    return { spawn, update, render, reset, HEIGHT };
})();
