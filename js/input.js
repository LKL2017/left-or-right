// input.js — 键盘/鼠标/触屏输入统一处理
const Input = (() => {
    let targetX = null;       // null = 无输入，数值 = 目标 x 坐标
    let canvasRect = null;
    let scaleX = 1;
    let isDragging = false;
    let keys = {};

    function init(canvas, logicalWidth) {
        canvasRect = canvas.getBoundingClientRect.bind(canvas);
        scaleX = logicalWidth / canvas.clientWidth;

        // 键盘
        window.addEventListener('keydown', e => { keys[e.key] = true; });
        window.addEventListener('keyup', e => { keys[e.key] = false; });

        // 鼠标
        canvas.addEventListener('mousedown', e => {
            isDragging = true;
            updatePointer(e.clientX);
        });
        window.addEventListener('mousemove', e => {
            if (isDragging) updatePointer(e.clientX);
        });
        window.addEventListener('mouseup', () => {
            isDragging = false;
            targetX = null;
        });

        // 触屏
        canvas.addEventListener('touchstart', e => {
            e.preventDefault();
            isDragging = true;
            updatePointer(e.touches[0].clientX);
        }, { passive: false });
        canvas.addEventListener('touchmove', e => {
            e.preventDefault();
            if (isDragging) updatePointer(e.touches[0].clientX);
        }, { passive: false });
        canvas.addEventListener('touchend', e => {
            e.preventDefault();
            isDragging = false;
            targetX = null;
        }, { passive: false });
    }

    function updatePointer(clientX) {
        const rect = canvasRect();
        targetX = (clientX - rect.left) * scaleX;
    }

    function updateScale(logicalWidth, canvas) {
        scaleX = logicalWidth / canvas.clientWidth;
    }

    function getInput(playerX, dt, speed) {
        // 键盘优先
        const left = keys['a'] || keys['A'] || keys['ArrowLeft'];
        const right = keys['d'] || keys['D'] || keys['ArrowRight'];
        if (left && !right) return playerX - speed * dt;
        if (right && !left) return playerX + speed * dt;

        // 指针输入
        if (targetX !== null) return targetX;

        return playerX;
    }

    function isPointerDown() {
        return isDragging || keys[' '] || keys['Enter'];
    }

    function isKeyDown(key) {
        return !!keys[key];
    }

    return { init, updateScale, getInput, isPointerDown, isKeyDown };
})();
