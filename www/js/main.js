function showMenu() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('menu').classList.add('active');
    document.getElementById('back-btn').classList.add('hidden');
    document.getElementById('main-header').querySelector('h1').textContent = '🎮 小游戏集合';
    stopAllGames();
}

function showGame(game) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('game-' + game).classList.add('active');
    document.getElementById('back-btn').classList.remove('hidden');
    stopAllGames();

    const names = {
        '2048': '2048',
        'snake': '贪吃蛇',
        'sudoku': '数独',
        'minesweeper': '扫雷',
        'tetris': '俄罗斯方块',
        'memory': '记忆翻牌'
    };
    document.getElementById('main-header').querySelector('h1').textContent = names[game] || game;

    switch(game) {
        case '2048': init2048(); break;
        case 'snake': initSnake(); break;
        case 'sudoku': initSudoku('easy'); break;
        case 'minesweeper': initMinesweeper(); break;
        case 'tetris': initTetris(); break;
        case 'memory': initMemory(); break;
    }
}

function stopAllGames() {
    if (window.snakeInterval) clearInterval(window.snakeInterval);
    if (window.tetrisInterval) clearInterval(window.tetrisInterval);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') showMenu();
});
