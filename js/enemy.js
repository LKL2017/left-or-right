// enemy.js — 敌人：生成、碰撞、渲染
const Enemy = (() => {
    const RADIUS = 16;

    let enemies = [];  // [{x, y, count, alive}]

    function spawn(y, playerCount) {
        // 敌人数值：基于玩家积分动态调整，不超过玩家积分的 60%
        const maxVal = Math.max(1, Math.floor(playerCount * 0.6));
        const count = Math.floor(Math.random() * maxVal) + 1;

        // 随机车道
        const lane = Math.floor(Math.random() * Track.LANE_COUNT);
        const x = Track.getLaneX(lane);

        enemies.push({ x, y, count, alive: true, flash: 0 });
    }

    function update(dt, scrollSpeed) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const e = enemies[i];
            e.y += scrollSpeed * dt;
            if (e.flash > 0) e.flash -= dt * 3;

            // 碰撞检测
            if (e.alive) {
                const ph = Player.getHitbox();
                const px = ph.x + ph.w / 2;
                const py = ph.y + ph.h / 2;

                const dx = px - e.x;
                const dy = py - e.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const hitDist = Player.RADIUS + RADIUS;

                if (dist < hitDist) {
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

            // 红色小人群
            drawEnemyCrowd(ctx, e.x, e.y, e.count);

            // 数值
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(e.count, e.x, e.y - RADIUS - 6);
        }
    }

    function drawEnemyCrowd(ctx, cx, cy, num) {
        const size = Math.min(num, 30);
        const r = RADIUS + Math.min(size * 0.2, 8);

        // 底座
        ctx.fillStyle = '#ff4444';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 3, r + 2, r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // 小火柴人
        const drawCount = Math.min(size, 8);
        for (let i = 0; i < drawCount; i++) {
            const angle = (i / drawCount) * Math.PI * 2;
            const dist = Math.min(i * 2, r * 0.5);
            const sx = cx + Math.cos(angle) * dist;
            const sy = cy - 1 + Math.sin(angle) * dist * 0.3;
            drawRedStickman(ctx, sx, sy, 0.6);
        }
    }

    function drawRedStickman(ctx, sx, sy, scale) {
        const s = 7 * scale;
        ctx.strokeStyle = '#ff6666';
        ctx.fillStyle = '#ff6666';
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

    return { spawn, update, render, reset, RADIUS };
})();
