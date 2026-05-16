const tetrisCols = 10;
const tetrisRows = 20;
const tetrisBlockSize = 30;
let tetrisBoard = [];
let tetrisPiece = null;
let tetrisNextPiece = null;
let tetrisScore = 0;
let tetrisGameOver = false;

const tetrisShapes = [
    [[1,1,1,1]],
    [[1,1],[1,1]],
    [[0,1,0],[1,1,1]],
    [[1,0,0],[1,1,1]],
    [[0,0,1],[1,1,1]],
    [[1,1,0],[0,1,1]],
    [[0,1,1],[1,1,0]]
];

const tetrisColors = ['#00f0f0', '#f0f000', '#a000f0', '#0000f0', '#f0a000', '#00f000', '#f00000'];

function initTetris() {
    if (window.tetrisInterval) clearInterval(window.tetrisInterval);
    tetrisBoard = Array(tetrisRows).fill(null).map(() => Array(tetrisCols).fill(0));
    tetrisScore = 0;
    tetrisGameOver = false;
    document.getElementById('score-tetris').textContent = '0';
    tetrisNextPiece = randomTetrisPiece();
    spawnTetrisPiece();
    window.tetrisInterval = setInterval(tetrisTick, 500);
}

function randomTetrisPiece() {
    const idx = Math.floor(Math.random() * tetrisShapes.length);
    return { shape: tetrisShapes[idx], color: tetrisColors[idx], x: 0, y: 0 };
}

function spawnTetrisPiece() {
    tetrisPiece = tetrisNextPiece;
    tetrisPiece.x = Math.floor((tetrisCols - tetrisPiece.shape[0].length) / 2);
    tetrisPiece.y = 0;
    tetrisNextPiece = randomTetrisPiece();
    drawTetrisNext();

    if (!isValidTetris(tetrisPiece.shape, tetrisPiece.x, tetrisPiece.y)) {
        tetrisGameOver = true;
        clearInterval(window.tetrisInterval);
        setTimeout(() => alert('游戏结束！分数: ' + tetrisScore), 100);
    }
}

function isValidTetris(shape, px, py) {
    for (let r = 0; r < shape.length; r++)
        for (let c = 0; c < shape[r].length; c++)
            if (shape[r][c]) {
                const x = px + c, y = py + r;
                if (x < 0 || x >= tetrisCols || y >= tetrisRows) return false;
                if (y >= 0 && tetrisBoard[y][x]) return false;
            }
    return true;
}

function tetrisTick() {
    if (tetrisGameOver) return;
    if (isValidTetris(tetrisPiece.shape, tetrisPiece.x, tetrisPiece.y + 1)) {
        tetrisPiece.y++;
    } else {
        lockTetrisPiece();
        clearTetrisLines();
        spawnTetrisPiece();
    }
    drawTetris();
}

function lockTetrisPiece() {
    const {shape, x, y, color} = tetrisPiece;
    for (let r = 0; r < shape.length; r++)
        for (let c = 0; c < shape[r].length; c++)
            if (shape[r][c] && y + r >= 0) tetrisBoard[y + r][x + c] = color;
}

function clearTetrisLines() {
    let lines = 0;
    for (let r = tetrisRows - 1; r >= 0; r--) {
        if (tetrisBoard[r].every(c => c !== 0)) {
            tetrisBoard.splice(r, 1);
            tetrisBoard.unshift(Array(tetrisCols).fill(0));
            lines++;
            r++;
        }
    }
    if (lines > 0) {
        tetrisScore += [0, 100, 300, 500, 800][lines];
        document.getElementById('score-tetris').textContent = tetrisScore;
    }
}

function rotateTetrisPiece() {
    const shape = tetrisPiece.shape;
    const rows = shape.length, cols = shape[0].length;
    const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            rotated[c][rows - 1 - r] = shape[r][c];
    if (isValidTetris(rotated, tetrisPiece.x, tetrisPiece.y)) {
        tetrisPiece.shape = rotated;
    }
}

function tetrisAction(action) {
    if (tetrisGameOver) return;
    switch(action) {
        case 'left':
            if (isValidTetris(tetrisPiece.shape, tetrisPiece.x - 1, tetrisPiece.y)) tetrisPiece.x--;
            break;
        case 'right':
            if (isValidTetris(tetrisPiece.shape, tetrisPiece.x + 1, tetrisPiece.y)) tetrisPiece.x++;
            break;
        case 'down':
            if (isValidTetris(tetrisPiece.shape, tetrisPiece.x, tetrisPiece.y + 1)) tetrisPiece.y++;
            break;
        case 'rotate':
            rotateTetrisPiece();
            break;
        case 'drop':
            while (isValidTetris(tetrisPiece.shape, tetrisPiece.x, tetrisPiece.y + 1)) tetrisPiece.y++;
            break;
    }
    drawTetris();
}

function drawTetris() {
    const canvas = document.getElementById('tetris-canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < tetrisRows; r++)
        for (let c = 0; c < tetrisCols; c++)
            if (tetrisBoard[r][c]) {
                ctx.fillStyle = tetrisBoard[r][c];
                ctx.fillRect(c * tetrisBlockSize, r * tetrisBlockSize, tetrisBlockSize - 1, tetrisBlockSize - 1);
            }

    if (tetrisPiece) {
        ctx.fillStyle = tetrisPiece.color;
        for (let r = 0; r < tetrisPiece.shape.length; r++)
            for (let c = 0; c < tetrisPiece.shape[r].length; c++)
                if (tetrisPiece.shape[r][c])
                    ctx.fillRect((tetrisPiece.x + c) * tetrisBlockSize, (tetrisPiece.y + r) * tetrisBlockSize, tetrisBlockSize - 1, tetrisBlockSize - 1);
    }
}

function drawTetrisNext() {
    const canvas = document.getElementById('tetris-next');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!tetrisNextPiece) return;
    const shape = tetrisNextPiece.shape;
    const bs = 25;
    const ox = (canvas.width - shape[0].length * bs) / 2;
    const oy = (canvas.height - shape.length * bs) / 2;
    ctx.fillStyle = tetrisNextPiece.color;
    for (let r = 0; r < shape.length; r++)
        for (let c = 0; c < shape[r].length; c++)
            if (shape[r][c])
                ctx.fillRect(ox + c * bs, oy + r * bs, bs - 1, bs - 1);
}

document.addEventListener('keydown', (e) => {
    if (!document.getElementById('game-tetris').classList.contains('active')) return;
    const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'down', ArrowUp: 'rotate', ' ': 'drop' };
    if (map[e.key]) {
        e.preventDefault();
        tetrisAction(map[e.key]);
    }
});
