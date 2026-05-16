let memoryCards = [];
let memoryFlipped = [];
let memoryMatched = [];
let memoryMoves = 0;
let memoryLocked = false;

const memoryEmojis = ['🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍒', '🥝'];

function initMemory() {
    const pairs = [...memoryEmojis, ...memoryEmojis];
    memoryCards = shuffle([...pairs]);
    memoryFlipped = [];
    memoryMatched = [];
    memoryMoves = 0;
    memoryLocked = false;
    document.getElementById('score-memory').textContent = '0';
    renderMemory();
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function renderMemory() {
    const container = document.getElementById('memory-board');
    container.innerHTML = '';
    memoryCards.forEach((emoji, i) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        if (memoryFlipped.includes(i) || memoryMatched.includes(i)) {
            card.textContent = emoji;
            card.classList.add('flipped');
        } else {
            card.textContent = '?';
        }
        if (memoryMatched.includes(i)) card.classList.add('matched');
        card.onclick = () => flipMemoryCard(i);
        container.appendChild(card);
    });
}

function flipMemoryCard(idx) {
    if (memoryLocked || memoryFlipped.includes(idx) || memoryMatched.includes(idx)) return;
    if (memoryFlipped.length >= 2) return;

    memoryFlipped.push(idx);
    renderMemory();

    if (memoryFlipped.length === 2) {
        memoryMoves++;
        document.getElementById('score-memory').textContent = memoryMoves;
        memoryLocked = true;

        const [a, b] = memoryFlipped;
        if (memoryCards[a] === memoryCards[b]) {
            memoryMatched.push(a, b);
            memoryFlipped = [];
            memoryLocked = false;
            renderMemory();
            if (memoryMatched.length === memoryCards.length) {
                setTimeout(() => alert('恭喜！你用了 ' + memoryMoves + ' 步完成配对！'), 200);
            }
        } else {
            setTimeout(() => {
                memoryFlipped = [];
                memoryLocked = false;
                renderMemory();
            }, 800);
        }
    }
}
