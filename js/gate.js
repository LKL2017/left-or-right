// gate.js — 功能门：生成、渲染、碰撞检测、运算执行
const Gate = (() => {
    const GATE_HEIGHT = 60;
    const HALF_WIDTH = Track.TRACK_WIDTH / 2;

    let gates = [];   // [{y, leftOp, rightOp, passed}]

    // 运算类型
    const OPS = [
        (n) => ({ label: `+${n}`, apply: (c) => c + n }),
        (n) => ({ label: `-${n}`, apply: (c) => c - n }),
        (n) => ({ label: `×${n}`, apply: (c) => c * n }),
        (n) => ({ label: `÷${n}`, apply: (c) => Math.floor(c / n) }),
    ];

    function generateOp(playerCount) {
        // 动态调整数值范围
        const base = Math.max(1, Math.floor(playerCount * 0.3));
        const type = Math.floor(Math.random() * 4);

        switch (type) {
            case 0: { // +N
                const n = Math.floor(Math.random() * base) + 1;
                return { label: `+${n}`, apply: (c) => c + n, favorable: true };
            }
            case 1: { // -N
                const n = Math.floor(Math.random() * Math.max(1, base * 0.6)) + 1;
                return { label: `-${n}`, apply: (c) => c - n, favorable: false };
            }
            case 2: { // ×N
                const n = Math.floor(Math.random() * 2) + 2; // ×2 or ×3
                return { label: `×${n}`, apply: (c) => c * n, favorable: true };
            }
            case 3: { // ÷N
                const n = Math.floor(Math.random() * 2) + 2; // ÷2 or ÷3
                return { label: `÷${n}`, apply: (c) => Math.floor(c / n), favorable: false };
            }
        }
    }

    function spawn(y, playerCount) {
        const left = generateOp(playerCount);
        const right = generateOp(playerCount);
        // 保证左右不完全一样
        if (left.label === right.label) {
            right.label = `+${Math.floor(Math.random() * 3) + 1}`;
            const n = parseInt(right.label.slice(1));
            right.apply = (c) => c + n;
            right.favorable = true;
        }
        gates.push({ y, leftOp: left, rightOp: right, passed: false, flash: 0 });
    }

    function update(dt, scrollSpeed) {
        for (let i = gates.length - 1; i >= 0; i--) {
            const g = gates[i];
            g.y += scrollSpeed * dt;
            if (g.flash > 0) g.flash -= dt * 3;

            // 碰撞检测
            if (!g.passed) {
                const ph = Player.getHitbox();
                const py = ph.y + ph.h / 2;
                const px = ph.x + ph.w / 2;

                if (py >= g.y && py <= g.y + GATE_HEIGHT) {
                    g.passed = true;
                    g.flash = 1;

                    // 判断左右
                    const mid = Track.TRACK_LEFT + HALF_WIDTH;
                    if (px < mid) {
                        applyOp(g.leftOp);
                    } else {
                        applyOp(g.rightOp);
                    }
                }
            }

            // 移除出屏的门
            if (g.y > Track.LOGICAL_H + 100) {
                gates.splice(i, 1);
            }
        }
    }

    function applyOp(op) {
        const oldCount = Player.getCount();
        const newCount = op.apply(oldCount);
        const delta = newCount - oldCount;

        if (op.label.startsWith('×') || op.label.startsWith('÷')) {
            Player.multiplyCount(newCount / oldCount);
        } else {
            Player.addCount(delta);
        }
    }

    function render(ctx) {
        for (const g of gates) {
            const mid = Track.TRACK_LEFT + HALF_WIDTH;

            // 左门
            drawGate(ctx, Track.TRACK_LEFT, g.y, HALF_WIDTH, GATE_HEIGHT, g.leftOp, g.flash);
            // 右门
            drawGate(ctx, mid, g.y, HALF_WIDTH, GATE_HEIGHT, g.rightOp, g.flash);

            // 中间分隔线
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(mid, g.y);
            ctx.lineTo(mid, g.y + GATE_HEIGHT);
            ctx.stroke();
        }
    }

    function drawGate(ctx, x, y, w, h, op, flash) {
        const color = op.favorable ? 'rgba(50, 200, 80, 0.7)' : 'rgba(200, 50, 50, 0.7)';
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);

        if (flash > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${flash * 0.5})`;
            ctx.fillRect(x, y, w, h);
        }

        // 边框
        ctx.strokeStyle = op.favorable ? '#4eff4e' : '#ff4e4e';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);

        // 文字
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(op.label, x + w / 2, y + h / 2);
    }

    function reset() {
        gates = [];
    }

    function getGates() { return gates; }

    return { spawn, update, render, reset, getGates, GATE_HEIGHT };
})();
