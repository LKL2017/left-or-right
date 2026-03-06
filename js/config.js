// config.js — Phaser 配置 + 游戏常量

const GAME_W = 400;
const GAME_H = 700;

const TRACK_PADDING = 40;
const TRACK_LEFT = TRACK_PADDING;
const TRACK_RIGHT = GAME_W - TRACK_PADDING;
const TRACK_WIDTH = TRACK_RIGHT - TRACK_LEFT;
const LANE_COUNT = 2;
const LANE_WIDTH = TRACK_WIDTH / LANE_COUNT;

const DASH_LEN = 30;
const DASH_GAP = 20;
const DASH_TOTAL = DASH_LEN + DASH_GAP;

const PLAYER_SPEED = 300;
const PLAYER_Y = GAME_H * 0.75;
const PLAYER_RADIUS = 18;
const INITIAL_COUNT = 10;

const GATE_HEIGHT = 60;
const GATE_HALF_W = TRACK_WIDTH / 2;

const ENEMY_HEIGHT = 40;

const INITIAL_SCROLL_SPEED = 200;
const INITIAL_EVENT_DIST = 300;

const COLORS = {
    bg: 0x1a1a2e,
    track: 0x3a3a5c,
    border: 0xffffff,
    player: 0x4a9eff,
    favorable: 0x32c850,
    favorableBg: 0x32c850,
    unfavorable: 0xc83232,
    unfavorableBg: 0xc83232,
    enemy: 0xff4e4e,
    enemyBg: 0xc82828,
    text: 0xffffff,
    green: '#4eff4e',
    red: '#ff4e4e',
    playerHex: '#4a9eff',
    enemyStickman: '#ff9999',
};
