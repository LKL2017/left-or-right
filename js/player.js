// player.js — 主角：位置、积分、小人群渲染
const Player = (() => {
    const MOVE_SPEED = 300;     // px/s
    const Y_POS = Track.LOGICAL_H * 0.75;
    const RADIUS = 18;
    const INITIAL_COUNT = 10;

    let x = 0;
    let count = 0;
    let floatingTexts = [];     // 飘字动效 [{text, x, y, alpha, color}]

    function init() {
        x = Track.LOGICAL_W / 2;
        count = INITIAL_COUNT;
        floatingTexts = [];
    }

    function update(dt) {
        // 移动
        const newX = Input.getInput(x, dt, MOVE_SPEED);
        x = clamp(newX, Track.TRACK_LEFT + RADIUS, Track.TRACK_RIGHT - RADIUS);

        // 飘字更新
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
            const ft = floatingTexts[i];
            ft.y -= 60 * dt;
            ft.alpha -= 1.2 * dt;
            if (ft.alpha <= 0) floatingTexts.splice(i, 1);
        }
    }

    function addCount(delta) {
        const prev = count;
        count = Math.round(count + delta);
        if (count < 0) count = 0;
        const display = delta > 0 ? `+${Math.round(delta)}` : `${Math.round(delta)}`;
        const color = delta > 0 ? '#4eff4e' : '#ff4e4e';
        floatingTexts.push({ text: display, x, y: Y_POS - 40, alpha: 1, color });
    }

    function multiplyCount(factor) {
        const prev = count;
        count = Math.round(count * factor);
        if (count < 0) count = 0;
        const display = factor >= 1 ? `×${factor}` : `÷${Math.round(1 / factor)}`;
        const color = factor >= 1 ? '#4eff4e' : '#ff4e4e';
        floatingTexts.push({ text: display, x, y: Y_POS - 40, alpha: 1, color });
    }

    function render(ctx) {
        // 小人群
        drawCrowd(ctx, x, Y_POS, count, '#4a9eff', RADIUS);

        // 数量文字
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(count, x, Y_POS - RADIUS - 8);

        // 飘字
        for (const ft of floatingTexts) {
            ctx.globalAlpha = ft.alpha;
            ctx.fillStyle = ft.color;
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.globalAlpha = 1;
        }
    }

    function getHitbox() {
        return { x: x - RADIUS, y: Y_POS - RADIUS, w: RADIUS * 2, h: RADIUS * 2 };
    }

    function getX() { return x; }
    function getY() { return Y_POS; }
    function getCount() { return count; }

    // 绘制小人群（简笔火柴人群组）
    function drawCrowd(ctx, cx, cy, num, color, baseR) {
        const size = Math.min(num, 50);
        const r = baseR + Math.min(size * 0.3, 15);

        // 底座圆
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 4, r + 4, r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // 绘制若干小火柴人
        const drawCount = Math.min(size, 12);
        for (let i = 0; i < drawCount; i++) {
            const angle = (i / drawCount) * Math.PI * 2;
            const dist = Math.min(i * 2.5, r * 0.6);
            const sx = cx + Math.cos(angle) * dist;
            const sy = cy - 2 + Math.sin(angle) * dist * 0.4;
            drawStickman(ctx, sx, sy, color, 0.7 + Math.min(num / 30, 0.5));
        }
    }

    function drawStickman(ctx, sx, sy, color, scale) {
        const s = 8 * scale;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.5;

        // 头
        ctx.beginPath();
        ctx.arc(sx, sy - s * 2.2, s * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // 身体
        ctx.beginPath();
        ctx.moveTo(sx, sy - s * 1.7);
        ctx.lineTo(sx, sy - s * 0.3);
        ctx.stroke();

        // 胳膊
        ctx.beginPath();
        ctx.moveTo(sx - s * 0.7, sy - s * 1.2);
        ctx.lineTo(sx + s * 0.7, sy - s * 1.2);
        ctx.stroke();

        // 腿
        ctx.beginPath();
        ctx.moveTo(sx, sy - s * 0.3);
        ctx.lineTo(sx - s * 0.5, sy + s * 0.3);
        ctx.moveTo(sx, sy - s * 0.3);
        ctx.lineTo(sx + s * 0.5, sy + s * 0.3);
        ctx.stroke();
    }

    function clamp(v, min, max) {
        return v < min ? min : v > max ? max : v;
    }

    return { init, update, addCount, multiplyCount, render, getHitbox, getX, getY, getCount, Y_POS, RADIUS };
})();
