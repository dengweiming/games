let mineBoard = [];
let mineRevealed = [];
let mineFlagged = [];
let mineGameOver = false;
const mineRows = 10;
const mineCols = 10;
const mineCount = 10;

function initMinesweeper() {
    mineBoard = Array(mineRows).fill(null).map(() => Array(mineCols).fill(0));
    mineRevealed = Array(mineRows).fill(null).map(() => Array(mineCols).fill(false));
    mineFlagged = Array(mineRows).fill(null).map(() => Array(mineCols).fill(false));
    mineGameOver = false;

    let placed = 0;
    while (placed < mineCount) {
        const r = Math.floor(Math.random() * mineRows);
        const c = Math.floor(Math.random() * mineCols);
        if (mineBoard[r][c] !== -1) {
            mineBoard[r][c] = -1;
            placed++;
        }
    }

    for (let r = 0; r < mineRows; r++) {
        for (let c = 0; c < mineCols; c++) {
            if (mineBoard[r][c] === -1) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++)
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < mineRows && nc >= 0 && nc < mineCols && mineBoard[nr][nc] === -1) count++;
                }
            mineBoard[r][c] = count;
        }
    }

    document.getElementById('mines-left').textContent = mineCount;
    renderMinesweeper();
}

function renderMinesweeper() {
    const container = document.getElementById('minesweeper-board');
    container.innerHTML = '';
    for (let r = 0; r < mineRows; r++) {
        for (let c = 0; c < mineCols; c++) {
            const cell = document.createElement('button');
            cell.className = 'mine-cell';
            if (mineRevealed[r][c]) {
                cell.classList.add('revealed');
                if (mineBoard[r][c] === -1) {
                    cell.classList.add('mine');
                    cell.textContent = '💣';
                } else if (mineBoard[r][c] > 0) {
                    cell.textContent = mineBoard[r][c];
                    cell.dataset.num = mineBoard[r][c];
                }
            } else if (mineFlagged[r][c]) {
                cell.classList.add('flagged');
                cell.textContent = '🚩';
            }
            cell.onclick = () => revealMineCell(r, c);
            cell.oncontextmenu = (e) => { e.preventDefault(); flagMineCell(r, c); };
            container.appendChild(cell);
        }
    }
}

function revealMineCell(r, c) {
    if (mineGameOver || mineFlagged[r][c] || mineRevealed[r][c]) return;
    mineRevealed[r][c] = true;

    if (mineBoard[r][c] === -1) {
        mineGameOver = true;
        for (let i = 0; i < mineRows; i++)
            for (let j = 0; j < mineCols; j++)
                if (mineBoard[i][j] === -1) mineRevealed[i][j] = true;
        renderMinesweeper();
        setTimeout(() => alert('踩到地雷了！'), 100);
        return;
    }

    if (mineBoard[r][c] === 0) {
        for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < mineRows && nc >= 0 && nc < mineCols) revealMineCell(nr, nc);
            }
    }

    renderMinesweeper();
    checkMineWin();
}

function flagMineCell(r, c) {
    if (mineGameOver || mineRevealed[r][c]) return;
    mineFlagged[r][c] = !mineFlagged[r][c];
    const flagCount = mineFlagged.flat().filter(f => f).length;
    document.getElementById('mines-left').textContent = mineCount - flagCount;
    renderMinesweeper();
}

function checkMineWin() {
    let revealedCount = 0;
    for (let r = 0; r < mineRows; r++)
        for (let c = 0; c < mineCols; c++)
            if (mineRevealed[r][c]) revealedCount++;
    if (revealedCount === mineRows * mineCols - mineCount) {
        mineGameOver = true;
        setTimeout(() => alert('恭喜！你赢了！'), 100);
    }
}
