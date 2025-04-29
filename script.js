const challengeTitleDisplay = document.getElementById('challenge-title');
const challengeDescriptionDisplay = document.getElementById('challenge-description');
const scrambledElementsArea = document.getElementById('scrambled-elements');
const reassemblyArea = document.getElementById('reassembly-area');
const messageArea = document.getElementById('message-area');
const levelNumberDisplay = document.getElementById('level-number');
const scoreDisplay = document.getElementById('score');
const tipsArea = document.getElementById('tips-area');
const tip1Display = document.getElementById('tip-1');
const tip2Display = document.getElementById('tip-2');
const tip3Display = document.getElementById('tip-3');
const infoTextDisplay = document.getElementById('info-text');

const levelsData = [
    {
        title: "Level 1: IP Address Assembly",
        description: "Rearrange the fragments to form a valid IP address.",
        type: "ip_address",
        scrambled: ["192", ".", "168", ".", "1", ".", "100"],
        correct: ["192", ".", "168", ".", "1", ".", "100"],
        tips: ["IP addresses have four numerical octets separated by dots.", "Each octet typically ranges from 0 to 255.", "Look for common patterns in IP address structure."],
        info: "An IP address (Internet Protocol address) is a numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication. It serves two main functions: host or network interface identification and location addressing."
    },
    {
        title: "Level 2: Password Cracking (Simple)",
        description: "Reorder the letters to form the password.",
        type: "password",
        scrambled: ["p", "s", "s", "a", "w", "o", "r", "d"],
        correct: ["p", "a", "s", "s", "w", "o", "r", "d"],
        tips: ["Look for common letter combinations.", "Consider common short words.", "Try the most frequent letters first."],
        info: "Password cracking is the process of recovering passwords from data that has been stored in or transmitted by a computer system. Common techniques include brute-force attacks, dictionary attacks, and social engineering."
    },
    {
        title: "Level 3: Basic Port Numbers",
        description: "Match the service to its common port number.",
        type: "port_number",
        scrambled: ["HTTP", "FTP", "SSH", "21", "80", "22"],
        correct: ["HTTP", "80", "FTP", "21", "SSH", "22"],
        tips: ["Think about the primary use of each service.", "Some port numbers are very well-known.", "Consider the order in which these services might be initiated."],
        info: "A port number is a communication endpoint specific to an application or a process running on a network device. Port numbers allow different applications on the same computer to use network resources simultaneously. Well-known ports (0-1023) are commonly associated with specific services."
    },
    {
        title: "Level 4: Hex Color Code",
        description: "Arrange the characters to form a valid hex color code.",
        type: "hex_color",
        scrambled: ["#", "f", "0", "0", "a", "f"],
        correct: ["#", "f", "f", "0", "0", "a"],
        tips: ["Hex color codes start with '#'.", "They consist of six hexadecimal characters (0-9 and a-f).", "Think about common color patterns (e.g., all red, all green)."],
        info: "Hexadecimal color codes are a way of specifying colors using hexadecimal values. The code itself is a triplet of six hexadecimal digits, representing the amount of red, green, and blue in the color."
    },
    {
        title: "Level 5: Simple SQL Injection",
        description: "Reorder the parts to form a basic SQL injection to bypass login.",
        type: "sql_injection",
        scrambled: ["'", "or", "1", "=", "1", "--"],
        correct: ["'", "or", "1", "=", "1", "--"],
        tips: ["SQL injection often involves manipulating conditions.", "Look for logical operators.", "--' usually signifies a comment."],
        info: "SQL injection is a code injection technique, used to attack data-driven applications, in which malicious SQL statements are inserted into an entry field for execution (e.g. to dump the database content to the attacker)."
    },
    {
        title: "Level 6: Base64 Encoding (Partial)",
        description: "Rearrange to decode a partial Base64 string.",
        type: "base64",
        scrambled: ["Y", "W", "==", "g", "A"],
        correct: ["Y", "W", "=="], // Represents "a"
        tips: ["Base64 often ends with '==' for padding.", "It uses a specific set of characters (A-Z, a-z, 0-9, +, /).", "Try to recognize common short encoded sequences."],
        info: "Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation. It's often used to transmit data over channels that only support ASCII text."
    },
    {
        title: "Level 7: Caesar Cipher (Shift 1)",
        description: "Shift the letters back to reveal the word.",
        type: "caesar_cipher",
        scrambled: ["f", "m", "p", "v", "u"],
        correct: ["e", "l", "o", "u", "t"],
        tips: ["This is a simple letter substitution cipher.", "The shift is by one position in the alphabet.", "Try shifting each letter backwards."],
        info: "A Caesar cipher is one of the simplest and most widely known encryption techniques. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet."
    },
    {
        title: "Level 8: Simple File Path",
        description: "Reconstruct the correct file path.",
        type: "file_path",
        scrambled: ["/", "home", "/", "user", "/", "documents", "/", "report.txt"],
        correct: ["/", "home", "/", "user", "/", "documents", "/", "report.txt"],
        tips: ["File paths start with a root directory (often '/').", "Directories are separated by '/'.", "The final part is usually the filename."],
        info: "A file path describes the location of a file in a computer's file system. It specifies the directory structure leading to the file."
    },
    {
        title: "Level 9: Basic Binary Code",
        description: "Arrange the binary digits to represent a decimal number (0-9).",
        type: "binary",
        scrambled: ["0", "1", "0", "1"],
        correct: ["0", "1", "0", "1"], // Represents 5
        tips: ["Binary code uses only 0s and 1s.", "Consider the place value of each digit (powers of 2 from right to left).", "The target is a single digit number."],
        info: "Binary code is a digital coding system that uses one binary digit (bit) to represent one of two possible values (0 or 1). Most digital systems use binary code as the basis for representing information."
    },
    {
        title: "Level 10: Simple Scripting Command",
        description: "Reorder the parts to form a basic command to list files.",
        type: "scripting_command",
        scrambled: ["ls", "-", "l", "a"],
        correct: ["ls", "-", "a", "l"],
        tips: ["Think about common command-line tools.", "Options often start with a hyphen '-'.", "The order of some options might matter."],
        info: "A scripting command is an instruction given to a command-line interpreter to perform a specific task. These commands are fundamental for interacting with and automating tasks on computer systems."
    }
];

let currentLevel = 0;
let score = 0;
let draggableElements = [];
let dropSlots = [];
let currentLevelData;

function startGame() {
    currentLevel = 0;
    score = 0;
    updateScoreDisplay();
    loadLevel();
}

function loadLevel() {
    challengeTitleDisplay.textContent = '';
    challengeDescriptionDisplay.textContent = '';
    scrambledElementsArea.innerHTML = '';
    reassemblyArea.innerHTML = '';
    messageArea.textContent = '';
    tipsArea.style.display = 'none';
    tip1Display.textContent = '';
    tip2Display.textContent = '';
    tip3Display.textContent = '';
    infoTextDisplay.textContent = '';
    levelNumberDisplay.textContent = `${currentLevel + 1}`;

    currentLevelData = levelsData[currentLevel];
    challengeTitleDisplay.textContent = currentLevelData.title;
    challengeDescriptionDisplay.textContent = currentLevelData.description;
    infoTextDisplay.textContent = currentLevelData.info;

    if (currentLevelData.tips && currentLevelData.tips.length > 0) {
        tipsArea.style.display = 'block';
        tip1Display.textContent = currentLevelData.tips[0] || '';
        tip2Display.textContent = currentLevelData.tips[1] || '';
        tip3Display.textContent = currentLevelData.tips[2] || '';
    }

    const scrambled = [...currentLevelData.scrambled].sort(() => Math.random() - 0.5);
    const correctLength = currentLevelData.correct.length;

    draggableElements = [];
    for (const text of scrambled) {
        const element = document.createElement('div');
        element.classList.add('draggable');
        element.textContent = text;
        element.draggable = true;
        element.addEventListener('dragstart', dragStart);
        scrambledElementsArea.appendChild(element);
        draggableElements.push({ node: element, text: text });
    }

    dropSlots = [];
    reassemblyArea.innerHTML = ''; // Clear previous drop slots
    for (let i = 0; i < correctLength; i++) {
        const slot = document.createElement('div');
        slot.classList.add('drop-slot');
        slot.dataset.index = i;
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('drop', drop);
        reassemblyArea.appendChild(slot);
        dropSlots.push({ node: slot, occupiedBy: null });
    }
}

let draggedElement = null;

function dragStart(event) {
    draggedElement = draggableElements.find(el => el.node === event.target);
    event.dataTransfer.setData('text/plain', draggedElement.text);
    event.target.classList.add('dragging');
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    if (!draggedElement) return;

    const dropSlot = dropSlots.find(slot => slot.node === event.target);
    if (dropSlot && dropSlot.occupiedBy === null) {
        dropSlot.node.textContent = draggedElement.text;
        dropSlot.occupiedBy = draggedElement;
        draggedElement.node.style.display = 'none';
        checkSolution();
    } else if (dropSlot && dropSlot.occupiedBy !== null) {
        messageArea.textContent = "That slot is already occupied.";
        setTimeout(() => messageArea.textContent = '', 1500);
    }

    if (draggedElement) {
        draggedElement.node.classList.remove('dragging');
        draggedElement = null;
    }
}

function checkSolution() {
    const currentSolution = dropSlots.map(slot => slot.occupiedBy ? slot.occupiedBy.text : '');
    if (arraysAreEqual(currentSolution, currentLevelData.correct)) {
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
    } else if (!dropSlots.some(slot => slot.occupiedBy === null) && currentSolution.some((item, index) => item !== currentLevelData.correct[index])) {
        messageArea.textContent = "Incorrect. Try again.";
        setTimeout(() => messageArea.textContent = '', 1500);
    }
}

function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

function updateScoreDisplay() {
    scoreDisplay.textContent = score;
}

// Start the game when the page loads
startGame();
