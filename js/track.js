// track.js — 跑道渲染 + 滚动效果
const Track = (() => {
    const LOGICAL_W = 400;
    const LOGICAL_H = 700;
    const LANE_COUNT = 2;
    const TRACK_PADDING = 40;           // 跑道左右留白
    const TRACK_LEFT = TRACK_PADDING;
    const TRACK_RIGHT = LOGICAL_W - TRACK_PADDING;
    const TRACK_WIDTH = TRACK_RIGHT - TRACK_LEFT;
    const LANE_WIDTH = TRACK_WIDTH / LANE_COUNT;
    const DASH_LEN = 30;
    const DASH_GAP = 20;
    const DASH_TOTAL = DASH_LEN + DASH_GAP;

    let scrollY = 0;

    function getLaneX(lane) {
        // lane 0/1 → 车道中心 x
        return TRACK_LEFT + LANE_WIDTH * (lane + 0.5);
    }

    function update(dt, speed) {
        scrollY += speed * dt;
        scrollY %= DASH_TOTAL * 100;   // 避免溢出
    }

    function render(ctx) {
        // 跑道背景
        ctx.fillStyle = '#3a3a5c';
        ctx.fillRect(TRACK_LEFT, 0, TRACK_WIDTH, LOGICAL_H);

        // 跑道边线
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(TRACK_LEFT, 0);
        ctx.lineTo(TRACK_LEFT, LOGICAL_H);
        ctx.moveTo(TRACK_RIGHT, 0);
        ctx.lineTo(TRACK_RIGHT, LOGICAL_H);
        ctx.stroke();

        // 车道分隔虚线
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([DASH_LEN, DASH_GAP]);
        const offset = scrollY % DASH_TOTAL;
        ctx.lineDashOffset = -offset;
        for (let i = 1; i < LANE_COUNT; i++) {
            const x = TRACK_LEFT + LANE_WIDTH * i;
            ctx.beginPath();
            ctx.moveTo(x, -DASH_TOTAL);
            ctx.lineTo(x, LOGICAL_H + DASH_TOTAL);
            ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;
    }

    function reset() {
        scrollY = 0;
    }

    return {
        LOGICAL_W, LOGICAL_H,
        TRACK_LEFT, TRACK_RIGHT, TRACK_WIDTH,
        LANE_COUNT, LANE_WIDTH,
        getLaneX, update, render, reset
    };
})();
