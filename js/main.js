// main.js — 入口：初始化 canvas、启动游戏循环
(function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const W = Track.LOGICAL_W;
    const H = Track.LOGICAL_H;

    let lastTime = 0;

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const maxH = window.innerHeight;
        const maxW = window.innerWidth;

        // 按逻辑比例计算实际尺寸，适应屏幕
        let scale = Math.min(maxW / W, maxH / H);
        const displayW = Math.floor(W * scale);
        const displayH = Math.floor(H * scale);

        canvas.style.width = displayW + 'px';
        canvas.style.height = displayH + 'px';
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        Input.updateScale(W, canvas);
    }

    function init() {
        resize();
        window.addEventListener('resize', resize);

        Input.init(canvas, W);
        Game.init();

        // 点击事件处理（菜单和 Game Over 按钮）
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = W / canvas.clientWidth;
            const scaleY = H / canvas.clientHeight;
            const lx = (e.clientX - rect.left) * scaleX;
            const ly = (e.clientY - rect.top) * scaleY;
            Game.handleClick(lx, ly);
        });

        canvas.addEventListener('touchend', (e) => {
            if (Game.getState() !== Game.State.PLAYING) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = W / canvas.clientWidth;
                const scaleY = H / canvas.clientHeight;
                const touch = e.changedTouches[0];
                const lx = (touch.clientX - rect.left) * scaleX;
                const ly = (touch.clientY - rect.top) * scaleY;
                Game.handleClick(lx, ly);
            }
        });

        lastTime = performance.now();
        requestAnimationFrame(loop);
    }

    function loop(time) {
        const dt = Math.min((time - lastTime) / 1000, 0.05); // cap at 50ms
        lastTime = time;

        Game.update(dt);
        Game.render(ctx);

        requestAnimationFrame(loop);
    }

    init();
})();
