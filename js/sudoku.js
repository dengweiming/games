let sudokuBoard = [];
let sudokuSolution = [];
let sudokuGiven = [];
let sudokuSelected = null;

function initSudoku(difficulty) {
    document.querySelectorAll('.difficulty-selector button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    sudokuSolution = generateSudokuSolution();
    const removeCount = {easy: 35, medium: 45, hard: 55}[difficulty] || 35;
    sudokuBoard = sudokuSolution.map(r => [...r]);
    sudokuGiven = Array(9).fill(null).map(() => Array(9).fill(true));

    let removed = 0;
    while (removed < removeCount) {
        const r = Math.floor(Math.random() * 9);
        const c = Math.floor(Math.random() * 9);
        if (sudokuBoard[r][c] !== 0) {
            sudokuBoard[r][c] = 0;
            sudokuGiven[r][c] = false;
            removed++;
        }
    }

    sudokuSelected = null;
    renderSudoku();
}

function generateSudokuSolution() {
    const board = Array(9).fill(null).map(() => Array(9).fill(0));
    solveSudoku(board);
    return board;
}

function solveSudoku(board) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                const nums = shuffle([1,2,3,4,5,6,7,8,9]);
                for (const num of nums) {
                    if (isValidSudoku(board, r, c, num)) {
                        board[r][c] = num;
                        if (solveSudoku(board)) return true;
                        board[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValidSudoku(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;
        if (board[i][col] === num) return false;
    }
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++)
        for (let c = bc; c < bc + 3; c++)
            if (board[r][c] === num) return false;
    return true;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function renderSudoku() {
    const container = document.getElementById('sudoku-board');
    container.innerHTML = '';
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('button');
            cell.className = 'sudoku-cell';
            if (sudokuGiven[r][c]) cell.classList.add('given');
            if (sudokuSelected && sudokuSelected[0] === r && sudokuSelected[1] === c) cell.classList.add('selected');
            cell.textContent = sudokuBoard[r][c] || '';
            cell.onclick = () => selectSudokuCell(r, c);
            container.appendChild(cell);
        }
    }
}

function selectSudokuCell(r, c) {
    if (sudokuGiven[r][c]) return;
    sudokuSelected = [r, c];
    renderSudoku();
}

function sudokuInput(num) {
    if (!sudokuSelected) return;
    const [r, c] = sudokuSelected;
    if (sudokuGiven[r][c]) return;
    sudokuBoard[r][c] = num;
    renderSudoku();
}

function sudokuClear() {
    if (!sudokuSelected) return;
    const [r, c] = sudokuSelected;
    if (sudokuGiven[r][c]) return;
    sudokuBoard[r][c] = 0;
    renderSudoku();
}

function checkSudoku() {
    const cells = document.querySelectorAll('.sudoku-cell');
    let allCorrect = true;
    let idx = 0;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (!sudokuGiven[r][c] && sudokuBoard[r][c] !== 0) {
                if (sudokuBoard[r][c] === sudokuSolution[r][c]) {
                    cells[idx].classList.add('correct');
                } else {
                    cells[idx].classList.add('error');
                    allCorrect = false;
                }
            }
            if (sudokuBoard[r][c] === 0 && !sudokuGiven[r][c]) allCorrect = false;
            idx++;
        }
    }
    if (allCorrect) setTimeout(() => alert('恭喜！你完成了数独！'), 100);
}

document.addEventListener('keydown', (e) => {
    if (!document.getElementById('game-sudoku').classList.contains('active')) return;
    if (e.key >= '1' && e.key <= '9') sudokuInput(parseInt(e.key));
    if (e.key === 'Backspace' || e.key === 'Delete') sudokuClear();
});
