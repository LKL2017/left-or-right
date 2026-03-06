// Track.js — 跑道背景 Graphics 对象
class Track {
    constructor(scene) {
        this.scene = scene;
        this.scrollY = 0;
        this.bg = scene.add.graphics();
        this.lines = scene.add.graphics();
        this.dashes = scene.add.graphics();

        this.drawBackground();
        this.drawBorderLines();
    }

    drawBackground() {
        this.bg.fillStyle(COLORS.track, 1);
        this.bg.fillRect(TRACK_LEFT, 0, TRACK_WIDTH, GAME_H);
    }

    drawBorderLines() {
        this.lines.lineStyle(3, COLORS.border, 1);
        this.lines.beginPath();
        this.lines.moveTo(TRACK_LEFT, 0);
        this.lines.lineTo(TRACK_LEFT, GAME_H);
        this.lines.moveTo(TRACK_RIGHT, 0);
        this.lines.lineTo(TRACK_RIGHT, GAME_H);
        this.lines.strokePath();
    }

    update(dt, scrollSpeed) {
        this.scrollY += scrollSpeed * dt;
        this.scrollY %= DASH_TOTAL * 100;
        this.drawDashes();
    }

    drawDashes() {
        this.dashes.clear();
        this.dashes.lineStyle(2, COLORS.border, 0.4);

        const offset = this.scrollY % DASH_TOTAL;

        for (let lane = 1; lane < LANE_COUNT; lane++) {
            const x = TRACK_LEFT + LANE_WIDTH * lane;
            let y = -DASH_TOTAL + offset;
            while (y < GAME_H + DASH_TOTAL) {
                this.dashes.beginPath();
                this.dashes.moveTo(x, y);
                this.dashes.lineTo(x, y + DASH_LEN);
                this.dashes.strokePath();
                y += DASH_TOTAL;
            }
        }
    }

    reset() {
        this.scrollY = 0;
        this.dashes.clear();
    }

    destroy() {
        this.bg.destroy();
        this.lines.destroy();
        this.dashes.destroy();
    }
}
