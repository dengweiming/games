let snake = [];
let snakeDir = 'right';
let snakeNextDir = 'right';
let snakeFood = {};
let snakeScore = 0;
const snakeSize = 20;
const snakeGridSize = 20;

function initSnake() {
    if (window.snakeInterval) clearInterval(window.snakeInterval);
    snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
    snakeDir = 'right';
    snakeNextDir = 'right';
    snakeScore = 0;
    document.getElementById('score-snake').textContent = '0';
    placeSnakeFood();
    window.snakeInterval = setInterval(updateSnake, 120);
}

function placeSnakeFood() {
    do {
        snakeFood = {
            x: Math.floor(Math.random() * snakeGridSize),
            y: Math.floor(Math.random() * snakeGridSize)
        };
    } while (snake.some(s => s.x === snakeFood.x && s.y === snakeFood.y));
}

function updateSnake() {
    snakeDir = snakeNextDir;
    const head = {...snake[0]};
    switch(snakeDir) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    if (head.x < 0 || head.x >= snakeGridSize || head.y < 0 || head.y >= snakeGridSize ||
        snake.some(s => s.x === head.x && s.y === head.y)) {
        clearInterval(window.snakeInterval);
        setTimeout(() => alert('游戏结束！分数: ' + snakeScore), 50);
        return;
    }

    snake.unshift(head);

    if (head.x === snakeFood.x && head.y === snakeFood.y) {
        snakeScore += 10;
        document.getElementById('score-snake').textContent = snakeScore;
        placeSnakeFood();
    } else {
        snake.pop();
    }

    drawSnake();
}

function drawSnake() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x <= snakeGridSize; x++) {
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        ctx.moveTo(x * snakeSize, 0);
        ctx.lineTo(x * snakeSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, x * snakeSize);
        ctx.lineTo(canvas.width, x * snakeSize);
        ctx.stroke();
    }

    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(snakeFood.x * snakeSize + snakeSize/2, snakeFood.y * snakeSize + snakeSize/2, snakeSize/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    snake.forEach((seg, i) => {
        const brightness = 1 - (i / snake.length) * 0.5;
        ctx.fillStyle = `rgba(46, 204, 113, ${brightness})`;
        ctx.fillRect(seg.x * snakeSize + 1, seg.y * snakeSize + 1, snakeSize - 2, snakeSize - 2);
    });
}

function setSnakeDir(dir) {
    const opposites = {up: 'down', down: 'up', left: 'right', right: 'left'};
    if (dir !== opposites[snakeDir]) snakeNextDir = dir;
}

document.addEventListener('keydown', (e) => {
    if (!document.getElementById('game-snake').classList.contains('active')) return;
    const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    if (map[e.key]) {
        e.preventDefault();
        setSnakeDir(map[e.key]);
    }
});
