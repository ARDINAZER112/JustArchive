# 🐍 DOKUMENTASI LENGKAP SNAKE GAME
## ✅ Penjelasan Detail Fungsi Kode untuk Semua Device

---

## 📑 DAFTAR ISI

1. [Struktur Proyek](#struktur-proyek)
2. [HTML Documentation](#html-documentation)
3. [CSS Responsive Design](#css-responsive-design)
4. [JavaScript Functions](#javascript-functions)
5. [Game Mechanics](#game-mechanics)
6. [Device Compatibility](#device-compatibility)

---

## STRUKTUR PROYEK

### File Struktur
```
snake-game/
├── index.html                          # HTML utama
├── style/
│   ├── style.css                      # Base styles
│   ├── style_fixed.css                # Fixed layout
│   ├── style_layout_improved.css      # Improved layout
│   └── style_universal.css            # Universal responsive
└── script/
    ├── script_universal.js            # Main game logic
    ├── script_hybrid_controls.js      # Hybrid keyboard
    └── script_improved.js             # Improvements
```

---

## HTML DOCUMENTATION

### 1. Meta Tags & Responsive Setup

```html
<!-- Viewport - CRITICAL untuk responsive design -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, 
    viewport-fit=cover, user-scalable=yes, maximum-scale=5.0">
```

**Penjelasan setiap parameter:**

| Parameter | Fungsi | Nilai |
|-----------|--------|-------|
| `width=device-width` | Set width = lebar device | Dynamic |
| `initial-scale=1.0` | Initial zoom level | 100% |
| `viewport-fit=cover` | Fit ke notch area (iPhone) | cover |
| `user-scalable=yes` | Izin user zoom in/out | yes |
| `maximum-scale=5.0` | Max zoom level | 500% |

**Mengapa penting?**
- Memastikan responsivitas di semua device
- Mencegah text dari auto-zoom pada desktop
- Memungkinkan user untuk zoom (accessibility)

---

### 2. Mobile Web App Configuration

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#667eea">
```

**Fungsi:**
- Bisa di-save ke home screen iOS
- Status bar styling untuk PWA
- Theme color untuk Android (#667eea = Indigo)

---

### 3. Game Header Structure

```html
<div class="game-header">
    <h1>SNAKE GAME</h1>
    <div class="game-stats">
        <div class="stat">
            <span class="label">Score:</span>
            <span class="value" id="score">0</span>
        </div>
        <div class="stat">
            <span class="label">Waktu:</span>
            <span class="value" id="timer">00:00</span>
        </div>
    </div>
</div>
```

**Update via JavaScript:**
```javascript
// Score update
scoreDisplay.textContent = gameState.score;  // "0" → "10" → "20"

// Timer update (setiap 1 detik)
timerDisplay.textContent = formatTime(gameState.elapsed);  // "00:00" → "00:01"
```

---

### 4. Canvas & Game Board

```html
<canvas id="gameCanvas" width="500" height="500" 
    role="img" aria-label="Game Canvas"></canvas>
```

**Attributes:**
- `id="gameCanvas"` → Reference JavaScript
- `width/height="500"` → Native resolution (akan di-override JS)
- `role="img"` → Accessibility untuk screen reader
- `aria-label` → Deskripsi untuk blind users

**Setup JavaScript:**
```javascript
const CANVAS = document.getElementById('gameCanvas');
const CTX = CANVAS.getContext('2d');

function setupCanvas() {
    let maxWidth = Math.min(500, window.innerWidth - 40);
    let maxHeight = Math.min(500, window.innerHeight * 0.6);
    
    const size = Math.min(maxWidth, maxHeight);
    CANVAS.width = size;
    CANVAS.height = size;
    
    return size;
}
```

**Penjelasan:**
1. Get max width/height dari viewport
2. Pastikan minimum 200px untuk playability
3. Buat square (width = height)
4. Set canvas size responsif

---

### 5. Mobile Control Buttons

```html
<div id="mobileControls" class="mobile-controls hidden">
    <button class="mobile-btn mobile-btn-up" data-direction="up">▲</button>
    <div class="mobile-row">
        <button class="mobile-btn mobile-btn-left" data-direction="left">◀</button>
        <button class="mobile-btn mobile-btn-right" data-direction="right">▶</button>
    </div>
    <button class="mobile-btn mobile-btn-down" data-direction="down">▼</button>
</div>
```

**Layout:**
```
    ▲
  ◀ ▶
    ▼
```

**Hidden Class:**
```css
.mobile-controls.hidden {
    display: none;  /* Tidak ditampilkan di desktop */
}
```

---

### 6. Game Buttons

```html
<div class="game-controls">
    <button id="startBtn" class="btn btn-primary">Mulai Game</button>
    <button id="pauseBtn" class="btn btn-warning" disabled>Pause</button>
    <button id="resumeBtn" class="btn btn-success" disabled>Lanjut</button>
    <button id="resetBtn" class="btn btn-danger">Reset Game</button>
</div>
```

**Button States:**
```javascript
// Kondisi 1: Game Idle
startBtn.disabled = false;      // ✅ Enable
pauseBtn.disabled = true;       // ❌ Disable
resumeBtn.disabled = true;      // ❌ Disable
resetBtn.disabled = false;      // ✅ Enable

// Kondisi 2: Game Running
startBtn.disabled = true;       // ❌ Disable
pauseBtn.disabled = false;      // ✅ Enable
resumeBtn.disabled = true;      // ❌ Disable

// Kondisi 3: Game Paused
pauseBtn.disabled = true;       // ❌ Disable
resumeBtn.disabled = false;     // ✅ Enable
```

---

### 7. Game Over Modal

```html
<div id="gameOverModal" class="modal hidden" 
    role="dialog" aria-labelledby="gameOverTitle" aria-modal="true">
    <div class="modal-content">
        <h2 id="gameOverTitle">GAME OVER!</h2>
        <div class="game-over-stats">
            <p>Final Score: <span id="finalScore">0</span></p>
            <p>Waktu Bermain: <span id="finalTime">00:00</span></p>
        </div>
        <div class="modal-buttons">
            <button id="playAgainBtn" class="btn btn-primary">Coba Lagi</button>
            <button id="closeModalBtn" class="btn btn-secondary">Tutup</button>
        </div>
    </div>
</div>
```

**Modal Control:**
```javascript
// Show modal
gameOverModal.classList.remove('hidden');

// Hide modal
gameOverModal.classList.add('hidden');
```

---

## CSS RESPONSIVE DESIGN

### 1. Responsive Units (clamp function)

```css
/* Syntax: clamp(MIN, PREFERRED, MAX) */
font-size: clamp(0.8em, 1.5vw, 1em);
```

**Behavior Chart:**
```
Size ▲
     │              MAX (1em)
     │            /─────────
     │           /
     │          / PREFERRED (1.5vw)
     │         /
     │────────/
     │MIN (0.8em)
     │
     └──────────────────────────→
      320px  600px  1000px  Viewport
```

**Contoh Kalkulasi:**
```
At 320px:  1.5vw = 4.8px < 0.8em (12.8px) → Use 0.8em ✅
At 600px:  1.5vw = 9px (between min & max) → Use 9px ✅
At 1000px: 1.5vw = 15px > 1em (16px) → Use 1em ✅
```

---

### 2. Flexbox Layout System

```css
.game-main {
    display: flex;
    gap: clamp(15px, 3vw, 30px);  /* Dynamic gap */
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: center;
}

.game-left {
    flex: 1;  /* Grow to fill */
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.game-right {
    flex: 0 0 auto;  /* Don't grow/shrink */
    display: flex;
    flex-direction: column;
    gap: 15px;
}
```

**Desktop Layout:**
```
┌─────────────────────────────────────┐
│ Canvas     Gap     Buttons/Info     │
└─────────────────────────────────────┘
```

**Mobile Layout:**
```
┌──────────────┐
│   Canvas     │
├──────────────┤
│ Buttons/Info │
└──────────────┘
```

---

### 3. Mobile Controls Grid

```css
.mobile-controls {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;  /* 3 equal columns */
    gap: clamp(8px, 2vw, 10px);
}

.mobile-btn-up {
    grid-column: 2;  /* Center column */
}

.mobile-row {
    grid-column: 1 / -1;  /* Span all columns */
    display: flex;
    justify-content: center;
}
```

**Visual Grid:**
```
Col 1    Col 2    Col 3
  □        ▲        □     Row 1
  ◀        □        ▶     Row 2
  □        ▼        □     Row 3
```

---

### 4. Responsive Breakpoints

```css
/* Large Desktop (1200px+) */
@media (min-width: 1200px) {
    .game-main { flex-wrap: nowrap; }  /* Side-by-side */
}

/* Desktop (768px - 1199px) */
@media (min-width: 768px) and (max-width: 1199px) {
    .game-main { flex-wrap: wrap; }    /* Flexible */
}

/* Tablet (600px - 767px) */
@media (min-width: 600px) and (max-width: 767px) {
    .game-main { flex-direction: column; }  /* Stacked */
}

/* Mobile Landscape (500px - 599px) */
@media (min-width: 500px) and (max-width: 599px) {
    #gameCanvas { max-height: 50vh; }
}

/* Mobile Portrait (< 500px) */
@media (max-width: 499px) {
    #gameCanvas { width: 100%; }
    .game-main { flex-direction: column; }
}

/* Extra Small (< 380px) */
@media (max-width: 379px) {
    .btn { font-size: 0.65em; }
}

/* Landscape Mode */
@media (max-height: 600px) and (orientation: landscape) {
    #gameCanvas { max-height: 80vh; }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
    body { background: #1a1a1a; }
    .container { background: #222; }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    * { animation: none !important; }
}

/* Touch Devices */
@media (hover: none) and (pointer: coarse) {
    .btn:hover { transform: none; }
}
```

---

### 5. Button Styling

```css
.btn {
    padding: clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px);
    font-size: clamp(0.8em, 1.5vw, 1em);
    min-height: 44px;  /* Touch-friendly */
    width: 100%;
    transition: all 0.3s ease;
}

.btn:hover:not(:disabled) {
    transform: translateY(-2px);  /* Lift effect */
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Color Variants */
.btn-primary { background-color: #667eea; }   /* Blue */
.btn-warning { background-color: #f59e0b; }   /* Orange */
.btn-success { background-color: #10b981; }   /* Green */
.btn-danger { background-color: #ef4444; }    /* Red */
```

---

## JAVASCRIPT FUNCTIONS

### 1. Canvas Setup Function

```javascript
function setupCanvas() {
    const gameBoard = CANVAS.parentElement;
    
    // Get available space (max 500px atau kurang)
    let maxWidth = Math.min(500, window.innerWidth - 40);
    let maxHeight = Math.min(500, window.innerHeight * 0.6);
    
    // Ensure minimum size for playability
    maxWidth = Math.max(200, maxWidth);
    maxHeight = Math.max(200, maxHeight);
    
    // Make square
    const size = Math.min(maxWidth, maxHeight);
    
    CANVAS.width = size;
    CANVAS.height = size;
    
    return size;
}

let CANVAS_SIZE = setupCanvas();

// Grid configuration
const TARGET_TILE_COUNT = 20;  // 20x20 grid
let TILE_COUNT = TARGET_TILE_COUNT;
let GRID_SIZE = Math.floor(CANVAS_SIZE / TILE_COUNT);
// Contoh: 400px canvas / 20 = 20px per tile
```

**Fungsi:**
- Calculate responsive canvas size
- Maintain square aspect ratio
- Ensure playable minimum size
- Calculate tile grid size

---

### 2. Game State Management

```javascript
let gameState = {
    isRunning: false,        // Game active?
    isPaused: false,         // Game paused?
    score: 0,                // Total points
    elapsed: 0,              // Play time (seconds)
    timerInterval: null,     // Timer ID
    lastInputTime: 0,        // Last input time
    inputDelay: 50           // Min ms between inputs
};

let snake = [];             // Snake segments [{x,y}, ...]
let food = {x, y};          // Food position
let direction = {x, y};     // Current direction
let nextDirection = {x, y}; // Next direction (queued)
```

---

### 3. Timer Functions

```javascript
/**
 * formatTime(seconds)
 * Convert seconds to MM:SS format
 * 
 * Contoh:
 *   125 → "02:05"
 *   5   → "00:05"
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    // padStart(2, '0') = add leading zero if needed
}

/**
 * startTimer()
 * Start counting play time
 */
function startTimer() {
    if (gameState.timerInterval) return;  // Prevent duplicates
    
    gameState.timerInterval = setInterval(() => {
        if (!gameState.isPaused) {
            gameState.elapsed++;
            timerDisplay.textContent = formatTime(gameState.elapsed);
        }
    }, 1000);  // Every 1 second
}

/**
 * stopTimer()
 * Stop the timer
 */
function stopTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
}

/**
 * resetTimer()
 * Reset timer to 00:00
 */
function resetTimer() {
    stopTimer();
    gameState.elapsed = 0;
    timerDisplay.textContent = '00:00';
}
```

---

### 4. Drawing Functions

```javascript
/**
 * drawGrid()
 * Draw background and 20x20 grid
 */
function drawGrid() {
    // Background
    CTX.fillStyle = '#1a1a1a';
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);

    // Grid lines
    CTX.strokeStyle = '#333';
    CTX.lineWidth = 0.5;
    
    for (let i = 0; i <= TILE_COUNT; i++) {
        const pos = i * GRID_SIZE;
        
        // Vertical lines
        CTX.beginPath();
        CTX.moveTo(pos, 0);
        CTX.lineTo(pos, CANVAS.height);
        CTX.stroke();
        
        // Horizontal lines
        CTX.beginPath();
        CTX.moveTo(0, pos);
        CTX.lineTo(CANVAS.width, pos);
        CTX.stroke();
    }
}

/**
 * drawSnake()
 * Draw snake with head and eyes
 */
function drawSnake() {
    snake.forEach((segment, index) => {
        // Head: bright green, Body: dark green
        CTX.fillStyle = index === 0 ? '#00ff00' : '#00cc00';
        
        CTX.fillRect(
            segment.x * GRID_SIZE + 1,      // +1 padding
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,                  // -2 for gap
            GRID_SIZE - 2
        );

        // Draw eyes only on head
        if (index === 0) {
            CTX.fillStyle = 'white';
            const eyeSize = Math.max(1, Math.floor(GRID_SIZE / 10));
            const eyeOffset = Math.floor(GRID_SIZE / 3);
            
            // Left eye
            CTX.beginPath();
            CTX.arc(
                segment.x * GRID_SIZE + eyeOffset,
                segment.y * GRID_SIZE + eyeOffset,
                eyeSize, 0, Math.PI * 2
            );
            CTX.fill();
            
            // Right eye
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

/**
 * drawFood()
 * Draw food (red circle with yellow shine)
 */
function drawFood() {
    // Main circle (red)
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

    // Shine effect (yellow)
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

/**
 * draw()
 * Render all game visuals
 * Order: background → snake → food
 */
function draw() {
    drawGrid();
    drawSnake();
    drawFood();
}
```

---

### 5. Game Logic Functions

```javascript
/**
 * updateSnake()
 * Update snake position and check collisions
 */
function updateSnake() {
    direction = nextDirection;

    const head = snake[0];
    const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };

    // ========== COLLISION DETECTION ==========
    
    // Wall collision
    if (newHead.x < 0 || newHead.x >= TILE_COUNT || 
        newHead.y < 0 || newHead.y >= TILE_COUNT) {
        endGame();
        return;
    }

    // Self collision
    if (snake.some(segment => 
        segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
        return;
    }

    // ========== VALID MOVE ==========
    
    // Add new head
    snake.unshift(newHead);

    // Check food
    if (newHead.x === food.x && newHead.y === food.y) {
        // Snake grows (don't remove tail)
        gameState.score += 10;
        scoreDisplay.textContent = gameState.score;
        generateFood();
    } else {
        // Snake maintains length (remove tail)
        snake.pop();
    }
}

/**
 * generateFood()
 * Spawn food at random position not on snake
 */
function generateFood() {
    let newFood;
    let foodOnSnake = true;

    while (foodOnSnake) {
        newFood = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };

        foodOnSnake = snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
        );
    }

    food = newFood;
}

/**
 * gameLoop()
 * Main game loop (every 100ms = 10 FPS)
 */
function gameLoop() {
    updateSnake();
    draw();
}
```

---

### 6. Game Control Functions

```javascript
/**
 * startGame()
 * Start the game
 */
function startGame() {
    resetGame();
    gameState.isRunning = true;
    gameState.isPaused = false;

    startTimer();
    gameLoopInterval = setInterval(gameLoop, GAME_SPEED);  // 100ms

    // Update button states
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
    resetBtn.disabled = false;
}

/**
 * pauseGame()
 * Pause the game
 */
function pauseGame() {
    gameState.isPaused = true;
    clearInterval(gameLoopInterval);
    gameLoopInterval = null;

    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
}

/**
 * resumeGame()
 * Resume from pause
 */
function resumeGame() {
    gameState.isPaused = false;
    gameLoopInterval = setInterval(gameLoop, GAME_SPEED);

    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
}

/**
 * resetGame()
 * Reset to initial state
 */
function resetGame() {
    // Reset snake to center
    const centerX = Math.floor(TILE_COUNT / 2);
    const centerY = Math.floor(TILE_COUNT / 2);
    
    snake = [{ x: centerX, y: centerY }];
    direction = { x: 1, y: 0 };      // Right
    nextDirection = { x: 1, y: 0 };

    // Reset score
    gameState.score = 0;
    scoreDisplay.textContent = '0';

    // Reset timer
    resetTimer();

    // Generate food
    generateFood();

    // Draw initial state
    draw();

    // Reset buttons
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    resetBtn.disabled = false;
    
    gameState.isRunning = false;
}

/**
 * endGame()
 * Game over - show results
 */
function endGame() {
    gameState.isRunning = false;
    stopTimer();
    clearInterval(gameLoopInterval);
    gameLoopInterval = null;

    // Show modal
    finalScoreDisplay.textContent = gameState.score;
    finalTimeDisplay.textContent = formatTime(gameState.elapsed);
    gameOverModal.classList.remove('hidden');

    // Reset buttons
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    resetBtn.disabled = false;
}
```

---

### 7. Input Handler

```javascript
/**
 * handleDirectionInput(newDir)
 * Process direction input from user
 * 
 * Prevents:
 * - Input spam (< 50ms)
 * - 180° turn (can't go opposite)
 */
function handleDirectionInput(newDir) {
    // Prevent input spam
    const now = Date.now();
    if (now - gameState.lastInputTime < gameState.inputDelay) {
        return;  // Ignore if < 50ms
    }
    
    if (!gameState.isRunning || gameState.isPaused) return;

    // Prevent 180° turn
    // newDir.x !== 0 && direction.x === 0 = Horizontal input, vertical direction
    // newDir.y !== 0 && direction.y === 0 = Vertical input, horizontal direction
    if ((newDir.x !== 0 && direction.x === 0) || 
        (newDir.y !== 0 && direction.y === 0)) {
        nextDirection = newDir;
        gameState.lastInputTime = now;
    }
}

/**
 * Keyboard Input Handler
 * Support WASD + Arrow Keys
 */
document.addEventListener('keydown', (e) => {
    if (!gameState.isRunning || gameState.isPaused) return;

    const key = e.key.toLowerCase();
    let newDir = null;

    // WASD controls
    if (key === 'w') newDir = { x: 0, y: -1 };      // Up
    else if (key === 's') newDir = { x: 0, y: 1 };  // Down
    else if (key === 'a') newDir = { x: -1, y: 0 }; // Left
    else if (key === 'd') newDir = { x: 1, y: 0 };  // Right

    // Arrow Keys
    else if (e.key === 'ArrowUp') newDir = { x: 0, y: -1 };
    else if (e.key === 'ArrowDown') newDir = { x: 0, y: 1 };
    else if (e.key === 'ArrowLeft') newDir = { x: -1, y: 0 };
    else if (e.key === 'ArrowRight') newDir = { x: 1, y: 0 };

    if (newDir) {
        handleDirectionInput(newDir);
        e.preventDefault();
    }
}, { passive: false });
```

---

### 8. Mobile Touch Handling

```javascript
/**
 * Mobile Button Click Handler
 */
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

        // Touch feedback
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
            button.style.opacity = '0.8';
        }, { passive: false });

        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
            
            // Handle direction change
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

        // Mouse feedback (desktop)
        button.addEventListener('mousedown', (e) => {
            button.style.transform = 'scale(0.95)';
            button.style.opacity = '0.8';
        });

        button.addEventListener('mouseup', (e) => {
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
        });
    });
}
```

---

### 9. Swipe Handler

```javascript
/**
 * Swipe Gesture Detection
 * For mobile swipe controls
 * 
 * Threshold: 50px minimum or 10% canvas size
 */
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
    const diffX = touchStartX - touchEndX;  // Negative = swipe right
    const diffY = touchStartY - touchEndY;  // Negative = swipe down

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
```

---

### 10. Device Detection

```javascript
/**
 * isMobileDevice()
 * Detect mobile device by user agent
 */
function isMobileDevice() {
    const mobilePattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i;
    return mobilePattern.test(navigator.userAgent);
}

/**
 * isMobileViewport()
 * Detect viewport size
 */
function isMobileViewport() {
    return window.innerWidth < 768;
}

/**
 * showMobileControls()
 * Show/hide mobile button controls
 */
function showMobileControls() {
    if (!mobileControls) return;
    
    if (isMobileDevice() || isMobileViewport()) {
        mobileControls.classList.remove('hidden');
        return true;
    } else {
        mobileControls.classList.add('hidden');
        return false;
    }
}
```

---

### 11. Window Events

```javascript
/**
 * Window Resize Handler
 * Debounced with 200ms delay
 */
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (!gameState.isRunning) {
            const oldCanvasSize = CANVAS_SIZE;
            CANVAS_SIZE = setupCanvas();
            
            // Recalculate if changed significantly
            if (Math.abs(CANVAS_SIZE - oldCanvasSize) > 10) {
                GRID_SIZE = Math.floor(CANVAS_SIZE / TILE_COUNT);
                
                const centerX = Math.floor(TILE_COUNT / 2);
                const centerY = Math.floor(TILE_COUNT / 2);
                snake = [{ x: centerX, y: centerY }];
                generateFood();
            }
            
            draw();
        }
        
        showMobileControls();
    }, 200);  // Wait 200ms
});

/**
 * Orientation Change Handler
 */
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

/**
 * Visibility Change Handler
 * Auto pause when tab not visible
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (gameState.isRunning && !gameState.isPaused) {
            pauseGame();
        }
    }
});
```

---

## GAME MECHANICS

### Direction System

```javascript
Direction = {x, y}

Kanan:  {x: 1,  y: 0}   ▶
Kiri:   {x: -1, y: 0}   ◀
Atas:   {x: 0,  y: -1}  ▲
Bawah:  {x: 0,  y: 1}   ▼

Move calculation:
newX = head.x + direction.x
newY = head.y + direction.y
```

---

### Snake Movement Cycle

```
Frame 1:
Before: [{x:10, y:5}, {x:9, y:5}, {x:8, y:5}]
             (head)    (body)    (tail)

Add new head:
snake.unshift({x:11, y:5})

After: [{x:11, y:5}, {x:10, y:5}, {x:9, y:5}, {x:8, y:5}]

Remove tail if no food:
snake.pop()

Result: [{x:11, y:5}, {x:10, y:5}, {x:9, y:5}]
(sama panjang - gerakan normal)

Frame 2 (eat food):
Tidak remove tail → snake memanjang
New: [{x:12, y:5}, {x:11, y:5}, {x:10, y:5}, {x:9, y:5}]
```

---

### Collision Detection

```javascript
// Wall collision
if (newHead.x < 0 || newHead.x >= TILE_COUNT || 
    newHead.y < 0 || newHead.y >= TILE_COUNT) {
    endGame();
}

// Self collision
if (snake.some(segment => 
    segment.x === newHead.x && segment.y === newHead.y)) {
    endGame();
}

// Grid range: 0-19 (untuk 20x20 grid)
```

---

## DEVICE COMPATIBILITY

### Desktop (1200px+)

```
Feature           Support
──────────────────────────
Keyboard (WASD)   ✅ Full
Keyboard (Arrow)  ✅ Full
Mobile buttons    ❌ Hidden
Touch/Swipe       ✅ Supported
Layout            Side-by-side
Canvas max        500px
```

### Tablet (768px - 1199px)

```
Feature           Support
──────────────────────────
Keyboard (WASD)   ✅ Full
Keyboard (Arrow)  ✅ Full
Mobile buttons    ✅ Shown
Touch/Swipe       ✅ Full
Layout            Flexible
Canvas max        100% width
```

### Mobile (< 768px)

```
Feature           Support
──────────────────────────
Keyboard (WASD)   ⚠️ Limited
Keyboard (Arrow)  ⚠️ Limited
Mobile buttons    ✅ Full
Touch/Swipe       ✅ Full
Layout            Stacked
Canvas max        Device width
```

### Responsivenes Breakpoints

| Ukuran | Kondisi | Behavior |
|--------|---------|----------|
| 1200px+ | Desktop | Side-by-side layout |
| 768-1199px | Tablet | Flexible layout |
| 600-767px | Tablet small | Column layout |
| 500-599px | Mobile landscape | Full width |
| < 500px | Mobile portrait | Compact layout |
| < 380px | Extra small | Minimal sizes |

---

## PERFORMANCE TIPS

### Game Loop Speed
```javascript
const GAME_SPEED = 100;  // 10 FPS (optimal untuk snake)
```
- Cukup untuk smooth movement
- Tidak membuang resource

### Input Handling
```javascript
const inputDelay = 50;  // Minimum 50ms between inputs
```
- Prevent spam input
- Smooth direction changes

### Resize Debounce
```javascript
resizeTimeout = setTimeout(() => {
    // Recalculate canvas
}, 200);  // Wait 200ms
```
- Prevent excessive recalculation
- Better performance

---

**Dokumentasi Lengkap Selesai!** ✅

Semua fungsi, HTML, CSS, dan game mechanics sudah dijelaskan dengan detail untuk semua device.

Selamat bermain! 🐍🎮
