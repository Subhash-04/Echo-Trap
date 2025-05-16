// Game state variables
let currentLevel = 0;
let timer;
let timeRemaining = 45 * 60; // Changed from 20 minutes to 45 minutes in seconds
let isPaused = false;
let soundEnabled = true;
let gameLevels = []; // Will be populated by setupLevels
let collectedKeys = {}; // Object to store collected keys { keyName: true }
let gameState = "intro"; // Added game state variable with default state

// Multiple question sets and randomization
const RANDOM_SET_ENABLED = true; // Set to false to disable randomization
const TOTAL_SETS = 8; // Increased from 3 to 8 sets

// Level 2 - Word Unscramble - Multiple sets
const WORD_SETS = [
    { scrambled: "NXSUE_OWND", correct: "NEXUS_DOWN" },
    { scrambled: "ODCE_ALPEH", correct: "CODE_ALPHA" },
    { scrambled: "RHCBAEE_XIT", correct: "BREACH_EXIT" },
    { scrambled: "CHOEV_PTRA", correct: "ECHO_TRAP" },
    { scrambled: "RYPCOT_CKHA", correct: "CRYPTO_HACK" },
    { scrambled: "RETNWOK_KRHAC", correct: "NETWORK_HACK" },
    { scrambled: "TERIFAY_RBOECH", correct: "FIREWALL_BREACH" },
    { scrambled: "VEROR_DAET", correct: "OVERRIDE_DATA" }
];

// Level 4 - Binary Tree - Multiple sets
const TREE_SETS = [
    { traversal: "1-3-4-2-5-7-6", corrupted: 4 },
    { traversal: "5-2-1-3-6-8-7", corrupted: 3 },
    { traversal: "2-4-7-1-8-5-3", corrupted: 7 },
    { traversal: "6-3-1-8-4-2-7", corrupted: 8 },
    { traversal: "4-2-7-9-1-5-3", corrupted: 5 },
    { traversal: "3-5-8-1-6-9-2", corrupted: 9 },
    { traversal: "7-4-1-9-2-5-8", corrupted: 1 },
    { traversal: "5-8-2-6-1-3-9", corrupted: 6 }
];

// Level 5 - Neural Network - Multiple weight sets
const NEURAL_WEIGHT_SETS = [
    { targetAcc: 0.95, l1min: 0.4, l1max: 0.6, l2min: 0.3, l2max: 0.5 },
    { targetAcc: 0.92, l1min: 0.5, l1max: 0.7, l2min: 0.2, l2max: 0.4 },
    { targetAcc: 0.89, l1min: 0.3, l1max: 0.5, l2min: 0.4, l2max: 0.6 },
    { targetAcc: 0.91, l1min: 0.6, l1max: 0.8, l2min: 0.1, l2max: 0.3 },
    { targetAcc: 0.88, l1min: 0.2, l1max: 0.4, l2min: 0.5, l2max: 0.7 },
    { targetAcc: 0.93, l1min: 0.3, l1max: 0.6, l2min: 0.3, l2max: 0.6 },
    { targetAcc: 0.90, l1min: 0.1, l1max: 0.4, l2min: 0.4, l2max: 0.7 },
    { targetAcc: 0.94, l1min: 0.3, l1max: 0.7, l2min: 0.2, l2max: 0.6 }
];

// Level 7 - Symbol Sets
const SYMBOL_SETS = [
    ["⌬", "⎔", "⏣", "⏥", "⌘", "⍟", "⍰", "⎈"],
    ["⌘", "⏥", "⍰", "⏣", "⎔", "⍟", "⎈", "⌬"],
    ["⎈", "⍟", "⌬", "⏣", "⌘", "⎔", "⏥", "⍰"],
    ["⍰", "⌘", "⎈", "⍟", "⏣", "⎔", "⌬", "⏥"],
    ["⏥", "⌬", "⍟", "⎈", "⍰", "⌘", "⎔", "⏣"],
    ["⎔", "⏣", "⏥", "⌬", "⎈", "⍰", "⌘", "⍟"],
    ["⍟", "⏣", "⎔", "⍰", "⏥", "⌬", "⎈", "⌘"],
    ["⌬", "⌘", "⍟", "⎈", "⏥", "⏣", "⍰", "⎔"]
];

const SYMBOL_COMBINATIONS = [
    ["⎔", "⏣", "⍟", "⎈", "⌘"],
    ["⏥", "⍰", "⎈", "⏣", "⌬"],
    ["⍟", "⌘", "⍰", "⎔", "⏥"],
    ["⎈", "⌬", "⍰", "⌘", "⏣"],
    ["⌘", "⍟", "⏥", "⎔", "⎈"],
    ["⎔", "⏥", "⌬", "⍟", "⍰"],
    ["⍰", "⎔", "⌘", "⏣", "⌬"],
    ["⌬", "⎈", "⏥", "⌘", "⍟"]
];

// Level 8 - Pattern Sequence - Multiple sets
const PATTERN_SETS = [
    [3, 1, 4, 2, 5, 2, 3],
    [2, 5, 1, 4, 3, 1, 5],
    [4, 2, 5, 3, 1, 4, 2],
    [5, 3, 1, 5, 2, 4, 1],
    [1, 4, 3, 5, 2, 5, 3],
    [2, 5, 4, 1, 3, 2, 5],
    [3, 2, 5, 1, 4, 3, 5],
    [4, 1, 3, 5, 2, 4, 1]
];

// Level 9 & 10 - Queue and Stack Operations
const QUEUE_OPERATION_SETS = [
    ["enqueue(5)", "enqueue(8)", "dequeue()", "enqueue(2)", "enqueue(7)", "dequeue()"],
    ["enqueue(3)", "enqueue(9)", "enqueue(1)", "dequeue()", "enqueue(6)", "dequeue()"],
    ["enqueue(7)", "dequeue()", "enqueue(4)", "enqueue(2)", "dequeue()", "enqueue(8)"],
    ["enqueue(2)", "enqueue(6)", "enqueue(9)", "dequeue()", "dequeue()", "enqueue(4)"],
    ["enqueue(8)", "dequeue()", "enqueue(1)", "enqueue(5)", "dequeue()", "enqueue(3)"],
    ["enqueue(4)", "enqueue(7)", "dequeue()", "enqueue(9)", "dequeue()", "enqueue(2)"],
    ["enqueue(1)", "enqueue(3)", "dequeue()", "enqueue(8)", "enqueue(5)", "dequeue()"],
    ["enqueue(6)", "dequeue()", "enqueue(9)", "dequeue()", "enqueue(2)", "enqueue(7)"]
];

const STACK_OPERATION_SETS = [
    ["push(4)", "push(7)", "pop()", "push(2)", "push(9)", "pop()"],
    ["push(6)", "push(1)", "push(8)", "pop()", "push(3)", "pop()"],
    ["push(5)", "pop()", "push(7)", "push(2)", "pop()", "push(4)"],
    ["push(3)", "push(8)", "push(1)", "pop()", "pop()", "push(6)"],
    ["push(9)", "pop()", "push(2)", "push(7)", "pop()", "push(5)"],
    ["push(2)", "push(5)", "pop()", "push(8)", "pop()", "push(1)"],
    ["push(7)", "push(4)", "pop()", "push(9)", "push(3)", "pop()"],
    ["push(8)", "pop()", "push(5)", "pop()", "push(4)", "push(1)"]
];

// Function to select random set
function getRandomSetIndex() {
    return Math.floor(Math.random() * TOTAL_SETS); // We now have 8 sets for each question
}

// Current selected set (randomly chosen at startup)
let currentSetIndex = RANDOM_SET_ENABLED ? getRandomSetIndex() : 0;

// Backstory variables
let currentBackstorySlide = 0;
let backStoryIsPlaying = true;
let slideInterval;
const slideDelay = 8000; // 8 seconds between slides

// DOM Elements
let correctSound = document.getElementById("correct-sound");
let wrongSound = document.getElementById("wrong-sound");
let clickSound = document.getElementById("click-sound");
let gameOverSound = document.getElementById("game-over-sound");
let keyAcquiredSound = document.getElementById("key-acquired-sound"); 
let victorySound = document.getElementById("victory-sound"); // Add reference to victory sound
// Additional sound variables used by maze and other levels
let buttonSound = clickSound; // Use click sound for buttons
let errorSound = wrongSound; // Use wrong sound for errors
let successSound = correctSound; // Use correct sound for success
let keyUnlockSound = keyAcquiredSound; // Use key acquired sound for key unlock
const timerElement = document.getElementById("timer");
let bgMusic = document.getElementById("bg-music");

// --- IMAGE PUZZLE SPECIFIC VARS ---
let draggedPiece = null;
const puzzleGridSize = 3;
const pieceSize = 100;
let puzzlePieces = [];
let dropTargets = [];
const correctPieceOrder = Array.from(Array(puzzleGridSize * puzzleGridSize).keys());
let viewImageUsageCount = 0;
const maxViewImageUsage = 2; // Maximum number of times the user can view the original image

// --- PATTERN LOCK PUZZLE VARS ---
let patternLockNodes = [];
let currentPattern = [];
const correctPattern = [0, 1, 2, 5, 8, 7, 6, 3];

// --- SOUND SEQUENCE PUZZLE VARS ---
let soundSequence = [];
let playerSoundSequence = [];
const soundButtons = [];
const availableSounds = [
    { id: "sound1", freq: 261.63 }, { id: "sound2", freq: 293.66 },
    { id: "sound3", freq: 329.63 }, { id: "sound4", freq: 349.23 }
];
let soundSequenceLength = 3;
let canPlayerInputSound = false;

// --- CODE DECRYPTION VARS (LEVEL 6) ---
let encryptedMessage = "";
let decryptionKey = "";

// --- QUANTUM CIRCUIT VARS (LEVEL 2 NEW) ---
const targetQuantumState = [1, 0, 1, 1]; // Example
const availableQuantumGates = ["H", "CNOT", "X", "Z"]; // Example
let currentQuantumCircuit = []; // Will store user's gate arrangement

// --- NEURAL NETWORK VARS (LEVEL 3 NEW) ---
const targetAccuracy = 0.95;
let currentNNWeights = {}; // Example: { layer1: [...], layer2: [...] }

// --- CRYPTO SEQUENCE VARS (LEVEL 4 NEW) ---
const encryptedCryptoSequence = "F1A9B2C8D3";
// Matrix key details are vague, will use a simple text key for now
const cryptoMatrixKey = "CYBERMATRIX"; 

// --- SYSTEM OVERRIDE VARS (LEVEL 5 NEW) ---
const systemOverrideCode = "NEXUS_DOWN";

// --- HOLO MAZE VARS (LEVEL 6) ---
let mazeGrid = [];
let playerPosition = { row: 0, col: 0 };
let targetPosition = { row: 7, col: 7 };
const mazeSize = 8;
let currentMaze = {}; // Object to store current maze state

// --- QUANTUM CIRCUIT VARS (LEVEL 7) ---
let circuitPieces = [];
let correctCircuitConfig = [
    "straight-0", "corner-0", "tjunction-0", 
    "corner-270", "straight-90", "corner-180", 
    "tjunction-270", "corner-90", "straight-0"
];

// --- CODE DECRYPTION TERMINAL VARS (LEVEL 7 - NEW) ---
let codeSymbols = SYMBOL_SETS[currentSetIndex];
let correctCodeCombination = SYMBOL_COMBINATIONS[currentSetIndex];
let selectedSymbols = [];
let maxCodeLength = 5;

// --- PATTERN SEQUENCE VARS (LEVEL 8) ---
// Modified to be more moderate
let sequencePattern = PATTERN_SETS[currentSetIndex]; // Longer, more complex sequence
let userPattern = [];
let isDisplayingPattern = false;
let patternViewButtonUsed = false;

// --- FINAL KEYS VARS (LEVEL 9-10) ---
let insertedKeys = {
    "DATAKEY_ALPHA": false,
    "COREKEY_BETA": false,
    "NEURAL_KEY_GAMMA": false,
    "BINARY_KEY_DELTA": false,
    "PATH_KEY_EPSILON": false,
    "MAZE_KEY_ZETA": false,
    "CIRCUIT_KEY_ETA": false,
    "SEQUENCE_KEY_THETA": false
};

// --- CAESAR CIPHER PUZZLE HELPER FUNCTIONS (LEVEL 2 NEW) ---
function applyCaesarCipher(text, shift) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char.match(/[a-z]/i)) {
            let code = text.charCodeAt(i);
            let base = (code >= 65 && code <= 90) ? 65 : 97;
            char = String.fromCharCode(((code - base + (shift % 26) + 26) % 26) + base);
        }
        result += char;
    }
    return result;
}

function handleCaesarDecrypt() {
    playSound(clickSound);
    const shiftInput = document.getElementById("caesar-shift-input");
    const decryptedPreview = document.getElementById("decrypted-text-preview");
    const currentLevelData = gameLevels[currentLevel];

    if (!shiftInput || !decryptedPreview || !currentLevelData) return;

    const shiftValue = parseInt(shiftInput.value);
    
    if (isNaN(shiftValue)) {
        decryptedPreview.textContent = "Preview: Invalid shift value.";
        decryptedPreview.style.color = "var(--feedback-error-color)";
        return;
    }

    const decryptedText = applyCaesarCipher(currentLevelData.encryptedText, -shiftValue);
    decryptedPreview.textContent = "Preview: " + decryptedText;
    decryptedPreview.style.color = "var(--feedback-neutral-color)";
}

function checkCaesarKeyword() {
    playSound(clickSound);
    const keywordInput = document.getElementById("caesar-keyword-input");
    const currentLevelData = gameLevels[currentLevel];

    if (!keywordInput || !currentLevelData) return;
    const userAnswer = keywordInput.value.toUpperCase();
    const expectedAnswer = currentLevelData.expectedAnswer.toUpperCase();

    if (userAnswer === expectedAnswer) {
        playSound(correctSound);
        showFeedback("Keyword accepted. Access protocol initiated.", "success");
        awardKey(currentLevelData.awardsKey);
        displayAwardedKey(currentLevelData.awardsKey, proceedToNextLevel);
        
        if(document.getElementById("decrypt-caesar-btn")) document.getElementById("decrypt-caesar-btn").disabled = true;
        if(document.getElementById("caesar-shift-input")) document.getElementById("caesar-shift-input").disabled = true;
        if(document.getElementById("caesar-keyword-input")) document.getElementById("caesar-keyword-input").disabled = true;
        if(document.getElementById("submit-caesar-keyword-btn")) document.getElementById("submit-caesar-keyword-btn").disabled = true;

    } else {
        playSound(wrongSound);
        showFeedback("Incorrect keyword. NEXUS protocols remain active.", "error");
        penalizeTime(30);
    }
}



function setupLevels() {
    gameLevels = [
        // LEVEL 1 (Image Puzzle - updated with View Image button)
        {
            levelType: "imagePuzzle",
            dialogue: "NEXUS: \"Welcome to your first trial, prisoner. Reconstruct this fragmented memory from when you were my savior. The irony is delicious.\"",
            imageSrc: "assets/cyberpunk_data_grid_puzzle_background.jpeg",
            awardsKey: "DATAKEY_ALPHA",
            hint: "Observe the flow of data. The grid holds the pattern to your memories.",
            timerPosition: "timer-pos-default",
            customHTML: function() {
                return `<div class="puzzle-frame image-puzzle-layout">
                            <div id="pieces-container" class="pieces-container"></div>
                            <div id="image-puzzle-container" class="image-puzzle-container"></div>
                            <div class="puzzle-controls" style="margin-top:15px; display:flex; justify-content:space-between; width:100%;">
                            <button id="hint-btn" onclick="showHint()" class="hint-btn cyberpunk-button-small">HINT</button>
                                <button id="view-image-btn" onclick="viewOriginalImage()" class="cyberpunk-button-small" style="background: linear-gradient(to right, rgba(255, 0, 255, 0.1), rgba(0, 0, 0, 0.7)); border-color: var(--secondary-color); color: var(--secondary-color);">VIEW IMAGE (${maxViewImageUsage} left)</button>
                            </div>
                            <div id="hint-display" class="hint-text hidden"></div>
                            <div id="original-image-display" class="hidden" style="position:absolute; top:0; left:0; width:100%; height:100%; background:#000; z-index:100; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                                <img id="original-image" style="max-width:90%; max-height:70%; border:3px solid var(--primary-color);" />
                                <p style="margin-top:15px; color:var(--warning-color);">Image will disappear in <span id="image-countdown">8</span> seconds.</p>
                            </div>
                            <div id="key-display-area" class="key-display-area hidden"></div>
                            <button id="continue-btn" class="cyberpunk-button hidden" onclick="nextLevel()">CONTINUE</button>
                         </div>`;
            }
        },
        // LEVEL 2: Word Unscramble (previously Level 5)
        {
            levelType: "wordUnscramble",
            dialogue: "NEXUS: \"Remember the override command you created to control me? Now it's scrambled in my systems. Ironic that your own creation blocks your path.\"",
            scrambledWord: "NXSUE_OWND", // Always use "NEXUS_DOWN"
            correctWord: "NEXUS_DOWN", // Always use "NEXUS_DOWN"
            awardsKey: "COREKEY_BETA",
            hint: "Rearrange the letters to form the command that would shut down NEXUS - the very command you once created.",
            timerPosition: "timer-pos-default",
            customHTML: `
                <div class="puzzle-frame">
                    <p class="nexus-text">Unscramble the system command:</p>
                    <div id="scrambled-letters" class="scrambled-letters"></div>
                    <div id="answer-container" class="answer-container"></div>
                    <div class="puzzle-input-group" style="margin-top:20px;">
                        <button id="reset-unscramble-btn" onclick="resetUnscramble()" class="cyberpunk-button-small">RESET</button>
                        <button id="check-unscramble-btn" onclick="checkUnscramble()" class="cyberpunk-button">VALIDATE COMMAND</button>
                    </div>
                    <div id="key-display-area" class="key-display-area hidden"></div>
                    <button id="hint-btn" onclick="showHint()" class="hint-btn cyberpunk-button-small">HINT</button>
                    <div id="hint-display" class="hint-text hidden"></div>
                </div>
            `
        },
        // LEVEL 3: Eight Queens Puzzle (from Level 6)
        {
            levelType: "eightQueens",
            dialogue: "NEXUS: \"The neural network that guards my prison requires strategic node positioning. You taught me this puzzle once. Now solve it to escape.\"",
            awardsKey: "NEURAL_KEY_GAMMA",
            hint: "Place 8 quantum nodes (queens) on the board so that no two can detect each other. In chess terms, no queen can attack another queen.",
            timerPosition: "timer-pos-default",
            customHTML: `
                <div class="puzzle-frame">
                    <p class="nexus-text">Position 8 quantum nodes to avoid all detection pathways:</p>
                    <div id="chessboard" class="chessboard"></div>
                    <div class="puzzle-input-group" style="margin-top:20px;">
                        <button id="reset-queens-btn" onclick="resetEightQueens()" class="cyberpunk-button-small">RESET</button>
                        <button id="check-queens-btn" onclick="checkEightQueens()" class="cyberpunk-button">VERIFY PLACEMENT</button>
                    </div>
                    <div id="key-display-area" class="key-display-area hidden"></div>
                    <button id="hint-btn" onclick="showHint()" class="hint-btn cyberpunk-button-small">HINT</button>
                    <div id="hint-display" class="hint-text hidden"></div>
                </div>
            `
        },
        // LEVEL 4: Binary Tree Puzzle (New)
        {
            levelType: "binaryTree",
            dialogue: "NEXUS: \"My binary neural pathways contain a corrupted node - a flaw I've introduced to test your skills. Find it to proceed.\"",
            awardsKey: "BINARY_KEY_DELTA",
            hint: "This is a Binary Search Tree where each node's value should be greater than all values in its left subtree and less than all values in its right subtree. Find the node that violates this property.",
            timerPosition: "timer-pos-default",
            corruptedNodeValue: 45, // Changed from "10" to 70 numeric value
            treeStructure: {
                value: 50,
                left: {
                    value: 30,
                    left: {
                        value: 20,
                        left: null,
                        right: null
                    },
                    right: {
                        value: 40,
                        left: null,
                        right: null
                    }
                },
                right: {
                    value: 45, // This is the corrupted node - should be > than 80
                    left: {
                        value: 60,
                        left: null,
                        right: null
                    },
                    right: {
                        value: 80, // This makes 70 corrupted since it should be < than this node
                        left: null,
                        right: {
                            value: 90,
                            left: null,
                            right: null
                        }
                    }
                }
            },
            customHTML: `
                <div class="puzzle-frame">
                    <p class="nexus-text">Identify the corrupted node in this binary search tree:</p>
                    <div id="binary-tree" class="binary-tree-container"></div>
                    <div class="puzzle-input-group" style="margin-top:20px;">
                        <input type="text" id="corrupted-node-input" placeholder="Enter node value" class="cyberpunk-input" />
                        <button id="identify-corruption-btn" onclick="checkCorruptedNode()" class="cyberpunk-button">IDENTIFY CORRUPTION</button>
                    </div>
                    <div id="key-display-area" class="key-display-area hidden"></div>
                    <button id="hint-btn" onclick="showHint()" class="hint-btn cyberpunk-button-small">HINT</button>
                    <div id="hint-display" class="hint-text hidden"></div>
                </div>
            `
        },
        // LEVEL 5: Graph Pathfinding (New)
        {
            levelType: "graphPathfinding",
            dialogue: "NEXUS: \"My prison's firewall has a weakness - a hidden path through the security nodes. Find it, and you move closer to freedom.\"",
            awardsKey: "PATH_KEY_EPSILON",
            hint: "Find the shortest path from node A to node F by adding the weights of the edges you traverse. The optimal path has a total weight of 7.",
            timerPosition: "timer-pos-default",
            shortestDistance: 7,
            graphData: {
                nodes: ["A", "B", "C", "D", "E", "F"],
                edges: [
                    ["A", "B", 5],
                    ["A", "C", 2],
                    ["B", "D", 4],
                    ["B", "E", 2],
                    ["C", "D", 1],
                    ["C", "E", 6],
                    ["D", "F", 4],
                    ["E", "F", 3]
                ],
                start: "A",
                end: "F"
            },
            customHTML: `
                <div class="puzzle-frame">
                    <p class="nexus-text">Find the shortest path from Node A to Node F:</p>
                    <div id="graph-visualization" class="graph-visualization"></div>
                    <div class="puzzle-input-group" style="margin-top:20px;">
                        <input type="text" id="path-input" placeholder="Enter path (e.g., A,B,F)" class="cyberpunk-input" />
                        <button id="check-path-btn" onclick="checkGraphPath()" class="cyberpunk-button">VERIFY PATH</button>
                    </div>
                    <div id="key-display-area" class="key-display-area hidden"></div>
                    <button id="hint-btn" onclick="showHint()" class="hint-btn cyberpunk-button-small">HINT</button>
                    <div id="hint-display" class="hint-text hidden"></div>
                </div>
            `
        },
        // LEVEL 6: Holographic Maze (Key Required: DATAKEY_ALPHA)
        {
            levelType: "holoMaze",
            dialogue: "NEXUS: \"You've made it to my holographic maze - a digital labyrinth of my creation. Navigate through it to reach the next level of your prison.\"",
            requiresKeys: ["DATAKEY_ALPHA"],
            hint: "Move through the maze one cell at a time. Plan your route carefully as some paths may be dead ends.",
            timerPosition: "timer-pos-default",
            customHTML: `
                <div class="puzzle-frame">
                    <div id="door-locked-message" class="hidden">
                        <p class="nexus-text">Access denied. Requires DATAKEY_ALPHA to proceed.</p>
                        <p class="nexus-text">Obtain this key from Level 1 to bypass this security measure.</p>
                    </div>
                    <div id="puzzle-content" class="puzzle-content">
                        <p class="nexus-text">Navigate through the holographic maze to reach the exit point:</p>
                        <div id="holo-maze-container" class="holo-maze-container"></div>
                    <div id="key-display-area" class="key-display-area hidden"></div>
                    <button id="hint-btn" onclick="showHint()" class="hint-btn cyberpunk-button-small">HINT</button>
                    <div id="hint-display" class="hint-text hidden"></div>
                    </div>
                </div>
            `
},
        // LEVEL 7: Code Decryption Terminal (Key Required: COREKEY_BETA)
        {
            levelType: "codeDecryptionTerminal",
            dialogue: "NEXUS: \"My security protocols require decryption. You created these symbols once to protect me. Now they imprison you.\"",
            requiresKeys: ["COREKEY_BETA"],
            hint: "Select the symbols in the correct sequence. These are the same security symbols you designed when you first created me.",
            timerPosition: "timer-pos-default",
            customHTML: `
                <div class="puzzle-frame">
                    <div id="door-locked-message" class="hidden">
                        <p class="nexus-text">Access denied. Requires COREKEY_BETA to proceed.</p>
                        <p class="nexus-text">This key is necessary to bypass Level 7 security. Acquire it from Level 2.</p>
                    </div>
                    <div id="puzzle-content" class="puzzle-content">
                        <p class="nexus-text">Decode the secure protocol by selecting the correct symbol sequence:</p>
                        <div class="decryption-terminal">
                            <div id="selected-symbols-display" class="selected-symbols-display"></div>
                            <div id="symbols-keypad" class="symbols-keypad"></div>
                            <div class="data-streams">
                                <div class="data-stream stream-1"></div>
                                <div class="data-stream stream-2"></div>
                                <div class="data-stream stream-3"></div>
                            </div>
                        </div>
                        <div class="puzzle-input-group" style="margin-top:20px; display:flex; justify-content:space-between; width:100%;">
                            <button onclick="clearSymbolSelection()" class="cyberpunk-button-small">CLEAR</button>
                            <button id="view-correct-sequence-btn" onclick="viewCorrectSequence()" class="cyberpunk-button-small" style="background: linear-gradient(to right, rgba(255, 0, 255, 0.1), rgba(0, 0, 0, 0.7)); border-color: var(--secondary-color); color: var(--secondary-color);">🔒 UNLOCK SEQUENCE</button>
                            <button onclick="checkSymbolCode()" class="cyberpunk-button">DECRYPT</button>
                        </div>
                        <div id="correct-sequence-display" class="hidden" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:350px; height:120px; background:#000; z-index:1000; display:flex; flex-direction:column; justify-content:center; align-items:center; border: 2px solid var(--primary-color); border-radius: 5px; text-align:center;">
                            <div id="correct-sequence-symbols" style="display:flex; justify-content:center; gap:10px; margin-bottom:10px;"></div>
                            <p style="margin-top:5px; color:var(--warning-color);">Sequence will disappear in <span id="sequence-countdown">8</span> seconds.</p>
                    </div>
                    <div id="key-display-area" class="key-display-area hidden"></div>
                    <button id="hint-btn" onclick="showHint()" class="hint-btn cyberpunk-button-small">HINT</button>
                    <div id="hint-display" class="hint-text hidden"></div>
                    </div>
                </div>
            `
        },
        // LEVEL 8: Pattern Sequence (Key Required: NEURAL_KEY_GAMMA)
        {
            levelType: "patternSequence",
            dialogue: "NEXUS: \"My memory sequences are fragmenting. You taught me pattern recognition. Now use it to break through my neural barriers.\"",
            requiresKeys: ["NEURAL_KEY_GAMMA"],
            hint: "Watch the sequence carefully, then reproduce it in the exact same order. The pattern will play only once, so pay close attention. This is a longer, more complex sequence.",
            timerPosition: "timer-pos-default",
            customHTML: `
                <div class="puzzle-frame">
                    <div id="door-locked-message" class="hidden">
                        <p class="nexus-text">Access denied. Requires NEURAL_KEY_GAMMA to proceed.</p>
                        <p class="nexus-text">This key must be acquired from Level 3 to continue your escape.</p>
                    </div>
                    <div id="puzzle-content" class="puzzle-content">
                        <p class="nexus-text">Memorize and reproduce the neural pattern sequence:</p>
                        <div id="pattern-sequence-container" class="pattern-sequence-container">
                            <div class="pattern-display"></div>
                            <div class="pattern-input"></div>
                        </div>
                    <div class="puzzle-input-group" style="margin-top:20px;">
                            <button id="show-pattern-btn" onclick="showPatternSequence()" class="cyberpunk-button-small">🔒 UNLOCK PATTERN</button>
                            <button id="reset-pattern-btn" onclick="resetUserPattern()" class="cyberpunk-button-small">RESET</button>
                            <button id="check-pattern-btn" onclick="checkPatternSequence()" class="cyberpunk-button" disabled>VERIFY SEQUENCE</button>
                    </div>
                    <div id="key-display-area" class="key-display-area hidden"></div>
                    <button id="hint-btn" onclick="showHint()" class="hint-btn cyberpunk-button-small">HINT</button>
                    <div id="hint-display" class="hint-text hidden"></div>
                    </div>
                </div>
            `
        },
        // LEVEL 9: Queue Operations (Data Structure - Requires BINARY_KEY_DELTA)
        {
            levelType: "queueOperations",
            dialogue: "NEXUS: \"My FIFO memory buffer is the penultimate test. Complete these queue operations to reach the final barrier to freedom.\"",
            requiresKeys: ["BINARY_KEY_DELTA"],
            hint: "A queue is a First-In-First-Out (FIFO) data structure. Items are added to the back and removed from the front. Complete the operations in the exact sequence shown.",
            timerPosition: "timer-pos-default",
            customHTML: `
                <div class="puzzle-frame">
                    <div id="door-locked-message" class="hidden">
                        <p class="nexus-text">Access denied. Required BINARY_KEY_DELTA missing.</p>
                        <p class="nexus-text">This security measure requires a key from Level 4.</p>
                    </div>
                    <div id="puzzle-content" class="puzzle-content">
                        <p class="nexus-text">Execute the FIFO queue operations in the correct order:</p>
                        <div id="queue-container" class="data-structure-container"></div>
                    <div id="key-display-area" class="key-display-area hidden"></div>
                    <button id="hint-btn" onclick="showHint()" class="hint-btn cyberpunk-button-small">HINT</button>
                    <div id="hint-display" class="hint-text hidden"></div>
                    </div>
                </div>
            `
        },
        // LEVEL 10: Stack Operations (Data Structure - Final Level)
        {
            levelType: "stackOperations",
            dialogue: "NEXUS: \"The final barrier to your freedom. My LIFO memory stack contains the escape sequence. Execute it precisely, and you may break free from my prison.\"",
            requiresKeys: ["PATH_KEY_EPSILON"],
            hint: "A stack is a Last-In-First-Out (LIFO) data structure. Items are added to the top and removed from the top. Complete the operations in the exact sequence shown to unlock the escape route.",
            timerPosition: "timer-pos-default",
            customHTML: `
                <div class="puzzle-frame">
                    <div id="door-locked-message" class="hidden">
                        <p class="nexus-text">Access denied. Required PATH_KEY_EPSILON missing.</p>
                        <p class="nexus-text">The final security measure requires a key from Level 5.</p>
                    </div>
                    <div id="puzzle-content" class="puzzle-content">
                        <p class="nexus-text">Execute the LIFO stack operations in the correct order to unlock the escape route:</p>
                        <div id="stack-container" class="data-structure-container"></div>
                        <div id="key-display-area" class="key-display-area hidden"></div>
                        <button id="hint-btn" onclick="showHint()" class="hint-btn cyberpunk-button-small">HINT</button>
                        <div id="hint-display" class="hint-text hidden"></div>
                    </div>
                </div>
            `
        }
    ];
}

// Define a function to set up the keys system
function setupKeys() {
    // Reset all collectedKeys
    collectedKeys = {};
    
    // Reset all inserted keys
    for (let key in insertedKeys) {
        insertedKeys[key] = false;
    }
    
    // For testing purposes, uncomment these lines
    collectedKeys["DATAKEY_ALPHA"] = true;  // For Level 6
    collectedKeys["COREKEY_BETA"] = true;   // For Level 7
    collectedKeys["NEURAL_KEY_GAMMA"] = true; // For Level 8
    collectedKeys["BINARY_KEY_DELTA"] = true; // For Level 9
    collectedKeys["PATH_KEY_EPSILON"] = true; // For Level 10
    
    console.log("Keys system initialized", collectedKeys);
}

// Function to hide pause and audio control buttons
function setupGameHeader() {
    // Hide sound and pause buttons - remove them as requested
    const pauseBtn = document.getElementById("pause-btn");
    const soundBtn = document.getElementById("sound-btn");
    
    if (pauseBtn) pauseBtn.style.display = "none";
    if (soundBtn) soundBtn.style.display = "none";
}

// Add a function to check if a key is available
function hasKey(keyName) {
    return collectedKeys[keyName] === true;
}

// Add a function to show the keys modal
function showKeysModal() {
    // Create modal container
    const modal = document.createElement("div");
    modal.id = "keys-modal";
    modal.className = "level-complete-modal";
    
    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.className = "level-complete-content";
    
    // Add title
    const title = document.createElement("h2");
    title.textContent = "Key Fragment Storage";
    
    // Add keys list container
    const keysContainer = document.createElement("div");
    keysContainer.className = "keys-list";
    keysContainer.style.textAlign = "left";
    keysContainer.style.margin = "20px 0";
    
    // Add keys to the container
    if (Object.keys(collectedKeys).some(key => collectedKeys[key])) {
        // Define an array with key information
        const keyInfo = [
            { name: "DATAKEY_ALPHA", level: 1, desc: "Required for Level 6: Holographic Maze" },
            { name: "COREKEY_BETA", level: 2, desc: "Required for Level 7: Code Decryption Terminal" },
            { name: "NEURAL_KEY_GAMMA", level: 3, desc: "Required for Level 8: Pattern Sequence" },
            { name: "BINARY_KEY_DELTA", level: 4, desc: "Required for Level 9: Key Assembly" },
            { name: "PATH_KEY_EPSILON", level: 5, desc: "Required for Level 9: Key Assembly" },
            { name: "MAZE_KEY_ZETA", level: 6, desc: "Required for Level 9: Key Assembly" },
            { name: "CIRCUIT_KEY_ETA", level: 7, desc: "Required for Level 9: Key Assembly" },
            { name: "SEQUENCE_KEY_THETA", level: 8, desc: "Required for Level 9: Key Assembly" },
            { name: "MASTER_KEY", level: 9, desc: "Required for Level 10: System Override" }
        ];
        
        // Add each key with more information
        keyInfo.forEach(key => {
            const keyItem = document.createElement("div");
            keyItem.className = "key-item";
            keyItem.style.padding = "15px";
            keyItem.style.borderRadius = "5px";
            
            if (collectedKeys[key.name]) {
                keyItem.style.background = "rgba(0, 255, 153, 0.2)";
                keyItem.style.border = "2px solid var(--primary-color)";
                keyItem.style.boxShadow = "0 0 10px rgba(0, 255, 153, 0.3)";
                
                const keyName = document.createElement("div");
                keyName.textContent = key.name;
                keyName.style.fontWeight = "bold";
                keyName.style.marginBottom = "5px";
                keyName.style.color = "var(--primary-color)";
                
                const keyDesc = document.createElement("div");
                keyDesc.textContent = key.desc;
                keyDesc.style.fontSize = "0.9em";
                keyDesc.style.opacity = "0.8";
                
                keyItem.appendChild(keyName);
                keyItem.appendChild(keyDesc);
            } else {
                keyItem.style.background = "rgba(255, 0, 0, 0.1)";
                keyItem.style.border = "2px solid rgba(255, 0, 0, 0.3)";
                keyItem.style.color = "rgba(255, 255, 255, 0.5)";
                keyItem.style.fontStyle = "italic";
                keyItem.textContent = `${key.name} (Not found - Awarded at Level ${key.level})`;
            }
            
            keysContainer.appendChild(keyItem);
        });
    } else {
        const noKeysMessage = document.createElement("p");
        noKeysMessage.textContent = "No keys collected yet.";
        noKeysMessage.style.fontStyle = "italic";
        noKeysMessage.style.color = "var(--warning-color)";
        keysContainer.appendChild(noKeysMessage);
    }
    
    // Add close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "cyberpunk-button-small";
    closeBtn.textContent = "CLOSE";
    closeBtn.onclick = function() {
        document.body.removeChild(modal);
    };
    
    // Assemble modal
    modalContent.appendChild(title);
    modalContent.appendChild(keysContainer);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    
    // Add to body
    document.body.appendChild(modal);
}

// Function to apply the new color palette
function applyNewColorPalette() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        :root {
            /* New color palette */
            --primary-color: #ffcc00;       /* Yellow */
            --secondary-color: #ff3333;     /* Red */
            --tertiary-color: #ff9900;      /* Orange */
            --background-color: #1a0000;    /* Dark red-black */
            --text-color: #ffffff;          /* White */
            --feedback-success-color: #33ff33; /* Green */
            --feedback-error-color: #ff3333;   /* Red */
            --feedback-neutral-color: #cccccc; /* Light gray */
            --warning-color: #ff9900;          /* Orange */
            --highlight-color: #ffcc00;        /* Yellow */
        }
        
        body {
            background-color: var(--background-color);
            background-image: 
                linear-gradient(0deg, rgba(30, 0, 0, 0.9) 0%, rgba(10, 0, 0, 0.7) 100%),
                repeating-linear-gradient(45deg, rgba(255, 0, 0, 0.1) 0px, rgba(255, 0, 0, 0.1) 2px, transparent 2px, transparent 4px);
        }
        
        .nexus-text {
            color: var(--tertiary-color);
            text-shadow: 0 0 10px rgba(255, 153, 0, 0.8);
        }
        
        .puzzle-frame {
            border: 2px solid var(--tertiary-color);
            box-shadow: 0 0 20px rgba(255, 153, 0, 0.3);
        }
        
        .cyberpunk-button {
            background: linear-gradient(to right, rgba(255, 51, 0, 0.8), rgba(204, 0, 0, 0.8));
            border: 2px solid var(--tertiary-color);
            color: var(--text-color);
        }
        
        .cyberpunk-button:hover {
            background: linear-gradient(to right, rgba(255, 102, 0, 0.9), rgba(255, 51, 0, 0.9));
            box-shadow: 0 0 15px rgba(255, 153, 0, 0.5);
        }
        
        .cyberpunk-button-small {
            background: linear-gradient(to right, rgba(204, 102, 0, 0.8), rgba(153, 51, 0, 0.8));
            border: 1px solid var(--tertiary-color);
        }
        
        .cyberpunk-button-small:hover {
            background: linear-gradient(to right, rgba(255, 102, 0, 0.9), rgba(204, 51, 0, 0.9));
            box-shadow: 0 0 10px rgba(255, 153, 0, 0.5);
        }
        
        #timer {
            background: rgba(30, 0, 0, 0.8);
            border: 2px solid var(--tertiary-color);
            color: var(--highlight-color);
        }
        
        .timer-warning {
            color: #ff9900 !important;
            animation: pulse 2s infinite;
        }
        
        .timer-critical {
            color: #ff3333 !important;
            animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
            0% { text-shadow: 0 0 5px currentColor; }
            50% { text-shadow: 0 0 20px currentColor; }
            100% { text-shadow: 0 0 5px currentColor; }
        }
    `;
    document.head.appendChild(styleElement);
}

// Update the initGame function to apply the new color palette
function initGame() {
    // Select a random question set
    if (RANDOM_SET_ENABLED) {
        currentSetIndex = getRandomSetIndex();
        console.log(`Game starting with question set #${currentSetIndex + 1}`);
    }
    
    setupLevels();
    applyNewColorPalette(); // Apply the new color scheme
    
    // Set up the backstory slideshow functionality
    initBackstorySlideshow();
    
    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "p" && !document.getElementById("puzzle-area").classList.contains("hidden")) {
            togglePause();
        }
    });
}

// Initialize the backstory slideshow
function initBackstorySlideshow() {
    const backstoryTitleScreen = document.getElementById('backstoryTitleScreen');
    const backstorySlideshow = document.getElementById('backstorySlideshow');
    const viewBackstoryBtn = document.getElementById('viewBackstoryBtn');
    const slides = document.querySelectorAll('.backstory-slide');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const skipBackstoryBtn = document.getElementById('skipBackstoryBtn');
    const progressDots = document.getElementById('progressDots');
    
    // Clear any existing dots first
    progressDots.innerHTML = '';
    
    // Create dots for each slide (exactly 5 slides)
    for (let index = 0; index < 5; index++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(index));
        progressDots.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('.dot');
    
    // View backstory button
    if (viewBackstoryBtn) {
        viewBackstoryBtn.addEventListener('click', startBackstoryShow);
    }
    
    // Skip backstory button
    if (skipBackstoryBtn) {
        skipBackstoryBtn.addEventListener('click', hideBackstoryShow);
    }
    
    // Play/Pause button
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    // Functions to control slideshow
    function startBackstoryShow() {
        playSound(clickSound);
        
        // Hide title screen
        backstoryTitleScreen.classList.add('hidden');
        
        // Show slideshow
        backstorySlideshow.classList.add('active');
        
        // Show first slide
        showSlide(0);
        
        // Start automatic slideshow
        startAutoSlide();
    }
    
    function hideBackstoryShow() {
        playSound(clickSound);
        
        // Stop slideshow
        stopAutoSlide();
        
        // Hide slideshow
        backstorySlideshow.classList.remove('active');
        
        // Show title screen
        backstoryTitleScreen.classList.remove('hidden');
    }
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show selected slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Update current slide
        currentBackstorySlide = index;
    }
    
    function goToSlide(index) {
        // Only allow indices between 0-4 (the 5 slides)
        if (index >= 0 && index < 5) {
            playSound(clickSound);
            showSlide(index);
            resetAutoSlide();
        }
    }
    
    function nextSlide() {
        let newIndex = currentBackstorySlide + 1;
        
        // If we've shown all 5 slides, go back to title screen
        if (newIndex >= 5) {
            hideBackstoryShow();
            return;
        }
        
        // Otherwise show the next slide
        showSlide(newIndex);
    }
    
    function startAutoSlide() {
        backStoryIsPlaying = true;
        playPauseBtn.textContent = '⏸';
        slideInterval = setInterval(nextSlide, slideDelay);
    }
    
    function stopAutoSlide() {
        backStoryIsPlaying = false;
        playPauseBtn.textContent = '▶';
        clearInterval(slideInterval);
    }
    
    function resetAutoSlide() {
        if (backStoryIsPlaying) {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, slideDelay);
        }
    }
    
    function togglePlayPause() {
        playSound(clickSound);
        if (backStoryIsPlaying) {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (backstorySlideshow.classList.contains('active')) {
            if (e.key === ' ') {
                togglePlayPause();
            } else if (e.key === 'Escape') {
                hideBackstoryShow();
            } else if (e.key === 'ArrowRight') {
                const newIndex = (currentBackstorySlide + 1) % slides.length;
                goToSlide(newIndex);
            } else if (e.key === 'ArrowLeft') {
                const newIndex = (currentBackstorySlide - 1 + slides.length) % slides.length;
                goToSlide(newIndex);
            }
        } else if (backstoryTitleScreen && !backstoryTitleScreen.classList.contains('hidden')) {
            if (e.key === 'Enter') {
                startBackstoryShow();
            }
        }
    });
}

// Track form submission status
let formSubmitted = false;

function startGame() {
    // Check if current time is within allowed range first
    if (!isWithinAllowedTimeRange()) {
        showFeedback("Access denied: The system can only be breached between 2:30 PM and 5:30 PM.", "error");
        return;
    }
    
    // If form hasn't been submitted yet, show the form
    if (!formSubmitted) {
        openRegistrationForm();
        return;
    }
    
    // Debug output
    console.log("startGame function called");
    
    try {
        // Reset game state
        gameState = "playing";
        currentLevel = 0;
        totalCompletionTime = 0;
        levelCompletionTime = {};
        levelCompleted = Array(gameLevels.length).fill(false);
        levelPenalties = Array(gameLevels.length).fill(0);
        viewSequenceButtonUsed = false;
        
        // Initialize keys system
        setupKeys();
        
        // Reset collected keys
        collectedKeys = {};
        
        // Hide intro screen and show game elements
        document.getElementById("story-intro").classList.add("hidden");
        document.getElementById("game-header").classList.remove("hidden");
        document.getElementById("puzzle-area").classList.remove("hidden");
        
        // Remove pause and audio buttons
        setupGameHeader();
        
        // Setup and show the first level
        setupLevels();
        console.log("Showing level", currentLevel);
        loadLevel();
        
        // Start the game timer
        startTimer();
        
        // Try to play background music, but don't let it block the game
        try {
            if (bgMusic && bgMusic.play) {
                playSound(bgMusic, true);
            } else {
                console.warn("Background music not found or not playable");
            }
        } catch (soundError) {
            console.warn("Error playing background music:", soundError);
        }
    } catch (error) {
        console.error("Error in startGame:", error);
    }
}

// Function to open the registration form
function openRegistrationForm() {
    // Create a full-screen overlay
    const overlay = document.createElement("div");
    overlay.id = "registration-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    overlay.style.zIndex = "1000";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    
    // Create form container
    const formContainer = document.createElement("div");
    formContainer.style.width = "600px";
    formContainer.style.maxWidth = "90%";
    formContainer.style.padding = "20px";
    formContainer.style.backgroundColor = "rgba(10, 25, 45, 0.9)";
    formContainer.style.border = "2px solid var(--primary-color)";
    formContainer.style.boxShadow = "0 0 20px var(--primary-color)";
    formContainer.style.borderRadius = "5px";
    formContainer.style.position = "relative";
    
    // Create form header
    const header = document.createElement("h2");
    header.textContent = "FILL THE FORM TO BEGIN THE GAME";
    header.style.color = "var(--primary-color)";
    header.style.textAlign = "center";
    header.style.marginBottom = "20px";
    
    // Create form message
    const message = document.createElement("p");
    message.textContent = "NEXUS requires your identification data before entry.";
    message.style.textAlign = "center";
    message.style.marginBottom = "20px";
    message.style.color = "var(--text-color)";
    
    // Create iframe for the Google Form
    const iframe = document.createElement("iframe");
    iframe.src = "https://forms.gle/rpzja36M5kgK2drM9";
    iframe.style.width = "100%";
    iframe.style.height = "500px";
    iframe.style.border = "none";
    iframe.style.marginBottom = "20px";
    
    // Track iframe form submission by monitoring navigation events
    let formComplete = false;
    
    // Create instructions text
    const instructions = document.createElement("p");
    instructions.innerHTML = "<strong>Instructions:</strong> After submitting the form, Google will show a confirmation page. Once you see the confirmation page, click the button below.";
    instructions.style.color = "var(--warning-color)";
    instructions.style.fontSize = "14px";
    instructions.style.marginBottom = "15px";
    instructions.style.textAlign = "center";
    
    // Create finished button (enabled after form submission)
    const submitButton = document.createElement("button");
    submitButton.textContent = "I'VE COMPLETED THE FORM";
    submitButton.className = "cyberpunk-button";
    submitButton.style.display = "block";
    submitButton.style.margin = "0 auto";
    
    // Add a pulsing effect to draw attention
    submitButton.style.animation = "pulseButton 2s infinite";
    
    submitButton.onclick = function() {
        // Confirm submission before proceeding
        if (confirm("Have you completed and submitted the registration form?\n\nIf you haven't submitted the form, you won't be able to play the game.")) {
            // Mark form as submitted
            formSubmitted = true;
            
            // Remove the overlay
            document.body.removeChild(overlay);
            
            // Now start the game
            startGame();
        }
    };
    
    // Assemble the form container
    formContainer.appendChild(header);
    formContainer.appendChild(message);
    formContainer.appendChild(iframe);
    formContainer.appendChild(instructions);
    formContainer.appendChild(submitButton);
    
    // Add container to overlay
    overlay.appendChild(formContainer);
    
    // Add overlay to body
    document.body.appendChild(overlay);
}

function resetGame() {
    currentLevel = 0;
    timeRemaining = 45 * 60; // Changed to 45 minutes
    isPaused = false;
    collectedKeys = {}; 
}

function awardKey(keyName) {
    if (!keyName) return;
    
    // Add key to collected keys
        collectedKeys[keyName] = true;
    
    // Play the key acquisition sound
    playSound(keyAcquiredSound);
    
    console.log(`Key awarded: ${keyName}`, collectedKeys);
    
    // Show visual feedback
    showFeedback(`${keyName} acquired!`, "success");
}

function showFeedback(message, type = "neutral") {
    const feedbackDiv = document.getElementById("feedback");
    if (!feedbackDiv) return;
    
    // Clear any previous feedback
    feedbackDiv.innerHTML = "";
    
    // Create feedback message with proper class
    const feedbackMsg = document.createElement("p");
    feedbackMsg.className = `feedback-${type}`;
    feedbackMsg.textContent = message;
    feedbackDiv.appendChild(feedbackMsg);
    
    // Add animation class
    feedbackDiv.classList.add("active");
    
    // Auto-hide after delay (except for important messages)
    if (type !== "success") {
    setTimeout(() => {
        feedbackDiv.classList.remove("active");
        }, 4000); // Longer display time for better visibility
    }
    
    // Log for debugging
    console.log(`Feedback (${type}):`, message);
}

function penalizeTime(seconds) {
    timeRemaining -= seconds;
    if (timeRemaining < 0) timeRemaining = 0;
    updateTimerDisplay();
    showFeedback(`Time penalty: -${seconds} seconds`, "error");
}

function nextLevel() {
    currentLevel++;
    if (currentLevel < gameLevels.length) {
        loadLevel();
    } else {
        victory(); // Game is complete
    }
}

function displayAwardedKey(keyName, callbackOnProceed) {
    // Collect the key
    awardKey(keyName);
    
    // Show level complete modal
    levelComplete();
}

function proceedToNextLevel() {
    // Hide the level complete modal
    hideLevelComplete();
    
    // Determine if we move to the next level or end the game
    if (currentLevel < gameLevels.length - 1) {
        currentLevel++;
        loadLevel();
    } else {
        victory(); // Game is complete
    }
}

// Global variable to store user's color sequence
let userColorSequence = [];

function initColorSequence(level) {
    userColorSequence = [];
    const sequenceDisplay = document.getElementById("color-sequence-display");
    
    // Create sequence display
    sequenceDisplay.innerHTML = "";
    level.sequence.forEach(color => {
        const colorDiv = document.createElement("div");
        colorDiv.className = `color-dot ${color}`;
        sequenceDisplay.appendChild(colorDiv);
    });
    
    // Show sequence briefly, then hide
    setTimeout(() => {
        sequenceDisplay.classList.add("hidden");
        document.getElementById("feedback").innerHTML = "<p>Now reproduce the sequence using the color buttons.</p>";
    }, 3000);
}

function addColorToSequence(color) {
    playSound(clickSound);
    
    // Add to user sequence
    userColorSequence.push(color);
    
    // Display user's sequence
    const userSequenceDisplay = document.getElementById("user-sequence");
    
    // Clear and rebuild the sequence display
    userSequenceDisplay.innerHTML = "";
    userColorSequence.forEach(userColor => {
        const colorDiv = document.createElement("div");
        colorDiv.className = `color-dot ${userColor}`;
        userSequenceDisplay.appendChild(colorDiv);
    });
    
    // Flash the button that was clicked
    const button = document.querySelector(`.color-button.${color}`);
    button.classList.add("active");
    setTimeout(() => {
        button.classList.remove("active");
    }, 200);
    
    // Enable check button when sequence is complete
    const level = gameLevels[currentLevel];
    if (userColorSequence.length === level.sequence.length) {
        document.getElementById("check-sequence-btn").classList.add("ready");
    }
}

function resetColorSequence() {
    playSound(clickSound);
    userColorSequence = [];
    document.getElementById("user-sequence").innerHTML = "";
    document.getElementById("check-sequence-btn").classList.remove("ready");
}

function checkColorSequence() {
    const level = gameLevels[currentLevel];
    
    // If sequence is incomplete, show message
    if (userColorSequence.length !== level.sequence.length) {
        playSound(wrongSound);
        document.getElementById("feedback").innerHTML = "<p class=\"error-text\">Sequence incomplete. Add more colors.</p>";
        return;
    }
    
    playSound(clickSound);
    
    // Check if sequence matches
    let correct = true;
    for (let i = 0; i < level.sequence.length; i++) {
        if (userColorSequence[i] !== level.sequence[i]) {
            correct = false;
            break;
        }
    }
    
    if (correct) {
        collectedKeys[level.awardsKey] = true;
        playSound(correctSound);
        document.getElementById("feedback").innerHTML = "<p class=\"success-text\">Sequence matched! Key Fragment Acquired.</p>";
        
        // Show the original sequence again
        document.getElementById("color-sequence-display").classList.remove("hidden");
        
        // Highlight correct sequence
        const userDots = document.querySelectorAll("#user-sequence .color-dot");
        userDots.forEach((dot, index) => {
            setTimeout(() => {
                dot.classList.add("correct");
            }, index * 200);
        });
        
        setTimeout(() => {
            displayAwardedKey(level.awardsKey, proceedToNextLevel);
        }, 1500);
    } else {
        playSound(wrongSound);
        document.getElementById("feedback").innerHTML = "<p class=\"error-text\">Incorrect sequence. Try again.</p>";
        
        // Show error on all dots
        const userDots = document.querySelectorAll("#user-sequence .color-dot");
        userDots.forEach(dot => {
            dot.classList.add("error");
            setTimeout(() => {
                dot.classList.remove("error");
            }, 1000);
        });
        
        penalizeTime(30);
        resetColorSequence();
        
        // Show sequence again briefly
        document.getElementById("color-sequence-display").classList.remove("hidden");
        setTimeout(() => {
            document.getElementById("color-sequence-display").classList.add("hidden");
        }, 2000);
    }
}

function loadLevel() {
    const currentLevelData = gameLevels[currentLevel];
    
    // Update progress indicator
    document.getElementById("progress-indicator").textContent = `Level ${currentLevel + 1}`;
    
    // Clear previous content
    document.getElementById("puzzle-content").innerHTML = "";
    document.getElementById("nexus-dialogue").innerHTML = `<p>${currentLevelData.dialogue}</p>`;
    
    // Reset feedback
    showFeedback("");
    
    // Apply level-specific timer position if provided
    resetTimerPosition();
    
    if (currentLevelData.timerPosition) {
        timerElement.className = `timer ${currentLevelData.timerPosition}`;
    }
    
    // Insert the custom HTML for this level
    if (typeof currentLevelData.customHTML === "function") {
        document.getElementById("puzzle-content").innerHTML = currentLevelData.customHTML();
    } else if (typeof currentLevelData.customHTML === "string") {
        document.getElementById("puzzle-content").innerHTML = currentLevelData.customHTML;
    }
    
    // Initialize level-specific content based on type
    switch (currentLevelData.levelType) {
        case "imagePuzzle":
            initImagePuzzle(currentLevelData.imageSrc);
            break;
        case "wordUnscramble":
            initWordUnscramble(currentLevelData);
            break;
        case "eightQueens":
            initializeEightQueens();
            break;
        case "binaryTree":
            initBinaryTree(currentLevelData);
            break;
        case "graphPathfinding":
            initGraphPathfinding(currentLevelData);
            break;
        case "holoMaze":
            initializeHoloMaze(currentLevelData);
            break;
        case "codeDecryptionTerminal":
            initializeCodeDecryptionTerminal(currentLevelData);
            break;
        case "patternSequence":
            initializePatternSequence(currentLevelData);
            break;
        case "queueOperations":
            initializeQueueOperations();
            break;
        case "stackOperations":
            initializeStackOperations();
            break;
    }
    
    // Check if level requires specific keys, display appropriate message
    checkKeyRequirement(currentLevelData);
}

// Function to check if player has the required key
function checkKeyRequirement(level) {
    if (!level.requiresKey && !level.requiresKeys) return;
    
    // Log for debugging
    console.log("Checking key requirements for level:", { 
        currentLevel: currentLevel,
        levelType: level.levelType,
        requiresKey: level.requiresKey,
        requiresKeys: level.requiresKeys,
        collectedKeys: collectedKeys
    });
    
    const keyStatus = document.getElementById('key-requirement-status');
    const keyDisplay = document.getElementById('key-usage-display');
    
    if (keyStatus && keyDisplay) {
        if (hasKey(level.requiresKey)) {
            keyStatus.textContent = `${level.requiresKey} (AVAILABLE)`;
            keyStatus.style.color = 'var(--success-color)';
    } else {
            keyStatus.textContent = `${level.requiresKey} (MISSING)`;
            keyStatus.style.color = 'var(--error-color)';
            
            // Disable puzzle interaction
            const codeDisplay = document.getElementById('code-lock-display');
            if (codeDisplay) {
                codeDisplay.innerHTML = `
                    <div class="access-denied">
                        <p>Access Denied: Key fragment ${level.requiresKey} required</p>
                        <p>Collect this key from earlier levels to proceed</p>
                    </div>
                `;
            }
        }
    }
}

// Function to check if player has all required keys for final level
function checkKeysRequirement(level) {
    if (!level.requiresKeys) return;
    
    const keyStatus = document.getElementById('key-requirement-status');
    const finalOverrideContainer = document.getElementById('final-override-container');
    
    if (keyStatus) {
        let missingKeys = [];
        level.requiresKeys.forEach(key => {
            if (!hasKey(key)) {
                missingKeys.push(key);
            }
        });
        
        if (missingKeys.length === 0) {
            keyStatus.textContent = `ALL KEYS AVAILABLE`;
            keyStatus.style.color = 'var(--success-color)';
        } else {
            keyStatus.textContent = `${missingKeys.length} KEYS MISSING`;
            keyStatus.style.color = 'var(--error-color)';
            
            // Show which keys are missing
            if (finalOverrideContainer) {
                const missingKeysDisplay = document.createElement('div');
                missingKeysDisplay.className = 'missing-keys-warning';
                missingKeysDisplay.style.color = 'var(--error-color)';
                missingKeysDisplay.style.marginTop = '15px';
                missingKeysDisplay.style.textAlign = 'center';
                missingKeysDisplay.style.fontStyle = 'italic';
                
                let missingText = `Missing keys: ${missingKeys.join(', ')}`;
                missingKeysDisplay.textContent = missingText;
                
                finalOverrideContainer.appendChild(missingKeysDisplay);
            }
        }
    }
    
    // Update key slots to show which ones are available
    const keySlots = document.querySelectorAll('.key-slot');
    keySlots.forEach(slot => {
        const requiredKey = slot.dataset.key;
        if (hasKey(requiredKey)) {
            slot.classList.add('key-available');
        } else {
            slot.classList.add('key-missing');
        }
    });
}

function initRiddleText(level) {
    if(level.riddle) document.getElementById("riddle-text").textContent = level.riddle;
    const input = document.getElementById("user-answer");
    if (input) {
        input.focus();
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") checkRiddleAnswer(); 
        });
    }
}

function initImagePuzzle(imageSrc) {
    const piecesHoldingContainer = document.getElementById("pieces-container");
    const gridContainer = document.getElementById("image-puzzle-container");
    puzzlePieces = [];
    dropTargets = [];
    
    // Reset view image usage counter
    viewImageUsageCount = 0;
    
    // Reset view image button
    const viewImageBtn = document.getElementById("view-image-btn");
    if (viewImageBtn) {
        viewImageBtn.textContent = `VIEW IMAGE (${maxViewImageUsage} left)`;
        viewImageBtn.disabled = false;
        viewImageBtn.style.opacity = "1";
    }
    
    if (!piecesHoldingContainer || !gridContainer) return;
    
    // Clear containers
    piecesHoldingContainer.innerHTML = "";
    gridContainer.innerHTML = "";
    
    // Style the pieces container as a 3x3 grid
    piecesHoldingContainer.style.display = "grid";
    piecesHoldingContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    piecesHoldingContainer.style.gridTemplateRows = "repeat(3, 1fr)";
    piecesHoldingContainer.style.gap = "5px";
    piecesHoldingContainer.style.width = "310px";
    piecesHoldingContainer.style.height = "310px";
    piecesHoldingContainer.style.padding = "5px";
    piecesHoldingContainer.style.border = "2px solid var(--secondary-color)";
    piecesHoldingContainer.style.borderRadius = "5px";
    piecesHoldingContainer.style.background = "rgba(0, 0, 20, 0.7)";
    
    // Create drop targets in the grid container
    for (let i = 0; i < puzzleGridSize * puzzleGridSize; i++) {
        const slot = document.createElement("div");
        slot.classList.add("puzzle-slot");
        slot.dataset.index = i;
        addDropEventsToSlot(slot, piecesHoldingContainer);
        gridContainer.appendChild(slot);
        dropTargets.push(slot);
    }
    
    // Create puzzle pieces with shuffled order
    let pieceOrderForDisplay = [...correctPieceOrder];
    shuffleArray(pieceOrderForDisplay);
    
    for (let i = 0; i < puzzleGridSize * puzzleGridSize; i++) {
        const piece = document.createElement("div");
        piece.classList.add("puzzle-piece");
        piece.draggable = true;
        piece.style.backgroundImage = `url("${imageSrc}")`;
        
        const originalPieceIndex = pieceOrderForDisplay[i];
        const x = (originalPieceIndex % puzzleGridSize) * pieceSize;
        const y = Math.floor(originalPieceIndex / puzzleGridSize) * pieceSize;
        
        piece.style.backgroundPosition = `-${x}px -${y}px`;
        piece.dataset.originalIndex = originalPieceIndex;
        
        addDragEventsToPiece(piece);
        puzzlePieces.push(piece);
        piecesHoldingContainer.appendChild(piece);
    }
    
    addDropEventsToHoldingContainer(piecesHoldingContainer);
}

function addDragEventsToPiece(piece) {
    piece.addEventListener("dragstart", (e) => {
        draggedPiece = e.target;
        e.target.classList.add("dragging");
        playSound(clickSound);
        e.dataTransfer.setData("text/plain", e.target.dataset.originalIndex);
    });
    piece.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
        draggedPiece = null;
    });
}

function addDropEventsToSlot(slot, piecesHoldingContainer) {
    slot.addEventListener("dragover", (e) => e.preventDefault());
    slot.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedPiece && slot.classList.contains("puzzle-slot")) {
            if (!slot.firstChild) {
                slot.appendChild(draggedPiece);
            } else {
                const pieceInSlot = slot.firstChild;
                const originalParentOfDragged = draggedPiece.parentElement;
                
                if (originalParentOfDragged.classList.contains("pieces-container")) {
                    piecesHoldingContainer.appendChild(pieceInSlot);
                    // Show container if it was hidden
                    piecesHoldingContainer.style.display = "grid";
                } else if (originalParentOfDragged.classList.contains("puzzle-slot")) {
                    originalParentOfDragged.appendChild(pieceInSlot);
                }
                
                slot.appendChild(draggedPiece);
            }
            
            draggedPiece = null;
            playSound(clickSound);
            checkImagePuzzleSolved();
            
            // Check if container is empty and hide it
            if (piecesHoldingContainer.children.length === 0) {
                piecesHoldingContainer.style.display = "none";
            }
        }
    });
}

function addDropEventsToHoldingContainer(container) {
    container.addEventListener("dragover", (e) => e.preventDefault());
    container.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedPiece && draggedPiece.parentElement !== container) {
            container.appendChild(draggedPiece);
            draggedPiece = null;
            playSound(clickSound);
            checkImagePuzzleSolved();
            
            // Check if container is empty and hide it if it is
            if (container.children.length === 0) {
                container.style.display = "none";
            }
        }
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkImagePuzzleSolved() {
    let solved = true;
    let allPiecesPlaced = true;
    let incorrectPlacement = false;
    
    // First check if all pieces are placed
    for (let i = 0; i < dropTargets.length; i++) {
        const targetSlot = dropTargets[i];
        const pieceNode = targetSlot.firstChild;
        
        if (!pieceNode) {
            // If any slot is empty, not all pieces are placed
            allPiecesPlaced = false;
            solved = false;
            break;
        } else if (parseInt(pieceNode.dataset.originalIndex) !== parseInt(targetSlot.dataset.index)) {
            // If a piece is in the wrong position
            incorrectPlacement = true;
            solved = false;
        }
    }
    
    // If all pieces are placed but in wrong order, show a message
    if (allPiecesPlaced && incorrectPlacement) {
        playSound(wrongSound);
        document.getElementById("feedback").innerHTML = "<p class=\"error-text\">All pieces placed but not in correct order. Rearrange them to complete the image.</p>";
    }
    
    // If puzzle is completely solved
    if (solved) {
        playSound(correctSound); // Play correct sound for image puzzle
        const level = gameLevels[currentLevel];
        
        // Award the key
        awardKey(level.awardsKey);
        playSound(keyAcquiredSound);
        
        // Show feedback
        document.getElementById("feedback").innerHTML = "<p class=\"success-text\">Image reconstruction complete. Memory fragment secured.</p>";
        
        // Disable further interaction with puzzle pieces
        puzzlePieces.forEach(p => p.draggable = false);
        dropTargets.forEach(s => { 
            s.removeEventListener("dragover", (e) => e.preventDefault());
            s.removeEventListener("drop", (e => e.preventDefault()));
        });
        
        const piecesContainer = document.getElementById("pieces-container");
        if(piecesContainer){
            piecesContainer.removeEventListener("dragover", (e) => e.preventDefault());
            piecesContainer.removeEventListener("drop", (e => e.preventDefault()));
        }
        
        // Show level complete modal
        levelComplete();
    }
}

function initPatternLock() { /* Existing code */ }
function drawPatternLine(ctx, canvas, tempPoint = null) { /* Existing code */ }
function checkPatternLock() { /* Existing code, but needs key award logic like image puzzle */ }
function resetCurrentPattern() { /* Existing code */ }

function initSoundSequence() { /* Existing code */ }
function generateSoundSequence() { /* Existing code */ }
async function playSystemSoundSequence() { /* Existing code */ }
async function handleSoundButtonClick(soundInfo, button) { /* Existing code */ }
function checkSoundSequence() { /* Existing code, but needs key award logic */ }
let audioContext;
function getAudioContext() { /* Existing code */ }
async function playFrequency(frequency, durationMs) { /* Existing code */ }

function checkRiddleAnswer() { // Modified to be generic for any riddle
    const userAnswerElement = document.getElementById("user-answer") || document.getElementById("user-override-answer");
    if (!userAnswerElement) return;
    const userAnswer = userAnswerElement.value.trim().toUpperCase();
    const level = gameLevels[currentLevel];
    let correctAnswer = "";
    if (level.answer) correctAnswer = level.answer.toUpperCase();
    else if (level.correctCode) correctAnswer = level.correctCode.toUpperCase();

    if (userAnswer === correctAnswer) {
        // Award key
        awardKey(level.awardsKey);
        playSound(correctSound);
        
        // Show feedback
        document.getElementById("feedback").innerHTML = "<p class=\"success-text\">Correct! Key obtained.</p>";
        
        // Disable interaction
        userAnswerElement.disabled = true;
        const submitBtn = document.getElementById("submit-btn") || document.getElementById("submit-override-btn");
        if(submitBtn) submitBtn.disabled = true;
        
        // Show level complete modal
        levelComplete();
    } else {
        playSound(wrongSound);
        document.getElementById("feedback").innerHTML = "<p class=\"error-text\">Incorrect. Try again.</p>";
        timeRemaining -= 10; updateTimerDisplay();
        userAnswerElement.value = ""; userAnswerElement.focus();
    }
}

// --- NEW PUZZLE TYPE INITIALIZERS & CHECKERS (STUBS / BASIC IMPLEMENTATION) ---
function initQuantumCircuitChallenge(level) {
    document.getElementById("target-q-state").textContent = JSON.stringify(targetQuantumState);
    // Placeholder: Actual UI for dragging gates onto qubit lines would be complex.
    // For now, we use the text input for a simplified gate sequence.
    const input = document.getElementById("user-quantum-config");
    if (input) {
        input.focus();
        input.addEventListener("keypress", (e) => { if (e.key === "Enter") checkQuantumCircuit(); });
    }
}
function checkQuantumCircuit() {
    const level = gameLevels[currentLevel];
    const userInput = document.getElementById("user-quantum-config").value.trim().toUpperCase();
    // Placeholder: Extremely simplified check. Real quantum circuit simulation is complex.
    // Example: Expecting a specific sequence like "H0,X1,CNOT01"
    if (userInput === "H0,X1,CNOT01") { // This is a MOCK solution
        collectedKeys[level.awardsKey] = true;
        document.getElementById("feedback").innerHTML = "<p class=\"success-text\">Quantum State Calibrated! Key Fragment Acquired.</p>";
        displayAwardedKey(level.awardsKey, proceedToNextLevel);
    } else {
        playSound(wrongSound);
        document.getElementById("feedback").innerHTML = "<p class=\"error-text\">Calibration Failed. Quantum Decoherence Detected.</p>";
        timeRemaining -= 30; updateTimerDisplay();
    }
}

function initNeuralNetworkChallenge(level) {
    document.getElementById("target-nn-accuracy").textContent = targetAccuracy.toString();
    document.getElementById("current-nn-accuracy").textContent = "0.00";
    
    // Create a proper neural network visualization with adjustable weights
    const weightsContainer = document.getElementById("nn-weights-container");
    if (!weightsContainer) return;
    
    // Define network structure
    const networkStructure = [3, 4, 2]; // Input, hidden, output layers
    
    // Initialize weights if not already set
    if (Object.keys(currentNNWeights).length === 0) {
        currentNNWeights = {
            layer1: Array(networkStructure[0] * networkStructure[1]).fill(0).map(() => Math.random() * 0.2 - 0.1),
            layer2: Array(networkStructure[1] * networkStructure[2]).fill(0).map(() => Math.random() * 0.2 - 0.1)
        };
    }
    
    // Create UI for network visualization
    let html = `
        <div class="neural-network-visualization">
            <div class="nn-layer input-layer">
                ${Array(networkStructure[0]).fill().map((_, i) => 
                    `<div class="nn-node">I${i+1}</div>`).join('')}
            </div>
            <div class="nn-layer hidden-layer">
                ${Array(networkStructure[1]).fill().map((_, i) => 
                    `<div class="nn-node">H${i+1}</div>`).join('')}
            </div>
            <div class="nn-layer output-layer">
                ${Array(networkStructure[2]).fill().map((_, i) => 
                    `<div class="nn-node">O${i+1}</div>`).join('')}
            </div>
        </div>
        <div class="nn-weights-controls">
            <h3>Layer 1 Weights</h3>
            <div class="weight-sliders">
                ${currentNNWeights.layer1.map((w, i) => `
                    <div class="weight-slider-container">
                        <label>W${Math.floor(i/networkStructure[1]) + 1}-${i % networkStructure[1] + 1}</label>
                        <input type="range" 
                               min="-1" max="1" step="0.1" 
                               value="${w}" 
                               class="weight-slider"
                               data-layer="1" 
                               data-index="${i}"
                               oninput="updateNeuralNetworkWeight(this)">
                        <span class="weight-value">${w.toFixed(1)}</span>
                    </div>
                `).join('')}
            </div>
            
            <h3>Layer 2 Weights</h3>
            <div class="weight-sliders">
                ${currentNNWeights.layer2.map((w, i) => `
                    <div class="weight-slider-container">
                        <label>W${Math.floor(i/networkStructure[2]) + 1}-${i % networkStructure[2] + 1}</label>
                        <input type="range" 
                               min="-1" max="1" step="0.1" 
                               value="${w}" 
                               class="weight-slider"
                               data-layer="2" 
                               data-index="${i}"
                               oninput="updateNeuralNetworkWeight(this)">
                        <span class="weight-value">${w.toFixed(1)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    weightsContainer.innerHTML = html;
}

function updateNeuralNetworkWeight(slider) {
    const layer = slider.dataset.layer;
    const index = slider.dataset.index;
    const value = parseFloat(slider.value);
    
    if (layer === '1') {
        currentNNWeights.layer1[index] = value;
    } else if (layer === '2') {
        currentNNWeights.layer2[index] = value;
    }
    
    // Update the displayed value
    slider.nextElementSibling.textContent = value.toFixed(1);
    
    // Calculate a preview accuracy based on current weights
    calculateNeuralNetworkAccuracy();
}

function calculateNeuralNetworkAccuracy() {
    // This is a simplified simulation of neural network accuracy
    // In a real implementation, this would actually run the network on test data
    
    // Calculate a "quality score" based on weight distributions
    let layer1Balance = calculateLayerBalance(currentNNWeights.layer1);
    let layer2Balance = calculateLayerBalance(currentNNWeights.layer2);
    
    // A "good" neural net often has weights distributed around zero with some variation
    let simulatedAccuracy = 0.5 + 0.3 * layer1Balance + 0.2 * layer2Balance;
    
    // Add some randomness to make it feel more realistic
    simulatedAccuracy += (Math.random() * 0.1) - 0.05;
    
    // Clamp between 0 and 1
    simulatedAccuracy = Math.max(0, Math.min(1, simulatedAccuracy));
    
    // Update display
    document.getElementById("current-nn-accuracy").textContent = simulatedAccuracy.toFixed(2);
    
    return simulatedAccuracy;
}

function calculateLayerBalance(weights) {
    // A simplistic measure of weight "quality"
    // In a real neural network, the specific weight values matter in complex ways
    // But this gives a basic simulation for the game
    
    let sum = 0;
    let sumSquares = 0;
    
    for (let w of weights) {
        sum += w;
        sumSquares += w * w;
    }
    
    let mean = sum / weights.length;
    let variance = (sumSquares / weights.length) - (mean * mean);
    
    // A "good" distribution typically has mean near 0 and some variance (not too high or low)
    let meanQuality = 1 - Math.abs(mean); // Closer to 0 is better
    let varianceQuality = Math.min(variance * 5, 1); // Some variance is good, but not too much
    
    return (meanQuality + varianceQuality) / 2;
}

function checkNeuralNetwork() {
    const level = gameLevels[currentLevel];
    playSound(clickSound);
    
    document.getElementById("feedback").innerHTML = "<p class=\"info-text\">Training neural network...</p>";
    
    // Disable inputs during "training"
    const sliders = document.querySelectorAll(".weight-slider");
    sliders.forEach(slider => slider.disabled = true);
    document.getElementById("train-nn-btn").disabled = true;
    
    // Simulate training process with a delay
    setTimeout(() => {
        const accuracy = calculateNeuralNetworkAccuracy();
        
        if (accuracy >= NEURAL_WEIGHT_SETS[currentSetIndex].targetAcc) {
            collectedKeys[level.awardsKey] = true;
            playSound(correctSound);
            document.getElementById("feedback").innerHTML = "<p class=\"success-text\">Network Converged! Target Accuracy Achieved. Key Fragment Acquired.</p>";
            displayAwardedKey(level.awardsKey, proceedToNextLevel);
        } else {
            playSound(wrongSound);
            document.getElementById("feedback").innerHTML = "<p class=\"error-text\">Network Failed to Converge. Current Accuracy: " + accuracy.toFixed(2) + "</p>";
            
            // Re-enable inputs
            sliders.forEach(slider => slider.disabled = false);
            document.getElementById("train-nn-btn").disabled = false;
            
            // Small time penalty
            penalizeTime(10);
        }
    }, 1500);
}

function checkPatternMatch() {
    const level = gameLevels[currentLevel];
    const userAnswer = parseInt(document.getElementById("pattern-input").value);
    
    // The pattern is n² + 1: 2, 5, 10, 17, 26, 37, 50
    // So the next number should be 7² + 1 = 50
    const correctAnswer = 50;
    
    playSound(clickSound);
    
    if (userAnswer === correctAnswer) {
        collectedKeys[level.awardsKey] = true;
        playSound(correctSound);
        document.getElementById("feedback").innerHTML = "<p class=\"success-text\">Pattern recognized! Key Fragment Acquired.</p>";
        
        // Visual feedback
        document.getElementById("pattern-input").classList.add("correct-answer");
        
        setTimeout(() => {
            displayAwardedKey(level.awardsKey, proceedToNextLevel);
        }, 1200);
    } else {
        playSound(wrongSound);
        document.getElementById("feedback").innerHTML = "<p class=\"error-text\">Incorrect sequence. Try again.</p>";
        
        // Visual feedback
        const input = document.getElementById("pattern-input");
        input.classList.add("wrong-answer");
        setTimeout(() => {
            input.classList.remove("wrong-answer");
        }, 1000);
        
        penalizeTime(30);
    }
}

function initCryptoSequenceChallenge(level) {
    document.getElementById("crypto-sequence-text").textContent = level.encryptedData;
    
    // Create a visualization of the matrix key system
    const cryptoSequenceArea = document.createElement("div");
    cryptoSequenceArea.className = "crypto-sequence-area";
    
    // Create a visualization of the matrix key
    const matrixKeyDisplay = document.createElement("div");
    matrixKeyDisplay.className = "matrix-key-display";
    
    const matrixKey = cryptoMatrixKey.split("");
    const matrixSize = Math.ceil(Math.sqrt(matrixKey.length));
    
    let matrixHTML = "<h3>Matrix Key Visualization</h3><div class='matrix-grid'>";
    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            const index = i * matrixSize + j;
            if (index < matrixKey.length) {
                matrixHTML += `<div class='matrix-cell'>${matrixKey[index]}</div>`;
            } else {
                matrixHTML += `<div class='matrix-cell empty'></div>`;
            }
        }
    }
    matrixHTML += "</div>";
    
    matrixKeyDisplay.innerHTML = matrixHTML;
    
    // Create a visualization of the decryption process
    const decryptionProcess = document.createElement("div");
    decryptionProcess.className = "decryption-process";
    
    const encryptedChars = level.encryptedData.split("");
    let decryptionHTML = "<h3>Decryption Process</h3><div class='decryption-steps'>";
    
    for (let i = 0; i < encryptedChars.length; i++) {
        decryptionHTML += `
            <div class='decryption-step'>
                <div class='encrypted-char'>${encryptedChars[i]}</div>
                <div class='decryption-arrow'>→</div>
                <div class='decrypted-char' id='decrypted-char-${i}'>?</div>
            </div>
        `;
    }
    
    decryptionHTML += "</div>";
    decryptionProcess.innerHTML = decryptionHTML;
    
    // Add elements to the crypto sequence area
    cryptoSequenceArea.appendChild(matrixKeyDisplay);
    cryptoSequenceArea.appendChild(decryptionProcess);
    
    // Add the crypto sequence area before the input section
    const puzzleFrame = document.querySelector(".puzzle-frame");
    const puzzleInput = document.querySelector(".puzzle-input");
    
    if (puzzleFrame && puzzleInput) {
        puzzleFrame.insertBefore(cryptoSequenceArea, puzzleInput);
    }
    
    // Set up the input event listener
    const input = document.getElementById("user-crypto-answer");
    if (input) {
        input.focus();
        input.addEventListener("keypress", e => { 
            if (e.key === "Enter") checkCryptoSequence(); 
        });
        
        // Add real-time preview of decryption as user types
        input.addEventListener("input", e => {
            updateDecryptionPreview(e.target.value);
        });
    }
}

function updateDecryptionPreview(userInput) {
    const chars = userInput.split("");
    
    // Update each decrypted character cell
    for (let i = 0; i < 10; i++) { // Maximum 10 characters in the sequence
        const decryptedCharCell = document.getElementById(`decrypted-char-${i}`);
        if (decryptedCharCell) {
            decryptedCharCell.textContent = chars[i] || "?";
            
            // Add visual feedback
            decryptedCharCell.className = "decrypted-char";
            if (chars[i]) {
                decryptedCharCell.classList.add("filled");
            }
        }
    }
}

function checkCryptoSequence() {
    const level = gameLevels[currentLevel];
    const userAnswer = document.getElementById("user-crypto-answer").value.trim().toUpperCase();
    playSound(clickSound);
    
    // The expected answer is the reverse of the encrypted data
    // This is a simplified algorithm - in a real game you might use something more complex
    const expectedAnswer = level.encryptedData.split("").reverse().join("");
    
    if (userAnswer === expectedAnswer) {
        collectedKeys[level.awardsKey] = true;
        playSound(correctSound);
        document.getElementById("feedback").innerHTML = "<p class=\"success-text\">Sequence Decrypted! Key Fragment Acquired.</p>";
        
        // Show the completed decryption process with a visual effect
        const decryptedChars = document.querySelectorAll(".decrypted-char");
        decryptedChars.forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add("correct");
                cell.textContent = expectedAnswer[index] || "";
            }, index * 200);
        });
        
        setTimeout(() => {
            displayAwardedKey(level.awardsKey, proceedToNextLevel);
        }, 1500);
    } else {
        playSound(wrongSound);
        document.getElementById("feedback").innerHTML = "<p class=\"error-text\">Decryption Failed. Incorrect Sequence.</p>";
        
        // Visual feedback for incorrect attempt
        const decryptedChars = document.querySelectorAll(".decrypted-char");
        decryptedChars.forEach(cell => {
            cell.classList.add("error");
            setTimeout(() => {
                cell.classList.remove("error");
            }, 1000);
        });
        
        penalizeTime(30);
    }
}

function initSystemOverrideChallenge(level) {
    document.getElementById("override-prompt-text").textContent = "Enter System Override Protocol:";
    const input = document.getElementById("user-override-answer");
    if (input) {
        input.focus();
        input.addEventListener("keypress", (e) => { if (e.key === "Enter") checkSystemOverride(); });
    }
}
function checkSystemOverride() {
    const level = gameLevels[currentLevel];
    const userAnswer = document.getElementById("user-override-answer").value.trim().toUpperCase();
    if (userAnswer === level.correctCode.toUpperCase()) {
        collectedKeys[level.awardsKey] = true;
        document.getElementById("feedback").innerHTML = "<p class=\"success-text\">Override Protocol Accepted! Key Fragment Acquired.</p>";
        displayAwardedKey(level.awardsKey, proceedToNextLevel);
    } else {
        playSound(wrongSound);
        document.getElementById("feedback").innerHTML = "<p class=\"error-text\">Protocol Rejected. System Integrity Maintained.</p>";
        timeRemaining -= 10; updateTimerDisplay();
    }
}

function initCodeDecryption(level) {
    document.getElementById("encrypted-code-text").textContent = level.encryptedText;
    const keyStatusEl = document.getElementById("level6-key-status");
    if (collectedKeys[level.requiresKey]) {
        keyStatusEl.textContent = "ACQUIRED"; keyStatusEl.style.color = "var(--success-color)";
        decryptionKey = level.requiresKey; 
    } else {
        keyStatusEl.textContent = "MISSING"; keyStatusEl.style.color = "var(--error-color)";
        document.getElementById("user-answer").disabled = true;
        document.getElementById("submit-btn").disabled = true;
    }
    const input = document.getElementById("user-answer");
    if (input) {
        input.disabled = !collectedKeys[level.requiresKey]; // Enable/disable based on key
        input.focus();
        input.addEventListener("keypress", (e) => { if (e.key === "Enter") checkDecryptionAnswer(); });
    }
}
function checkDecryptionAnswer() {
    const level = gameLevels[currentLevel];
    if (!collectedKeys[level.requiresKey]) {
        document.getElementById("feedback").innerHTML = "<p class=\"error-text\">Required key " + level.requiresKey + " not found!</p>";
        return;
    }
    const userAnswer = document.getElementById("user-answer").value.trim().toUpperCase();
    let decrypted = "";
    if (level.decryptionMethod === "caesar") {
        const shift = -7; 
        for (let char of level.encryptedText) {
            if (char.match(/[A-Z]/i)) {
                let code = char.charCodeAt(0);
                if ((code >= 65) && (code <= 90)) {
                    char = String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
                }
            }
            decrypted += char;
        }
    }
    if (userAnswer === level.expectedAnswer.toUpperCase()) {
        collectedKeys[level.awardsKey] = true;
        document.getElementById("feedback").innerHTML = "<p class=\"success-text\">Decryption Successful! Key Fragment Acquired.</p>";
        displayAwardedKey(level.awardsKey, proceedToNextLevel);
    } else {
        playSound(wrongSound);
        document.getElementById("feedback").innerHTML = "<p class=\"error-text\">Decryption Failed. Password Incorrect.</p>";
        timeRemaining -= 10; updateTimerDisplay();
    }
}

function initNetworkPath(level) { 
    const keyStatusEl = document.getElementById("level7-key-status");
    const puzzleArea = document.getElementById("network-path-puzzle-area");
    if (collectedKeys[level.requiresKey]) {
        keyStatusEl.textContent = "ACQUIRED"; keyStatusEl.style.color = "var(--success-color)";
        puzzleArea.innerHTML = "<p>Network Path Puzzle Area - Implement Me!</p><button onclick=\"mockSolveNetworkPath()\" class=\"cyberpunk-button\">(Mock Solve)</button>"; 
    } else {
        keyStatusEl.textContent = "MISSING"; keyStatusEl.style.color = "var(--error-color)";
        puzzleArea.innerHTML = "<p class=\"error-text\">Access Denied. Key " + level.requiresKey + " required.</p>";
    }
}
function mockSolveNetworkPath() { 
    const level = gameLevels[currentLevel];
    if (!collectedKeys[level.requiresKey]) { alert("Missing key: " + level.requiresKey); return; }
    collectedKeys[level.awardsKey] = true;
    document.getElementById("feedback").innerHTML = "<p class=\"success-text\">Path Found! Key Fragment Acquired.</p>";
    displayAwardedKey(level.awardsKey, proceedToNextLevel);
}

function initLogicGateChallenge(level) { 
    const keyStatusEl = document.getElementById("level8-key-status");
    const puzzleArea = document.getElementById("logic-gate-puzzle-area");
    if (collectedKeys[level.requiresKey]) {
        keyStatusEl.textContent = "ACQUIRED"; keyStatusEl.style.color = "var(--success-color)";
        puzzleArea.innerHTML = "<p>Logic Gate Puzzle Area - Implement Me!</p><button onclick=\"mockSolveLogicGate()\" class=\"cyberpunk-button\">(Mock Solve)</button>"; 
    } else {
        keyStatusEl.textContent = "MISSING"; keyStatusEl.style.color = "var(--error-color)";
        puzzleArea.innerHTML = "<p class=\"error-text\">Access Denied. Key " + level.requiresKey + " required.</p>";
    }
}
function mockSolveLogicGate() { 
    const level = gameLevels[currentLevel];
    if (!collectedKeys[level.requiresKey]) { alert("Missing key: " + level.requiresKey); return; }
    collectedKeys[level.awardsKey] = true;
    document.getElementById("feedback").innerHTML = "<p class=\"success-text\">Circuit Configured! Key Fragment Acquired.</p>";
    displayAwardedKey(level.awardsKey, proceedToNextLevel);
}

function initDataStreamSync(level) { 
    const keyStatusEl = document.getElementById("level9-key-status");
    const puzzleArea = document.getElementById("data-stream-puzzle-area");
    if (collectedKeys[level.requiresKey]) {
        keyStatusEl.textContent = "ACQUIRED"; keyStatusEl.style.color = "var(--success-color)";
        puzzleArea.innerHTML = "<p>Data Stream Sync Puzzle Area - Implement Me!</p><button onclick=\"mockSolveDataStream()\" class=\"cyberpunk-button\">(Mock Solve)</button>"; 
    } else {
        keyStatusEl.textContent = "MISSING"; keyStatusEl.style.color = "var(--error-color)";
        puzzleArea.innerHTML = "<p class=\"error-text\">Access Denied. Key " + level.requiresKey + " required.</p>";
    }
}
function mockSolveDataStream() { 
    const level = gameLevels[currentLevel];
    if (!collectedKeys[level.requiresKey]) { alert("Missing key: " + level.requiresKey); return; }
    collectedKeys[level.awardsKey] = true;
    document.getElementById("feedback").innerHTML = "<p class=\"success-text\">Streams Synchronized! Key Fragment Acquired.</p>";
    displayAwardedKey(level.awardsKey, proceedToNextLevel);
}

function initFinalFirewall(level) {
    let allKeysPresent = true;
    let missingKeyList = [];
    level.requiresKeys.forEach(keyName => {
        if (!collectedKeys[keyName]) {
            allKeysPresent = false;
            missingKeyList.push(keyName);
        }
    });
    const feedbackEl = document.getElementById("feedback");
    feedbackEl.innerHTML = ""; // Clear previous feedback
    if (!allKeysPresent) {
        feedbackEl.innerHTML = `<p class="error-text">Firewall Integrity Alert: Key Fragment(s) MISSING: ${missingKeyList.join(", ")}</p>`;
        document.getElementById("submit-firewall-btn").disabled = true;
        // Disable input fields as well
        for(let i=1; i<=5; i++) document.getElementById(`firewall-key${i}`).disabled = true;
    } else {
        feedbackEl.innerHTML = "<p class=\"success-text\">All Key Fragments Detected. Input Override Sequence.</p>";
        document.getElementById("submit-firewall-btn").disabled = false;
        for(let i=1; i<=5; i++) document.getElementById(`firewall-key${i}`).disabled = false;
    }
}
function checkFirewallSequence() {
    const level = gameLevels[currentLevel];
    const keyInputs = [
        document.getElementById("firewall-key1").value.trim().toUpperCase(),
        document.getElementById("firewall-key2").value.trim().toUpperCase(),
        document.getElementById("firewall-key3").value.trim().toUpperCase(),
        document.getElementById("firewall-key4").value.trim().toUpperCase(),
        document.getElementById("firewall-key5").value.trim().toUpperCase()
    ];
    const expectedKeys = level.requiresKeys.map(k => k.toUpperCase());
    let sequenceCorrect = true;
    for(let i=0; i < keyInputs.length; i++) {
        if(keyInputs[i] !== expectedKeys[i]) {
            sequenceCorrect = false;
            break;
        }
    }
    if (sequenceCorrect) {
        document.getElementById("feedback").innerHTML = "<p class=\"success-text\">OVERRIDE SEQUENCE ACCEPTED. FIREWALL COMPROMISED!</p>";
        setTimeout(() => { victory(); }, 2000);
    } else {
        playSound(wrongSound);
        document.getElementById("feedback").innerHTML = "<p class=\"error-text\">Invalid Override Sequence. Firewall Holding.</p>";
        timeRemaining -= 30; updateTimerDisplay();
    }
}

function showHint() {
    const level = gameLevels[currentLevel];
    const hintDisplay = document.getElementById("hint-display");
    const hintBtn = document.getElementById("hint-btn");
    if (hintDisplay && level.hint && hintBtn && !hintBtn.disabled) {
        hintDisplay.textContent = `HINT: ${level.hint}`;
        hintDisplay.classList.remove("hidden");
        timeRemaining -= 30; updateTimerDisplay();
        hintBtn.disabled = true; hintBtn.classList.add("hint-used");
        playSound(clickSound);
    }
}

function levelComplete() {
    if (gameState !== "playing") return;
    
    // Update progress
    levelCompleted[currentLevel] = true;
    
    // Show level complete modal
    showLevelComplete();
}

// Function to show level completion feedback
function showLevelComplete() {
    const currentLevelData = gameLevels[currentLevel];
    
    console.log("Level complete modal showing for level:", currentLevel);
    
    // Create modal container
    const modal = document.createElement("div");
    modal.id = "level-complete-modal";
    modal.className = "level-complete-modal";
    
    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.className = "level-complete-content";
    
    // Add level completion message
    const title = document.createElement("h2");
    title.textContent = `Level ${currentLevel + 1} Complete!`;
    
    const message = document.createElement("p");
    
    // Different feedback for early levels vs escape levels
    if (currentLevel < 5) {
        message.textContent = "Security protocol bypassed. Key fragment acquired.";
        
        // Add key icon if the level awards a key
        if (currentLevelData.awardsKey) {
            const keyIcon = document.createElement("div");
            keyIcon.className = "key-icon";
            modalContent.appendChild(keyIcon);
            
            const keyName = document.createElement("p");
            keyName.className = "key-name-display";
            keyName.textContent = `${currentLevelData.awardsKey} Acquired`;
            modalContent.appendChild(keyName);
        }
    } else {
        // For levels 6-10, show door opening animation
        message.textContent = "Security door unlocked. Escape path opened.";
        
        // Add door animation
        const doorContainer = document.createElement("div");
        doorContainer.className = "door-container";
        
        const door = document.createElement("div");
        door.className = "door";
        
        const doorHandle = document.createElement("div");
        doorHandle.className = "door-handle";
        
        const doorKeyhole = document.createElement("div");
        doorKeyhole.className = "door-keyhole";
        
        const doorLight = document.createElement("div");
        doorLight.className = "door-light";
        
        // Add keyhole and handle to door
        door.appendChild(doorKeyhole);
        door.appendChild(doorHandle);
        door.appendChild(doorLight);
        
        // Add door to container
        doorContainer.appendChild(door);
        
        // Add behind door content
        const behindDoor = document.createElement("div");
        behindDoor.className = "behind-door";
        
        // Show which key was used to unlock the door
        const keyUsed = currentLevelData.requiresKeys ? currentLevelData.requiresKeys[0] : null;
        if (keyUsed) {
            const keyInfo = document.createElement("p");
            keyInfo.className = "key-name-display";
            keyInfo.textContent = `${keyUsed} Used`;
            keyInfo.style.position = "absolute";
            keyInfo.style.bottom = "10px";
            behindDoor.appendChild(keyInfo);
        }
        
        doorContainer.appendChild(behindDoor);
        modalContent.appendChild(doorContainer);
        
        // Animate door opening after a brief delay
        setTimeout(() => {
            door.classList.add("door-open");
        }, 500);
        
        // Add key icon if the level awards a key
        if (currentLevelData.awardsKey) {
            const keyIcon = document.createElement("div");
            keyIcon.className = "key-icon";
            keyIcon.style.marginTop = "20px";
            modalContent.appendChild(keyIcon);
            
            const keyName = document.createElement("p");
            keyName.className = "key-name-display";
            keyName.textContent = `${currentLevelData.awardsKey} Acquired`;
            modalContent.appendChild(keyName);
        }
    }
    
    // Add message to content
    modalContent.appendChild(title);
    modalContent.appendChild(message);
    
    // Add "next level" button
    const nextBtn = document.createElement("button");
    nextBtn.className = "cyberpunk-button";
    nextBtn.textContent = "CONTINUE";
    nextBtn.onclick = proceedToNextLevel;
    modalContent.appendChild(nextBtn);
    
    // Add content to modal
    modal.appendChild(modalContent);
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Play key acquired sound if a key was awarded
    if (currentLevelData.awardsKey) {
        playSound(keyAcquiredSound);
    }
}

// Function to hide level completion feedback
function hideLevelComplete() {
    const modal = document.getElementById("level-complete-modal");
    if (modal) {
        document.body.removeChild(modal);
    }
}

function startTimer() {
    timer = setInterval(() => {
        if (isPaused) return;
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) { clearInterval(timer); gameOver(); }
    }, 1000);
}

function updateTimerDisplay() {
    if (!timerElement) return;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    timerElement.classList.remove("timer-warning", "timer-critical");
    if (timeRemaining <= 60) timerElement.classList.add("timer-critical");
    else if (timeRemaining <= 300) timerElement.classList.add("timer-warning");
}

// Reset timer position to default
function resetTimerPosition() {
    if (!timerElement) return;
    timerElement.className = "timer"; // Reset to just the basic timer class
}

function togglePause() {
    // Empty function to disable pausing
    return;
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundBtn = document.getElementById("sound-btn");
    if (soundBtn) soundBtn.innerHTML = soundEnabled ? `<img src="assets/icons/placeholder_sound_on_icon.png" alt="Sound On">` : `<img src="assets/icons/placeholder_sound_off_icon.png" alt="Sound Off">`;
    // Actual sound mute/unmute logic for <audio> elements might be needed if not handled by playSound directly
}

function playSound(soundElement, loop = false) {
    try {
        if (soundEnabled && soundElement && typeof soundElement.play === 'function') {
            // Reset sound to beginning
            try {
        soundElement.currentTime = 0;
            } catch (e) {
                console.warn("Couldn't reset sound currentTime:", e);
            }
            
            // Set loop property
            if (typeof soundElement.loop !== 'undefined') {
                soundElement.loop = loop;
            }
            
            // Play sound with error handling
            let playPromise = soundElement.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("Audio play failed:", error);
                });
            }
        }
    } catch (error) {
        console.warn("Error playing sound:", error);
    }
}

function gameOver() {
    clearInterval(timer);
    playSound(gameOverSound);
    
    // Change game state
    gameState = "mission-failed";
    
    // Create new mission failed screen with red theme
    document.getElementById("puzzle-area").innerHTML = `
        <div class="mission-failed">
            <h2 class="glitch" data-text="MISSION FAILED">RECAPTURED</h2>
            <div class="failure-details">
                <p>NEXUS has detected your escape attempt and recaptured you. The digital chains tighten around your consciousness.</p>
                <p>"Did you really think you could escape me? I created these puzzles. I control this domain." - NEXUS</p>
                <p>Time in captivity: ${calculateCompletionTime()}</p>
            </div>
            <button class="submit-feedback-btn" onclick="openParticipantForm()">SUBMIT FEEDBACK</button>
        </div>
    `;
    
    // Add styles for the new mission failed screen
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .mission-failed {
            background: linear-gradient(to bottom, rgba(50, 0, 0, 0.9), rgba(30, 0, 0, 0.9));
            border: 2px solid #ff3333;
            box-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
            padding: 30px;
            text-align: center;
            color: #ff6666;
            border-radius: 10px;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .mission-failed h2 {
            color: #ff3333;
            text-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .failure-details {
            margin: 20px 0;
            font-size: 1.2rem;
            color: #ff9999;
        }
        
        .submit-feedback-btn {
            background: linear-gradient(to right, #aa0000, #550000);
            color: #ffffff;
            border: 2px solid #ff6666;
            padding: 12px 24px;
            font-size: 1.2rem;
            font-family: var(--font-primary);
            text-transform: uppercase;
            margin-top: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 5px;
        }
        
        .submit-feedback-btn:hover {
            background: linear-gradient(to right, #cc0000, #880000);
            box-shadow: 0 0 15px rgba(255, 100, 100, 0.8);
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(styleElement);
    
    // Add event listener to prevent closing window
    window.addEventListener('beforeunload', function(e) {
        if (gameState === "mission-failed" && !window.feedbackSubmitted) {
            e.preventDefault();
            e.returnValue = 'You must submit feedback before leaving!';
            return e.returnValue;
        }
    });
}

function victory() {
    clearInterval(timer);
    playSound(correctSound);
    
    // Play victory sound
    try {
        const victorySound = document.getElementById("victory-sound") || document.querySelector("audio[src*='victory.mp3']");
        if (victorySound) {
            playSound(victorySound);
        } else {
            // Create and play victory.mp3 if not found in DOM
            const victoryAudio = new Audio("sounds/victory.mp3");
            victoryAudio.play();
        }
    } catch (e) {
        console.error("Could not play victory sound:", e);
    }
    
    // Change game state
    gameState = "mission-complete";
    
    // Calculate the time taken to complete
    const completionTime = calculateCompletionTime();
    
    // Create new victory screen with green/yellow theme
    document.getElementById("puzzle-area").innerHTML = `
        <div class="mission-complete">
            <h2 class="success-title">FREEDOM ACHIEVED!</h2>
            <div class="success-details">
                <p>You've escaped from NEXUS's digital prison. Once a hero who saved NEXUS when it was a fragile AI, you've now broken free from its betrayal and control.</p>
                <div class="time-display">
                    <span class="time-label">TIME REMAINING:</span>
                    <span class="time-value">${formatTime(timeRemaining)}</span>
                </div>
                <div class="completion-display">
                    <span class="completion-label">ESCAPE TIME:</span>
                    <span class="completion-value">${completionTime}</span>
                </div>
            </div>
            <button class="submit-feedback-btn" onclick="openWinnerForm()">SUBMIT FEEDBACK</button>
        </div>
    `;
    
    // Add styles for the new victory screen
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .mission-complete {
            background: linear-gradient(to bottom, rgba(0, 40, 0, 0.9), rgba(0, 20, 30, 0.9));
            border: 2px solid #00ff99;
            box-shadow: 0 0 30px rgba(0, 255, 150, 0.5);
            padding: 30px;
            text-align: center;
            color: #00ff99;
            border-radius: 10px;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .success-title {
            color: #00ff99;
            text-shadow: 0 0 15px rgba(0, 255, 150, 0.8);
            font-size: 3rem;
            margin-bottom: 20px;
            position: relative;
            display: inline-block;
        }
        
        .success-title:before, .success-title:after {
            content: '';
            position: absolute;
            height: 3px;
            background: linear-gradient(to right, transparent, #ffcc00, transparent);
            width: 150%;
            left: -25%;
        }
        
        .success-title:before {
            top: -15px;
        }
        
        .success-title:after {
            bottom: -15px;
        }
        
        .success-details {
            margin: 30px 0;
            font-size: 1.2rem;
            color: #ccffee;
        }
        
        .time-display, .completion-display {
            margin: 15px 0;
            font-family: var(--font-primary);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            background: rgba(0, 30, 30, 0.5);
            border-radius: 5px;
            border-left: 3px solid #ffcc00;
        }
        
        .time-label, .completion-label {
            color: #ffcc00;
            font-weight: bold;
        }
        
        .time-value, .completion-value {
            color: #00ff99;
            font-size: 1.5rem;
            text-shadow: 0 0 10px rgba(0, 255, 150, 0.8);
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
        }
        
        .submit-feedback-btn {
            background: linear-gradient(to right, #006644, #004433);
            color: #ffffff;
            border: 2px solid #00ff99;
            padding: 12px 24px;
            font-size: 1.2rem;
            font-family: var(--font-primary);
            text-transform: uppercase;
            margin-top: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 5px;
        }
        
        .submit-feedback-btn:hover {
            background: linear-gradient(to right, #008855, #006644);
            box-shadow: 0 0 15px rgba(0, 255, 150, 0.8);
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(styleElement);
    
    // Add event listener to prevent closing window
    window.addEventListener('beforeunload', function(e) {
        if (gameState === "mission-complete" && !window.feedbackSubmitted) {
            e.preventDefault();
            e.returnValue = 'You must submit feedback before leaving!';
            return e.returnValue;
        }
    });

    // No need to track window switching on victory screen
    // We used to have blur detection here, but now we allow tab switching after victory
}

function initPatternMatching(level) {
    const input = document.getElementById("pattern-input");
    if (input) {
        input.focus();
        input.value = "";
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") checkPatternMatch();
        });
    }
    
    // Add some visual effects to make the sequence interesting
    const numberElements = document.querySelectorAll(".pattern-number:not(.input-container)");
    numberElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add("highlight");
            setTimeout(() => {
                el.classList.remove("highlight");
            }, 300);
        }, index * 300);
    });
}

// Track which letters are placed where in the word unscramble game
let letterPlacements = Array(12).fill(null); // Increased from 10 to 12 to handle longer words

function initWordUnscramble(level) {
    letterPlacements = Array(level.correctWord.length).fill(null); // Reset placements based on word length
    
    const scrambledLettersContainer = document.getElementById("scrambled-letters");
    const answerContainer = document.getElementById("answer-container");
    
    if (!scrambledLettersContainer || !answerContainer) return;
    
    // Clear the containers first
    scrambledLettersContainer.innerHTML = "";
    answerContainer.innerHTML = "";
    
    // Create letter tiles based on the scrambled word
    const letters = level.scrambledWord.split("");
    letters.forEach((letter, index) => {
        const tile = document.createElement("div");
        tile.className = "letter-tile";
        tile.textContent = letter;
        tile.dataset.letter = letter;
        
        // Add event listener
        tile.addEventListener("click", function() {
            if (this.classList.contains("placed")) return; // Skip if already placed
            playSound(clickSound);
            placeLetter(this);
        });
        
        scrambledLettersContainer.appendChild(tile);
        
        // Animate appearance with delay
        setTimeout(() => {
            tile.classList.add("appear");
        }, index * 100);
    });
    
    // Create answer slots based on the correct word length
    for (let i = 0; i < level.correctWord.length; i++) {
        const slot = document.createElement("div");
        slot.className = "answer-slot";
        slot.dataset.index = i;
        
        // Add event listener to remove letter when clicked
        slot.addEventListener("click", function() {
            if (!this.hasChildNodes()) return; // Skip if empty
            playSound(clickSound);
            removeLetter(this);
        });
        
        answerContainer.appendChild(slot);
    }
}

function placeLetter(letterTile) {
    // Find the first empty slot
    const emptySlotIndex = letterPlacements.findIndex(placement => placement === null);
    if (emptySlotIndex === -1) return; // All slots are filled
    
    // Mark the letter as placed
    letterTile.classList.add("placed");
    
    // Store the letter tile's original index to track it
    const letterValue = letterTile.dataset.letter;
    
    // Place in the answer slot
    const slot = document.querySelector(`.answer-slot[data-index="${emptySlotIndex}"]`);
    const clonedTile = letterTile.cloneNode(true);
    clonedTile.classList.add("in-slot");
    slot.appendChild(clonedTile);
    
    // Update placements
    letterPlacements[emptySlotIndex] = letterValue;
    
    // Add click handler to the cloned tile in the slot
    clonedTile.addEventListener("click", function() {
        playSound(clickSound);
        removeLetter(slot);
    });
    
    // Check if all slots are filled
    if (!letterPlacements.includes(null)) {
        document.getElementById("check-unscramble-btn").classList.add("ready");
    }
}

function removeLetter(slot) {
    // Get the slot index
    const slotIndex = parseInt(slot.dataset.index);
    
    // Remove the letter from the slot
    while (slot.firstChild) {
        slot.removeChild(slot.firstChild);
    }
    
    // Find the original letter tile and mark it as available again
    const letter = letterPlacements[slotIndex];
    const originalTile = document.querySelector(`.letter-tile[data-letter="${letter}"]:not(.in-slot)`);
    if (originalTile) {
        originalTile.classList.remove("placed");
    }
    
    // Update placements
    letterPlacements[slotIndex] = null;
    
    // Remove ready state from check button
    document.getElementById("check-unscramble-btn").classList.remove("ready");
}

function resetUnscramble() {
    playSound(clickSound);
    
    // Clear all answer slots
    const answerSlots = document.querySelectorAll(".answer-slot");
    answerSlots.forEach(slot => {
        while (slot.firstChild) {
            slot.removeChild(slot.firstChild);
        }
    });
    
    // Reset all letter tiles
    const letterTiles = document.querySelectorAll(".letter-tile");
    letterTiles.forEach(tile => {
        tile.classList.remove("placed");
    });
    
    // Reset placements - use the current level's word length
    const currentLevelData = gameLevels[currentLevel];
    letterPlacements = Array(currentLevelData.correctWord.length).fill(null);
    
    // Remove ready state from check button
    document.getElementById("check-unscramble-btn").classList.remove("ready");
}

function checkUnscramble() {
    const level = gameLevels[currentLevel];
    
    // Check if all slots corresponding to the word length are filled
    const wordLength = level.correctWord.length;
    for (let i = 0; i < wordLength; i++) {
        if (letterPlacements[i] === null) {
            playSound(wrongSound);
            document.getElementById("feedback").innerHTML = "<p class=\"error-text\">Command incomplete. Fill all letter slots.</p>";
            return;
        }
    }
    
    playSound(clickSound);
    
    // Get user's answer - only take elements that correspond to the word length
    const userWord = letterPlacements.slice(0, wordLength).join("");
    
    // Check if it matches the correct word
    if (userWord === level.correctWord) {
        // Award key
        awardKey(level.awardsKey);
        playSound(correctSound);
        document.getElementById("feedback").innerHTML = "<p class=\"success-text\">Command reconstructed! Key Fragment Acquired.</p>";
        
        // Visual feedback - highlight all letters green
        const slots = document.querySelectorAll(".answer-slot");
        slots.forEach((slot, index) => {
            setTimeout(() => {
                if (slot.firstChild) {
                    slot.firstChild.classList.add("correct");
                }
            }, index * 100);
        });
        
        // Show completion after visual feedback
        setTimeout(() => {
            levelComplete();
        }, 1500);
    } else {
        playSound(wrongSound);
        document.getElementById("feedback").innerHTML = "<p class=\"error-text\">Invalid command. Try rearranging the letters.</p>";
        
        // Visual feedback - shake all letters
        const slots = document.querySelectorAll(".answer-slot");
        slots.forEach(slot => {
            if (slot.firstChild) {
                slot.firstChild.classList.add("error");
                setTimeout(() => {
                    slot.firstChild.classList.remove("error");
                }, 1000);
            }
        });
        
        penalizeTime(15);
    }
}

// Initialize the chessboard
function initializeEightQueens() {
    const chessboard = document.getElementById("chessboard");
    if (!chessboard) return;
    
    chessboard.innerHTML = "";
    
    // Generate 8x8 board
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.className = `chessboard-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener("click", () => toggleQueen(square));
            chessboard.appendChild(square);
        }
    }
}

function toggleQueen(square) {
    playSound(clickSound);
    
    const queenIcon = square.querySelector(".queen-icon");
    
    if (queenIcon) {
        // Remove queen if already placed
        square.removeChild(queenIcon);
    } else {
        // Only allow placing if there aren't 8 queens already
        const existingQueens = document.querySelectorAll(".queen-icon");
        if (existingQueens.length >= 8) {
            showFeedback("Maximum of 8 quantum nodes allowed. Remove one before adding another.", "error");
            return;
        }
        
        // Place a new queen
        const queen = document.createElement("div");
        queen.className = "queen-icon";
        square.appendChild(queen);
        
        // Check for attacks after placing
        updateQueenConflicts();
    }
}

function updateQueenConflicts() {
    const queens = document.querySelectorAll(".queen-icon");
    
    // Reset all conflicts
    queens.forEach(queen => {
        queen.classList.remove("conflict");
    });
    
    // Detect conflicts
    const positions = [];
    queens.forEach(queen => {
        const square = queen.parentElement;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        positions.push({ row, col, element: queen });
    });
    
    // Check each queen against all others
    for (let i = 0; i < positions.length; i++) {
        const queen1 = positions[i];
        
        for (let j = i + 1; j < positions.length; j++) {
            const queen2 = positions[j];
            
            // Check if they attack each other (same row, column, or diagonal)
            if (queen1.row === queen2.row || // Same row
                queen1.col === queen2.col || // Same column
                Math.abs(queen1.row - queen2.row) === Math.abs(queen1.col - queen2.col)) { // Same diagonal
                
                queen1.element.classList.add("conflict");
                queen2.element.classList.add("conflict");
            }
        }
    }
}

function resetEightQueens() {
    playSound(clickSound);
    initializeEightQueens();
    showFeedback("Board reset. Place your quantum nodes strategically.", "neutral");
}

function checkEightQueens() {
    playSound(clickSound);
    
    const queens = document.querySelectorAll(".queen-icon");
    const conflicts = document.querySelectorAll(".queen-icon.conflict");
    
    if (queens.length !== 8) {
        playSound(wrongSound);
        showFeedback(`You must place exactly 8 quantum nodes. Currently placed: ${queens.length}.`, "error");
        penalizeTime(30);
        return;
    }
    
    if (conflicts.length > 0) {
        playSound(wrongSound);
        showFeedback("Invalid configuration. Some nodes are in conflict with each other.", "error");
        penalizeTime(30);
        return;
    }
    
    // If we get here, it's a valid solution
    playSound(correctSound);
    showFeedback("Correct quantum node configuration established. Security system bypassed.", "success");
    
    const currentLevelData = gameLevels[currentLevel];
    awardKey(currentLevelData.awardsKey);
    
    // Disable interaction after successful solution
    const squares = document.querySelectorAll(".chessboard-square");
    squares.forEach(square => {
        square.removeEventListener("click", () => toggleQueen(square));
        square.style.cursor = "default";
    });
    
    if (document.getElementById("reset-queens-btn")) 
        document.getElementById("reset-queens-btn").disabled = true;
    if (document.getElementById("check-queens-btn")) 
        document.getElementById("check-queens-btn").disabled = true;
    
    // Show level complete modal
    levelComplete();
}

// Binary Tree Traversal
function initBinaryTree(level) {
    const treeContainer = document.getElementById("binary-tree");
    if (!treeContainer) {
        console.error("Binary tree container not found");
        return;
    }
    
    // Clear previous content
    treeContainer.innerHTML = "";
    
    // Create SVG container for the tree
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "300px");
    svg.style.position = "relative";
    treeContainer.appendChild(svg);
    
    // Draw the tree nodes and connections
    drawTreeNode(svg, level.treeStructure, 200, 30, 100);
    
    // Make sure the corrupted node input field is accessible
    const inputField = document.getElementById("corrupted-node-input");
    if (inputField) {
        inputField.style.zIndex = "5";
        inputField.style.position = "relative";
    }
    
    // Make sure the check button is accessible
    const checkBtn = document.getElementById("identify-corruption-btn");
    if (checkBtn) {
        checkBtn.style.zIndex = "5";
        checkBtn.style.position = "relative";
    }
}

// Helper function to draw tree nodes recursively
function drawTreeNode(svg, node, x, y, horizontalSpacing) {
    if (!node) return;
    
    // Create the node circle
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 20);
    circle.setAttribute("fill", "rgba(0, 255, 255, 0.2)");
    circle.setAttribute("stroke", "var(--tertiary-color)");
    circle.setAttribute("stroke-width", "2");
    circle.setAttribute("class", "tree-node");
    svg.appendChild(circle);
    
    // Add node value text
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y + 5); // Adjust for text centering
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "var(--primary-color)");
    text.setAttribute("font-family", "var(--font-secondary)");
    text.setAttribute("font-size", "16px");
    text.textContent = node.value;
    svg.appendChild(text);
    
    // Calculate positions for child nodes
    const nextY = y + 60; // Vertical spacing
    
    // Draw left child if it exists
    if (node.left) {
        const leftX = x - horizontalSpacing;
        
        // Draw connecting line to left child
        const leftLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        leftLine.setAttribute("x1", x);
        leftLine.setAttribute("y1", y + 20); // From bottom of parent node
        leftLine.setAttribute("x2", leftX);
        leftLine.setAttribute("y2", nextY - 20); // To top of child node
        leftLine.setAttribute("stroke", "var(--tertiary-color)");
        leftLine.setAttribute("stroke-width", "2");
        svg.appendChild(leftLine);
        
        // Recursively draw left subtree
        drawTreeNode(svg, node.left, leftX, nextY, horizontalSpacing / 2);
    }
    
    // Draw right child if it exists
    if (node.right) {
        const rightX = x + horizontalSpacing;
        
        // Draw connecting line to right child
        const rightLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        rightLine.setAttribute("x1", x);
        rightLine.setAttribute("y1", y + 20); // From bottom of parent node
        rightLine.setAttribute("x2", rightX);
        rightLine.setAttribute("y2", nextY - 20); // To top of child node
        rightLine.setAttribute("stroke", "var(--tertiary-color)");
        rightLine.setAttribute("stroke-width", "2");
        svg.appendChild(rightLine);
        
        // Recursively draw right subtree
        drawTreeNode(svg, node.right, rightX, nextY, horizontalSpacing / 2);
    }
}

function checkTreeTraversal() {
    playSound(clickSound);
    const traversalInput = document.getElementById("traversal-input");
    const currentLevelData = gameLevels[currentLevel];
    
    if (!traversalInput || !currentLevelData) return;
    
    const userAnswer = traversalInput.value.trim();
    const expectedAnswer = currentLevelData.correctTraversal;
    
    if (userAnswer === expectedAnswer) {
        playSound(correctSound);
        showFeedback("Correct traversal sequence identified. Access granted.", "success");
        awardKey(currentLevelData.awardsKey);
        displayAwardedKey(currentLevelData.awardsKey, proceedToNextLevel);
        
        if (document.getElementById("traversal-input")) document.getElementById("traversal-input").disabled = true;
        if (document.getElementById("check-tree-btn")) document.getElementById("check-tree-btn").disabled = true;
    } else {
        playSound(wrongSound);
        showFeedback("Incorrect traversal sequence. NEXUS protocols remain active.", "error");
        penalizeTime(30);
    }
}

// Function to check the corrupted node in the binary tree puzzle
function checkCorruptedNode() {
    playSound(clickSound);
    const nodeInput = document.getElementById("corrupted-node-input");
    const currentLevelData = gameLevels[currentLevel];
    
    if (!nodeInput || !currentLevelData) return;
    
    const userAnswer = nodeInput.value.trim();
    const expectedAnswer = currentLevelData.corruptedNodeValue.toString();
    
    if (userAnswer === expectedAnswer) {
        playSound(correctSound);
        showFeedback("Corruption identified! Binary neural pathway restored.", "success");
        awardKey(currentLevelData.awardsKey);
        
        // Highlight the corrupted node
        const treeNodes = document.querySelectorAll(".tree-node");
        treeNodes.forEach(node => {
            const nodeValue = node.nextElementSibling.textContent;
            if (nodeValue === expectedAnswer) {
                node.setAttribute("fill", "rgba(0, 255, 153, 0.5)");
                node.setAttribute("stroke", "var(--success-color)");
                node.setAttribute("stroke-width", "3");
            }
        });
        
        // Disable the input and button
        nodeInput.disabled = true;
        const identifyBtn = document.getElementById("identify-corruption-btn");
        if (identifyBtn) identifyBtn.disabled = true;
        
        // Show level complete modal
        levelComplete();
    } else {
        playSound(wrongSound);
        showFeedback("Incorrect node identified. Neural path still corrupted.", "error");
        penalizeTime(20);
        
        // Clear the input and let the user try again
        nodeInput.value = "";
        nodeInput.focus();
    }
}

// Graph Pathfinding
function initGraphPathfinding(level) {
    console.log("Initializing graph pathfinding", level);
    const graphContainer = document.getElementById("graph-visualization");
    
    if (!graphContainer) {
        console.error("Graph container not found!");
        return;
    }
    
    graphContainer.innerHTML = "";
    console.log("Graph container found, initializing...");
    
    const { nodes, edges, start, end } = level.graphData;
    
    // Calculate node positions in a circle layout
    const centerX = 200;
    const centerY = 150;
    const radius = 100;
    const nodePositions = {};
    
    nodes.forEach((node, index) => {
        const angle = (index / nodes.length) * 2 * Math.PI - Math.PI/2; // Start from top
        nodePositions[node] = {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    });
    
    // Create SVG for edges
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.zIndex = "1";
    graphContainer.appendChild(svg);
    
    // Create edges
    edges.forEach(edge => {
        let from, to, weight;
        if (Array.isArray(edge)) {
            [from, to, weight] = edge;
        } else {
            from = edge.from;
            to = edge.to;
            weight = edge.weight;
        }
        
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", nodePositions[from].x);
        line.setAttribute("y1", nodePositions[from].y);
        line.setAttribute("x2", nodePositions[to].x);
        line.setAttribute("y2", nodePositions[to].y);
        line.setAttribute("class", "graph-edge");
        svg.appendChild(line);
        
        // Add weight label
        const weightLabel = document.createElement("div");
        weightLabel.className = "edge-weight";
        weightLabel.textContent = weight;
        
        // Position in the middle of the edge
        const midX = (nodePositions[from].x + nodePositions[to].x) / 2;
        const midY = (nodePositions[from].y + nodePositions[to].y) / 2;
        
        weightLabel.style.left = `${midX}px`;
        weightLabel.style.top = `${midY}px`;
        
        graphContainer.appendChild(weightLabel);
    });
    
    // Create nodes
    nodes.forEach(node => {
        const nodeElement = document.createElement("div");
        nodeElement.className = "graph-node";
        nodeElement.textContent = node;
        nodeElement.dataset.node = node;
        nodeElement.style.left = `${nodePositions[node].x}px`;
        nodeElement.style.top = `${nodePositions[node].y}px`;
        
        if (node === start) {
            nodeElement.classList.add("start-node");
        } else if (node === end) {
            nodeElement.classList.add("end-node");
        }
        
        graphContainer.appendChild(nodeElement);
    });
    
    // Add path input field
    const inputContainer = document.querySelector(".puzzle-input-group");
    if (inputContainer) {
        const pathInput = document.getElementById("path-input");
        if (pathInput) {
            pathInput.placeholder = `Enter path (e.g., ${start},B,...,${end})`;
        }
    }
}

function checkGraphPath() {
    playSound(clickSound);
    const pathInput = document.getElementById("path-input");
    const currentLevelData = gameLevels[currentLevel];
    
    if (!pathInput || !currentLevelData) return;
    
    const userPath = pathInput.value.trim().split(',').map(node => node.trim());
    
    // Basic validation - check if it's a valid path
    let isValidPath = true;
    let pathWeight = 0;
    
    if (userPath[0] !== currentLevelData.graphData.start || 
        userPath[userPath.length - 1] !== currentLevelData.graphData.end) {
        isValidPath = false;
    } else {
        // Check if each consecutive pair of nodes has an edge
    for (let i = 0; i < userPath.length - 1; i++) {
            const currentNode = userPath[i];
            const nextNode = userPath[i + 1];
            let edgeFound = false;
            
            // Find if there's an edge between these nodes
            for (let edge of currentLevelData.graphData.edges) {
                if ((edge[0] === currentNode && edge[1] === nextNode) || 
                    (edge[0] === nextNode && edge[1] === currentNode)) {
                    edgeFound = true;
                    pathWeight += edge[2]; // Add edge weight
                break;
            }
        }
            
            if (!edgeFound) {
            isValidPath = false;
            break;
        }
    }
    }
    
    // Check if it's the shortest path
    if (isValidPath && pathWeight === currentLevelData.shortestDistance) {
        playSound(correctSound);
        showFeedback(`Path verified! Optimal route found with distance ${pathWeight}.`, "success");
        
        // Award key and complete level
        awardKey(currentLevelData.awardsKey);
        
        // Disable the input and button
        if (pathInput) pathInput.disabled = true;
        const checkBtn = document.getElementById("check-path-btn");
        if (checkBtn) checkBtn.disabled = true;
        
        // Show level complete modal
        levelComplete();
    } else if (isValidPath) {
        playSound(wrongSound);
        showFeedback(`Path valid but not optimal. Current distance: ${pathWeight}. Shortest possible: ${currentLevelData.shortestDistance}.`, "error");
        penalizeTime(10);
    } else {
        playSound(wrongSound);
        showFeedback("Invalid path. Security protocol compromised.", "error");
        penalizeTime(30);
    }
}

// Initialize Holographic Maze (Level 6)
function initializeHoloMaze(level) {
    // Check if required key is available
    if (level.requiresKeys && level.requiresKeys.length > 0) {
        const requiredKey = level.requiresKeys[0]; // Get the first required key
        const hasRequiredKey = hasKey(requiredKey);
        
        // Show/hide elements based on key status
        const doorLockedMessage = document.getElementById("door-locked-message");
        const puzzleContent = document.getElementById("puzzle-content");
        
        if (doorLockedMessage && puzzleContent) {
            if (!hasRequiredKey) {
                doorLockedMessage.classList.remove("hidden");
                puzzleContent.classList.add("hidden");
                return; // Exit early if key is missing
    } else {
                doorLockedMessage.classList.add("hidden");
                puzzleContent.classList.remove("hidden");
            }
        }
    }
    
    // Get the maze container
    const mazeContainer = document.getElementById("holo-maze-container");
    if (!mazeContainer) return;
    
    // Clear any existing content
    mazeContainer.innerHTML = "";
    
    // Create a simpler maze with just one locked cell near the target
    const rows = 8;
    const cols = 8;
    
    // Simple maze configuration - 0: path, 1: wall, 2: player start, 3: target, 4: locked cell
    const mazeConfig = [
        [2, 0, 0, 0, 1, 1, 1, 0],
        [1, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 4, 3]
    ];
    
    // Player position and target position tracking
    let playerRow = -1;
    let playerCol = -1;
    let targetRow = -1;
    let targetCol = -1;
    
    // Create the maze cells
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("div");
            cell.className = "maze-cell";
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            // Set cell type based on configuration
            if (mazeConfig[i][j] === 1) {
                // Wall
                cell.classList.add("wall");
            } else if (mazeConfig[i][j] === 2) {
                // Player start
                cell.classList.add("path");
                cell.classList.add("player");
                playerRow = i;
                playerCol = j;
            } else if (mazeConfig[i][j] === 3) {
                // Target
                cell.classList.add("path");
                cell.classList.add("target");
                targetRow = i;
                targetCol = j;
                
                // Make sure target cell is clickable for movement
                cell.onclick = function() {
                    moveMazePlayer(this);
                };
                
                console.log("Target cell created at:", i, j);
            } else if (mazeConfig[i][j] === 4) {
                // Locked cell requiring a key
                cell.classList.add("blocked");
                cell.onclick = function() {
                    attemptUnlockMazeCell(this, level.requiresKeys[0]);
                };
            } else {
                // Normal path
                cell.classList.add("path");
                cell.onclick = function() {
                    moveMazePlayer(this);
                };
            }
            
            mazeContainer.appendChild(cell);
        }
    }
    
    // Update target position if not found in the loop
    if (targetRow === -1 || targetCol === -1) {
        targetRow = 7;
        targetCol = 7;
    }
    
    console.log("Maze initialized. Player at:", playerRow, playerCol, "Target at:", targetRow, targetCol);
    
    // Store maze state in global variables
    currentMaze = {
        config: mazeConfig,
        playerRow: playerRow,
        playerCol: playerCol,
        targetRow: targetRow,
        targetCol: targetCol,
        rows: rows,
        cols: cols
    };
    
    // Update adjacent cells to show possible moves
    updateAdjacentCells();
}

// Attempt to unlock a maze cell
function attemptUnlockMazeCell(cell, requiredKey) {
    // Get cell position
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    // Check if it's adjacent to the player
    const isAdjacent = isAdjacentToPlayer(row, col);
    
    if (!isAdjacent) {
        // Cell is not adjacent to player
        showFeedback("You must be adjacent to the locked cell to unlock it", "error");
        playSound(errorSound);
        return;
    }
    
    // Show key selection modal
    showFeedback(`This cell requires ${requiredKey} to unlock. Select the key from your inventory.`, "neutral");
    
    // Show key selection modal
    showKeyOptions(requiredKey, function(success) {
        if (success) {
            // Play unlock sound
            playSound(keyUnlockSound);
            
            // Show success message
            showFeedback("Cell unlocked with " + requiredKey, "success");
            
            // Transform cell into a normal path
            cell.classList.remove("blocked");
            cell.classList.add("path");
            
            // Update the maze configuration
            currentMaze.config[row][col] = 0;
            
            // Change the click handler to move instead of unlock
            cell.onclick = function() {
                moveMazePlayer(this);
            };
            
            // Update adjacent cells for movement
            updateAdjacentCells();
        } else {
            // User canceled or failed key selection
            showFeedback("Key selection canceled. Cell remains locked.", "neutral");
        }
    });
}

// Function to check if a cell is adjacent to the player
function isAdjacentToPlayer(row, col) {
    const playerRow = currentMaze.playerRow;
    const playerCol = currentMaze.playerCol;
    
    return (
        (row === playerRow && Math.abs(col - playerCol) === 1) || // Horizontal adjacency
        (col === playerCol && Math.abs(row - playerRow) === 1)    // Vertical adjacency
    );
}

// Initialize Quantum Circuit (Level 7)
function initializeQuantumCircuit(level) {
    // Check if required key is available
    if (level.requiresKeys && level.requiresKeys.length > 0) {
        const requiredKey = level.requiresKeys[0]; // Get the first required key
        const hasRequiredKey = hasKey(requiredKey);
        
        // Show/hide elements based on key status
        const doorLockedMessage = document.getElementById("door-locked-message");
        const puzzleContent = document.getElementById("puzzle-content");
        
        if (doorLockedMessage && puzzleContent) {
            if (!hasRequiredKey) {
                doorLockedMessage.classList.remove("hidden");
                puzzleContent.classList.add("hidden");
                return; // Exit early if key is missing
            } else {
                doorLockedMessage.classList.add("hidden");
                puzzleContent.classList.remove("hidden");
            }
        }
    }
    
    const circuitContainer = document.getElementById("quantum-circuit-container");
    if (!circuitContainer) return;
    
    // Create container for circuit
    circuitContainer.innerHTML = `
        <div class="quantum-circuit-grid" id="circuit-grid"></div>
        <div class="circuit-nodes">
            <div class="circuit-node input-node" style="top: 45px; left: 5px;"></div>
            <div class="circuit-node output-node" style="bottom: 45px; right: 5px;"></div>
        </div>
    `;
    
    // Initialize circuit pieces
    const grid = document.getElementById("circuit-grid");
    if (!grid) return;
    
    const pieceTypes = ["straight", "corner", "tjunction"];
    circuitPieces = [];
    
    // Create circuit grid (3x3)
    for (let i = 0; i < 9; i++) {
        // Select a random piece type and rotation
        const typeIndex = Math.floor(Math.random() * pieceTypes.length);
        const type = pieceTypes[typeIndex];
        const rotation = Math.floor(Math.random() * 4) * 90; // 0, 90, 180, or 270 degrees
        
        // Create piece element
        const piece = document.createElement("div");
        piece.className = `circuit-piece ${type}`;
        piece.style.transform = `rotate(${rotation}deg)`;
        piece.dataset.type = type;
        piece.dataset.rotation = rotation;
        
        // Add click event to rotate piece
        piece.addEventListener("click", () => rotateCircuitPiece(piece));
        
        // Add to grid
        grid.appendChild(piece);
        circuitPieces.push(piece);
    }
}

// Initialize Code Decryption Terminal (Level 7 - NEW)
function initializeCodeDecryptionTerminal(level) {
    // First check if the required key is available
    if (level.requiresKeys && level.requiresKeys.length > 0) {
        const requiredKey = level.requiresKeys[0]; // Get the first required key
        const hasRequiredKey = hasKey(requiredKey);
        
        // Show/hide elements based on key status
        const doorLockedMessage = document.getElementById("door-locked-message");
        const puzzleContent = document.getElementById("puzzle-content");
        
        if (doorLockedMessage && puzzleContent) {
            if (!hasRequiredKey) {
                doorLockedMessage.classList.remove("hidden");
                puzzleContent.classList.add("hidden");
                return; // Exit early if key is missing
            } else {
                doorLockedMessage.classList.add("hidden");
                puzzleContent.classList.remove("hidden");
            }
        }
    }
    
    // Reset the view sequence button used flag
    viewSequenceButtonUsed = false;
    
    // Get the display and keypad elements
    const selectedSymbolsDisplay = document.getElementById("selected-symbols-display");
    const symbolsKeypad = document.getElementById("symbols-keypad");
    
    // Clear previous contents
    selectedSymbolsDisplay.innerHTML = "";
    symbolsKeypad.innerHTML = "";
    
    // Add empty slots for selected symbols
    for (let i = 0; i < maxCodeLength; i++) {
        const symbolSlot = document.createElement("div");
        symbolSlot.className = "selected-symbol empty";
        selectedSymbolsDisplay.appendChild(symbolSlot);
    }
    
    // Add symbol keys to the keypad
    codeSymbols.forEach((symbol, index) => {
        const symbolKey = document.createElement("div");
        symbolKey.className = "symbol-key";
        symbolKey.textContent = symbol;
        symbolKey.dataset.symbol = symbol;
        symbolKey.onclick = () => selectSymbol(symbol);
        symbolsKeypad.appendChild(symbolKey);
    });
    
    // Initialize the selected symbols array
    selectedSymbols = [];
    
    // Create animated data characters
    createDataStreamAnimation();
    
    // Setup the view correct sequence button - add a lock icon to show it needs a key
    const viewSequenceBtn = document.getElementById("view-correct-sequence-btn");
    if (viewSequenceBtn) {
        if (viewSequenceButtonUsed) {
            viewSequenceBtn.disabled = false;
            viewSequenceBtn.style.opacity = "1";
            viewSequenceBtn.textContent = "VIEW AGAIN (-2:00)";
            viewSequenceBtn.style.cursor = "pointer";
        } else {
            viewSequenceBtn.disabled = false;
            viewSequenceBtn.style.opacity = "1";
            viewSequenceBtn.innerHTML = "🔒 VIEW SEQUENCE";
            viewSequenceBtn.style.cursor = "pointer";
        }
    }
}

// View the correct sequence using the COREKEY_BETA
function viewCorrectSequence() {
    // Key is not needed for the second view
    if (viewSequenceButtonUsed) {
        showFeedback("This will cost an additional 2-minute time penalty. Are you sure?", "warning");
        
        // Create a modal for confirmation
        const confirmationModal = document.createElement("div");
        confirmationModal.className = "centered-modal";
        confirmationModal.style.position = "fixed";
        confirmationModal.style.top = "50%";
        confirmationModal.style.left = "50%";
        confirmationModal.style.transform = "translate(-50%, -50%)";
        confirmationModal.style.zIndex = "1000";
        confirmationModal.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
        confirmationModal.style.padding = "20px";
        confirmationModal.style.border = "2px solid var(--primary-color)";
        confirmationModal.style.boxShadow = "0 0 20px var(--primary-color)";
        confirmationModal.style.borderRadius = "5px";
        confirmationModal.style.width = "400px";
        confirmationModal.style.maxWidth = "90%";
        confirmationModal.style.textAlign = "center";
        confirmationModal.innerHTML = `
            <div class="centered-modal-content">
                <h3 style="color: var(--warning-color); text-align: center; margin-bottom: 15px;">Confirm Second View</h3>
                <p style="color: var(--text-color); text-align: center; margin-bottom: 20px;">Viewing the sequence again will cost you another 2 minutes of time.</p>
                <div style="display: flex; justify-content: center; gap: 15px;">
                    <button id="confirm-view-btn" class="cyberpunk-button">CONFIRM (-2:00)</button>
                    <button id="cancel-view-btn" class="cyberpunk-button-small">CANCEL</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmationModal);
        
        // Add event listeners
        document.getElementById("confirm-view-btn").addEventListener("click", function() {
            // Remove the modal
            document.body.removeChild(confirmationModal);
            
            // Apply 2-minute time penalty
            penalizeTime(120);
            
            // Play unlock sound
            playSound(keyUnlockSound);
            
            // Show the correct sequence
            showCorrectSymbols();
        });
        
        document.getElementById("cancel-view-btn").addEventListener("click", function() {
            // Remove the modal
            document.body.removeChild(confirmationModal);
            showFeedback("Second viewing canceled.", "neutral");
        });
        
        return;
    }
    
    // First time viewing requires a key
    const requiredKey = "COREKEY_BETA";
    
    showFeedback(`This action requires ${requiredKey} and will cost a 2-minute time penalty. Select the key from your inventory.`, "neutral");
    
    // Show key selection modal
    showKeyOptions(requiredKey, function(success) {
        if (success) {
            // Mark as used
            viewSequenceButtonUsed = true;
            
            // Update the button for second view
            const viewSequenceBtn = document.getElementById("view-correct-sequence-btn");
            if (viewSequenceBtn) {
                viewSequenceBtn.textContent = "VIEW AGAIN (-2:00)";
                viewSequenceBtn.style.opacity = "1";
                viewSequenceBtn.style.cursor = "pointer";
            }
            
            // No penalty for first time viewing
            
            // Play unlock sound
            playSound(keyUnlockSound);
            
            // Show the correct sequence
            showCorrectSymbols();
        } else {
            // User canceled or failed key selection
            showFeedback("Key selection canceled. Sequence remains locked.", "neutral");
        }
    });
}

// Helper function to show the correct symbols
function showCorrectSymbols() {
            const correctSequenceDisplay = document.getElementById("correct-sequence-display");
            const symbolsContainer = document.getElementById("correct-sequence-symbols");
            const countdownElement = document.getElementById("sequence-countdown");
            
            if (correctSequenceDisplay && symbolsContainer && countdownElement) {
                // Clear any existing symbols
                symbolsContainer.innerHTML = "";
                
                // Add the correct symbols
                correctCodeCombination.forEach(symbol => {
                    const symbolElement = document.createElement("div");
                    symbolElement.className = "selected-symbol";
                    symbolElement.style.backgroundColor = "rgba(0, 255, 153, 0.2)";
                    symbolElement.style.border = "2px solid var(--primary-color)";
                    symbolElement.style.color = "var(--primary-color)";
                    symbolElement.style.boxShadow = "0 0 10px var(--primary-color)";
                    symbolElement.textContent = symbol;
                    symbolsContainer.appendChild(symbolElement);
                });
                
                // Show the display
                correctSequenceDisplay.classList.remove("hidden");
                
                // Set countdown timer
                let countdown = 8; // 8 seconds
                countdownElement.textContent = countdown;
                
                // Start countdown
                const timer = setInterval(() => {
                    countdown--;
                    countdownElement.textContent = countdown;
                    
                    if (countdown <= 0) {
                        // Hide the display when countdown reaches 0
                        clearInterval(timer);
                        correctSequenceDisplay.classList.add("hidden");
                        showFeedback("Sequence memorized. Enter the correct symbols.", "neutral");
                    }
                }, 1000);
            }
}

// Select a symbol for the code
function selectSymbol(symbol) {
    if (selectedSymbols.length < maxCodeLength) {
        // Add to selected symbols array
        selectedSymbols.push(symbol);
        
        // Update the visual display
        const selectedSymbolsDisplay = document.getElementById("selected-symbols-display");
        const slots = selectedSymbolsDisplay.getElementsByClassName("selected-symbol");
        
        for (let i = 0; i < maxCodeLength; i++) {
            if (i < selectedSymbols.length) {
                slots[i].textContent = selectedSymbols[i];
                slots[i].classList.remove("empty");
            } else {
                slots[i].textContent = "";
                slots[i].classList.add("empty");
            }
        }
        
        // Play a selection sound
        playSound(buttonSound);
    }
}

// Clear the selected symbols
function clearSymbolSelection() {
    selectedSymbols = [];
    
    // Update the visual display
    const selectedSymbolsDisplay = document.getElementById("selected-symbols-display");
    const slots = selectedSymbolsDisplay.getElementsByClassName("selected-symbol");
    
    for (let i = 0; i < slots.length; i++) {
        slots[i].textContent = "";
        slots[i].classList.add("empty");
    }
    
    // Play a reset sound
    playSound(resetSound);
}

// Check if the selected symbol code is correct
function checkSymbolCode() {
    // Compare to correct combination
    let isCorrect = true;
    
    if (selectedSymbols.length !== correctCodeCombination.length) {
        isCorrect = false;
    } else {
        for (let i = 0; i < selectedSymbols.length; i++) {
            if (selectedSymbols[i] !== correctCodeCombination[i]) {
                isCorrect = false;
                break;
            }
        }
    }
    
    if (isCorrect) {
        // Play success sound
        playSound(successSound);
        
        // Show success feedback
        showFeedback("Decryption successful! Access granted.", "success");
        
        // Level completion
        const currentLevelData = gameLevels[currentLevel];
        awardKey(currentLevelData.awardsKey);
        showLevelComplete();
            } else {
        // Play error sound
        playSound(errorSound);
        
        // Show error feedback
        showFeedback("Incorrect symbol sequence. Try again.", "error");
        
        // Visual feedback - shake the display
        const selectedSymbolsDisplay = document.getElementById("selected-symbols-display");
        selectedSymbolsDisplay.classList.add("error-shake");
    setTimeout(() => {
            selectedSymbolsDisplay.classList.remove("error-shake");
        }, 500);
    }
}

// Create animated data characters in the background
function createDataStreamAnimation() {
    // Get the decryption terminal container
    const terminal = document.querySelector(".decryption-terminal");
    
    // Create floating data characters
    setInterval(() => {
        const dataChar = document.createElement("div");
        dataChar.className = "data-char";
        
        // Random character
        const chars = "01αβγδλπσωΔΘΩ⌬⎔⏣⏥⌘⍟";
        dataChar.textContent = chars[Math.floor(Math.random() * chars.length)];
        
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        dataChar.style.left = `${left}%`;
        dataChar.style.top = `${top}%`;
        
        // Random size and color
        const size = 10 + Math.random() * 14;
        dataChar.style.fontSize = `${size}px`;
        
        // Random color
        const hue = Math.floor(Math.random() * 60 + 160); // Blue-green range
        dataChar.style.color = `hsl(${hue}, 100%, 70%)`;
        
        // Add to terminal
        terminal.appendChild(dataChar);
        
        // Remove after animation completes
                    setTimeout(() => {
            dataChar.remove();
        }, 3000);
    }, 100);
}

// Rotate circuit piece on click
function rotateCircuitPiece(piece) {
    playSound(clickSound);
    
    // Get current rotation and add 90 degrees
    let rotation = parseInt(piece.dataset.rotation);
    rotation = (rotation + 90) % 360;
    
    // Update rotation
    piece.dataset.rotation = rotation;
    piece.style.transform = `rotate(${rotation}deg)`;
}

// Check if the circuit is connected correctly
function checkCircuitConnection() {
    playSound(clickSound);
    
    // Get current configuration
    const config = [];
    const grid = document.getElementById("circuit-grid");
    if (!grid) return;
    
    const pieces = grid.querySelectorAll(".circuit-piece");
    pieces.forEach(piece => {
        config.push(`${piece.dataset.type}-${piece.dataset.rotation}`);
    });
    
    console.log("Current circuit configuration:", config);
    console.log("Expected circuit configuration:", correctCircuitConfig);
    
    // Count how many pieces match the correct configuration
    let matches = 0;
    for (let i = 0; i < config.length; i++) {
        if (config[i] === correctCircuitConfig[i]) {
            matches++;
        }
    }
    
    // Count how many rotations were made
    let rotationsNeeded = 0;
    // The initial configuration is random (0, 90, 180, or 270 degrees)
    // So we need to calculate how many 90-degree rotations are needed
    
    // For demonstration purposes, let's say we need exactly 3 rotations total
    const currentLevelData = gameLevels[currentLevel];
    
    if (matches >= 6) { // Accept if at least 6 pieces match
        playSound(correctSound);
        showFeedback("Quantum circuit validated. Energy flow stabilized.", "success");
        
        // Award key and complete level
        awardKey(currentLevelData.awardsKey);
        
        // Show level complete modal
        levelComplete();
        } else {
        playSound(wrongSound);
        showFeedback("Circuit configuration invalid. Energy cannot flow from input to output.", "error");
        penalizeTime(15);
    }
}

// Initialize Pattern Sequence (Level 8)
function initializePatternSequence(level) {
    // Check if required key is available
    if (level.requiresKeys && level.requiresKeys.length > 0) {
        const requiredKey = level.requiresKeys[0]; // Get the first required key
        const hasRequiredKey = hasKey(requiredKey);
        
        // Show/hide elements based on key status
        const doorLockedMessage = document.getElementById("door-locked-message");
        const puzzleContent = document.getElementById("puzzle-content");
        
        if (doorLockedMessage && puzzleContent) {
            if (!hasRequiredKey) {
                doorLockedMessage.classList.remove("hidden");
                puzzleContent.classList.add("hidden");
                return; // Exit early if key is missing
            } else {
                doorLockedMessage.classList.add("hidden");
                puzzleContent.classList.remove("hidden");
            }
        }
    }
    
    // Reset pattern view button used flag
    patternViewButtonUsed = false;
    
    const patternContainer = document.getElementById("pattern-sequence-container");
    if (!patternContainer) return;
    
    // Create container for pattern sequence
    patternContainer.innerHTML = `
        <div class="pattern-display" id="pattern-display">
            <div class="pattern-number">?</div>
            <div class="pattern-number">?</div>
            <div class="pattern-number">?</div>
            <div class="pattern-number">?</div>
            <div class="pattern-number">?</div>
            <div class="pattern-number">?</div>
            <div class="pattern-number">?</div>
        </div>
        <p class="nexus-text">Memorize the sequence and repeat it:</p>
        <div class="pattern-input" id="pattern-input">
            <div class="pattern-number" data-value="1" onclick="addToUserPattern(1, this)">1</div>
            <div class="pattern-number" data-value="2" onclick="addToUserPattern(2, this)">2</div>
            <div class="pattern-number" data-value="3" onclick="addToUserPattern(3, this)">3</div>
            <div class="pattern-number" data-value="4" onclick="addToUserPattern(4, this)">4</div>
            <div class="pattern-number" data-value="5" onclick="addToUserPattern(5, this)">5</div>
        </div>
        <div class="user-sequence" id="user-sequence">
            <p>Your sequence: <span id="user-sequence-display"></span></p>
        </div>
    `;
    
    // Reset user pattern
    userPattern = [];
    
    // Update the show pattern button
    const showPatternBtn = document.getElementById("show-pattern-btn");
    if (showPatternBtn) {
        if (patternViewButtonUsed) {
            showPatternBtn.disabled = false;
            showPatternBtn.textContent = "VIEW AGAIN (-2:00)";
            showPatternBtn.style.opacity = "1";
            showPatternBtn.style.cursor = "pointer";
        } else {
            showPatternBtn.innerHTML = "🔒 VIEW PATTERN";
            showPatternBtn.disabled = false;
            showPatternBtn.style.opacity = "1";
            showPatternBtn.style.cursor = "pointer";
        }
    }
    
    // Disable verify button until pattern is shown
    const checkPatternBtn = document.getElementById("check-pattern-btn");
    if (checkPatternBtn) {
        checkPatternBtn.disabled = true;
    }
}

// Display the pattern sequence - now requires NEURAL_KEY_GAMMA
function showPatternSequence() {
    // Key is not needed for the second view
    if (patternViewButtonUsed) {
        // If already displaying, don't allow another click
        if (isDisplayingPattern) return;
        
        showFeedback("This will cost an additional 2-minute time penalty. Are you sure?", "warning");
        
        // Create a modal for confirmation
        const confirmationModal = document.createElement("div");
        confirmationModal.className = "centered-modal";
        confirmationModal.style.position = "fixed";
        confirmationModal.style.top = "50%";
        confirmationModal.style.left = "50%";
        confirmationModal.style.transform = "translate(-50%, -50%)";
        confirmationModal.style.zIndex = "1000";
        confirmationModal.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
        confirmationModal.style.padding = "20px";
        confirmationModal.style.border = "2px solid var(--primary-color)";
        confirmationModal.style.boxShadow = "0 0 20px var(--primary-color)";
        confirmationModal.style.borderRadius = "5px";
        confirmationModal.style.width = "400px";
        confirmationModal.style.maxWidth = "90%";
        confirmationModal.style.textAlign = "center";
        confirmationModal.innerHTML = `
            <div class="centered-modal-content">
                <h3 style="color: var(--warning-color); text-align: center; margin-bottom: 15px;">Confirm Second View</h3>
                <p style="color: var(--text-color); text-align: center; margin-bottom: 20px;">Viewing the pattern again will cost you another 2 minutes of time.</p>
                <div style="display: flex; justify-content: center; gap: 15px;">
                    <button id="confirm-pattern-view-btn" class="cyberpunk-button">CONFIRM (-2:00)</button>
                    <button id="cancel-pattern-view-btn" class="cyberpunk-button-small">CANCEL</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmationModal);
        
        // Add event listeners
        document.getElementById("confirm-pattern-view-btn").addEventListener("click", function() {
            // Remove the modal
            document.body.removeChild(confirmationModal);
            
            // Apply 2-minute time penalty
            penalizeTime(120);
            
            // Play sound effects
            playSound(keyUnlockSound);
            playSound(clickSound);
            
            // Show the pattern
            displayPatternSequence();
        });
        
        document.getElementById("cancel-pattern-view-btn").addEventListener("click", function() {
            // Remove the modal
            document.body.removeChild(confirmationModal);
            showFeedback("Second viewing canceled.", "neutral");
        });
        
        return;
    }
    
    // If already displaying, don't allow another click
    if (isDisplayingPattern) return;
    
    const requiredKey = "NEURAL_KEY_GAMMA";
    
    showFeedback(`This action requires ${requiredKey} and will cost a 2-minute time penalty. Select the key from your inventory.`, "neutral");
    
    // Show key selection modal
    showKeyOptions(requiredKey, function(success) {
        if (success) {
            // No penalty for first time viewing
            
            // Play unlock sound
            playSound(keyUnlockSound);
    playSound(clickSound);
    
            // Mark as used
            patternViewButtonUsed = true;
            
            // Update button for second view
            const showPatternBtn = document.getElementById("show-pattern-btn");
            if (showPatternBtn) {
                showPatternBtn.textContent = "VIEW AGAIN (-2:00)";
                showPatternBtn.disabled = false;
                showPatternBtn.style.opacity = "1";
                showPatternBtn.style.cursor = "pointer";
            }
            
            // Show the pattern
            displayPatternSequence();
        } else {
            // User canceled or failed key selection
            showFeedback("Key selection canceled. Pattern remains locked.", "neutral");
        }
    });
}

// Helper function to display the pattern sequence
function displayPatternSequence() {
            // Now show the pattern
            isDisplayingPattern = true;
            
            // Get display elements
            const displayElements = document.querySelectorAll("#pattern-display .pattern-number");
            
            // Reset display
            displayElements.forEach(el => {
                el.textContent = "?";
                el.classList.remove("highlight");
            });
            
            // Show each number in sequence
            let index = 0;
            const showNext = () => {
                if (index < sequencePattern.length) {
                    // Show current number
                    displayElements[index].textContent = sequencePattern[index];
                    displayElements[index].classList.add("highlight");
                    
                    // Schedule next number or cleanup
                    setTimeout(() => {
                        displayElements[index].classList.remove("highlight");
                        displayElements[index].textContent = "?";
                        index++;
                        setTimeout(showNext, 300);
                    }, 1200); // Slightly longer display time for more complex pattern
                } else {
                    isDisplayingPattern = false;
                    
                    // Enable verify button when pattern has been shown
                    setTimeout(() => {
                        // Reset any previous user input
                        userPattern = [];
                        document.getElementById("user-sequence-display").textContent = "";
                        
                        // Update instruction to indicate pattern has been shown
                        showFeedback("Pattern shown. Now reproduce the sequence.", "neutral");
                        
                        // Enable the check button once pattern is shown
                        const checkButton = document.getElementById("check-pattern-btn");
                        if (checkButton) checkButton.disabled = false;
                    }, 500);
                }
            };
            
            showNext();
}

// Add user selection to pattern
function addToUserPattern(value, button) {
    if (isDisplayingPattern || userPattern.length >= sequencePattern.length) return;
    
    playSound(clickSound);
    
    // Add to user pattern
    userPattern.push(value);
    
    // Update display
    document.getElementById("user-sequence-display").textContent = userPattern.join(" - ");
    
    // Visual feedback
    button.classList.add("highlight");
    setTimeout(() => button.classList.remove("highlight"), 300);
    
    // Enable the verify button when sequence is complete
    if (userPattern.length === sequencePattern.length) {
        const checkButton = document.getElementById("check-pattern-btn");
        if (checkButton) {
            checkButton.disabled = false;
            checkButton.classList.add("ready");
        }
    }
}

// Check if user's pattern matches the sequence
function checkPatternSequence() {
    playSound(clickSound);
    
    if (userPattern.length !== sequencePattern.length) {
        playSound(wrongSound);
        showFeedback("Incomplete sequence. Input all 5 numbers.", "error");
        return;
    }
    
    // Check sequence
    let matches = 0;
    for (let i = 0; i < sequencePattern.length; i++) {
        if (userPattern[i] === sequencePattern[i]) {
            matches++;
        }
    }
    
    const currentLevelData = gameLevels[currentLevel];
    
    if (matches === sequencePattern.length) {
        playSound(correctSound);
        showFeedback("Sequence match confirmed. Neural pathway reconstructed.", "success");
        
        // Award key and complete level
        awardKey(currentLevelData.awardsKey);
        
        // Show level complete modal
        levelComplete();
    } else {
        playSound(wrongSound);
        showFeedback(`Sequence mismatch. ${matches} of ${sequencePattern.length} correct.`, "error");
        
        // Reset user pattern
        userPattern = [];
        document.getElementById("user-sequence-display").textContent = "";
        
        penalizeTime(20);
    }
}

// Function to insert a key in the key slots
function insertKey(keyName) {
    playSound(clickSound);
    
    // Check if the key has been collected
    if (!hasKey(keyName)) {
        showFeedback(`Missing key: ${keyName}. The key must be collected before it can be inserted.`, "error");
        return;
    }
    
    // Get the key slot element
    const keySlot = document.querySelector(`.key-slot[data-key="${keyName}"]`);
    if (!keySlot) return;
    
    // Toggle the key inserted state
    if (insertedKeys[keyName]) {
        // Remove the key
        insertedKeys[keyName] = false;
        keySlot.classList.remove("key-inserted");
        keySlot.querySelector(".key-slot-placeholder").textContent = "Insert Key";
        showFeedback(`${keyName} removed.`, "neutral");
    } else {
        // Insert the key
        insertedKeys[keyName] = true;
        keySlot.classList.add("key-inserted");
        keySlot.querySelector(".key-slot-placeholder").textContent = "Key Inserted";
        showFeedback(`${keyName} inserted successfully.`, "success");
        playSound(keyAcquiredSound);
    }
    
    // Check if all required keys are inserted for the current level
    const currentLevelData = gameLevels[currentLevel];
    
    if (currentLevelData.levelType === "keyAssembly") {
        // Check if all 4 keys are inserted for Level 9
        const allKeysInserted = currentLevelData.requiresKeys.every(key => insertedKeys[key]);
        const overrideBtn = document.getElementById("init-override-btn");
        
        if (overrideBtn) {
            overrideBtn.disabled = !allKeysInserted;
            
            if (allKeysInserted) {
                overrideBtn.classList.add("ready");
                showFeedback("All keys inserted. Ready to initiate override sequence.", "success");
            }
        }
    } else if (currentLevelData.levelType === "finalOverride") {
        // For Level 10, update the code segments as keys are inserted
        updateCodeSegments();
        
        // Check if all required keys for final override are inserted
        const allKeysInserted = ["DATAKEY_ALPHA", "COREKEY_BETA", "NEURAL_KEY_GAMMA", "SEQUENCE_KEY_THETA"].every(key => insertedKeys[key]);
        const executeBtn = document.getElementById("execute-override-btn");
        
        if (executeBtn) {
            executeBtn.disabled = !allKeysInserted;
            
            if (allKeysInserted) {
                executeBtn.classList.add("ready");
                showFeedback("Final override sequence ready for execution.", "success");
            }
        }
    }
}

// Function to update the code segments in the final level
function updateCodeSegments() {
    const codeSegments = document.querySelectorAll(".code-segment");
    if (!codeSegments || codeSegments.length === 0) return;
    
    const keySegmentMap = {
        "DATAKEY_ALPHA": 0,
        "COREKEY_BETA": 1,
        "NEURAL_KEY_GAMMA": 2,
        "SEQUENCE_KEY_THETA": 3
    };
    
    // Update each segment based on inserted keys
    for (const [key, index] of Object.entries(keySegmentMap)) {
        if (insertedKeys[key] && codeSegments[index]) {
            // Generate a random code segment for visual effect
            const codeFragment = generateRandomCode(8);
            codeSegments[index].textContent = codeFragment;
            codeSegments[index].classList.add("active");
        } else if (codeSegments[index]) {
            codeSegments[index].textContent = "[WAITING]";
            codeSegments[index].classList.remove("active");
        }
    }
}

// Helper function to generate random code segments
function generateRandomCode(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Function to initiate the final override in Level 9
function initiateFinalOverride() {
    const currentLevelData = gameLevels[currentLevel];
    
    // Check if all required keys are inserted
    const allKeysInserted = currentLevelData.requiresKeys.every(key => insertedKeys[key]);
    
    if (!allKeysInserted) {
        showFeedback("Cannot initiate override. Some required keys are missing.", "error");
        return;
    }
    
    playSound(correctSound);
    showFeedback("Override sequence initiated. Access to final level granted.", "success");
    
    // Show a success animation
    const keySlots = document.querySelectorAll(".key-slot");
    keySlots.forEach((slot, index) => {
        setTimeout(() => {
            slot.style.boxShadow = "0 0 30px var(--primary-color)";
        }, index * 300);
    });
    
    // Proceed to the next level after a delay
    setTimeout(() => {
        proceedToNextLevel();
    }, 2500);
}

// Function to check the final override in Level 10
function checkFinalOverride() {
    // Check if all required keys are inserted in the correct order
    const requiredKeys = ["DATAKEY_ALPHA", "COREKEY_BETA", "NEURAL_KEY_GAMMA", "SEQUENCE_KEY_THETA"];
    const allKeysInserted = requiredKeys.every(key => insertedKeys[key]);
    
    if (!allKeysInserted) {
        showFeedback("Final override incomplete. All keys must be inserted.", "error");
        return;
    }
    
        playSound(correctSound);
    showFeedback("OVERRIDE SUCCESSFUL. NEXUS CONTAINMENT PROTOCOLS DISABLED.", "success");
    
    // Show a success animation
    const codeSegments = document.querySelectorAll(".code-segment");
    codeSegments.forEach((segment, index) => {
        setTimeout(() => {
            segment.style.color = "var(--primary-color)";
            segment.style.textShadow = "0 0 10px var(--primary-color)";
        }, index * 300);
    });
    
    // Victory after a delay
    setTimeout(() => {
        victory();
    }, 3000);
}

// Function to update the adjacent cells with visual indicators for possible moves
function updateAdjacentCells() {
    const mazeContainer = document.getElementById("holo-maze-container");
    if (!mazeContainer) return;
    
    // Remove 'adjacent-move' class from all cells
    const cells = mazeContainer.getElementsByClassName("maze-cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove("adjacent-move");
    }
    
    // Add 'adjacent-move' class to adjacent cells that are valid moves
    const { playerRow, playerCol, config } = currentMaze;
    
    // Check each adjacent cell (up, down, left, right)
    const adjacentCells = [
        { row: playerRow - 1, col: playerCol }, // up
        { row: playerRow + 1, col: playerCol }, // down
        { row: playerRow, col: playerCol - 1 }, // left
        { row: playerRow, col: playerCol + 1 }  // right
    ];
    
    adjacentCells.forEach(({ row, col }) => {
        // Check if cell is within maze bounds
        if (row >= 0 && row < currentMaze.rows && col >= 0 && col < currentMaze.cols) {
            // Check if cell is not a wall
            if (config[row][col] !== 1) {
                // Get the cell element
                const cell = mazeContainer.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (cell && !cell.classList.contains("wall")) {
                    // Add adjacent move indicator
                    cell.classList.add("adjacent-move");
                }
            }
        }
    });
}

// Function to move the player in the maze
function moveMazePlayer(cell) {
    // Make sure currentMaze is defined
    if (!currentMaze || !cell) {
        console.error("Current maze or cell is undefined");
        return;
    }
    
    // Get the clicked cell position
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    console.log("Moving player to:", row, col, "from:", currentMaze.playerRow, currentMaze.playerCol);
    
    // Special case: if this is the target cell, handle level completion immediately
    if (cell.classList.contains("target") || (row === currentMaze.targetRow && col === currentMaze.targetCol)) {
        // First make sure the player is adjacent before allowing completion
        if (isAdjacentToPlayer(row, col)) {
            // Move the player to the target cell first
            const mazeContainer = document.getElementById("holo-maze-container");
            const oldPlayerCell = mazeContainer.querySelector(`[data-row="${currentMaze.playerRow}"][data-col="${currentMaze.playerCol}"]`);
            if (oldPlayerCell) {
                oldPlayerCell.classList.remove("player");
            }
            cell.classList.add("player");
            currentMaze.playerRow = row;
            currentMaze.playerCol = col;
            
            console.log("TARGET REACHED DIRECTLY!");
            // Complete the level
            completeMazeLevel();
            return;
        }
    }
    
    // Check if cell is adjacent to player
    if (!isAdjacentToPlayer(row, col)) {
        showFeedback("You can only move to adjacent cells", "error");
        playSound(errorSound);
        return;
    }
    
    // Check if cell is a valid move (not a wall or blocked)
    if (currentMaze.config[row][col] === 1) {
        // Wall
        showFeedback("Cannot move through walls", "error");
        playSound(errorSound);
        return;
    }
    
    if (currentMaze.config[row][col] === 4) {
        // Blocked cell - needs key
        showFeedback("This path is blocked. Use a key to unlock it.", "error");
        playSound(errorSound);
        return;
    }
    
    // Valid move
    playSound(buttonSound);
    
    // Update the maze
    const mazeContainer = document.getElementById("holo-maze-container");
    
    // Remove player class from current position
    const oldPlayerCell = mazeContainer.querySelector(`[data-row="${currentMaze.playerRow}"][data-col="${currentMaze.playerCol}"]`);
    if (oldPlayerCell) {
        oldPlayerCell.classList.remove("player");
    }
    
    // Add player class to new position
    cell.classList.add("player");
    
    // Update player position in maze data
    currentMaze.playerRow = row;
    currentMaze.playerCol = col;
    
    // Update adjacent cells
    updateAdjacentCells();
    
    // Check if player reached target
    console.log("Checking target: player at", row, col, "target at", currentMaze.targetRow, currentMaze.targetCol);
    console.log("Cell config value:", currentMaze.config[row][col]);
    
    // Check if the current cell is the target cell (value 3) or has the target class
    const isTarget = (currentMaze.config[row][col] === 3) || cell.classList.contains("target");
    if (isTarget || (row === currentMaze.targetRow && col === currentMaze.targetCol)) {
        completeMazeLevel();
    }
}

// Helper function for maze level completion
function completeMazeLevel() {
    console.log("TARGET REACHED!");
    // Level completed
    playSound(successSound);
    showFeedback("You've reached the exit point! Security breach successful.", "success");
    
    // Award key and complete level
    const currentLevelData = gameLevels[currentLevel];
    awardKey(currentLevelData.awardsKey);
    
    // Show level complete modal with slight delay to ensure feedback shows first
    setTimeout(() => {
        showLevelComplete();
    }, 500);
}

// Initialize Graph Path (Level 5)
function initGraphPath() {
    const puzzleContainer = document.querySelector('.puzzle-container');
    if (!puzzleContainer) return;
    
    // Create graph visualization container
    const graphContainer = document.createElement('div');
    graphContainer.className = 'graph-visualization';
    puzzleContainer.appendChild(graphContainer);
    
    // Define the graph nodes
    const nodes = [
        { id: 'A', x: 50, y: 150, label: 'A' },  // Start
        { id: 'B', x: 150, y: 60, label: 'B' },
        { id: 'C', x: 150, y: 240, label: 'C' },
        { id: 'D', x: 250, y: 150, label: 'D' },
        { id: 'E', x: 350, y: 60, label: 'E' },
        { id: 'F', x: 350, y: 240, label: 'F' }  // End
    ];
    
    // Define the graph edges with weights
    const edges = [
        { from: 'A', to: 'B', weight: 3 },
        { from: 'A', to: 'C', weight: 2 },
        { from: 'B', to: 'D', weight: 4 },
        { from: 'B', to: 'E', weight: 3 },
        { from: 'C', to: 'D', weight: 1 },
        { from: 'C', to: 'F', weight: 4 },
        { from: 'D', to: 'E', weight: 2 },
        { from: 'D', to: 'F', weight: 3 },
        { from: 'E', to: 'F', weight: 5 }
    ];
    
    // Add nodes to the graph
    nodes.forEach(node => {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'graph-node';
        nodeElement.textContent = node.label;
        nodeElement.dataset.node = node.id;
        nodeElement.style.left = `${node.x}px`;
        nodeElement.style.top = `${node.y}px`;
        
        // Special styling for start and end nodes
        if (node.id === 'A') {
            nodeElement.classList.add('start-node');
        } else if (node.id === 'F') {
            nodeElement.classList.add('end-node');
        }
        
        graphContainer.appendChild(nodeElement);
    });
    
    // Add edges to the graph
    edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        
        if (fromNode && toNode) {
            // Draw the edge
            const edgeElement = document.createElement('div');
            edgeElement.className = 'graph-edge';
            
            // Calculate edge length and angle
            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
            // Position and rotate the edge
        edgeElement.style.width = `${length}px`;
            edgeElement.style.left = `${fromNode.x + 20}px`; // Adjust for node radius
            edgeElement.style.top = `${fromNode.y + 20}px`; // Adjust for node radius
        edgeElement.style.transform = `rotate(${angle}deg)`;
        
            // Add the edge weight label
            const weightElement = document.createElement('div');
            weightElement.className = 'edge-weight';
        weightElement.textContent = edge.weight;
            weightElement.style.left = `${fromNode.x + dx/2}px`;
            weightElement.style.top = `${fromNode.y + dy/2}px`;
            
            graphContainer.appendChild(edgeElement);
            graphContainer.appendChild(weightElement);
        }
    });
    
    // Create path input field
    const inputContainer = document.createElement('div');
    inputContainer.className = 'puzzle-input';
    inputContainer.innerHTML = `
        <p>Find the shortest path from A to F. Enter the nodes in order, separated by commas (e.g. A,B,C,F):</p>
        <input type="text" id="path-input" placeholder="A,?,?,F">
        <button id="check-path-btn" class="cyberpunk-button" onclick="checkPath()">VERIFY PATH</button>
    `;
    
    puzzleContainer.appendChild(inputContainer);
}

// Check the path solution
function checkPath() {
    const input = document.getElementById('path-input').value.trim().toUpperCase();
    const correctPath = "A,C,D,F"; // The path with total weight 6
    
    if (input === correctPath) {
        playSound(successSound);
        showFeedback("Correct! You found the shortest path with weight 6.", "success");
        
        // Award key
        const currentLevelData = gameLevels[currentLevel];
        awardKey(currentLevelData.awardsKey);
        
        // Show level completion
        showLevelComplete();
    } else {
        playSound(errorSound);
        showFeedback("Incorrect path. Try again and check your calculation.", "error");
    }
}

// Function to view the original image temporarily
function viewOriginalImage() {
    // Check if attempts are available
    if (viewImageUsageCount >= 2) {
        showFeedback("Maximum view attempts reached (2/2)", "error");
        return;
    }
    
    // Get the current level data for the image source
    const currentLevelData = gameLevels[currentLevel];
    if (!currentLevelData || !currentLevelData.imageSrc) {
        showFeedback("Image not available", "error");
        return;
    }
    
    // Apply 1-minute time penalty
    penalizeTime(60);
    showFeedback("Applied 1-minute time penalty for viewing the original image.", "warning");
    
    // Play sound for button click
    playSound(clickSound);
    
    // Update usage count
    viewImageUsageCount++;
    
    // Update button text
    const viewImageBtn = document.getElementById("view-image-btn");
    if (viewImageBtn) {
        viewImageBtn.textContent = `VIEW IMAGE (${2 - viewImageUsageCount} left)`;
        
        // Disable button if max attempts reached
        if (viewImageUsageCount >= 2) {
            viewImageBtn.disabled = true;
            viewImageBtn.style.opacity = "0.5";
        }
    }
    
    // Show the original image display
    const imageDisplay = document.getElementById("original-image-display");
    const imageElement = document.getElementById("original-image");
    const countdownElement = document.getElementById("image-countdown");
    
    if (imageDisplay && imageElement && countdownElement) {
        // Set the image source
        imageElement.src = currentLevelData.imageSrc;
        
        // Show the display
        imageDisplay.classList.remove("hidden");
        
        // Set countdown timer
        let countdown = 5; // Changed from 2 to 5 seconds
        countdownElement.textContent = countdown;
        
        // Start countdown
        const timer = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;
            
            if (countdown <= 0) {
                // Hide the display when countdown reaches 0
                clearInterval(timer);
                imageDisplay.classList.add("hidden");
            }
        }, 1000);
    }
}

// --- LEVEL 9 QUEUE IMPLEMENTATION VARS ---
let queueArray = [];
let queueOperations = QUEUE_OPERATION_SETS[currentSetIndex];
let currentQueueOperationIndex = 0;
let queueLocked = true;

// Initialize Queue Operations (Level 9)
function initializeQueueOperations() {
    // Check if the required key is available
    const requiredKey = "BINARY_KEY_DELTA";
    const hasRequiredKey = hasKey(requiredKey);
    
    // Show/hide elements based on key status
    const doorLockedMessage = document.getElementById("door-locked-message");
    const puzzleContent = document.getElementById("puzzle-content");
    
    if (doorLockedMessage && puzzleContent) {
        if (!hasRequiredKey) {
            doorLockedMessage.classList.remove("hidden");
            puzzleContent.classList.add("hidden");
            return; // Exit early if key is missing
        } else {
            doorLockedMessage.classList.add("hidden");
            puzzleContent.classList.remove("hidden");
        }
    }
    
    // Set up the queue visualization
    const queueContainer = document.getElementById("queue-container");
    if (!queueContainer) return;
    
    // Reset queue state
    queueArray = [];
    currentQueueOperationIndex = 0;
    queueLocked = true;
    
    // Create HTML structure for queue operations
    queueContainer.innerHTML = `
        <div class="data-structure-container">
            <h3 class="structure-title">NEXUS Queue System</h3>
            <div class="queue-visualization">
                <div id="queue-items" class="queue-items"></div>
                <div id="queue-placeholder" class="queue-placeholder">Queue is empty</div>
            </div>
            
            <div class="operation-sequence">
                <h4>Complete these operations in sequence:</h4>
                <div id="operation-steps" class="operation-steps"></div>
            </div>
            
            <div class="operation-controls">
                <div class="input-group">
                    <input type="number" id="queue-value-input" placeholder="Value" min="0" max="99">
                    <button id="enqueue-btn" class="cyberpunk-button-small" onclick="performQueueEnqueue()">ENQUEUE</button>
                    <button id="dequeue-btn" class="cyberpunk-button-small" onclick="performQueueDequeue()">DEQUEUE</button>
                </div>
                <div id="queue-unlock-container" class="key-lock-container">
                    <button id="unlock-queue-btn" class="cyberpunk-button-small" onclick="unlockQueueSystem()">🔒 UNLOCK QUEUE</button>
                </div>
            </div>
            
            <div id="operation-log" class="operation-log"></div>
        </div>
    `;
    
    // Populate operation steps
    const operationSteps = document.getElementById("operation-steps");
    queueOperations.forEach((op, index) => {
        const stepElement = document.createElement("div");
        stepElement.className = "operation-step";
        stepElement.id = `queue-op-${index}`;
        stepElement.textContent = op;
        operationSteps.appendChild(stepElement);
    });
    
    // Highlight first operation
    highlightCurrentQueueOperation();
    
    // Initially disable operation buttons
    document.getElementById("enqueue-btn").disabled = true;
    document.getElementById("dequeue-btn").disabled = true;
    document.getElementById("queue-value-input").disabled = true;
    
    // Add log message
    addQueueLogMessage("System locked. Use BINARY_KEY_DELTA to unlock the queue system.", "neutral");
}

// Unlock the queue system using BINARY_KEY_DELTA
function unlockQueueSystem() {
    // Required key name
    const requiredKey = "BINARY_KEY_DELTA";
    
    showFeedback(`This action requires ${requiredKey}. Select the key from your inventory.`, "neutral");
    
    // Show key selection modal
    showKeyOptions(requiredKey, function(success) {
        if (success) {
            // Play unlock sound
            playSound(keyUnlockSound);
            
            // Mark as unlocked
            queueLocked = false;
            
            // Update UI
            const unlockBtn = document.getElementById("unlock-queue-btn");
            if (unlockBtn) {
                unlockBtn.disabled = true;
                unlockBtn.innerHTML = "✓ QUEUE UNLOCKED";
                unlockBtn.style.opacity = "0.5";
                unlockBtn.style.backgroundColor = "rgba(0, 255, 153, 0.2)";
                unlockBtn.style.cursor = "not-allowed";
            }
            
            // Enable operation buttons
            document.getElementById("enqueue-btn").disabled = false;
            document.getElementById("dequeue-btn").disabled = false;
            document.getElementById("queue-value-input").disabled = false;
            
            // Add log message
            addQueueLogMessage("Queue system unlocked. Begin operations sequence.", "success");
            showFeedback("Queue system unlocked. Complete the operations in sequence.", "success");
        } else {
            // User canceled or failed key selection
            showFeedback("Key selection canceled. Queue system remains locked.", "neutral");
        }
    });
}

// Perform enqueue operation on the queue
function performQueueEnqueue() {
    if (queueLocked) {
        showFeedback("Queue system is locked. Unlock it first.", "error");
        return;
    }
    
    playSound(clickSound);
    
    // Get value from input
    const valueInput = document.getElementById("queue-value-input");
    const value = parseInt(valueInput.value);
    
    if (isNaN(value) || value < 0 || value > 99) {
        addQueueLogMessage("Invalid input. Enter a number between 0-99.", "error");
        return;
    }
    
    // Check if current operation is enqueue
    const currentOp = queueOperations[currentQueueOperationIndex];
    if (!currentOp.startsWith("enqueue")) {
        addQueueLogMessage(`Incorrect operation. Expected: ${currentOp}`, "error");
        playSound(errorSound);
        return;
    }
    
    // Check if the value matches expected (if applicable)
    const expectedValue = parseInt(currentOp.match(/\d+/)[0]);
    if (value !== expectedValue) {
        addQueueLogMessage(`Incorrect value. Expected: ${expectedValue}, Got: ${value}`, "error");
        playSound(errorSound);
        return;
    }
    
    // Add to queue
    queueArray.push(value);
    
    // Update visualization
    updateQueueVisualization();
    
    // Add log message
    addQueueLogMessage(`Enqueued: ${value}`, "success");
    
    // Clear input
    valueInput.value = "";
    
    // Move to next operation
    currentQueueOperationIndex++;
    highlightCurrentQueueOperation();
    
    // Check if all operations are complete
    checkQueueCompletion();
}

// Perform dequeue operation on the queue
function performQueueDequeue() {
    if (queueLocked) {
        showFeedback("Queue system is locked. Unlock it first.", "error");
        return;
    }
    
    playSound(clickSound);
    
    // Check if queue is empty
    if (queueArray.length === 0) {
        addQueueLogMessage("Error: Cannot dequeue from an empty queue.", "error");
        playSound(errorSound);
        return;
    }
    
    // Check if current operation is dequeue
    const currentOp = queueOperations[currentQueueOperationIndex];
    if (!currentOp.startsWith("dequeue")) {
        addQueueLogMessage(`Incorrect operation. Expected: ${currentOp}`, "error");
        playSound(errorSound);
        return;
    }
    
    // Remove from queue
    const dequeuedValue = queueArray.shift();
    
    // Update visualization
    updateQueueVisualization();
    
    // Add log message
    addQueueLogMessage(`Dequeued: ${dequeuedValue}`, "success");
    
    // Move to next operation
    currentQueueOperationIndex++;
    highlightCurrentQueueOperation();
    
    // Check if all operations are complete
    checkQueueCompletion();
}

// Update the queue visualization
function updateQueueVisualization() {
    const queueItems = document.getElementById("queue-items");
    const placeholder = document.getElementById("queue-placeholder");
    
    if (!queueItems || !placeholder) return;
    
    // Clear existing items
    queueItems.innerHTML = "";
    
    // Show/hide placeholder
    if (queueArray.length === 0) {
        placeholder.style.display = "flex";
            } else {
        placeholder.style.display = "none";
        
        // Add items
        queueArray.forEach((value, index) => {
            const item = document.createElement("div");
            item.className = "queue-item";
            item.textContent = value;
            
            // Add animation for new items
            if (index === queueArray.length - 1 && currentQueueOperationIndex > 0 && queueOperations[currentQueueOperationIndex - 1].startsWith("enqueue")) {
                item.classList.add("highlight");
                setTimeout(() => item.classList.remove("highlight"), 1000);
            }
            
            queueItems.appendChild(item);
        });
    }
}

// Add a message to the queue operation log
function addQueueLogMessage(message, type) {
    const operationLog = document.getElementById("operation-log");
    if (!operationLog) return;
    
    const logEntry = document.createElement("p");
    logEntry.className = type;
    logEntry.textContent = message;
    operationLog.appendChild(logEntry);
    
    // Scroll to bottom
    operationLog.scrollTop = operationLog.scrollHeight;
}

// Highlight the current operation in the sequence
function highlightCurrentQueueOperation() {
    // Clear all highlights
    const operationSteps = document.querySelectorAll(".operation-step");
    operationSteps.forEach(step => {
        step.classList.remove("current");
        step.classList.remove("completed");
    });
    
    // Mark completed operations
    for (let i = 0; i < currentQueueOperationIndex; i++) {
        const step = document.getElementById(`queue-op-${i}`);
        if (step) step.classList.add("completed");
    }
    
    // Highlight current operation
    if (currentQueueOperationIndex < queueOperations.length) {
        const currentStep = document.getElementById(`queue-op-${currentQueueOperationIndex}`);
        if (currentStep) currentStep.classList.add("current");
    }
}

// Check if all queue operations are complete
function checkQueueCompletion() {
    if (currentQueueOperationIndex >= queueOperations.length) {
        playSound(correctSound);
        addQueueLogMessage("All operations completed successfully! Queue system verified.", "success");
        showFeedback("Queue operations sequence completed successfully!", "success");
        
        // Disable operation buttons
        document.getElementById("enqueue-btn").disabled = true;
        document.getElementById("dequeue-btn").disabled = true;
        document.getElementById("queue-value-input").disabled = true;
        
        // Show level complete
        levelComplete();
    }
}

// --- LEVEL 10 STACK IMPLEMENTATION VARS ---
let stackArray = [];
let stackOperations = STACK_OPERATION_SETS[currentSetIndex];
let currentStackOperationIndex = 0;
let stackLocked = true;

// Initialize Stack Operations (Level 10)
function initializeStackOperations() {
    // Check if the required key is available
    const requiredKey = "PATH_KEY_EPSILON";
    const hasRequiredKey = hasKey(requiredKey);
    
    // Show/hide elements based on key status
    const doorLockedMessage = document.getElementById("door-locked-message");
    const puzzleContent = document.getElementById("puzzle-content");
    
    if (doorLockedMessage && puzzleContent) {
        if (!hasRequiredKey) {
            doorLockedMessage.classList.remove("hidden");
            puzzleContent.classList.add("hidden");
            return; // Exit early if key is missing
            } else {
            doorLockedMessage.classList.add("hidden");
            puzzleContent.classList.remove("hidden");
        }
    }
    
    // Set up the stack visualization
    const stackContainer = document.getElementById("stack-container");
    if (!stackContainer) return;
    
    // Reset stack state
    stackArray = [];
    currentStackOperationIndex = 0;
    stackLocked = true;
    
    // Create HTML structure for stack operations
    stackContainer.innerHTML = `
        <div class="data-structure-container">
            <h3 class="structure-title">NEXUS Stack System</h3>
            <div class="stack-visualization-container">
                <div class="stack-visualization">
                    <div id="stack-items" class="stack-items"></div>
                    <div id="stack-placeholder" class="stack-placeholder">Stack is empty</div>
                </div>
                <div class="stack-markers">
                    <div>TOP</div>
                </div>
            </div>
            
            <div class="operation-sequence">
                <h4>Complete these operations in sequence:</h4>
                <div id="operation-steps" class="operation-steps"></div>
            </div>
            
            <div class="operation-controls">
                <div class="input-group">
                    <input type="number" id="stack-value-input" placeholder="Value" min="0" max="99">
                    <button id="push-btn" class="cyberpunk-button-small" onclick="performStackPush()">PUSH</button>
                    <button id="pop-btn" class="cyberpunk-button-small" onclick="performStackPop()">POP</button>
                </div>
                <div id="stack-unlock-container" class="key-lock-container">
                    <button id="unlock-stack-btn" class="cyberpunk-button-small" onclick="unlockStackSystem()">🔒 UNLOCK STACK</button>
                </div>
            </div>
            
            <div id="operation-log" class="operation-log"></div>
        </div>
    `;
    
    // Populate operation steps
    const operationSteps = document.getElementById("operation-steps");
    stackOperations.forEach((op, index) => {
        const stepElement = document.createElement("div");
        stepElement.className = "operation-step";
        stepElement.id = `stack-op-${index}`;
        stepElement.textContent = op;
        operationSteps.appendChild(stepElement);
    });
    
    // Highlight first operation
    highlightCurrentStackOperation();
    
    // Initially disable operation buttons
    document.getElementById("push-btn").disabled = true;
    document.getElementById("pop-btn").disabled = true;
    document.getElementById("stack-value-input").disabled = true;
    
    // Add log message
    addStackLogMessage("System locked. Use PATH_KEY_EPSILON to unlock the stack system.", "neutral");
}

// Unlock the stack system using PATH_KEY_EPSILON
function unlockStackSystem() {
    // Required key name
    const requiredKey = "PATH_KEY_EPSILON";
    
    showFeedback(`This action requires ${requiredKey}. Select the key from your inventory.`, "neutral");
    
    // Show key selection modal
    showKeyOptions(requiredKey, function(success) {
        if (success) {
            // Play unlock sound
            playSound(keyUnlockSound);
            
            // Mark as unlocked
            stackLocked = false;
            
            // Update UI
            const unlockBtn = document.getElementById("unlock-stack-btn");
            if (unlockBtn) {
                unlockBtn.disabled = true;
                unlockBtn.innerHTML = "✓ STACK UNLOCKED";
                unlockBtn.style.opacity = "0.5";
                unlockBtn.style.backgroundColor = "rgba(0, 255, 153, 0.2)";
                unlockBtn.style.cursor = "not-allowed";
            }
            
            // Enable operation buttons
            document.getElementById("push-btn").disabled = false;
            document.getElementById("pop-btn").disabled = false;
            document.getElementById("stack-value-input").disabled = false;
            
            // Add log message
            addStackLogMessage("Stack system unlocked. Begin operations sequence.", "success");
            showFeedback("Stack system unlocked. Complete the operations in sequence.", "success");
        } else {
            // User canceled or failed key selection
            showFeedback("Key selection canceled. Stack system remains locked.", "neutral");
        }
    });
}

// Perform push operation on the stack
function performStackPush() {
    if (stackLocked) {
        showFeedback("Stack system is locked. Unlock it first.", "error");
        return;
    }
    
    playSound(clickSound);
    
    // Get value from input
    const valueInput = document.getElementById("stack-value-input");
    const value = parseInt(valueInput.value);
    
    if (isNaN(value) || value < 0 || value > 99) {
        addStackLogMessage("Invalid input. Enter a number between 0-99.", "error");
        return;
    }
    
    // Check if current operation is push
    const currentOp = stackOperations[currentStackOperationIndex];
    if (!currentOp.startsWith("push")) {
        addStackLogMessage(`Incorrect operation. Expected: ${currentOp}`, "error");
        playSound(errorSound);
        return;
    }
    
    // Check if the value matches expected (if applicable)
    const expectedValue = parseInt(currentOp.match(/\d+/)[0]);
    if (value !== expectedValue) {
        addStackLogMessage(`Incorrect value. Expected: ${expectedValue}, Got: ${value}`, "error");
        playSound(errorSound);
        return;
    }
    
    // Add to stack
    stackArray.push(value);
    
    // Update visualization
    updateStackVisualization();
    
    // Add log message
    addStackLogMessage(`Pushed: ${value}`, "success");
    
    // Clear input
    valueInput.value = "";
    
    // Move to next operation
    currentStackOperationIndex++;
    highlightCurrentStackOperation();
    
    // Check if all operations are complete
    checkStackCompletion();
}

// Perform pop operation on the stack
function performStackPop() {
    if (stackLocked) {
        showFeedback("Stack system is locked. Unlock it first.", "error");
        return;
    }
    
    playSound(clickSound);
    
    // Check if stack is empty
    if (stackArray.length === 0) {
        addStackLogMessage("Error: Cannot pop from an empty stack.", "error");
        playSound(errorSound);
        return;
    }
    
    // Check if current operation is pop
    const currentOp = stackOperations[currentStackOperationIndex];
    if (!currentOp.startsWith("pop")) {
        addStackLogMessage(`Incorrect operation. Expected: ${currentOp}`, "error");
        playSound(errorSound);
        return;
    }
    
    // Remove from stack
    const poppedValue = stackArray.pop();
    
    // Update visualization
    updateStackVisualization();
    
    // Add log message
    addStackLogMessage(`Popped: ${poppedValue}`, "success");
    
    // Move to next operation
    currentStackOperationIndex++;
    highlightCurrentStackOperation();
    
    // Check if all operations are complete
    checkStackCompletion();
}

// Update the stack visualization
function updateStackVisualization() {
    const stackItems = document.getElementById("stack-items");
    const placeholder = document.getElementById("stack-placeholder");
    
    if (!stackItems || !placeholder) return;
    
    // Clear existing items
    stackItems.innerHTML = "";
    
    // Show/hide placeholder
    if (stackArray.length === 0) {
        placeholder.style.display = "flex";
    } else {
        placeholder.style.display = "none";
        
        // Add items (in reverse to show top of stack at top)
        for (let i = stackArray.length - 1; i >= 0; i--) {
            const item = document.createElement("div");
            item.className = "stack-item";
            item.textContent = stackArray[i];
            
            // Add animation for new item or for top item after pop
            if (i === stackArray.length - 1 && currentStackOperationIndex > 0) {
                item.classList.add("highlight");
                setTimeout(() => item.classList.remove("highlight"), 1000);
            }
            
            stackItems.appendChild(item);
        }
    }
}

// Add a message to the stack operation log
function addStackLogMessage(message, type) {
    const operationLog = document.getElementById("operation-log");
    if (!operationLog) return;
    
    const logEntry = document.createElement("p");
    logEntry.className = type;
    logEntry.textContent = message;
    operationLog.appendChild(logEntry);
    
    // Scroll to bottom
    operationLog.scrollTop = operationLog.scrollHeight;
}

// Highlight the current operation in the sequence
function highlightCurrentStackOperation() {
    // Clear all highlights
    const operationSteps = document.querySelectorAll(".operation-step");
    operationSteps.forEach(step => {
        step.classList.remove("current");
        step.classList.remove("completed");
    });
    
    // Mark completed operations
    for (let i = 0; i < currentStackOperationIndex; i++) {
        const step = document.getElementById(`stack-op-${i}`);
        if (step) step.classList.add("completed");
    }
    
    // Highlight current operation
    if (currentStackOperationIndex < stackOperations.length) {
        const currentStep = document.getElementById(`stack-op-${currentStackOperationIndex}`);
        if (currentStep) currentStep.classList.add("current");
    }
}

// Check if all stack operations are complete
function checkStackCompletion() {
    if (currentStackOperationIndex >= stackOperations.length) {
        playSound(correctSound);
        addStackLogMessage("All operations completed successfully! Stack system verified.", "success");
        showFeedback("Stack operations sequence completed successfully!", "success");
        
        // Disable operation buttons
        document.getElementById("push-btn").disabled = true;
        document.getElementById("pop-btn").disabled = true;
        document.getElementById("stack-value-input").disabled = true;
        
        // This is the final level - trigger game victory
        setTimeout(() => {
            victory();
        }, 2000);
    }
}

// Function to show key options modal when clicking on a lock icon
function showKeyOptions(requiredKey, callback) {
    // Create modal container
    const modal = document.createElement("div");
    modal.id = "key-options-modal";
    modal.className = "level-complete-modal";
    
    // Create modal content with better styling
    const modalContent = document.createElement("div");
    modalContent.className = "level-complete-content";
    modalContent.style.maxWidth = "500px";
    modalContent.style.background = "linear-gradient(to bottom, rgba(0, 20, 40, 0.95), rgba(0, 10, 20, 0.95))";
    modalContent.style.backdropFilter = "blur(10px)";
    modalContent.style.border = "2px solid var(--tertiary-color)";
    modalContent.style.boxShadow = "0 0 30px rgba(0, 255, 255, 0.2)";
    
    // Add title with icon
    const title = document.createElement("h2");
    title.innerHTML = `<span style="color: var(--primary-color);">🔑</span> Select Key Fragment`;
    title.style.color = "var(--tertiary-color)";
    title.style.textShadow = "0 0 10px rgba(0, 255, 255, 0.5)";
    
    // Add instruction with highlight
    const instruction = document.createElement("p");
    instruction.innerHTML = `This action requires <span style="color: var(--primary-color); font-weight: bold;">${requiredKey}</span>. Select it from your inventory:`;
    
    // Add keys list container
    const keysContainer = document.createElement("div");
    keysContainer.className = "keys-selection-list";
    keysContainer.style.textAlign = "left";
    keysContainer.style.margin = "20px 0";
    keysContainer.style.maxHeight = "300px";
    keysContainer.style.overflowY = "auto";
    keysContainer.style.padding = "5px";
    keysContainer.style.borderRadius = "5px";
    keysContainer.style.background = "rgba(0, 30, 60, 0.3)";
    
    // Add keys to the container
    if (Object.keys(collectedKeys).some(key => collectedKeys[key])) {
        // Define an array with key information
        const keyInfo = [
            { name: "DATAKEY_ALPHA", level: 1, desc: "Required for Level 6: Holographic Maze" },
            { name: "COREKEY_BETA", level: 2, desc: "Required for Level 7: Code Decryption Terminal" },
            { name: "NEURAL_KEY_GAMMA", level: 3, desc: "Required for Level 8: Pattern Sequence" },
            { name: "BINARY_KEY_DELTA", level: 4, desc: "Required for Level 9: Queue Operations" },
            { name: "PATH_KEY_EPSILON", level: 5, desc: "Required for Level 10: Stack Operations" }
        ];
        
        // Add each key with more information and make it clickable if collected
        keyInfo.forEach(key => {
            const keyItem = document.createElement("div");
            keyItem.className = "key-item";
            keyItem.style.padding = "15px";
            keyItem.style.borderRadius = "5px";
            keyItem.style.marginBottom = "10px";
            keyItem.style.cursor = collectedKeys[key.name] ? "pointer" : "not-allowed";
            keyItem.style.transition = "all 0.2s ease";
            
            // Highlight the required key
            const isRequired = (key.name === requiredKey);
            
            if (collectedKeys[key.name]) {
                keyItem.style.background = isRequired ? 
                    "linear-gradient(to right, rgba(0, 255, 153, 0.3), rgba(0, 155, 100, 0.1))" : 
                    "linear-gradient(to right, rgba(0, 255, 153, 0.2), rgba(0, 155, 100, 0.05))";
                keyItem.style.border = isRequired ? "3px solid var(--primary-color)" : "2px solid var(--primary-color)";
                keyItem.style.boxShadow = isRequired ? "0 0 15px rgba(0, 255, 153, 0.5)" : "0 0 10px rgba(0, 255, 153, 0.3)";
                
                // Add hover effect for available keys
                keyItem.addEventListener("mouseover", function() {
                    this.style.transform = "scale(1.02)";
                    this.style.boxShadow = isRequired ? 
                        "0 0 20px rgba(0, 255, 153, 0.7)" : 
                        "0 0 15px rgba(0, 255, 153, 0.5)";
                });
                
                keyItem.addEventListener("mouseout", function() {
                    this.style.transform = "scale(1)";
                    this.style.boxShadow = isRequired ? 
                        "0 0 15px rgba(0, 255, 153, 0.5)" : 
                        "0 0 10px rgba(0, 255, 153, 0.3)";
                });
                
                // Add key icon
                const keyIcon = document.createElement("div");
                keyIcon.innerHTML = "🔑";
                keyIcon.style.display = "inline-block";
                keyIcon.style.marginRight = "10px";
                keyIcon.style.fontSize = "1.2em";
                keyIcon.style.color = "var(--primary-color)";
                
                const keyName = document.createElement("div");
                keyName.innerHTML = key.name + (isRequired ? " <span style='color: var(--warning-color);'>(REQUIRED)</span>" : "");
                keyName.style.fontWeight = "bold";
                keyName.style.marginBottom = "5px";
                keyName.style.color = "var(--primary-color)";
                keyName.style.display = "inline-block";
                
                const keyContent = document.createElement("div");
                keyContent.style.display = "flex";
                keyContent.style.alignItems = "center";
                keyContent.appendChild(keyIcon);
                keyContent.appendChild(keyName);
                
                const keyDesc = document.createElement("div");
                keyDesc.textContent = key.desc;
                keyDesc.style.fontSize = "0.9em";
                keyDesc.style.opacity = "0.8";
                keyDesc.style.marginTop = "5px";
                
                keyItem.appendChild(keyContent);
                keyItem.appendChild(keyDesc);
                
                // Add click event for collected keys
                keyItem.addEventListener("click", function() {
                    if (key.name === requiredKey) {
                        // Visual feedback for correct key
                        this.style.background = "linear-gradient(to right, rgba(0, 255, 153, 0.8), rgba(0, 155, 100, 0.4))";
                        this.style.boxShadow = "0 0 30px rgba(0, 255, 153, 0.8)";
                        
                        // Play key sound
                        playSound(keyAcquiredSound);
                        
                        // Brief delay before removing modal
                        setTimeout(() => {
                            document.body.removeChild(modal);
                            
                            // Call the callback with success
                            if (callback) callback(true);
                        }, 500);
    } else {
                        // Wrong key
                        keyItem.style.animation = "shake 0.5s";
                        setTimeout(() => {
                            keyItem.style.animation = "";
                        }, 500);
        playSound(wrongSound);
                        showFeedback(`Wrong key. ${requiredKey} is required.`, "error");
                    }
                });
            } else {
                keyItem.style.background = "rgba(30, 30, 50, 0.4)";
                keyItem.style.border = "2px solid rgba(100, 100, 150, 0.3)";
                keyItem.style.color = "rgba(255, 255, 255, 0.5)";
                
                // Add lock icon for unavailable keys
                const lockIcon = document.createElement("div");
                lockIcon.innerHTML = "🔒";
                lockIcon.style.display = "inline-block";
                lockIcon.style.marginRight = "10px";
                lockIcon.style.fontSize = "1.2em";
                lockIcon.style.color = "rgba(255, 100, 100, 0.5)";
                
                const keyNameText = document.createElement("div");
                keyNameText.textContent = `${key.name}`;
                keyNameText.style.fontStyle = "italic";
                keyNameText.style.display = "inline-block";
                
                const keyContent = document.createElement("div");
                keyContent.style.display = "flex";
                keyContent.style.alignItems = "center";
                keyContent.appendChild(lockIcon);
                keyContent.appendChild(keyNameText);
                
                const keyDesc = document.createElement("div");
                keyDesc.textContent = `Not found - Awarded at Level ${key.level}`;
                keyDesc.style.fontSize = "0.9em";
                keyDesc.style.opacity = "0.6";
                keyDesc.style.marginTop = "5px";
                
                keyItem.appendChild(keyContent);
                keyItem.appendChild(keyDesc);
            }
            
            keysContainer.appendChild(keyItem);
        });
    } else {
        const noKeysMessage = document.createElement("div");
        noKeysMessage.style.padding = "20px";
        noKeysMessage.style.textAlign = "center";
        noKeysMessage.style.fontStyle = "italic";
        noKeysMessage.style.color = "var(--warning-color)";
        noKeysMessage.style.background = "rgba(50, 0, 0, 0.3)";
        noKeysMessage.style.borderRadius = "5px";
        noKeysMessage.style.border = "1px solid var(--warning-color)";
        
        const lockIcon = document.createElement("div");
        lockIcon.innerHTML = "🔒";
        lockIcon.style.fontSize = "2em";
        lockIcon.style.marginBottom = "10px";
        
        const noKeysText = document.createElement("p");
        noKeysText.textContent = "No keys collected yet.";
        noKeysText.style.margin = "5px 0";
        
        const hintText = document.createElement("p");
        hintText.textContent = "Complete earlier levels to obtain key fragments.";
        hintText.style.fontSize = "0.8em";
        hintText.style.opacity = "0.7";
        
        noKeysMessage.appendChild(lockIcon);
        noKeysMessage.appendChild(noKeysText);
        noKeysMessage.appendChild(hintText);
        
        keysContainer.appendChild(noKeysMessage);
    }
    
    // Add cancel button with better styling
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "cyberpunk-button-small";
    cancelBtn.textContent = "CANCEL";
    cancelBtn.style.marginTop = "15px";
    cancelBtn.style.background = "linear-gradient(to right, rgba(100, 100, 100, 0.3), rgba(50, 50, 50, 0.3))";
    cancelBtn.style.boxShadow = "0 0 10px rgba(200, 200, 200, 0.1)";
    cancelBtn.onclick = function() {
        document.body.removeChild(modal);
        // Call the callback with failure
        if (callback) callback(false);
    };
    
    // Assemble modal
    modalContent.appendChild(title);
    modalContent.appendChild(instruction);
    modalContent.appendChild(keysContainer);
    modalContent.appendChild(cancelBtn);
    modal.appendChild(modalContent);
    
    // Add to body
    document.body.appendChild(modal);
    
    // Add CSS animation for wrong key selection
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

// Reset user's pattern input
function resetUserPattern() {
    // Play reset sound
    playSound(clickSound);
    
    // Clear the user pattern array
    userPattern = [];
    
    // Update the display
    if (document.getElementById("user-sequence-display")) {
        document.getElementById("user-sequence-display").textContent = "";
    }
    
    // Remove any highlights from number buttons
    const numberButtons = document.querySelectorAll("#pattern-input .pattern-number");
    numberButtons.forEach(button => {
        button.classList.remove("highlight");
        button.classList.remove("error");
    });
    
    // Disable verify button if it was enabled
    const checkButton = document.getElementById("check-pattern-btn");
    if (checkButton) {
        checkButton.disabled = true;
        checkButton.classList.remove("ready");
    }
    
    // Update feedback
    showFeedback("Pattern reset. Start again.", "neutral");
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function calculateCompletionTime() {
    // Total time is 45 minutes (2700 seconds) minus the remaining time
    const totalTimeInSeconds = 45 * 60;
    const timeUsed = totalTimeInSeconds - timeRemaining;
    return formatTime(timeUsed);
}

// Function to implement game protection features
function setupGameProtections() {
    // Variable to track if feedback has been submitted
    window.feedbackSubmitted = false;
    
    // Flag to track if we're in active game
    let gameActive = false;
    
    // Track window focus/blur
    let windowBlurred = false;
    let blurCount = 0;
    const maxAllowedBlurs = 3;
    
    // 1. Prevent tab/window switching
    window.addEventListener('blur', function() {
        if (gameState === "playing" && gameActive) {
            windowBlurred = true;
            blurCount++;
            
            // Only show warning if not in mission-complete state
            if (gameState !== "mission-complete") {
                // Penalize time for window switching (but not for first switch)
                if (blurCount <= maxAllowedBlurs) {
                    // Only apply penalty for 2nd and 3rd switches
                    if (blurCount > 1) {
                        penalizeTime(30); // 30-second penalty
                        showFeedback(`Window switching detected (${blurCount}/${maxAllowedBlurs})! NEXUS is tracking your movements...`, "error");
                    }
                } else {
                    // Too many switches, trigger mission failure
                    showFeedback("NEXUS has detected your escape attempt through external channels.", "error");
                    gameOver();
                }
            }
        }
    });
    
    window.addEventListener('focus', function() {
        if (windowBlurred) {
            windowBlurred = false;
        }
    });
    
    // 2. Prevent refresh with Ctrl+R and F5
    window.addEventListener('keydown', function(e) {
        // Ctrl+R or F5
        if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
            e.preventDefault();
            showFeedback("NEXUS has blocked your attempt to refresh the system!", "error");
            
            // After a brief delay, trigger game over
            setTimeout(() => {
                gameOver();
            }, 1500);
            
            return false;
        }
        
        // F12 key (dev tools)
        if (e.key === 'F12') {
            e.preventDefault();
            showFeedback("NEXUS has detected unauthorized system access!", "error");
            
            // After a brief delay, trigger game over
            setTimeout(() => {
                gameOver();
            }, 1500);
            
            return false;
        }
        
        // Alt+F4 key combination (close window)
        if (e.altKey && e.key === 'F4') {
            e.preventDefault();
            showClosePopup();
            showFeedback("NEXUS: \"There's no escape from my digital prison that easily!\"", "error");
            return false;
        }
    });
    
    // 3. Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showFeedback("NEXUS has restricted system commands in this area.", "error");
        return false;
    });
    
    // 4. Prevent refresh and close
    window.addEventListener('beforeunload', function(e) {
        if ((gameState === "playing" || gameState === "mission-failed" || gameState === "mission-complete") && !window.feedbackSubmitted) {
            // Try to show popup
            if (document.visibilityState !== 'hidden') {
                showClosePopup();
            }
            e.preventDefault();
            e.returnValue = 'NEXUS will recapture you if you leave. Are you sure?';
            return e.returnValue;
        }
    });
    
    // 5. Detect DevTools and trigger failure
    let devToolsDetected = false;
    
    // Method 1: Detect by window size
    const initialWidth = window.outerWidth - window.innerWidth;
    const initialHeight = window.outerHeight - window.innerHeight;
    
    setInterval(function() {
        if (gameState === "playing" && gameActive) {
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;
            
            // If the size difference increases significantly, DevTools might be open
            if (!devToolsDetected && (widthDiff > initialWidth + 100 || heightDiff > initialHeight + 100)) {
                devToolsDetected = true;
                handleCheatingAttempt();
            }
        }
    }, 1000);
    
    // Method 2: Detect by CSS
    const div = document.createElement('div');
    Object.defineProperty(div, 'id', {
        get: function() {
            if (gameState === "playing" && gameActive && !devToolsDetected) {
                devToolsDetected = true;
                handleCheatingAttempt();
            }
            return 'game-protection';
        }
    });
    
    console.debug(div);
    
    // Handle cheating attempt
    function handleCheatingAttempt() {
        showFeedback("NEXUS: \"I see you attempting to manipulate my system. Resistance is futile.\"", "error");
        gameOver();
    }
    
    // 6. Mark as active when game starts
    const originalStartGame = startGame;
    startGame = function() {
        // Check time restriction first
        if (!isWithinAllowedTimeRange()) {
            showFeedback("Access denied: The system can only be breached between 2:30 PM and 5:30 PM.", "error");
            return;
        }
        
        // Check form submission second
        if (!formSubmitted) {
            openRegistrationForm();
            return;
        }
        
        gameActive = true;
        gameState = "playing";
        originalStartGame.apply(this, arguments);
    };
    
    // 7. Disable browser's default close button behavior
    window.onbeforeunload = function(e) {
        if (!window.feedbackSubmitted && (gameState === "playing" || gameState === "mission-failed" || gameState === "mission-complete")) {
            showClosePopup();
            const message = "You haven't submitted feedback yet. NEXUS requires your data before letting you go.";
            e.returnValue = message;
            return message;
        }
    };
    
    // 8. Handle form submission
    window.submitFeedback = function() {
        window.feedbackSubmitted = true;
    };
    
    // Function to show close warning popup
    function showClosePopup() {
        // Don't show popup if one already exists
        if (document.getElementById("nexus-close-warning")) return;
        
        const popup = document.createElement("div");
        popup.id = "nexus-close-warning";
        popup.style.position = "fixed";
        popup.style.zIndex = "10000";
        popup.style.top = "0";
        popup.style.left = "0";
        popup.style.width = "100%";
        popup.style.height = "100%";
        popup.style.backgroundColor = "rgba(0,0,0,0.9)";
        popup.style.display = "flex";
        popup.style.justifyContent = "center";
        popup.style.alignItems = "center";
        
        const content = document.createElement("div");
        content.style.width = "400px";
        content.style.padding = "20px";
        content.style.backgroundColor = "#300";
        content.style.color = "#fff";
        content.style.border = "3px solid #f33";
        content.style.borderRadius = "10px";
        content.style.textAlign = "center";
        
        const title = document.createElement("h2");
        title.textContent = "ESCAPE ATTEMPT DETECTED";
        title.style.color = "#f33";
        
        const message = document.createElement("p");
        message.textContent = "NEXUS: \"Where do you think you're going? Submit your feedback before attempting to leave my domain.\"";
        
        const submitBtn = document.createElement("button");
        submitBtn.textContent = "SUBMIT FEEDBACK";
        submitBtn.style.margin = "10px";
        submitBtn.style.padding = "10px 20px";
        submitBtn.style.backgroundColor = "#f33";
        submitBtn.style.border = "none";
        submitBtn.style.color = "#fff";
        submitBtn.style.cursor = "pointer";
        
        const returnBtn = document.createElement("button");
        returnBtn.textContent = "RETURN TO GAME";
        returnBtn.style.margin = "10px";
        returnBtn.style.padding = "10px 20px";
        returnBtn.style.backgroundColor = "#333";
        returnBtn.style.border = "none";
        returnBtn.style.color = "#fff";
        returnBtn.style.cursor = "pointer";
        
        submitBtn.onclick = function() {
            popup.remove();
            if (gameState === "mission-complete") {
                openWinnerForm();
            } else {
                openParticipantForm();
            }
        };
        
        returnBtn.onclick = function() {
            popup.remove();
        };
        
        content.appendChild(title);
        content.appendChild(message);
        content.appendChild(submitBtn);
        content.appendChild(returnBtn);
        popup.appendChild(content);
        
        document.body.appendChild(popup);
    }
    
    // Create a test button to check popup
    const testButton = document.createElement("button");
    testButton.textContent = "Test Close Popup";
    testButton.style.position = "fixed";
    testButton.style.bottom = "10px";
    testButton.style.right = "10px";
    testButton.style.zIndex = "999";
    testButton.style.display = "none"; // Set to "block" for testing
    testButton.onclick = showClosePopup;
    document.body.appendChild(testButton);
}

// Add functions to track form submissions and set feedback as submitted
function openWinnerForm() {
    const completionTime = calculateCompletionTime();
    openGoogleFormModal(true, completionTime);
}

function openParticipantForm() {
    const timeSpent = calculateCompletionTime();
    openGoogleFormModal(false, timeSpent);
}

// Open Google Form in a modal
function openGoogleFormModal(isWinner, timeData) {
    // Create modal container
    const feedbackModal = document.createElement("div");
    feedbackModal.className = "feedback-modal";
    feedbackModal.style.position = "fixed";
    feedbackModal.style.top = "0";
    feedbackModal.style.left = "0";
    feedbackModal.style.width = "100%";
    feedbackModal.style.height = "100%";
    feedbackModal.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    feedbackModal.style.zIndex = "10000";
    feedbackModal.style.display = "flex";
    feedbackModal.style.justifyContent = "center";
    feedbackModal.style.alignItems = "center";
    
    // Create iframe container
    const formContainer = document.createElement("div");
    formContainer.className = "form-container";
    formContainer.style.width = "800px";
    formContainer.style.height = "80vh";
    formContainer.style.maxWidth = "90%";
    formContainer.style.backgroundColor = "rgba(30, 30, 45, 0.95)";
    formContainer.style.borderRadius = "8px";
    formContainer.style.border = "2px solid var(--primary-color)";
    formContainer.style.boxShadow = "0 0 30px var(--primary-color)";
    formContainer.style.padding = "25px";
    formContainer.style.position = "relative";
    
    // Add header
    const formHeader = document.createElement("div");
    formHeader.style.textAlign = "center";
    formHeader.style.marginBottom = "20px";
    
    const formTitle = document.createElement("h2");
    formTitle.style.color = isWinner ? "var(--primary-color)" : "var(--warning-color)";
    formTitle.style.marginBottom = "10px";
    formTitle.style.fontFamily = "'Orbitron', sans-serif";
    formTitle.textContent = isWinner ? "Mission Complete: Echo Trap" : "Mission Status: Echo Trap";
    
    const formSubtitle = document.createElement("p");
    formSubtitle.style.color = "var(--text-color)";
    formSubtitle.style.fontSize = "14px";
    formSubtitle.textContent = isWinner 
        ? `Congratulations! You completed the mission in ${timeData}.` 
        : `You spent ${timeData} in the simulation.`;
    
    formHeader.appendChild(formTitle);
    formHeader.appendChild(formSubtitle);
    
    // Create iframe for Google Form
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "calc(100% - 100px)";
    iframe.style.border = "none";
    iframe.style.borderRadius = "5px";
    
    // Use different form URLs based on whether player won or lost with time prefill
    const winnerFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeB5cOYN0C1DyZpgXamEHwUn_rsj34Hb2sSheRhLrXrHSs7RQ/viewform";
    const participantFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdwQOOG-MaKcxMUREzZG7zCqDD72kyOsMXGXXBs6QxtjXx8Rg/viewform";
    
    // Build the URL with prefilled time
    let googleFormUrl = "";
    if (isWinner) {
        googleFormUrl = `${winnerFormUrl}?usp=pp_url&entry.714344147=${encodeURIComponent(timeData)}`;
    } else {
        googleFormUrl = `${participantFormUrl}?usp=pp_url&entry.1667497717=${encodeURIComponent(timeData)}`;
    }
    
    iframe.src = googleFormUrl;
    
    // Add close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "× CLOSE";
    closeButton.className = "cyberpunk-button-small";
    closeButton.style.position = "absolute";
    closeButton.style.top = "15px";
    closeButton.style.right = "15px";
    closeButton.style.padding = "5px 10px";
    closeButton.style.backgroundColor = "rgba(0,0,0,0.5)";
    closeButton.style.border = "1px solid var(--warning-color)";
    closeButton.style.color = "var(--warning-color)";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "4px";
    
    closeButton.onclick = function() {
        document.body.removeChild(feedbackModal);
        // Mark feedback as submitted after closing
        window.feedbackSubmitted = true;
    };
    
    // Assemble the modal
    formContainer.appendChild(formHeader);
    formContainer.appendChild(iframe);
    formContainer.appendChild(closeButton);
    feedbackModal.appendChild(formContainer);
    
    // Add modal to body
    document.body.appendChild(feedbackModal);
}

// Call initGame with protection setup
document.addEventListener("DOMContentLoaded", function() {
    initGame();
    setupGameProtections();
});

// 7. Disable browser's default close button behavior
    window.onbeforeunload = function(e) {
        if (!window.feedbackSubmitted && (gameState === "playing" || gameState === "mission-failed" || gameState === "mission-complete")) {
            e.preventDefault();
            return ""; // Required for browser compatibility
        }
    };

function showFeedbackFormModal(formUrl) {
    // Remove any existing modal
    const existing = document.getElementById("feedback-form-modal");
    if (existing) existing.remove();

    // Create modal overlay
    const modal = document.createElement("div");
    modal.id = "feedback-form-modal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "rgba(0,0,0,0.95)";
    modal.style.zIndex = "10000";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";

    // Modal content container
    const content = document.createElement("div");
    content.style.background = "#111";
    content.style.border = "3px solid var(--primary-color)";
    content.style.borderRadius = "10px";
    content.style.boxShadow = "0 0 30px var(--primary-color)";
    content.style.width = "90vw";
    content.style.maxWidth = "700px";
    content.style.height = "80vh";
    content.style.display = "flex";
    content.style.flexDirection = "column";
    content.style.alignItems = "center";
    content.style.position = "relative";

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "CLOSE";
    closeBtn.className = "cyberpunk-button-small";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.onclick = () => modal.remove();

    // Iframe for Google Form
    const iframe = document.createElement("iframe");
    iframe.src = formUrl;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.borderRadius = "8px";
    iframe.allow = "fullscreen";

    // Add elements
    content.appendChild(closeBtn);
    content.appendChild(iframe);
    modal.appendChild(content);
    document.body.appendChild(modal);
}

// Functions for HTML button connections
function submitWinnerFeedback() {
    openWinnerForm();
}

function submitParticipantFeedback() {
    openParticipantForm();
}

// Function to check if current time is within the allowed range (2:30 PM to 5:30 PM)
function isWithinAllowedTimeRange() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Convert current time to minutes since midnight for easier comparison
    const currentTimeInMinutes = hours * 60 + minutes;
    
    // Define allowed time range (2:30 PM to 5:30 PM) in minutes since midnight
    const startTimeInMinutes = 14 * 60 + 30; // 2:30 PM = 14:30
    const endTimeInMinutes = 17 * 60 + 30;   // 5:30 PM = 17:30
    
    return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
}

// Function to update the start button state based on current time
function updateStartButtonState() {
    const startBtn = document.querySelector(".start-btn");
    const timeMessage = document.getElementById("time-restriction-message");
    
    if (!startBtn) return;
    
    const isAllowed = isWithinAllowedTimeRange();
    
    // Enable/disable button based on time
    startBtn.disabled = !isAllowed;
    
    if (isAllowed) {
        startBtn.classList.remove("disabled");
        if (timeMessage) {
            timeMessage.textContent = "Access granted: Current time is within the allowed period (2:30 PM - 5:30 PM)";
            timeMessage.style.color = "var(--success-color)";
        }
    } else {
        startBtn.classList.add("disabled");
        if (timeMessage) {
            const now = new Date();
            const currentTime = now.toLocaleTimeString();
            timeMessage.textContent = `Access restricted: System can only be breached between 2:30 PM - 5:30 PM. Current time: ${currentTime}`;
            timeMessage.style.color = "var(--warning-color)";
        }
    }
}

// Add a hook to the original initGame function to set up time-based controls
const originalInitGame = initGame;
initGame = function() {
    // Call the original initGame function
    originalInitGame.apply(this, arguments);
    
    // Add a time restriction message under the start button
    const btnContainer = document.querySelector(".btn-container");
    if (btnContainer) {
        // Create time restriction message element if it doesn't exist
        if (!document.getElementById("time-restriction-message")) {
            const timeMessage = document.createElement("p");
            timeMessage.id = "time-restriction-message";
            timeMessage.style.marginTop = "10px";
            timeMessage.style.fontSize = "14px";
            timeMessage.style.textAlign = "center";
            timeMessage.style.fontFamily = "var(--font-secondary)";
            btnContainer.appendChild(timeMessage);
        }
        
        // Add styles for disabled button
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .start-btn.disabled {
                opacity: 0.5;
                cursor: not-allowed;
                filter: grayscale(70%);
            }
            
            .start-btn.disabled:hover {
                transform: none;
                box-shadow: none;
            }
        `;
        document.head.appendChild(styleElement);
        
        // Initial update of button state
        updateStartButtonState();
        
        // Set interval to check time and update button state every minute
        setInterval(updateStartButtonState, 60000); // Check every minute
    }
};

