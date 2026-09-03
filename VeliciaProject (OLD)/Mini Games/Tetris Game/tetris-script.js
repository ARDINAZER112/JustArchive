const COLS = 10, ROWS = 20;
const PIECES = [
  { shape: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], color: '#00f5ff' },
  { shape: [[1,1],[1,1]],                              color: '#ffe600' },
  { shape: [[0,1,0],[1,1,1],[0,0,0]],                  color: '#cc44ff' },
  { shape: [[0,1,1],[1,1,0],[0,0,0]],                  color: '#aaff00' },
  { shape: [[1,1,0],[0,1,1],[0,0,0]],                  color: '#ff3300' },
  { shape: [[1,0,0],[1,1,1],[0,0,0]],                  color: '#4488ff' },
  { shape: [[0,0,1],[1,1,1],[0,0,0]],                  color: '#ff8800' },
];

const canvas     = document.getElementById('game-canvas');
const ctx        = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const nCtx       = nextCanvas.getContext('2d');
const overlay    = document.getElementById('overlay');
const oTitle     = document.getElementById('overlay-title');
const oSub       = document.getElementById('overlay-sub');
const startBtn   = document.getElementById('start-btn');
const pauseLabel = document.getElementById('pause-label');

let BLOCK = 28;
let board, piece, nextPiece, score, level, lines, gameRunning, paused, dropInterval, dropTimer, animFrame, lastTime;
let bestScore = parseInt(localStorage.getItem('tetris_best') || '0');
document.getElementById('best').textContent = bestScore;

// ===== LAYOUT =====
function computeLayout() {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const isMobile = W < 700 || ('ontouchstart' in window && W < 1024);

  // Title
  const titleEl = document.getElementById('title');
  const titleFS = isMobile ? Math.max(13, Math.min(20, W * 0.042)) : Math.min(24, W * 0.022);
  const titleMT = Math.round(H * 0.012);
  const titleMB = Math.round(H * 0.01);
  titleEl.style.cssText = `font-size:${titleFS}px;margin-top:${titleMT}px;margin-bottom:${titleMB}px`;

  // Mobile controls area height
  const mobH = isMobile ? Math.min(185, H * 0.27) : 0;

  // KB info
  const kbEl = document.getElementById('kb-info');
  if (isMobile) {
    kbEl.style.display = 'none';
  } else {
    const kbFS = Math.max(7, Math.min(9, W * 0.007));
    kbEl.style.cssText = `display:grid;font-size:${kbFS}px;gap:6px 0;margin-left:-120px;margin-bottom:250px;align-self:center`;
  }

  // Available height for board
  const titleH = titleFS + titleMT + titleMB + 4;
  const kbH    = isMobile ? 0 : 50;
  const availH = H - titleH - mobH - kbH - 8;
  const availW = W;

  // Compute BLOCK
BLOCK = Math.floor(Math.min((availH * 1.12) / ROWS, (availW * 0.65) / COLS));
BLOCK = Math.max(14, Math.min(38, BLOCK));

  const boardW = BLOCK * COLS;
  const boardH = BLOCK * ROWS;

  canvas.width  = boardW;
  canvas.height = boardH;
  canvas.style.cssText = `width:${boardW}px;height:${boardH}px`;

  const remainW = availW - boardW;
  const panelW  = Math.max(55, Math.min(120, remainW / 2 - 12));
  const gap     = Math.max(3, Math.min(10, (remainW - panelW * 2) / 4));
  const panelFS = Math.max(5.5, Math.min(10, panelW * 0.09));
  const panelVS = Math.max(8,   Math.min(15, panelW * 0.14));
  const panelPad= Math.max(4,   Math.min(9,  panelW * 0.08));
  const panelGap= Math.max(4,   Math.min(8,  boardH * 0.012));

  const gameArea = document.getElementById('game-area');
  gameArea.style.cssText = `gap:${gap}px;padding-left:${gap}px;padding-right:${gap}px;display:flex;align-items:flex-start;justify-content:center;flex:1;width:100%;min-height:0`;

  ['left-panel','right-panel'].forEach(id => {
    const el = document.getElementById(id);
    el.style.cssText = `width:${panelW}px;gap:${panelGap}px;display:flex;flex-direction:column;flex-shrink:0`;
  });

  document.querySelectorAll('.panel-box').forEach(pb => { pb.style.padding = panelPad + 'px'; });
  document.querySelectorAll('.panel-label').forEach(el => { el.style.cssText = `font-size:${panelFS}px;margin-bottom:3px`; });
  document.querySelectorAll('.panel-value').forEach(el => { el.style.fontSize = panelVS + 'px'; });

  // Next canvas inside right panel
  const nb  = Math.max(10, Math.min(20, panelW * 0.22));
  const ncW = Math.round(nb * 5), ncH = Math.round(nb * 4);
  nextCanvas.width = ncW; nextCanvas.height = ncH;
  nextCanvas.style.cssText = `width:${ncW}px;height:${ncH}px`;

  // Overlay fonts
  oTitle.style.fontSize = Math.max(9, Math.min(15, boardW * 0.042)) + 'px';
  oSub.style.fontSize   = Math.max(6, Math.min(9,  boardW * 0.028)) + 'px';
  startBtn.style.fontSize = Math.max(7, Math.min(11, boardW * 0.034)) + 'px';

  buildMobControls(mobH, isMobile);
}

function buildMobControls(totalH, show) {
  const mc = document.getElementById('mob-controls');
  if (!show || totalH < 40) { mc.style.display = 'none'; return; }
  mc.style.display = 'flex';

  const btnSize = Math.max(44, Math.min(65, totalH * 0.36));
  const fontSize= Math.max(8,  Math.min(13, btnSize * 0.24));
  const rowGap  = Math.max(4,  Math.min(8,  btnSize * 0.1));
  const colGap  = Math.max(4,  Math.min(8,  btnSize * 0.1));

  mc.style.cssText = `flex-shrink:0;display:flex;flex-direction:column;align-items:center;width:100%;gap:${rowGap}px;padding-top:${rowGap}px;padding-bottom:${rowGap}px`;
  ['mob-row-top','mob-row-mid','mob-row-bot'].forEach(id => {
    document.getElementById(id).style.gap = colGap + 'px';
  });
  document.querySelectorAll('.mob-btn').forEach(b => {
    b.style.cssText = `width:${btnSize}px;height:${btnSize}px;font-size:${fontSize}px;border-radius:${Math.round(btnSize*0.15)}px`;
  });
}

// Build D-pad
(function() {
  const rows = {
    'mob-row-top': [{ id:'mob-rotate', label:'↑',  action:'rotate' }],
    'mob-row-mid': [
      { id:'mob-left',  label:'←', action:'left'  },
      { id:'mob-down',  label:'↓', action:'down'  },
      { id:'mob-right', label:'→', action:'right' }
    ],
    'mob-row-bot': [{ id:'mob-drop', label:'▼▼', action:'drop' }],
  };
  for (const [rowId, btns] of Object.entries(rows)) {
    const row = document.getElementById(rowId);
    btns.forEach(({ id, label, action }) => {
      const b = document.createElement('div');
      b.className = 'mob-btn'; b.id = id;
      b.textContent = label; b.dataset.action = action;
      row.appendChild(b);
    });
  }
})();

// ===== GAME =====
function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function randomPiece() {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)];
  return {
    shape: p.shape.map(r => [...r]),
    color: p.color,
    x: Math.floor(COLS / 2) - Math.floor(p.shape[0].length / 2),
    y: 0
  };
}

function startGame() {
  board = createBoard();
  score = 0; level = 1; lines = 0;
  piece = randomPiece();
  nextPiece = randomPiece();
  gameRunning = true; paused = false;
  overlay.classList.add('hidden');
  pauseLabel.style.display = 'none';
  dropInterval = 800;
  dropTimer = 0; lastTime = 0;
  cancelAnimationFrame(animFrame);
  updateHUD(); drawNextPiece();
  animFrame = requestAnimationFrame(loop);
}
startBtn.addEventListener('click', startGame);
startBtn.addEventListener('touchend', e => { e.preventDefault(); startGame(); });

function loop(ts) {
  if (!gameRunning) return;
  const dt = lastTime ? ts - lastTime : 0;
  lastTime = ts;
  if (!paused) {
    dropTimer += dt;
    if (dropTimer >= dropInterval) { dropTimer = 0; moveDown(); }
    draw();
  }
  animFrame = requestAnimationFrame(loop);
}

// ===== DRAW =====
function drawBlock(context, x, y, color, bs) {
  const px = x * bs, py = y * bs;
  const m = 1, s = Math.max(3, Math.floor(bs * 0.12));
  context.fillStyle = color;
  context.fillRect(px + m, py + m, bs - m * 2, bs - m * 2);
  context.fillStyle = 'rgba(255,255,255,0.22)';
  context.fillRect(px + m, py + m, bs - m * 2, s);
  context.fillRect(px + m, py + m, s, bs - m * 2);
  context.fillStyle = 'rgba(0,0,0,0.28)';
  context.fillRect(px + m, py + bs - s - m, bs - m * 2, s);
  context.fillRect(px + bs - s - m, py + m, s, bs - m * 2);
  context.strokeStyle = color;
  context.globalAlpha = 0.35;
  context.lineWidth = 0.8;
  context.strokeRect(px, py, bs, bs);
  context.globalAlpha = 1;
}

function draw() {
  ctx.fillStyle = '#06060e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(0,245,255,0.05)';
  ctx.lineWidth = 0.5;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      ctx.strokeRect(c * BLOCK, r * BLOCK, BLOCK, BLOCK);
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (board[r][c]) drawBlock(ctx, c, r, board[r][c], BLOCK);
  drawGhost();
  if (piece)
    piece.shape.forEach((row, dr) =>
      row.forEach((val, dc) => { if (val) drawBlock(ctx, piece.x + dc, piece.y + dr, piece.color, BLOCK); })
    );
}

function drawGhost() {
  if (!piece) return;
  const ghost = { ...piece, shape: piece.shape.map(r => [...r]) };
  while (canMove(ghost, 0, 1)) ghost.y++;
  if (ghost.y === piece.y) return;
  ghost.shape.forEach((row, dr) =>
    row.forEach((val, dc) => {
      if (!val) return;
      const px = (ghost.x + dc) * BLOCK, py = (ghost.y + dr) * BLOCK;
      ctx.strokeStyle = piece.color;
      ctx.globalAlpha = 0.22;
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 1, py + 1, BLOCK - 2, BLOCK - 2);
      ctx.globalAlpha = 1;
    })
  );
}

function drawNextPiece() {
  const nW = nextCanvas.width, nH = nextCanvas.height;
  nCtx.fillStyle = '#06060e';
  nCtx.fillRect(0, 0, nW, nH);
  if (!nextPiece) return;
  const nb  = Math.floor(Math.min(nW / 5, nH / 4));
  const offX = Math.floor((nW - nextPiece.shape[0].length * nb) / 2 / nb);
  const offY = Math.floor((nH - nextPiece.shape.length * nb) / 2 / nb);
  nextPiece.shape.forEach((row, dr) =>
    row.forEach((val, dc) => { if (val) drawBlock(nCtx, offX + dc, offY + dr, nextPiece.color, nb); })
  );
}

// ===== LOGIC =====
function canMove(p, dx, dy, shape) {
  shape = shape || p.shape;
  return shape.every((row, dr) =>
    row.every((val, dc) => {
      if (!val) return true;
      const nx = p.x + dc + dx, ny = p.y + dr + dy;
      return nx >= 0 && nx < COLS && ny < ROWS && (ny < 0 || !board[ny][nx]);
    })
  );
}

function moveDown() {
  if (canMove(piece, 0, 1)) piece.y++;
  else lock();
}

function lock() {
  piece.shape.forEach((row, dr) =>
    row.forEach((val, dc) => {
      if (val && piece.y + dr >= 0) board[piece.y + dr][piece.x + dc] = piece.color;
    })
  );
  clearLines();
  piece = nextPiece;
  nextPiece = randomPiece();
  drawNextPiece();
  if (!canMove(piece, 0, 0)) gameOver();
}

function clearLines() {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(c => c !== 0)) {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(0));
      cleared++; r++;
    }
  }
  if (cleared > 0) {
    score += ([0,100,300,500,800][cleared] || 800) * level;
    lines += cleared;
    level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(80, 800 - (level - 1) * 70);
    updateHUD();
  }
}

function updateHUD() {
  document.getElementById('score').textContent = score;
  document.getElementById('level').textContent = level;
  document.getElementById('lines').textContent = lines;
  document.getElementById('level-bar').style.width = ((lines % 10) / 10 * 100) + '%';
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('tetris_best', bestScore);
    document.getElementById('best').textContent = bestScore;
  }
}

function rotate() {
  const rot = piece.shape[0].map((_, i) => piece.shape.map(r => r[i]).reverse());
  for (const k of [0, 1, -1, 2, -2])
    if (canMove(piece, k, 0, rot)) { piece.shape = rot; piece.x += k; return; }
}

function hardDrop() {
  let d = 0;
  while (canMove(piece, 0, 1)) { piece.y++; d++; }
  score += d * 2;
  lock(); updateHUD();
}

function gameOver() {
  gameRunning = false;
  cancelAnimationFrame(animFrame);
  oTitle.textContent = 'GAME OVER';
  oSub.textContent = 'SKOR: ' + score;
  startBtn.textContent = 'MAIN LAGI';
  overlay.classList.remove('hidden');
}

function togglePause() {
  if (!gameRunning) return;
  paused = !paused;
  pauseLabel.style.display = paused ? 'block' : 'none';
  if (!paused) lastTime = performance.now();
}

// ===== KEYBOARD =====
document.addEventListener('keydown', e => {
  if (!gameRunning) return;
  if (e.code === 'KeyP') { togglePause(); return; }
  if (e.code === 'KeyR') { startGame(); return; }
  if (paused) return;
  if (['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Space'].includes(e.code)) e.preventDefault();
  switch (e.code) {
    case 'ArrowLeft':  if (canMove(piece,-1,0)) piece.x--; break;
    case 'KeyA':  if (canMove(piece,-1,0)) piece.x--; break;
    case 'ArrowRight': if (canMove(piece, 1,0)) piece.x++; break;
    case 'KeyD': if (canMove(piece, 1,0)) piece.x++; break;
    case 'ArrowDown':  moveDown(); score++; updateHUD(); break;
    case 'KeyS':  moveDown(); score++; updateHUD(); break;
    case 'ArrowUp':    rotate(); break;
    case 'KeyW':    rotate(); break;
    case 'Space':      hardDrop(); break;
  }
});

// ===== MOBILE BUTTONS (with repeat) =====
const actionFns = {
  left:   () => { if (gameRunning && !paused && canMove(piece,-1,0)) piece.x--; },
  right:  () => { if (gameRunning && !paused && canMove(piece, 1,0)) piece.x++; },
  down:   () => { if (gameRunning && !paused) { moveDown(); score++; updateHUD(); } },
  rotate: () => { if (gameRunning && !paused) rotate(); },
  drop:   () => { if (gameRunning && !paused) hardDrop(); },
};
const repeatTOs = {}, repeatIVs = {};

function startRepeat(action) {
  const fn = actionFns[action];
  fn();
  repeatTOs[action] = setTimeout(() => {
    repeatIVs[action] = setInterval(fn, 75);
  }, 210);
}
function stopRepeat(action) {
  clearTimeout(repeatTOs[action]);
  clearInterval(repeatIVs[action]);
}

document.querySelectorAll('.mob-btn').forEach(btn => {
  const action = btn.dataset.action;
  const repeatable = ['left','right','down'].includes(action);

  btn.addEventListener('touchstart', e => {
    e.preventDefault();
    btn.classList.add('pressed');
    if (repeatable) startRepeat(action);
    else actionFns[action]();
  }, { passive: false });

  btn.addEventListener('touchend', e => {
    e.preventDefault();
    btn.classList.remove('pressed');
    if (repeatable) stopRepeat(action);
  }, { passive: false });

  btn.addEventListener('touchcancel', e => {
    btn.classList.remove('pressed');
    if (repeatable) stopRepeat(action);
  }, { passive: false });

  btn.addEventListener('mousedown', () => {
    btn.classList.add('pressed');
    if (repeatable) startRepeat(action);
    else actionFns[action]();
  });
});

window.addEventListener('mouseup', () => {
  document.querySelectorAll('.mob-btn').forEach(b => {
    b.classList.remove('pressed');
    stopRepeat(b.dataset.action);
  });
});

// ===== SWIPE on canvas =====
let touchStart = null;
canvas.addEventListener('touchstart', e => {
  touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
}, { passive: true });
canvas.addEventListener('touchend', e => {
  if (!touchStart || !gameRunning || paused) return;
  const dx = e.changedTouches[0].clientX - touchStart.x;
  const dy = e.changedTouches[0].clientY - touchStart.y;
  const dt = Date.now() - touchStart.t;
  const adx = Math.abs(dx), ady = Math.abs(dy);
  if (adx < 12 && ady < 12 && dt < 250) { rotate(); return; }
  if (adx > ady) {
    if (adx > 25) { if (dx > 0) { if (canMove(piece,1,0)) piece.x++; } else { if (canMove(piece,-1,0)) piece.x--; } }
  } else {
    if (dy > 50) hardDrop();
  }
}, { passive: true });

// ===== RESIZE =====
let resizeTO;
function onResize() {
  clearTimeout(resizeTO);
  resizeTO = setTimeout(() => {
    computeLayout();
    drawNextPiece();
    if (!gameRunning) draw();
  }, 120);
}
window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', () => setTimeout(onResize, 350));

// Init
computeLayout();
drawNextPiece();
draw();
