# ⚡ QUICK REFERENCE GUIDE
## 🔍 Panduan Cepat Semua Fungsi & Fitur Snake Game

---

## 📚 JAVASCRIPT FUNCTIONS AT A GLANCE

### Setup & Initialization

```javascript
setupCanvas()
├─ Description: Calculate responsive canvas size
├─ Returns: Canvas size (number)
├─ When Called: On page load, on window resize
└─ Example: let CANVAS_SIZE = setupCanvas();

resetGame()
├─ Description: Reset game to initial state
├─ Resets: Snake, score, timer, food, buttons
├─ When Called: On "Reset Game" button click
└─ Updates gameState.isRunning = false
```

### Timer Functions

```javascript
formatTime(seconds)
├─ Input: seconds (number)
├─ Returns: "MM:SS" format (string)
├─ Example: formatTime(125) → "02:05"

startTimer()
├─ Starts: setInterval every 1000ms
├─ Increments: gameState.elapsed
├─ Updates: timerDisplay.textContent
└─ Prevents: Multiple intervals

stopTimer()
├─ Stops: gameState.timerInterval
├─ Sets: gameState.timerInterval = null
└─ Called: When game ends or pause

resetTimer()
├─ Calls: stopTimer()
├─ Sets: gameState.elapsed = 0
└─ Updates: Display to "00:00"
```

### Drawing Functions

```javascript
drawGrid()
├─ Draws: 20x20 grid background
├─ Colors: #1a1a1a background, #333 lines
└─ Size: Based on GRID_SIZE

drawSnake()
├─ Draws: Snake segments
├─ Head: #00ff00 (bright green)
├─ Body: #00cc00 (dark green)
├─ Eyes: White circles on head
└─ Positions: Based on snake array

drawFood()
├─ Draws: Red circle with yellow shine
├─ Colors: #ff0000 (red), #ffff00 (shine)
└─ Position: Based on food object

draw()
├─ Calls: drawGrid() → drawSnake() → drawFood()
└─ Order: Important for layering
```

### Game Logic

```javascript
updateSnake()
├─ Step 1: direction = nextDirection
├─ Step 2: Calculate newHead position
├─ Step 3: Check wall collision
├─ Step 4: Check self collision
├─ Step 5: snake.unshift(newHead)
├─ Step 6: Check food
├─ Step 7: snake.pop() if no food
└─ Calls: endGame() if collision

generateFood()
├─ Loop: Until find empty tile
├─ Checks: Not on snake body
├─ Sets: food = {x, y}
└─ Called: At start and after eating

gameLoop()
├─ Calls: updateSnake()
├─ Calls: draw()
├─ Interval: GAME_SPEED (100ms)
└─ Speed: 10 FPS
```

### Game Control

```javascript
startGame()
├─ Calls: resetGame()
├─ Starts: Timer and gameLoop
├─ Updates: Button states
├─ Sets: gameState.isRunning = true
└─ Interval: setInterval(gameLoop, 100ms)

pauseGame()
├─ Sets: gameState.isPaused = true
├─ Clears: gameLoopInterval
├─ Updates: Button states
└─ Timer: Continues counting (just paused rendering)

resumeGame()
├─ Sets: gameState.isPaused = false
├─ Restarts: gameLoopInterval
├─ Updates: Button states
└─ Timer: Resumes from pause time

endGame()
├─ Sets: gameState.isRunning = false
├─ Calls: stopTimer()
├─ Shows: Game Over modal
├─ Displays: Final score and time
└─ Updates: Button states
```

### Input Handling

```javascript
handleDirectionInput(newDir)
├─ Checks: Input spam (50ms delay)
├─ Checks: 180° turn prevention
├─ Sets: nextDirection = newDir
└─ Called: From keyboard, buttons, swipe

Keyboard Events
├─ WASD: w(up), s(down), a(left), d(right)
├─ Arrow: ↑↓←→
├─ Passive: false (preventDefault works)
└─ When: Only if gameState.isRunning

Mobile Button Events
├─ Click: Handle direction change
├─ Touchstart: Scale 0.95, opacity 0.8
├─ Touchend: Scale 1, opacity 1
└─ Mousedown/up: Desktop feedback

Swipe Events
├─ Threshold: 50px minimum
├─ Horizontal: Left/Right swipe
├─ Vertical: Up/Down swipe
└─ Passive: true (doesn't preventDefault)
```

### Device Detection

```javascript
isMobileDevice()
├─ Checks: navigator.userAgent
├─ Returns: true/false
└─ Pattern: Android, iPhone, iPad, etc.

isMobileViewport()
├─ Checks: window.innerWidth < 768
├─ Returns: true/false
└─ Use: For responsive detection

showMobileControls()
├─ Shows: If mobile device OR viewport < 768px
├─ Hides: If desktop AND viewport >= 768px
└─ Updates: classList (add/remove 'hidden')
```

### Window Events

```javascript
Resize Handler
├─ Debounce: 200ms delay
├─ Updates: CANVAS_SIZE, GRID_SIZE
├─ Recalculates: Snake position if changed > 10px
└─ Calls: showMobileControls()

Orientation Change
├─ Delay: 100ms
├─ Recalculates: Canvas size
├─ Redraws: Game board
└─ Updates: Mobile controls

Visibility Change
├─ Detects: Tab visibility
├─ Pauses: If tab hidden
└─ Resumes: When back to focus

Double-tap Prevention
├─ Detects: Two touches within 300ms
├─ Prevents: Browser zoom
└─ Touch end: Checks time delta
```

---

## 🎮 GAME STATE MANAGEMENT

### gameState Object

```javascript
gameState = {
    isRunning: false,        // Game active? (boolean)
    isPaused: false,         // Game paused? (boolean)
    score: 0,                // Points earned (number)
    elapsed: 0,              // Seconds played (number)
    timerInterval: null,     // Timer ID (or null)
    lastInputTime: 0,        // Last input time (number)
    inputDelay: 50           // Min ms between inputs (number)
}

State Transitions:
IDLE → startGame() → RUNNING
                ↓
            pauseGame()
                ↓
            PAUSED ←→ resumeGame()
                ↓
            endGame()
                ↓
            GAME OVER
                ↓
            resetGame()
                ↓
            back to IDLE
```

### Game Objects

```javascript
snake = [
    {x: 10, y: 10},  // head (index 0)
    {x: 9, y: 10},   // body
    {x: 8, y: 10}    // tail (last)
]

food = {x: 15, y: 12}

direction = {x: 1, y: 0}      // Current (will move)
nextDirection = {x: 1, y: 0}  // Next (queued)

GRID_SIZE = CANVAS_SIZE / 20  // Pixel size per tile
```

---

## 🎨 CSS MEDIA QUERIES

### Breakpoints Quick Reference

| Breakpoint | Size | Device | Layout |
|-----------|------|--------|--------|
| Large Desktop | 1200px+ | Desktop | Side-by-side |
| Desktop | 768-1199px | Desktop/Tablet | Flexible |
| Tablet | 600-767px | Tablet | Column |
| Mobile Land | 500-599px | Mobile | Full width |
| Mobile | < 500px | Mobile | Stacked |
| Extra Small | < 380px | Old phone | Compact |
| Landscape | height < 600px | Landscape | Tight |

### Responsive Units

```css
Font: clamp(MIN, PREFERRED, MAX)
Padding: clamp(MIN, VWPERCENT, MAX)
Gap: clamp(MIN, VWPERCENT, MAX)

Benefits:
- Automatic scaling
- No media query needed
- Smooth transitions
- Maintains readability
```

---

## 🔌 HTML ELEMENTS & IDS

### Core Elements

```html
Canvas
└─ id="gameCanvas"
   ├─ width: 500 (native)
   ├─ height: 500 (native)
   └─ Sets: role, aria-label

Display Elements
├─ id="score" → Score text
├─ id="timer" → Timer text
├─ id="finalScore" → Game over score
└─ id="finalTime" → Game over time

Buttons
├─ id="startBtn" → Start game
├─ id="pauseBtn" → Pause game
├─ id="resumeBtn" → Resume game
├─ id="resetBtn" → Reset game
├─ id="playAgainBtn" → Play again
└─ id="closeModalBtn" → Close modal

Containers
├─ id="mobileControls" → Mobile buttons container
├─ id="gameOverModal" → Game over modal
└─ .container → Main wrapper
```

### Mobile Control Buttons

```html
<div id="mobileControls" class="mobile-controls">
    ├─ class="mobile-btn mobile-btn-up" data-direction="up"
    ├─ class="mobile-btn mobile-btn-left" data-direction="left"
    ├─ class="mobile-btn mobile-btn-right" data-direction="right"
    └─ class="mobile-btn mobile-btn-down" data-direction="down"
```

---

## 🎯 COMMON ISSUES & FIXES

### Issue 1: Canvas tidak responsive

❌ **Wrong:**
```css
#gameCanvas {
    width: 500px;  /* Fixed size */
    height: 500px;
}
```

✅ **Right:**
```javascript
function setupCanvas() {
    let maxWidth = Math.min(500, window.innerWidth - 40);
    let maxHeight = Math.min(500, window.innerHeight * 0.6);
    const size = Math.min(maxWidth, maxHeight);
    
    CANVAS.width = size;
    CANVAS.height = size;
    return size;
}

CSS:
#gameCanvas {
    max-width: 100%;
    height: auto;
}
```

---

### Issue 2: 180° turn not prevented

❌ **Wrong:**
```javascript
if (newDir.x !== direction.x) {  // Incomplete check
    nextDirection = newDir;
}
```

✅ **Right:**
```javascript
if ((newDir.x !== 0 && direction.x === 0) || 
    (newDir.y !== 0 && direction.y === 0)) {
    nextDirection = newDir;
}

Logic:
- newDir.x !== 0 && direction.x === 0
  = Horizontal input, currently vertical
  = Perpendicular turn ✅
  
- newDir.y !== 0 && direction.y === 0
  = Vertical input, currently horizontal
  = Perpendicular turn ✅
```

---

### Issue 3: Input spam causing issues

❌ **Wrong:**
```javascript
document.addEventListener('keydown', (e) => {
    nextDirection = getDirection(e.key);  // Immediate
});
```

✅ **Right:**
```javascript
const gameState = {
    lastInputTime: 0,
    inputDelay: 50
};

function handleDirectionInput(newDir) {
    const now = Date.now();
    if (now - gameState.lastInputTime < gameState.inputDelay) {
        return;  // Ignore if too fast
    }
    
    nextDirection = newDir;
    gameState.lastInputTime = now;
}
```

---

### Issue 4: Modal tidak hide

❌ **Wrong:**
```javascript
gameOverModal.style.display = 'none';  // Direct style */
```

✅ **Right:**
```javascript
// Show
gameOverModal.classList.remove('hidden');

// Hide
gameOverModal.classList.add('hidden');

// CSS
.modal.hidden {
    display: none;
}
```

---

### Issue 5: Mobile buttons not clickable

❌ **Wrong:**
```javascript
button.addEventListener('click', handler);
// No touch handling
```

✅ **Right:**
```javascript
button.addEventListener('click', (e) => {
    e.preventDefault();
    handler();
}, { passive: false });

button.addEventListener('touchstart', (e) => {
    e.preventDefault();
    button.style.transform = 'scale(0.95)';
}, { passive: false });

button.addEventListener('touchend', (e) => {
    e.preventDefault();
    button.style.transform = 'scale(1)';
    handler();
}, { passive: false });
```

---

## 📊 QUICK STATS

### Performance

```
Game Speed:          100ms (10 FPS)
Input Debounce:      50ms
Resize Debounce:     200ms
Swipe Threshold:     50px
Canvas Max:          500px
Grid Size:           20x20 tiles
Min Canvas:          200x200px
Tile Count:          400 tiles
```

### Responsive Values

```
Font Scaling:     clamp(0.8em, 1.5vw, 1em)
Padding:          clamp(10px, 2vw, 12px)
Gap:              clamp(15px, 3vw, 30px)
Button Min:       44px (touch-friendly)
Canvas Max Width: 500px
Grid Count:       20 tiles fixed
```

### Colors

```
Primary:          #667eea (Indigo)
Secondary:        #6b7280 (Gray)
Success:          #10b981 (Green)
Warning:          #f59e0b (Orange)
Danger:           #ef4444 (Red)
Snake Head:       #00ff00 (Bright Green)
Snake Body:       #00cc00 (Dark Green)
Food:             #ff0000 (Red)
Food Shine:       #ffff00 (Yellow)
Background:       #1a1a1a (Dark)
```

---

## 🔄 GAME FLOW DIAGRAM

```
┌─────────────────┐
│  Load Page      │
│ - Load HTML/CSS │
│ - Load JS       │
└────────┬────────┘
         ↓
┌─────────────────────────────────────────┐
│  Initialize                             │
│  - setupCanvas()                        │
│  - resetGame()                          │
│  - Add event listeners                  │
│  - Device detection                     │
└────────┬────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│  Ready State                         │
│  - Canvas: displayed                 │
│  - Buttons: enabled                  │
│  - Score: 0                          │
│  - Timer: 00:00                      │
└────────┬─────────────────────────────┘
         ↓
   User Clicks START
         ↓
┌──────────────────────────────────────┐
│  startGame()                         │
│  - resetGame()                       │
│  - startTimer()                      │
│  - setInterval(gameLoop, 100ms)      │
│  - gameState.isRunning = true        │
└────────┬─────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│  Game Loop (every 100ms)             │
│  1. updateSnake()                    │
│     - Calculate new position         │
│     - Check collision                │
│     - Check food                     │
│  2. draw()                           │
│     - Update canvas                  │
└────────┬─────────────────────────────┘
         ↓
    User Input
    (Keyboard/Touch/Swipe)
         ↓
   nextDirection = newDir
         ↓
    [Next Loop]
         ↓
   ┌─────────────────┐
   │ Collision?      │
   │ (wall/self)     │
   └──┬──────────┬──┘
      │          │
     YES        NO
      │          │
      ↓          ↓
   endGame()   Continue
      ↓          │
      └──────┬───┘
             ↓
   ┌──────────────────┐
   │  Game Over Modal │
   │ Final Score/Time │
   └────────┬─────────┘
            ↓
   User: Play Again OR Close
            ↓
   resetGame() / Close
            ↓
   Back to Ready State
```

---

## 💡 TIPS & TRICKS

### Performance Optimization

```javascript
// Debounce resize (don't recalculate every pixel)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate
    }, 200);
});

// Prevent input spam (50ms minimum)
if (now - lastInputTime < 50) return;

// Pause on tab hidden (save resources)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameState.isRunning) {
        pauseGame();
    }
});
```

### Testing Checklist

- [ ] Keyboard works (WASD + Arrow)
- [ ] Mobile buttons appear on small screens
- [ ] Touch/swipe works on mobile
- [ ] 180° turn prevented
- [ ] Input spam prevented
- [ ] Score updates correctly
- [ ] Timer counts correctly
- [ ] Collision detection works
- [ ] Pause/Resume works
- [ ] Reset clears everything
- [ ] Modal shows on game over
- [ ] Responsive on all devices
- [ ] Dark mode supported
- [ ] Reduced motion respected
- [ ] No console errors

---

**Quick Reference Complete!** ⚡
