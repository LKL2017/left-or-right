// game.js — 游戏状态管理 + 事件调度
const Game = (() => {
    const State = { MENU: 'MENU', PLAYING: 'PLAYING', GAME_OVER: 'GAME_OVER' };

    let state = State.MENU;
    let score = 0;
    let scrollDistance = 0;
    let scrollSpeed = 200;       // 初始滚动速度 px/s
    let nextEventDist = 300;     // 下一个事件触发距离
    let eventToggle = false;     // 交替生成：gate / enemy
    let difficulty = 1;

    function init() {
        state = State.MENU;
        score = 0;
    }

    function startGame() {
        state = State.PLAYING;
        score = 0;
        scrollDistance = 0;
        scrollSpeed = 200;
        nextEventDist = 300;
        eventToggle = false;
        difficulty = 1;

        Player.init();
        Track.reset();
        Gate.reset();
        Enemy.reset();
    }

    function update(dt) {
        if (state !== State.PLAYING) return;

        // 滚动
        scrollDistance += scrollSpeed * dt;
        Track.update(dt, scrollSpeed);

        // 难度渐进
        difficulty = 1 + scrollDistance / 3000;
        scrollSpeed = 200 + difficulty * 20;

        // 事件生成
        if (scrollDistance >= nextEventDist) {
            spawnEvent();
            // 下一事件间距：150~300px，随难度缩小
            const gap = Math.max(120, 300 - difficulty * 15);
            nextEventDist = scrollDistance + gap + Math.random() * 100;
        }

        // 更新对象
        Player.update(dt);
        Gate.update(dt, scrollSpeed);
        Enemy.update(dt, scrollSpeed);

        // 积分追踪
        score = Math.max(score, Math.floor(scrollDistance / 10));

        // Game Over 检测
        if (Player.getCount() <= 0) {
            state = State.GAME_OVER;
        }
    }

    function spawnEvent() {
        const spawnY = -80; // 从屏幕上方生成
        if (eventToggle) {
            Enemy.spawn(spawnY, Player.getCount());
        } else {
            Gate.spawn(spawnY, Player.getCount());
        }
        eventToggle = !eventToggle;
    }

    function render(ctx) {
        const W = Track.LOGICAL_W;
        const H = Track.LOGICAL_H;

        // 清屏
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, W, H);

        if (state === State.MENU) {
            renderMenu(ctx, W, H);
        } else if (state === State.PLAYING) {
            Track.render(ctx);
            Gate.render(ctx);
            Enemy.render(ctx);
            Player.render(ctx);
            renderHUD(ctx, W);
        } else if (state === State.GAME_OVER) {
            Track.render(ctx);
            Gate.render(ctx);
            Enemy.render(ctx);
            Player.render(ctx);
            renderGameOver(ctx, W, H);
        }
    }

    function renderMenu(ctx, W, H) {
        // 标题
        ctx.fillStyle = '#4a9eff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('数量跑酷', W / 2, H * 0.3);

        ctx.fillStyle = '#aaa';
        ctx.font = '18px Arial';
        ctx.fillText('Left or Right', W / 2, H * 0.38);

        // 说明
        ctx.fillStyle = '#ddd';
        ctx.font = '16px Arial';
        ctx.fillText('选择正确的门来增加人数', W / 2, H * 0.5);
        ctx.fillText('躲避敌人，保持人数 > 0', W / 2, H * 0.56);

        // 开始按钮
        const btnX = W / 2 - 80;
        const btnY = H * 0.68;
        const btnW = 160;
        const btnH = 50;
        ctx.fillStyle = '#4a9eff';
        ctx.beginPath();
        ctx.roundRect(btnX, btnY, btnW, btnH, 10);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px Arial';
        ctx.fillText('开始游戏', W / 2, btnY + btnH / 2);

        // 操作提示
        ctx.fillStyle = '#888';
        ctx.font = '14px Arial';
        ctx.fillText('点击/触屏 或 A/D 键操控', W / 2, H * 0.85);
    }

    function renderHUD(ctx, W) {
        // 分数
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(0, 0, W, 36);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`距离: ${Math.floor(scrollDistance / 10)}`, 12, 18);
        ctx.textAlign = 'right';
        ctx.fillText(`人数: ${Player.getCount()}`, W - 12, 18);
    }

    function renderGameOver(ctx, W, H) {
        // 遮罩
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#ff4e4e';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('游戏结束', W / 2, H * 0.33);

        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(`最终距离: ${Math.floor(scrollDistance / 10)}`, W / 2, H * 0.45);

        // 重新开始按钮
        const btnX = W / 2 - 80;
        const btnY = H * 0.58;
        const btnW = 160;
        const btnH = 50;
        ctx.fillStyle = '#4a9eff';
        ctx.beginPath();
        ctx.roundRect(btnX, btnY, btnW, btnH, 10);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px Arial';
        ctx.fillText('再来一次', W / 2, btnY + btnH / 2);
    }

    function handleClick(logicalX, logicalY) {
        const W = Track.LOGICAL_W;
        const H = Track.LOGICAL_H;

        if (state === State.MENU) {
            // 开始按钮区域
            const btnX = W / 2 - 80;
            const btnY = H * 0.68;
            if (logicalX >= btnX && logicalX <= btnX + 160 && logicalY >= btnY && logicalY <= btnY + 50) {
                startGame();
            }
        } else if (state === State.GAME_OVER) {
            // 重新开始按钮区域
            const btnX = W / 2 - 80;
            const btnY = H * 0.58;
            if (logicalX >= btnX && logicalX <= btnX + 160 && logicalY >= btnY && logicalY <= btnY + 50) {
                startGame();
            }
        }
    }

    function getState() { return state; }

    return { State, init, startGame, update, render, handleClick, getState };
})();
