const signalArea = document.getElementById('signal-area');
const reassembledArea = document.getElementById('reassembled-area');
const messageArea = document.getElementById('message-area');
const levelNumberDisplay = document.getElementById('level-number');
const scoreDisplay = document.getElementById('score');

const levelsData = [
    { scrambled: ["192", ".", "168", ".", "1", ".", "100"], correct: "192.168.1.100" },
    { scrambled: ["10", ".", "0", ".", "0", ".", "1"], correct: "10.0.0.1" },
    { scrambled: ["172", ".", "16", ".", "254", ".", "10"], correct: "172.16.254.10" },
    { scrambled: ["203", ".", "0", ".", "113", ".", "45"], correct: "203.0.113.45" },
    { scrambled: ["127", ".", "0", ".", "0", ".", "1"], correct: "127.0.0.1" },
    { scrambled: ["255", ".", "255", ".", "255", ".", "0"], correct: "255.255.255.0" },
    { scrambled: ["169", ".", "254", ".", "1", ".", "10"], correct: "169.254.1.10" },
    { scrambled: ["1", ".", "1", ".", "1", ".", "1"], correct: "1.1.1.1" },
    { scrambled: ["100", ".", "200", ".", "50", ".", "150"], correct: "100.200.50.150" },
    { scrambled: ["52", ".", "168", ".", "10", ".", "25"], correct: "52.168.10.25" }
];

let currentLevel = 0;
let score = 0;
let fragments = [];
let dropTargets = [];
let correctOrder = [];

function startGame() {
    currentLevel = 0;
    score = 0;
    updateScoreDisplay();
    loadLevel();
}

function loadLevel() {
    signalArea.innerHTML = '';
    reassembledArea.innerHTML = '';
    messageArea.textContent = '';
    levelNumberDisplay.textContent = `${currentLevel + 1}`;

    const currentLevelData = levelsData[currentLevel];
    const scrambledFragments = [...currentLevelData.scrambled].sort(() => Math.random() - 0.5); // Shuffle
    correctOrder = currentLevelData.scrambled;

    fragments = scrambledFragments.map(text => {
        const fragment = document.createElement('div');
        fragment.classList.add('fragment');
        fragment.textContent = text;
        fragment.draggable = true;
        fragment.addEventListener('dragstart', dragStart);
        signalArea.appendChild(fragment);
        return { node: fragment, text: text, originalIndex: scrambledFragments.indexOf(text) };
    });

    correctOrder.forEach((_, index) => {
        const target = document.createElement('div');
        target.classList.add('drop-target');
        target.dataset.index = index;
        target.addEventListener('dragover', dragOver);
        target.addEventListener('drop', drop);
        reassembledArea.appendChild(target);
        dropTargets.push({ node: target, occupiedBy: null });
    });
}

let draggedFragment = null;

function dragStart(event) {
    draggedFragment = fragments.find(f => f.node === event.target);
    event.dataTransfer.setData('text/plain', draggedFragment.originalIndex);
    event.target.classList.add('dragging');
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    if (!draggedFragment) return;

    const dropTarget = dropTargets.find(dt => dt.node === event.target);
    if (dropTarget && dropTarget.occupiedBy === null) {
        dropTarget.node.textContent = draggedFragment.text;
        dropTarget.occupiedBy = draggedFragment;
        draggedFragment.node.style.display = 'none'; // Hide the original fragment
        checkSolution();
    } else if (dropTarget && dropTarget.occupiedBy !== null) {
        // Allow swapping? For simplicity, let's not for now.
        messageArea.textContent = "That slot is already occupied.";
        setTimeout(() => messageArea.textContent = '', 1500);
    }

    if (draggedFragment) {
        draggedFragment.node.classList.remove('dragging');
        draggedFragment = null;
    }
}

function checkSolution() {
    const currentSolution = dropTargets.map(dt => dt.occupiedBy ? dt.occupiedBy.text : '').join('');
    if (currentSolution === levelsData[currentLevel].correct) {
        messageArea.textContent = "Level Complete!";
        score += 100;
        updateScoreDisplay();
        setTimeout(() => {
            currentLevel++;
            if (currentLevel < levelsData.length) {
                loadLevel();
            } else {
                messageArea.textContent = `Game Over! Final Score: ${score}`;
            }
        }, 1500);
    } else if (!dropTargets.some(dt => dt.occupiedBy === null)) {
        messageArea.textContent = "Incorrect IP Address. Try again.";
        setTimeout(() => messageArea.textContent = '', 1500);
    }
}

function updateScoreDisplay() {
    scoreDisplay.textContent = score;
}

// Start the game when the page loads
startGame();
