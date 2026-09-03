// ========== KEYBOARD CONTROLS - HYBRID VERSION ==========
// Support WASD dan Arrow Keys (untuk backward compatibility)
// W = Atas, S = Bawah, A = Kiri, D = Kanan
// ↑ ↓ ← → = juga support

document.addEventListener('keydown', (e) => {
    if (!gameState.isRunning || gameState.isPaused) return;

    const key = e.key.toLowerCase();
    let newDir = null;

    // ========== WASD CONTROLS ==========
    if (key === 'w') {
        newDir = { x: 0, y: -1 };  // Atas
    } else if (key === 's') {
        newDir = { x: 0, y: 1 };   // Bawah
    } else if (key === 'a') {
        newDir = { x: -1, y: 0 };  // Kiri
    } else if (key === 'd') {
        newDir = { x: 1, y: 0 };   // Kanan
    }

    // ========== ARROW KEYS CONTROLS (Backward Compatibility) ==========
    else if (e.key === 'ArrowUp') {
        newDir = { x: 0, y: -1 };  // Atas
    } else if (e.key === 'ArrowDown') {
        newDir = { x: 0, y: 1 };   // Bawah
    } else if (e.key === 'ArrowLeft') {
        newDir = { x: -1, y: 0 };  // Kiri
    } else if (e.key === 'ArrowRight') {
        newDir = { x: 1, y: 0 };   // Kanan
    }

    // ========== APPLY DIRECTION CHANGE ==========
    if (newDir) {
        // Prevent 180° turn (can't go directly opposite)
        if ((newDir.x !== 0 && direction.x === 0) || 
            (newDir.y !== 0 && direction.y === 0)) {
            nextDirection = newDir;
        }
        e.preventDefault();
    }
});
