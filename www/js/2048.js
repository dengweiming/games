let grid2048 = [];
let score2048 = 0;

function init2048() {
    grid2048 = Array(4).fill(null).map(() => Array(4).fill(0));
    score2048 = 0;
    document.getElementById('score-2048').textContent = '0';
    addRandomTile();
    addRandomTile();
    render2048();
}

function addRandomTile() {
    const empty = [];
    for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++)
            if (grid2048[r][c] === 0) empty.push([r, c]);
    if (empty.length === 0) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    grid2048[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function render2048() {
    const container = document.getElementById('grid-2048');
    container.innerHTML = '';
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile-2048';
            const val = grid2048[r][c];
            if (val !== 0) {
                tile.textContent = val;
                tile.classList.add(val <= 2048 ? `tile-${val}` : 'tile-super');
            }
            container.appendChild(tile);
        }
    }
}

function move2048(direction) {
    let moved = false;
    const oldGrid = JSON.stringify(grid2048);

    if (direction === 'left' || direction === 'right') {
        for (let r = 0; r < 4; r++) {
            let row = [...grid2048[r]];
            if (direction === 'right') row.reverse();
            row = mergeLine(row);
            if (direction === 'right') row.reverse();
            grid2048[r] = row;
        }
    } else {
        for (let c = 0; c < 4; c++) {
            let col = [grid2048[0][c], grid2048[1][c], grid2048[2][c], grid2048[3][c]];
            if (direction === 'down') col.reverse();
            col = mergeLine(col);
            if (direction === 'down') col.reverse();
            for (let r = 0; r < 4; r++) grid2048[r][c] = col[r];
        }
    }

    if (JSON.stringify(grid2048) !== oldGrid) {
        addRandomTile();
        render2048();
        document.getElementById('score-2048').textContent = score2048;
        if (isGameOver2048()) {
            setTimeout(() => alert('游戏结束！分数: ' + score2048), 100);
        }
    }
}

function mergeLine(line) {
    let filtered = line.filter(v => v !== 0);
    for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
            filtered[i] *= 2;
            score2048 += filtered[i];
            filtered[i + 1] = 0;
        }
    }
    filtered = filtered.filter(v => v !== 0);
    while (filtered.length < 4) filtered.push(0);
    return filtered;
}

function isGameOver2048() {
    for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++) {
            if (grid2048[r][c] === 0) return false;
            if (c < 3 && grid2048[r][c] === grid2048[r][c + 1]) return false;
            if (r < 3 && grid2048[r][c] === grid2048[r + 1][c]) return false;
        }
    return true;
}

document.addEventListener('keydown', (e) => {
    if (!document.getElementById('game-2048').classList.contains('active')) return;
    const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
    if (map[e.key]) {
        e.preventDefault();
        move2048(map[e.key]);
    }
});

let touchStartX, touchStartY;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    if (!document.getElementById('game-2048').classList.contains('active')) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
    if (Math.abs(dx) > Math.abs(dy)) {
        move2048(dx > 0 ? 'right' : 'left');
    } else {
        move2048(dy > 0 ? 'down' : 'up');
    }
});
