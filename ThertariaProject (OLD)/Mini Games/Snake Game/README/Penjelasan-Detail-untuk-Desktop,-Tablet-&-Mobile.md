# 📱 DEVICE SPECIFIC IMPLEMENTATION GUIDE
## ✅ Penjelasan Detail untuk Desktop, Tablet & Mobile

---

## 📑 DAFTAR ISI

1. [Desktop Implementation](#desktop-implementation)
2. [Tablet Implementation](#tablet-implementation)
3. [Mobile Implementation](#mobile-implementation)
4. [Responsive CSS Breakdown](#responsive-css-breakdown)
5. [Event Handling per Device](#event-handling-per-device)

---

## DESKTOP IMPLEMENTATION

### 1. Layout Configuration (1200px+)

```html
<!-- Desktop: Side-by-side layout -->
<div class="game-main">
    <div class="game-left">       <!-- Canvas: flex 1 (grow) -->
        <canvas id="gameCanvas"></canvas>
    </div>
    
    <div class="game-right">      <!-- Buttons: flex 0 0 auto (fixed) -->
        <div class="game-controls">
            <!-- Buttons -->
        </div>
    </div>
</div>
```

### 2. CSS untuk Desktop

```css
/* Desktop (1200px+) */
@media (min-width: 1200px) {
    .container {
        padding: 30px;
        max-width: 1200px;
    }

    .game-main {
        flex-wrap: nowrap;      /* Side-by-side */
        align-items: flex-start;
        gap: 30px;              /* Large gap */
    }

    .game-left {
        flex: 0 0 auto;         /* Fixed size */
        width: auto;
        max-width: none;
    }

    .game-right {
        flex: 0 0 auto;         /* Fixed size */
        min-width: 220px;       /* Buttons area */
    }

    .mobile-controls {
        display: none !important;  /* Hide buttons */
    }

    .info-desktop {
        display: inline;        /* Show WASD info */
    }

    .info-mobile {
        display: none;          /* Hide mobile info */
    }
}
```

### 3. Desktop User Experience

```
Layout:
┌────────────────────────────────────────────┐
│                SNAKE GAME                   │
│         Score: 0    Waktu: 00:00           │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────┐  ┌────────────────┐ │
│  │                  │  │ Mulai Game     │ │
│  │   Canvas         │  │ Pause          │ │
│  │   1500x1500      │  │ Lanjut         │ │
│  │                  │  │ Reset          │ │
│  │                  │  │                │ │
│  │                  │  │ Cara Bermain:  │ │
│  │                  │  │ - WASD untuk   │ │
│  │                  │  │   gerak        │ │
│  │                  │  │ - Arrow keys   │ │
│  │                  │  │ - Makan food   │ │
│  └──────────────────┘  └────────────────┘ │
│                                            │
│  ┌────────────────────────────────────┐  │
│  │  Informasi Tambahan                │  │
│  │  - Semakin lama bermain...         │  │
│  └────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

### 4. Input Handling (Desktop)

```javascript
// Keyboard: Primary input method
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    // WASD controls (preferred)
    if (key === 'w') newDir = { x: 0, y: -1 };
    else if (key === 's') newDir = { x: 0, y: 1 };
    else if (key === 'a') newDir = { x: -1, y: 0 };
    else if (key === 'd') newDir = { x: 1, y: 0 };
    
    // Arrow keys (alternative)
    else if (e.key === 'ArrowUp') newDir = { x: 0, y: -1 };
    else if (e.key === 'ArrowDown') newDir = { x: 0, y: 1 };
    else if (e.key === 'ArrowLeft') newDir = { x: -1, y: 0 };
    else if (e.key === 'ArrowRight') newDir = { x: 1, y: 0 };
    
    if (newDir) {
        handleDirectionInput(newDir);
        e.preventDefault();
    }
});

// Mouse: Button clicks
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resumeBtn.addEventListener('click', resumeGame);
resetBtn.addEventListener('click', resetGame);
```

### 5. Interaction Flow (Desktop)

```
User Action          Response
────────────────────────────────────────
Press W              ✓ Change direction up
Press S              ✓ Change direction down
Press A              ✓ Change direction left
Press D              ✓ Change direction right
Press Arrow Keys     ✓ Alternative input
Click "Mulai Game"   ✓ Start game
Click "Pause"        ✓ Pause game
Click "Lanjut"       ✓ Resume game
Click "Reset"        ✓ Reset game
Mouse hover          ✓ Button feedback
```

---

## TABLET IMPLEMENTATION

### 1. Layout Configuration (600px - 1199px)

```html
<!-- Tablet: Flexible stacked layout -->
<div class="game-main">
    <div class="game-left">
        <canvas id="gameCanvas"></canvas>
    </div>
    
    <div class="game-right">
        <div class="game-controls">
            <!-- Buttons -->
        </div>
        <div class="game-instruction">
            <!-- Instructions -->
        </div>
    </div>
</div>

<!-- Mobile buttons (shown on tablet) -->
<div id="mobileControls" class="mobile-controls">
    <!-- Direction buttons -->
</div>
```

### 2. CSS untuk Tablet

```css
/* Tablet (600px - 767px) */
@media (min-width: 600px) and (max-width: 767px) {
    .container {
        padding: 20px;
        max-width: 100%;
    }

    .game-main {
        flex-direction: column;     /* Stacked */
        align-items: center;
        gap: 15px;
    }

    .game-left {
        width: 100%;
        max-width: 500px;
    }

    .game-right {
        width: 100%;
        max-width: 500px;
    }

    .mobile-controls {
        display: grid;              /* Show buttons */
        grid-template-columns: 1fr 1fr 1fr;
    }

    .info-desktop {
        display: inline;            /* Show instructions */
    }

    .info-mobile {
        display: none;
    }
}

/* Desktop Tablet (768px - 1199px) */
@media (min-width: 768px) and (max-width: 1199px) {
    .container {
        padding: 25px;
    }

    .game-main {
        flex-wrap: wrap;            /* Flexible */
    }

    .game-left {
        flex: 0 0 auto;
        max-width: 500px;
    }

    .game-right {
        min-width: 200px;
    }

    .mobile-controls {
        display: none;              /* Hide buttons */
    }

    .info-desktop {
        display: inline;
    }

    .info-mobile {
        display: none;
    }
}
```

### 3. Tablet User Experience

```
Landscape Mode:
┌──────────────────────────────────────┐
│ SNAKE GAME  Score: 0  Waktu: 00:00  │
├──────────────────────────────────────┤
│ ┌─────────────┐  ┌─────────────────┐ │
│ │   Canvas    │  │  Buttons/Info   │ │
│ │   400x400   │  │                 │ │
│ │             │  │  - Mulai Game   │ │
│ │             │  │  - Pause        │ │
│ │             │  │  - Lanjut       │ │
│ │             │  │  - Reset        │ │
│ │             │  │                 │ │
│ │             │  │  Cara Bermain:  │ │
│ │             │  │  - WASD untuk.. │ │
│ └─────────────┘  └─────────────────┘ │
│                                      │
│  ┌──────────────────────────────────┐│
│  │  Informasi Tambahan              ││
│  └──────────────────────────────────┘│
└──────────────────────────────────────┘

Portrait Mode:
┌──────────────────┐
│  SNAKE GAME      │
│ Score: 0 (00:00) │
├──────────────────┤
│ ┌──────────────┐ │
│ │    Canvas    │ │
│ │    350x350   │ │
│ │              │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │  Buttons     │ │
│ │ ┌──────────┐ │ │
│ │ │Mulai Game│ │ │
│ │ ├──────────┤ │ │
│ │ │Pause     │ │ │
│ │ ├──────────┤ │ │
│ │ │Lanjut    │ │ │
│ │ ├──────────┤ │ │
│ │ │Reset     │ │ │
│ │ └──────────┘ │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ Mobile Btns  │ │
│ │    ▲         │ │
│ │   ◀ ▶        │ │
│ │    ▼         │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │Instructions  │ │
│ └──────────────┘ │
└──────────────────┘
```

### 4. Input Handling (Tablet)

```javascript
// Keyboard: Still supported
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === 'w') newDir = { x: 0, y: -1 };
    else if (key === 's') newDir = { x: 0, y: 1 };
    else if (key === 'a') newDir = { x: -1, y: 0 };
    else if (key === 'd') newDir = { x: 1, y: 0 };
    
    if (newDir) handleDirectionInput(newDir);
});

// Touch buttons: Primary method
const mobileButtons = mobileControls.querySelectorAll('.mobile-btn');
mobileButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const dir = button.getAttribute('data-direction');
        const direction_map = {
            'up': { x: 0, y: -1 },
            'down': { x: 0, y: 1 },
            'left': { x: -1, y: 0 },
            'right': { x: 1, y: 0 }
        };
        handleDirectionInput(direction_map[dir]);
    });
    
    // Touch feedback
    button.addEventListener('touchstart', (e) => {
        button.style.transform = 'scale(0.95)';
        button.style.opacity = '0.8';
    });
    
    button.addEventListener('touchend', (e) => {
        button.style.transform = 'scale(1)';
        button.style.opacity = '1';
    });
});

// Swipe: Alternative input
let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 50) handleDirectionInput({ x: -1, y: 0 }); // Left
        else if (diffX < -50) handleDirectionInput({ x: 1, y: 0 }); // Right
    } else {
        // Vertical swipe
        if (diffY > 50) handleDirectionInput({ x: 0, y: -1 }); // Up
        else if (diffY < -50) handleDirectionInput({ x: 0, y: 1 }); // Down
    }
});
```

### 5. Interaction Flow (Tablet)

```
User Action          Response
────────────────────────────────────────
Touch Button ▲       ✓ Change direction up
Touch Button ◀       ✓ Change direction left
Touch Button ▶       ✓ Change direction right
Touch Button ▼       ✓ Change direction down
Swipe up             ✓ Change direction up
Swipe left           ✓ Change direction left
Swipe right          ✓ Change direction right
Swipe down           ✓ Change direction down
Press W/WASD         ✓ Change direction (keyboard)
Tap "Mulai Game"     ✓ Start game
Tap "Pause"          ✓ Pause game
Tap "Lanjut"         ✓ Resume game
Tap "Reset"          ✓ Reset game
```

---

## MOBILE IMPLEMENTATION

### 1. Layout Configuration (< 600px)

```html
<!-- Mobile: Fully stacked layout -->
<div class="game-header">
    <!-- Header dengan responsive fonts -->
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

<div class="game-main">
    <div class="game-left">
        <div class="game-board">
            <canvas id="gameCanvas"></canvas>
        </div>
        
        <!-- Mobile control buttons -->
        <div id="mobileControls" class="mobile-controls">
            <button class="mobile-btn mobile-btn-up" data-direction="up">▲</button>
            <div class="mobile-row">
                <button class="mobile-btn mobile-btn-left" data-direction="left">◀</button>
                <button class="mobile-btn mobile-btn-right" data-direction="right">▶</button>
            </div>
            <button class="mobile-btn mobile-btn-down" data-direction="down">▼</button>
        </div>
    </div>
    
    <div class="game-right">
        <!-- Game control buttons (stacked) -->
        <div class="game-controls">
            <button id="startBtn" class="btn btn-primary">Mulai Game</button>
            <button id="pauseBtn" class="btn btn-warning" disabled>Pause</button>
            <button id="resumeBtn" class="btn btn-success" disabled>Lanjut</button>
            <button id="resetBtn" class="btn btn-danger">Reset Game</button>
        </div>
        
        <!-- Instructions for mobile -->
        <div class="game-instruction">
            <p><strong>Cara Memainkannya:</strong></p>
            <ul>
                <li>
                    <span class="info-mobile">
                        Gunakan <strong>tombol arah</strong> di bawah layar
                    </span>
                </li>
                <li>Makan makanan merah (●) untuk +10 poin</li>
                <li>Jangan menabrak dinding atau tubuh sendiri!</li>
            </ul>
        </div>
    </div>
</div>

<div class="game-info">
    <!-- Additional information -->
</div>
```

### 2. CSS untuk Mobile

```css
/* Mobile Portrait (< 500px) */
@media (max-width: 499px) {
    body {
        padding: 5px;               /* Minimal padding */
    }

    .container {
        padding: 12px;              /* Compact padding */
        border-radius: 10px;
    }

    .game-header {
        margin-bottom: 15px;
    }

    .game-header h1 {
        font-size: 1.4em;           /* Responsive size */
        margin-bottom: 10px;
    }

    .game-stats {
        gap: 10px;                  /* Minimal gap */
        flex-direction: column;      /* Stack vertically */
        align-items: center;
    }

    .game-main {
        flex-direction: column;      /* Fully stacked */
        align-items: center;
        gap: 12px;
        margin-bottom: 15px;
    }

    .game-left {
        width: 100%;
        order: 1;
    }

    #gameCanvas {
        width: 100%;                /* Full width */
        border-width: 2px;          /* Thinner border */
        max-height: 60vh;           /* Max 60% viewport */
    }

    .game-right {
        width: 100%;
        order: 2;
        max-width: 100%;
        gap: 12px;
    }

    .game-controls {
        gap: 8px;
    }

    .btn {
        padding: 8px 12px;
        font-size: 0.75em;
        min-height: 40px;           /* Touch-friendly */
    }

    /* Mobile controls grid */
    .mobile-controls {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 6px;
        margin-top: 10px;
        max-width: 300px;
    }

    .mobile-btn {
        width: clamp(40px, 8vw, 50px);  /* Responsive size */
        height: clamp(40px, 8vw, 50px);
        font-size: 1em;
        min-height: 44px;                 /* Touch minimum */
    }

    .info-desktop {
        display: none;              /* Hide desktop info */
    }

    .info-mobile {
        display: inline;            /* Show mobile info */
    }

    .modal-content {
        padding: 20px 15px;
        margin: 15px;
        border-radius: 12px;
    }

    .modal-content h2 {
        font-size: 1.4em;
    }

    .modal-buttons {
        flex-direction: column;
        gap: 8px;
    }

    .modal-buttons .btn {
        width: 100%;
    }
}

/* Extra Small Devices (< 380px) */
@media (max-width: 379px) {
    .container {
        padding: 10px;
    }

    .game-header h1 {
        font-size: 1.2em;
        margin-bottom: 8px;
    }

    .game-stats {
        gap: 8px;
    }

    .stat {
        font-size: 0.8em;
    }

    .btn {
        padding: 6px 10px;
        font-size: 0.65em;
        min-height: 36px;
    }

    .mobile-btn {
        width: 40px;
        height: 40px;
        font-size: 0.9em;
    }

    .game-info {
        padding: 8px;
        font-size: 0.75em;
    }
}

/* Mobile Landscape (500px - 599px) */
@media (min-width: 500px) and (max-width: 599px) {
    .container {
        padding: 15px;
    }

    .game-header h1 {
        font-size: 1.6em;
    }

    #gameCanvas {
        width: 100%;
        max-height: 50vh;           /* Less height in landscape */
    }

    .mobile-controls {
        display: grid;
    }
}

/* Landscape Mode (height < 600px) */
@media (max-height: 600px) and (orientation: landscape) {
    .container {
        padding: 10px;
    }

    #gameCanvas {
        max-height: 80vh;
    }

    .game-info {
        padding: 8px;
        font-size: 0.8em;
    }
}
```

### 3. Mobile User Experience

```
Portrait (< 500px):
┌──────────────────┐
│  SNAKE GAME      │
│ Score: 0         │
│ Waktu: 00:00     │
├──────────────────┤
│ ┌──────────────┐ │
│ │              │ │
│ │   Canvas     │ │
│ │   300x300    │ │
│ │              │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │    ▲         │ │
│ │   ◀ ▶        │ │
│ │    ▼         │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ Mulai Game   │ │
│ │ Pause Resume │ │
│ │ Reset        │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ Instructions │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ More Info    │ │
│ └──────────────┘ │
└──────────────────┘

Landscape (> 600px):
┌─────────────────────────┐
│ SNAKE GAME              │
│ Score: 0  Waktu: 00:00  │
├─────────────────────────┤
│ ┌─────────────┐┌──────┐ │
│ │             ││Mulai │ │
│ │   Canvas    ││Pause │ │
│ │   300x300   ││Lanjut│ │
│ │             ││Reset │ │
│ │             │└──────┘ │
│ │             │┌──────┐ │
│ │             ││ ▲    │ │
│ │             ││◀ ▶   │ │
│ │             ││ ▼    │ │
│ └─────────────┘└──────┘ │
└─────────────────────────┘
```

### 4. Input Handling (Mobile)

```javascript
// Touch buttons: Primary method
const mobileButtons = mobileControls.querySelectorAll('.mobile-btn');
mobileButtons.forEach(button => {
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

    // Touch visual feedback
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        button.style.transform = 'scale(0.95)';  // Pressed effect
        button.style.opacity = '0.8';
    }, { passive: false });

    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        button.style.transform = 'scale(1)';    // Released effect
        button.style.opacity = '1';
        
        // Execute direction change
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
});

// Swipe controls
let touchStartX = 0, touchStartY = 0;
const SWIPE_THRESHOLD = 50;  // 50px minimum

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
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

// Keyboard (minimal - for Android soft keyboard if present)
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === 'w') handleDirectionInput({ x: 0, y: -1 });
    else if (key === 's') handleDirectionInput({ x: 0, y: 1 });
    else if (key === 'a') handleDirectionInput({ x: -1, y: 0 });
    else if (key === 'd') handleDirectionInput({ x: 1, y: 0 });
});
```

### 5. Interaction Flow (Mobile)

```
User Action              Response
────────────────────────────────────────
Tap Button ▲             ✓ Direction up
Tap Button ◀             ✓ Direction left
Tap Button ▶             ✓ Direction right
Tap Button ▼             ✓ Direction down
Swipe UP                 ✓ Direction up
Swipe DOWN               ✓ Direction down
Swipe LEFT               ✓ Direction left
Swipe RIGHT              ✓ Direction right
Tap "Mulai Game"         ✓ Start game
Tap "Pause"              ✓ Pause game
Tap "Lanjut"             ✓ Resume game
Tap "Reset"              ✓ Reset game
Rotate device            ✓ Recalculate canvas
Swipe to hide navbar     ✓ Immersive mode
Double tap               ✗ Prevented
Pinch zoom               ✓ Supported
```

---

## RESPONSIVE CSS BREAKDOWN

### 1. Font Scaling dengan clamp()

```css
/* Title */
font-size: clamp(1.5em, 5vw, 2.5em);

Viewport  │ Calculation │ Result
──────────┼─────────────┼──────────
320px     │ 5% = 16px   │ 1.5em (min) ✅
500px     │ 5% = 25px   │ 2.5em (max) ✅
800px     │ 5% = 40px   │ 2.5em (max) ✅

/* Buttons */
font-size: clamp(0.8em, 1.5vw, 1em);

Viewport  │ Calculation │ Result
──────────┼─────────────┼──────────
320px     │ 1.5% = 4.8  │ 0.8em (min) ✅
600px     │ 1.5% = 9px  │ 9px ✅
1000px    │ 1.5% = 15px │ 1em (max) ✅

/* Padding */
padding: clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px);

Viewport  │ Horizontal  │ Vertical
──────────┼─────────────┼────────────
320px     │ 16px        │ 10px (min)
500px     │ ~26px       │ ~25px
1000px    │ 24px (max)  │ 12px (max)
```

### 2. Flex Layout Responsive

```css
.game-main {
    display: flex;
    gap: clamp(15px, 3vw, 30px);
    flex-wrap: wrap;
    align-items: flex-start;
}

/* Desktop: Side-by-side */
.game-main {
    flex-wrap: nowrap;
    gap: 30px;
}
Layout: [Canvas ──30px gap── Buttons]

/* Tablet: Flexible */
.game-main {
    flex-wrap: wrap;
    gap: 15px;
}
Layout: [Canvas]
        [Buttons]

/* Mobile: Stacked */
.game-main {
    flex-direction: column;
    gap: 12px;
}
Layout: [Canvas]
        [Buttons]
        [Mobile Controls]
```

### 3. Canvas Responsive

```css
#gameCanvas {
    max-width: 100%;
    height: auto;
    display: block;
}

Desktop:
- setupCanvas(): max 500px
- CANVAS.width = 500
- CANVAS.height = 500

Tablet:
- setupCanvas(): min(500, window.innerWidth - 40)
- CANVAS.width = ~440-480px
- CANVAS.height = ~440-480px

Mobile:
- setupCanvas(): window.innerWidth - 40
- CANVAS.width = 280-360px
- CANVAS.height = 280-360px (square)
```

### 4. Grid Layout (Mobile Buttons)

```css
.mobile-controls {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: clamp(6px, 2vw, 10px);
}

.mobile-btn-up {
    grid-column: 2;  /* Center */
}

.mobile-row {
    grid-column: 1 / -1;  /* Full width */
    display: flex;
    justify-content: center;
}

Visual:
┌───┬─────┬───┐
│   │  ▲  │   │  Row 1
├───┼─────┼───┤
│ ◀ │     │ ▶ │  Row 2
├───┼─────┼───┤
│   │  ▼  │   │  Row 3
└───┴─────┴───┘
```

---

## EVENT HANDLING PER DEVICE

### Device Detection

```javascript
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
        .test(navigator.userAgent);
}

function isMobileViewport() {
    return window.innerWidth < 768;
}

function isTablet() {
    const width = window.innerWidth;
    return (width >= 600 && width <= 1000);
}

// Usage
if (isMobileDevice() || isMobileViewport()) {
    showMobileControls();
} else {
    hideMobileControls();
}
```

### Event Priority

```
Desktop:
1. Keyboard (WASD) ← Primary
2. Arrow Keys      ← Alternative
3. Mouse clicks    ← Secondary

Tablet:
1. Touch buttons   ← Primary
2. Swipe gestures  ← Secondary
3. Keyboard        ← Tertiary

Mobile:
1. Touch buttons   ← Primary
2. Swipe gestures  ← Secondary
3. Keyboard        ← Minimal
```

### Prevent Unwanted Behaviors

```javascript
// Prevent context menu (right-click)
CANVAS.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();  // Prevent zoom
    }
    lastTouchEnd = now;
}, { passive: false });

// Prevent multi-touch zoom
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();  // Prevent pinch
    }
}, { passive: false });

// Auto-pause on tab hide
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (gameState.isRunning && !gameState.isPaused) {
            pauseGame();
        }
    }
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        CANVAS_SIZE = setupCanvas();
        GRID_SIZE = Math.floor(CANVAS_SIZE / TILE_COUNT);
        draw();
        showMobileControls();
    }, 100);
});
```

---

**Device Specific Implementation Complete!** ✅

Semua detail untuk Desktop, Tablet, dan Mobile sudah dijelaskan dengan lengkap.
