// ==========================================
// SNAKE GAME - UNIVERSAL VERSION
// ✅ Compatible dengan SEMUA devices
// ✅ Support: Desktop, Tablet, Mobile
// ✅ Support: Keyboard (WASD + Arrow Keys) + Touch
// ==========================================

// Game Configuration
const CANVAS = document.getElementById('gameCanvas');
const CTX = CANVAS.getContext('2d');

// ========== RESPONSIVE CANVAS SETUP ==========
function setupCanvas() {
    const gameBoard = CANVAS.parentElement;
    
    // Get available space
    let maxWidth = Math.min(500, window.innerWidth - 40);
    let maxHeight = Math.min(500, window.innerHeight * 0.6);
    
    // Ensure minimum size for playability
    maxWidth = Math.max(200, maxWidth);
    maxHeight = Math.max(200, maxHeight);
    
    // Make square
    const size = Math.min(maxWidth, maxHeight);
    
    CANVAS.width = size;
    CANVAS.height = size;
    
    console.log(`Canvas set to: ${size}x${size}`);
    return size;
}

let CANVAS_SIZE = setupCanvas();

// ✅ FIXED TILE COUNT (20x20 grid)
const TARGET_TILE_COUNT = 20;
let TILE_COUNT = TARGET_TILE_COUNT;
let GRID_SIZE = Math.floor(CANVAS_SIZE / TILE_COUNT);

// ========== GAME STATE ==========
let gameState = {
    isRunning: false,
    isPaused: false,
    score: 0,
    elapsed: 0,
    timerInterval: null,
    lastInputTime: 0,
    inputDelay: 50  // Prevent input spam
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

// Dioptimalkan fungsi pauseGame()
function pauseGame() {
    gameState.isPaused = true;
    clearInterval(gameLoopInterval);
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
}

// Dioptimalkan fungsi resumeGame()
function resumeGame() {
    gameState.isPaused = false;
    gameLoopInterval = setInterval(gameLoop, GAME_SPEED);
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
}

// ========== DEVICE DETECTION ==========
function isMobileDevice() {
    // Check user agent
    const mobilePattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i;
    return mobilePattern.test(navigator.userAgent);
}

function isTablet() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    
    // Tablet jika width 600-1000px
    return (width >= 600 && width <= 1000) || (width > 1000 && isPortrait);
}

function isMobileViewport() {
    return window.innerWidth < 768;
}

function showMobileControls() {
    if (!mobileControls) return;
    
    // Show mobile controls jika:
    // 1. Device adalah mobile
    // 2. Atau viewport kecil (< 768px)
    if (isMobileDevice() || isMobileViewport()) {
        mobileControls.classList.remove('hidden');
        return true;
    } else {
        mobileControls.classList.add('hidden');
        return false;
    }
}

// Update mobile controls on init
showMobileControls();

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
            CTX.arc(
                segment.x * GRID_SIZE + eyeOffset,
                segment.y * GRID_SIZE + eyeOffset,
                eyeSize, 0, Math.PI * 2
            );
            CTX.fill();
            CTX.beginPath();
            CTX.arc(
                segment.x * GRID_SIZE + (GRID_SIZE - eyeOffset),
                segment.y * GRID_SIZE + eyeOffset,
                eyeSize, 0, Math.PI * 2
            );
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

// ========== INPUT HANDLER (Unified) ==========
function handleDirectionInput(newDir) {
    // Prevent input spam
    const now = Date.now();
    if (now - gameState.lastInputTime < gameState.inputDelay) {
        return;
    }
    
    if (!gameState.isRunning || gameState.isPaused) return;

    // Prevent 180° turn
    if ((newDir.x !== 0 && direction.x === 0) || 
        (newDir.y !== 0 && direction.y === 0)) {
        nextDirection = newDir;
        gameState.lastInputTime = now;
    }
}

// ========== KEYBOARD CONTROLS (WASD + Arrow Keys) ==========
document.addEventListener('keydown', (e) => {
    if (!gameState.isRunning || gameState.isPaused) return;

    const key = e.key.toLowerCase();
    let newDir = null;

    // WASD controls
    if (key === 'w') newDir = { x: 0, y: -1 };      // Naik
    else if (key === 's') newDir = { x: 0, y: 1 };   // Turun
    else if (key === 'a') newDir = { x: -1, y: 0 };  // Kiri
    else if (key === 'd') newDir = { x: 1, y: 0 };   // Kanan

    // Arrow Keys (backward compatibility)
    else if (e.key === 'ArrowUp') newDir = { x: 0, y: -1 };      // Naik
    else if (e.key === 'ArrowDown') newDir = { x: 0, y: 1 };     // Turun
    else if (e.key === 'ArrowLeft') newDir = { x: -1, y: 0 };    // Kiri
    else if (e.key === 'ArrowRight') newDir = { x: 1, y: 0 };    // Kanan

    if (newDir) {
        handleDirectionInput(newDir);
        e.preventDefault();
    }
}, { passive: false });

// ========== MOBILE CONTROLS - TOUCH BUTTONS ==========
if (mobileControls) {
    const mobileButtons = mobileControls.querySelectorAll('.mobile-btn');
    
    mobileButtons.forEach(button => {
        // Click event
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const direction_map = {
                'up': { x: 0, y: -1 },
                'down': { x: 0, y: 1 },
                'left': { x: -1, y: 0 },
                'right': { x: 1, y: 0 }
            };

            const dir = button.getAttribute('data-direction');
            const newDir = direction_map[dir];
            
            if (newDir) {
                handleDirectionInput(newDir);
            }
        }, { passive: false });

        // Touch start - visual feedback
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
            button.style.opacity = '0.8';
        }, { passive: false });

        // Touch end - visual feedback + action
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
            
            const direction_map = {
                'up': { x: 0, y: -1 },
                'down': { x: 0, y: 1 },
                'left': { x: -1, y: 0 },
                'right': { x: 1, y: 0 }
            };

            const dir = button.getAttribute('data-direction');
            const newDir = direction_map[dir];
            
            if (newDir) {
                handleDirectionInput(newDir);
            }
        }, { passive: false });

        // Mouse down - desktop feedback
        button.addEventListener('mousedown', (e) => {
            button.style.transform = 'scale(0.95)';
            button.style.opacity = '0.8';
        });

        // Mouse up - desktop feedback
        button.addEventListener('mouseup', (e) => {
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
        });
    });
}

// ========== SWIPE CONTROLS (MOBILE) ==========
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = Math.min(50, CANVAS_SIZE / 10);

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (!gameState.isRunning || gameState.isPaused) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > SWIPE_THRESHOLD) {
            handleDirectionInput({ x: -1, y: 0 }); // Left
        } else if (diffX < -SWIPE_THRESHOLD) {
            handleDirectionInput({ x: 1, y: 0 }); // Right
        }
    } else {
        // Vertical swipe
        if (diffY > SWIPE_THRESHOLD) {
            handleDirectionInput({ x: 0, y: -1 }); // Up
        } else if (diffY < -SWIPE_THRESHOLD) {
            handleDirectionInput({ x: 0, y: 1 }); // Down
        }
    }
}, { passive: true });

// ========== WINDOW RESIZE HANDLER ==========
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (!gameState.isRunning) {
            const oldCanvasSize = CANVAS_SIZE;
            CANVAS_SIZE = setupCanvas();
            
            // Recalculate grid jika size berubah significant
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
        
        // Update mobile controls visibility
        showMobileControls();
    }, 200); // Wait 200ms before resize
});

// ========== EVENT LISTENERS ==========
if (startBtn) {
    startBtn.addEventListener('click', startGame);
}

if (pauseBtn) {
    pauseBtn.addEventListener('click', pauseGame);
}

if (resumeBtn) {
    resumeBtn.addEventListener('click', resumeGame);
}

if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        stopTimer();
        resetGame();
        if (gameOverModal) gameOverModal.classList.add('hidden');
    });
}

if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
        if (gameOverModal) gameOverModal.classList.add('hidden');
        startGame();
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        if (gameOverModal) gameOverModal.classList.add('hidden');
    });
}

// ========== PREVENT CONTEXT MENU ==========
CANVAS.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// ========== PREVENT ZOOM ON DOUBLE TAP ==========
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// ========== ORIENTATION CHANGE HANDLER ==========
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (!gameState.isRunning) {
            CANVAS_SIZE = setupCanvas();
            GRID_SIZE = Math.floor(CANVAS_SIZE / TILE_COUNT);
            draw();
            showMobileControls();
        }
    }, 100);
});

// ========== VISIBILITY CHANGE HANDLER ==========
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause game ketika tab tidak visible
        if (gameState.isRunning && !gameState.isPaused) {
            pauseGame();
        }
    }
});

// ========== FOCUS HANDLERS ==========
window.addEventListener('focus', () => {
    console.log('Game window focused');
});

window.addEventListener('blur', () => {
    console.log('Game window blurred');
    // Optional: pause game
});

// ========== INITIALIZE GAME ==========
console.log(`
=== SNAKE GAME INITIALIZED ===
Device: ${isMobileDevice() ? 'MOBILE' : 'DESKTOP'}
Viewport: ${window.innerWidth}x${window.innerHeight}
Canvas: ${CANVAS_SIZE}x${CANVAS_SIZE}
Grid: ${TILE_COUNT}x${TILE_COUNT}
Mobile Controls: ${showMobileControls() ? 'VISIBLE' : 'HIDDEN'}
Ready to play!
`);

resetGame();
