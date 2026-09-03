// ==========================================
// SNAKE GAME - IMPROVED VERSION
// ==========================================

// Game Configuration
const CANVAS = document.getElementById('gameCanvas');
const CTX = CANVAS.getContext('2d');

// ========== CANVAS SETUP ==========
function setupCanvas() {
    const gameBoard = CANVAS.parentElement;
    const maxWidth = Math.min(500, gameBoard.clientWidth);
    const maxHeight = Math.min(500, window.innerHeight * 0.6);
    
    const size = Math.min(maxWidth, maxHeight);
    CANVAS.width = size;
    CANVAS.height = size;
    
    return size;
}

let CANVAS_SIZE = setupCanvas();

// ✅ PERBAIKAN #4: Tile count yang fixed
const TARGET_TILE_COUNT = 20;
let TILE_COUNT = TARGET_TILE_COUNT;
let GRID_SIZE = Math.floor(CANVAS_SIZE / TILE_COUNT);

// ========== GAME STATE ==========
let gameState = {
    isRunning: false,
    isPaused: false,
    score: 0,
    elapsed: 0,
    timerInterval: null
};

// Snake Body - array of {x, y}
let snake = [];

// Food Position
let food = {
    x: Math.floor(Math.random() * TILE_COUNT),
    y: Math.floor(Math.random() * TILE_COUNT)
};

// Direction
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };

// Game Speed (milliseconds)
const GAME_SPEED = 100;
let gameLoopInterval = null;

// ========== DOM ELEMENTS ==========
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreDisplay = document.getElementById('finalScore');
const finalTimeDisplay = document.getElementById('finalTime');
const playAgainBtn = document.getElementById('playAgainBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const mobileControls = document.getElementById('mobileControls');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');

// ========== DEVICE DETECTION ==========
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function updateMobileControls() {
    if (isMobileDevice() || window.innerWidth < 768) {
        mobileControls.classList.remove('hidden');
    } else {
        mobileControls.classList.add('hidden');
    }
}

updateMobileControls();

// ========== TIMER FUNCTIONS ==========
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
    if (gameState.timerInterval) return;
    
    gameState.timerInterval = setInterval(() => {
        if (!gameState.isPaused) {
            gameState.elapsed++;
            timerDisplay.textContent = formatTime(gameState.elapsed);
        }
    }, 1000);
}

function stopTimer() {
    // ✅ PERBAIKAN #5: Always clear
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
}

function resetTimer() {
    stopTimer();
    gameState.elapsed = 0;
    timerDisplay.textContent = '00:00';
}

// ========== DRAWING FUNCTIONS ==========
function drawGrid() {
    CTX.fillStyle = '#1a1a1a';
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);

    CTX.strokeStyle = '#333';
    CTX.lineWidth = 0.5;
    
    for (let i = 0; i <= TILE_COUNT; i++) {
        const pos = i * GRID_SIZE;
        CTX.beginPath();
        CTX.moveTo(pos, 0);
        CTX.lineTo(pos, CANVAS.height);
        CTX.stroke();
        
        CTX.beginPath();
        CTX.moveTo(0, pos);
        CTX.lineTo(CANVAS.width, pos);
        CTX.stroke();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            CTX.fillStyle = '#00ff00';
        } else {
            CTX.fillStyle = '#00cc00';
        }
        
        CTX.fillRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );

        // Eyes on head
        if (index === 0) {
            CTX.fillStyle = 'white';
            const eyeSize = Math.max(1, Math.floor(GRID_SIZE / 10));
            const eyeOffset = Math.floor(GRID_SIZE / 3);
            
            CTX.beginPath();
            CTX.arc(segment.x * GRID_SIZE + eyeOffset, segment.y * GRID_SIZE + eyeOffset, eyeSize, 0, Math.PI * 2);
            CTX.fill();
            CTX.beginPath();
            CTX.arc(segment.x * GRID_SIZE + (GRID_SIZE - eyeOffset), segment.y * GRID_SIZE + eyeOffset, eyeSize, 0, Math.PI * 2);
            CTX.fill();
        }
    });
}

function drawFood() {
    CTX.fillStyle = '#ff0000';
    CTX.beginPath();
    CTX.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        Math.PI * 2
    );
    CTX.fill();

    // Food shine effect
    CTX.strokeStyle = '#ffff00';
    CTX.lineWidth = 2;
    CTX.beginPath();
    CTX.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 4,
        0,
        Math.PI * 2
    );
    CTX.stroke();
}

function draw() {
    drawGrid();
    drawSnake();
    drawFood();
}

// ========== GAME LOGIC FUNCTIONS ==========
function updateSnake() {
    direction = nextDirection;

    const head = snake[0];
    const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };

    // Check collision with walls
    if (newHead.x < 0 || newHead.x >= TILE_COUNT || newHead.y < 0 || newHead.y >= TILE_COUNT) {
        endGame();
        return;
    }

    // Check collision with self
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
        return;
    }

    snake.unshift(newHead);

    // Check if food is eaten
    if (newHead.x === food.x && newHead.y === food.y) {
        gameState.score += 10;
        scoreDisplay.textContent = gameState.score;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    let newFood;
    let foodOnSnake = true;

    while (foodOnSnake) {
        newFood = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };

        foodOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }

    food = newFood;
}

function gameLoop() {
    updateSnake();
    draw();
}

function startGame() {
    resetGame();
    gameState.isRunning = true;
    gameState.isPaused = false;

    startTimer();
    gameLoopInterval = setInterval(gameLoop, GAME_SPEED);

    startBtn.disabled = true;
    if (pauseBtn) pauseBtn.disabled = false;
    if (resumeBtn) resumeBtn.disabled = true;
    resetBtn.disabled = false;
}

function pauseGame() {
    if (!pauseBtn) return;
    
    gameState.isPaused = true;
    clearInterval(gameLoopInterval);
    gameLoopInterval = null;

    pauseBtn.disabled = true;
    if (resumeBtn) resumeBtn.disabled = false;
}

function resumeGame() {
    if (!resumeBtn) return;
    
    gameState.isPaused = false;
    gameLoopInterval = setInterval(gameLoop, GAME_SPEED);

    if (pauseBtn) pauseBtn.disabled = false;
    resumeBtn.disabled = true;
}

// ✅ PERBAIKAN #1: Dynamically centered snake
// ✅ PERBAIKAN #6: Set isRunning = false at reset
function resetGame() {
    // Reset snake ke center
    const centerX = Math.floor(TILE_COUNT / 2);
    const centerY = Math.floor(TILE_COUNT / 2);
    
    snake = [{ x: centerX, y: centerY }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    // Reset score
    gameState.score = 0;
    scoreDisplay.textContent = '0';

    // Reset timer
    resetTimer();

    // Generate new food
    generateFood();

    // Draw initial state
    draw();

    // Reset buttons
    startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
    if (resumeBtn) resumeBtn.disabled = true;
    resetBtn.disabled = false;
    
    // ✅ PERBAIKAN: Set running state
    gameState.isRunning = false;
}

function endGame() {
    gameState.isRunning = false;
    stopTimer();
    clearInterval(gameLoopInterval);
    gameLoopInterval = null;

    // Show game over modal
    finalScoreDisplay.textContent = gameState.score;
    finalTimeDisplay.textContent = formatTime(gameState.elapsed);
    gameOverModal.classList.remove('hidden');

    // Reset buttons
    startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
    if (resumeBtn) resumeBtn.disabled = true;
    resetBtn.disabled = false;
}

// ========== EVENT LISTENERS ==========
startBtn.addEventListener('click', startGame);

if (pauseBtn) {
    pauseBtn.addEventListener('click', pauseGame);
}

if (resumeBtn) {
    resumeBtn.addEventListener('click', resumeGame);
}

resetBtn.addEventListener('click', () => {
    stopTimer();
    resetGame();
    gameOverModal.classList.add('hidden');
});

playAgainBtn.addEventListener('click', () => {
    gameOverModal.classList.add('hidden');
    startGame();
});

closeModalBtn.addEventListener('click', () => {
    gameOverModal.classList.add('hidden');
});

// ========== KEYBOARD CONTROLS (WASD) ==========
// W = Atas, S = Bawah, A = Kiri, D = Kanan
document.addEventListener('keydown', (e) => {
    if (!gameState.isRunning || gameState.isPaused) return;

    const key = e.key.toLowerCase();

    switch (key) {
        case 'w':
            if (direction.y === 0) nextDirection = { x: 0, y: -1 };
            e.preventDefault();
            break;
        case 's':
            if (direction.y === 0) nextDirection = { x: 0, y: 1 };
            e.preventDefault();
            break;
        case 'a':
            if (direction.x === 0) nextDirection = { x: -1, y: 0 };
            e.preventDefault();
            break;
        case 'd':
            if (direction.x === 0) nextDirection = { x: 1, y: 0 };
            e.preventDefault();
            break;
    }
});

// ✅ PERBAIKAN #2: Better touch event handling
if (mobileControls) {
    const mobileButtons = mobileControls.querySelectorAll('.mobile-btn');
    mobileButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (!gameState.isRunning || gameState.isPaused) return;

            const direction_map = {
                'up': { x: 0, y: -1 },
                'down': { x: 0, y: 1 },
                'left': { x: -1, y: 0 },
                'right': { x: 1, y: 0 }
            };

            const dir = button.getAttribute('data-direction');
            const newDir = direction_map[dir];

            if ((newDir.x !== 0 && direction.x === 0) || (newDir.y !== 0 && direction.y === 0)) {
                nextDirection = newDir;
            }
        });

        // Touch support dengan visual feedback
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
        });

        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(1)';
            
            // Trigger direction change manually
            if (!gameState.isRunning || gameState.isPaused) return;

            const direction_map = {
                'up': { x: 0, y: -1 },
                'down': { x: 0, y: 1 },
                'left': { x: -1, y: 0 },
                'right': { x: 1, y: 0 }
            };

            const dir = button.getAttribute('data-direction');
            const newDir = direction_map[dir];

            if ((newDir.x !== 0 && direction.x === 0) || (newDir.y !== 0 && direction.y === 0)) {
                nextDirection = newDir;
            }
        });
    });
}

// Handle window resize for responsive canvas
window.addEventListener('resize', () => {
    if (gameState.isRunning) {
        draw();
    } else {
        const oldCanvasSize = CANVAS_SIZE;
        CANVAS_SIZE = setupCanvas();
        
        // Recalculate grid if canvas size changed significantly
        if (Math.abs(CANVAS_SIZE - oldCanvasSize) > 10) {
            GRID_SIZE = Math.floor(CANVAS_SIZE / TILE_COUNT);
            
            // Reinitialize snake position
            const centerX = Math.floor(TILE_COUNT / 2);
            const centerY = Math.floor(TILE_COUNT / 2);
            snake = [{ x: centerX, y: centerY }];
            generateFood();
        }
        
        draw();
    }

    updateMobileControls();
});

// ✅ PERBAIKAN #3: Dynamic swipe threshold
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = Math.min(50, CANVAS_SIZE / 10);

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
}, false);

document.addEventListener('touchend', (e) => {
    if (!gameState.isRunning || gameState.isPaused) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > SWIPE_THRESHOLD && direction.x === 0) {
            nextDirection = { x: -1, y: 0 }; // Left
        } else if (diffX < -SWIPE_THRESHOLD && direction.x === 0) {
            nextDirection = { x: 1, y: 0 }; // Right
        }
    } else {
        // Vertical swipe
        if (diffY > SWIPE_THRESHOLD && direction.y === 0) {
            nextDirection = { x: 0, y: -1 }; // Up
        } else if (diffY < -SWIPE_THRESHOLD && direction.y === 0) {
            nextDirection = { x: 0, y: 1 }; // Down
        }
    }
}, false);

// Initialize game
resetGame();
