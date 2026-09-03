# 🍎 FRUIT DROPPER - SISTEM CUSTOM BACKGROUND

## Daftar Isi
1. [Ringkasan](#ringkasan)
2. [Fitur-Fitur Utama](#fitur-fitur-utama)
3. [Panduan Penggunaan](#panduan-penggunaan)
4. [Perbaikan Teknis](#perbaikan-teknis)
5. [Kompatibilitas Device](#kompatibilitas-device)
6. [Troubleshooting](#troubleshooting)

---

## Ringkasan

Dokumentasi ini menjelaskan sistem Custom Background Color yang telah diperbaiki untuk Fruit Dropper Game. Sistem ini memungkinkan pemain memilih warna latar belakang kanvas permainan dengan dua metode:

1. **Color Presets** - Pemilihan warna cepat dari 8 pilihan preset yang telah dioptimalkan
2. **Custom Color Picker** - Input warna custom menggunakan color picker atau kode HEX

Sistem ini dirancang untuk bekerja sempurna di semua perangkat dari mobile hingga desktop.

---

## Fitur-Fitur Utama

### 1. Color Presets (8 Pilihan)

Sistem menyediakan 8 warna preset yang telah dipilih dengan cermat:

| No. | Nama | Hex Code | Deskripsi |
|-----|------|----------|-----------|
| 1 | Dark Gray | `#2d3436` | Warna default, gelap dan netral |
| 2 | Deep Blue | `#1a237e` | Biru gelap, profesional |
| 3 | Deep Purple | `#4a148c` | Ungu gelap, elegan |
| 4 | Dark Green | `#1b5e20` | Hijau gelap, alami |
| 5 | Dark Red | `#b71c1c` | Merah gelap, intens |
| 6 | Navy | `#0d47a1` | Navy biru, klasik |
| 7 | Dark Teal | `#004d40` | Teal gelap, modern |
| 8 | Charcoal | `#212121` | Abu-abu gelap, minimalis |

**Keuntungan Preset:**
- ✅ Pemilihan cepat dengan sekali klik
- ✅ Visual preview langsung
- ✅ Kombinasi warna yang harmonis dengan elemen UI
- ✅ Responsif di semua ukuran layar
- ✅ Indikator "✓" yang jelas saat dipilih

### 2. Custom Color Picker

Sistem custom color picker menyediakan dua input:

#### a. Color Input HTML5
- Menggunakan native HTML5 color picker
- Tampil berbeda di setiap platform (sistem native)
- Sinkronisasi otomatis dengan HEX input
- Ukuran responsif: 50px × 40px

#### b. HEX Color Input
- Menerima input manual kode HEX (contoh: `#FF5733`)
- Validasi format otomatis (hanya menerima `#RRGGBB`)
- Konversi otomatis ke huruf besar (uppercase)
- Sinkronisasi otomatis dengan color picker

**Fitur Validation:**
```javascript
// Menerima format: #RRGGBB
/^#[0-9A-F]{6}$/i.test(value)  // Case-insensitive

// Contoh valid: #2d3436, #FF5733, #FFFFFF
// Contoh invalid: #2d3, FF5733, #gggggg
```

### 3. Sinkronisasi Real-Time

Ketiga elemen (Preset, Color Picker, HEX Input) tersinkronisasi otomatis:

```
User Action → Update Hex Input → Update Color Picker → 
Update Preset → Update Canvas Background
```

---

## Panduan Penggunaan

### Untuk Pemain

#### 1. **Memilih Warna Preset**
```
1. Buka menu utama game
2. Temukan bagian "Background Color - Presets"
3. Klik salah satu warna kotak yang tersedia
4. Kotak akan menampilkan checkmark (✓) saat dipilih
5. Warna canvas akan berubah otomatis
```

#### 2. **Memilih Warna Custom dengan Color Picker**
```
1. Klik tombol input warna (kotak berwarna)
2. Pilih warna dari native color picker
3. Warna akan tersinkronisasi otomatis ke:
   - HEX input (#RRGGBB format)
   - Preset akan hilang (custom selected)
4. Klik "PLAY" untuk mulai dengan warna pilihan
```

#### 3. **Memasukkan Kode HEX Manual**
```
1. Fokus pada HEX input field
2. Hapus teks sebelumnya (Ctrl+A → Delete)
3. Ketik kode HEX (contoh: #FF5733)
4. Tekan Tab/Enter untuk validasi
5. Jika format benar, warna akan berubah
6. Jika format salah, akan kembali ke warna sebelumnya
```

**Contoh Kode HEX Popular:**

| Warna | Kode | Penggunaan |
|-------|------|-----------|
| Hitam | `#000000` | Ultra gelap |
| Putih | `#FFFFFF` | Terang (tidak recommended) |
| Merah | `#FF0000` | Vibrant merah |
| Hijau | `#00FF00` | Vibrant hijau |
| Biru | `#0000FF` | Vibrant biru |
| Oranye | `#FFA500` | Oranye cerah |
| Pink | `#FF69B4` | Hot pink |

---

## Perbaikan Teknis

### 1. Struktur HTML yang Diperbaiki

**Sebelum (Tidak Optimal):**
```html
<!-- Old Structure -->
<div class="color-picker-container">
    <input type="color" id="bgColor" class="color-input" value="#2d3436">
    <span class="color-label">Custom Background</span>
</div>
```

**Sesudah (Optimal):**
```html
<!-- New Structure -->
<div class="color-picker-section">
    <!-- Presets Section -->
    <label class="menu-label">Background Color - Presets</label>
    <div class="color-presets" id="colorPresets"></div>

    <!-- Custom Section -->
    <label class="menu-label">Custom Color</label>
    <div class="color-custom-wrapper">
        <div class="color-input-group">
            <input type="color" id="bgColorPicker" class="color-input">
            <input type="text" id="bgColorHex" class="color-hex-input" placeholder="#2d3436">
        </div>
    </div>
</div>
```

**Keuntungan:**
- ✅ Struktur lebih terorganisir
- ✅ Mudah dimaintain dan diperluas
- ✅ Label lebih jelas untuk setiap bagian
- ✅ Pemisahan visual antara preset dan custom

### 2. Logic JavaScript yang Diperbaiki

#### A. Inisialisasi Color Presets
```javascript
function initializeColorPresets() {
    colorPresetsContainer.innerHTML = '';
    COLOR_PRESETS.forEach((preset, index) => {
        const button = document.createElement('button');
        button.className = 'color-preset' + 
            (preset.color === gameState.backgroundColor ? ' active' : '');
        button.style.backgroundColor = preset.color;
        button.title = preset.name;
        button.addEventListener('click', () => selectColorPreset(preset.color, button));
        colorPresetsContainer.appendChild(button);
    });
}
```

**Fitur:**
- Pembuatan button dinamis dari array preset
- Automatic styling berdasarkan state
- Tooltip nama warna saat hover
- Event listener untuk setiap tombol preset

#### B. Sinkronisasi Color Picker
```javascript
bgColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    gameState.backgroundColor = color;
    bgColorHex.value = color.toUpperCase();
    // Hapus active class dari semua preset
    document.querySelectorAll('.color-preset')
        .forEach(btn => btn.classList.remove('active'));
});
```

**Fitur:**
- Update immediate saat user drag color wheel
- Konversi otomatis ke uppercase
- Visual feedback clear dari preset

#### C. Validasi HEX Input
```javascript
bgColorHex.addEventListener('blur', (e) => {
    let value = e.target.value.trim();
    if (!value.startsWith('#')) {
        value = '#' + value;
    }
    if (!/^#[0-9A-F]{6}$/i.test(value)) {
        value = gameState.backgroundColor; // Revert jika invalid
    }
    gameState.backgroundColor = value;
    bgColorPicker.value = value;
    bgColorHex.value = value.toUpperCase();
});
```

**Fitur:**
- Validasi saat meninggalkan field (blur)
- Auto-add `#` jika user lupa
- Revert ke warna sebelumnya jika format invalid
- Case-insensitive validation
- Uppercase display

### 3. CSS Styling yang Responsive

#### Grid Layout untuk Presets
```css
.color-presets {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(45px, 1fr));
    gap: 8px;
    width: 100%;
}

@media (max-width: 480px) {
    .color-presets {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (min-width: 769px) {
    .color-presets {
        grid-template-columns: repeat(6, 1fr);
    }
}
```

**Responsive Behavior:**
- Mobile (< 480px): 4 kolom
- Tablet (481px - 768px): 5 kolom (auto-fit)
- Desktop (> 769px): 6 kolom

#### Color Preset Button State

```css
/* Default State */
.color-preset {
    border: 3px solid var(--secondary-color);
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Hover State */
.color-preset:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 15px rgba(78, 205, 196, 0.6);
}

/* Active State */
.color-preset.active {
    border-color: var(--accent-color);
    box-shadow: 0 0 20px rgba(255, 230, 109, 0.8);
    transform: scale(1.05);
}

/* Checkmark Indicator */
.color-preset::after {
    content: '✓';
    opacity: 0;
    transition: opacity 0.3s ease;
}

.color-preset.active::after {
    opacity: 1;
}
```

**Visual Feedback:**
- Border color change (secondary → accent)
- Box shadow glow effect
- Slight scale up animation
- Checkmark appearance

---

## Kompatibilitas Device

### 1. Mobile Devices (320px - 480px)

**Karakteristik:**
- Portrait orientation primary
- Touch-based interaction
- Limited horizontal space
- Screen height varies (< 900px)

**Optimisasi:**
```css
@media (max-width: 480px) {
    .color-presets {
        grid-template-columns: repeat(4, 1fr);
    }
    
    .menu-section {
        max-width: none;  /* Full width */
    }
    
    .color-input {
        width: 50px;
        height: 40px;
    }
}

/* Touch Device Interaction */
@media (hover: none) and (pointer: coarse) {
    .color-preset:active {
        transform: scale(0.95);  /* Haptic feedback visual */
    }
}
```

**Testing Devices:**
- iPhone SE (375px)
- iPhone 12/13 (390px)
- Samsung Galaxy A50 (360px)
- Pixel 5a (432px)

### 2. Tablet Devices (481px - 768px)

**Karakteristik:**
- Landscape dan portrait support
- Mid-range screen size
- Touch dan stylus input

**Optimisasi:**
```css
@media (min-width: 481px) and (max-width: 768px) {
    :root {
        --game-width: 380px;
        --game-height: 570px;
    }
    
    .color-presets {
        grid-template-columns: repeat(5, 1fr);
    }
}
```

**Testing Devices:**
- iPad Mini (768px)
- Galaxy Tab S6 (712px)

### 3. Desktop Devices (769px+)

**Karakteristik:**
- Large screen space
- Mouse/trackpad input
- Landscape primary

**Optimisasi:**
```css
@media (min-width: 769px) {
    .color-presets {
        grid-template-columns: repeat(6, 1fr);
    }
    
    .menu {
        padding: 30px;
        gap: 20px;
    }
}

@media (min-width: 1600px) {
    .game-container {
        width: 450px;
        height: 680px;
    }
}
```

**Testing Devices:**
- Desktop 1920x1080 (Full HD)
- Desktop 2560x1440 (2K)
- Desktop 3840x2160 (4K)

### 4. Landscape Mode (Height < 500px)

**Karakteristik:**
- Very limited vertical space
- Horizontal layout priority
- Common di mobile/tablet

**Optimisasi:**
```css
@media (max-height: 500px) {
    .menu {
        gap: 10px;
        padding: 15px;
    }
    
    .color-presets {
        grid-template-columns: repeat(4, 1fr);
    }
    
    .button-group {
        gap: 8px;
    }
}
```

### 5. High DPI Screens (Retina)

**Karakteristik:**
- 2x atau lebih pixel ratio
- Perlu pixelation untuk canvas

**Optimisasi:**
```css
@media (min-resolution: 2dppx) {
    canvas {
        image-rendering: pixelated;  /* Prevent blur */
    }
}
```

---

## Troubleshooting

### Problem 1: Warna Canvas Tidak Berubah

**Penyebab:**
1. Event listener tidak terikat
2. Variable gameState.backgroundColor tidak terupdate
3. drawGame() tidak merender ulang

**Solusi:**
```javascript
// Pastikan inisialisasi dilakukan di window.load
window.addEventListener('load', () => {
    initializeColorPresets();
    initialDraw();
});

// Verifikasi gameState update
console.log('Current background color:', gameState.backgroundColor);

// Check drawGame function
function drawGame() {
    console.log('Drawing with color:', gameState.backgroundColor);
    ctx.fillStyle = gameState.backgroundColor;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}
```

### Problem 2: Color Picker Tidak Sinkronisasi

**Penyebab:**
1. Event listener missing pada color input
2. ID element salah
3. Input readonly atau disabled

**Solusi:**
```javascript
// Verifikasi elements exist
console.log('Color picker:', document.getElementById('bgColorPicker'));
console.log('Hex input:', document.getElementById('bgColorHex'));

// Add event listeners dengan proper binding
const bgColorPicker = document.getElementById('bgColorPicker');
const bgColorHex = document.getElementById('bgColorHex');

if (bgColorPicker && bgColorHex) {
    bgColorPicker.addEventListener('input', (e) => {
        bgColorHex.value = e.target.value.toUpperCase();
        gameState.backgroundColor = e.target.value;
    });
}
```

### Problem 3: Preset Button Tidak Responsive

**Penyebab:**
1. CSS grid tidak compatible
2. Button click event tidak terikat
3. Active class toggle gagal

**Solusi:**
```javascript
// Verifikasi container exist
const colorPresetsContainer = document.getElementById('colorPresets');

// Ensure initialization runs
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeColorPresets);
} else {
    initializeColorPresets();
}

// Debug function
function debugColorPresets() {
    console.log('Container:', colorPresetsContainer);
    console.log('Presets HTML:', colorPresetsContainer.innerHTML);
    console.log('Preset count:', colorPresetsContainer.querySelectorAll('.color-preset').length);
}

debugColorPresets();
```

### Problem 4: HEX Validation Tidak Bekerja

**Penyebab:**
1. Regex pattern salah
2. Input event vs change event
3. Timing masalah

**Solusi:**
```javascript
// Gunakan regex case-insensitive
const hexPattern = /^#[0-9A-F]{6}$/i;

// Test validation
console.log(hexPattern.test('#FF5733'));  // true
console.log(hexPattern.test('#ff5733'));  // true (case-insensitive)
console.log(hexPattern.test('FF5733'));   // false (no hash)
console.log(hexPattern.test('#FF573'));   // false (hanya 5 char)

// Tambah beide blur dan change events
bgColorHex.addEventListener('blur', validateHex);
bgColorHex.addEventListener('change', validateHex);
```

### Problem 5: Layout Bergeser pada Mobile

**Penyebab:**
1. Max-width constraint
2. Padding/margin terlalu besar
3. Grid tidak responsive

**Solusi:**
```css
/* Gunakan clamp untuk responsive sizing */
.menu {
    padding: clamp(10px, 5vw, 30px);  /* Min 10px, Max 30px */
    gap: clamp(10px, 3vw, 20px);
}

/* Ensure presets fit */
.color-presets {
    grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
}

/* Test dengan device devtools */
/* Chrome: F12 → Toggle device toolbar → Test berbagai ukuran */
```

---

## Performance Tips

### 1. Color Picker Optimization
```javascript
// Gunakan debounce untuk input events
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

bgColorHex.addEventListener('input', debounce((e) => {
    // Validation logic
}, 300));
```

### 2. Canvas Rendering
```javascript
// Hanya redraw saat necessary
let lastBackgroundColor = gameState.backgroundColor;

function drawGame() {
    if (gameState.backgroundColor !== lastBackgroundColor) {
        ctx.fillStyle = gameState.backgroundColor;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        lastBackgroundColor = gameState.backgroundColor;
    }
    // Render fruits dan basket
}
```

### 3. DOM Updates
```javascript
// Batch DOM updates
function updateColorUI(color) {
    // Prevent multiple reflows
    const presets = document.querySelectorAll('.color-preset');
    requestAnimationFrame(() => {
        presets.forEach(p => p.classList.remove('active'));
        // Add active ke yang sesuai
    });
}
```

---

## Best Practices

### 1. ✅ DO

- Selalu validasi input HEX sebelum menggunakan
- Gunakan uppercase untuk display HEX
- Sinkronisasi state antara UI dan gameState
- Test di multiple devices
- Provide clear visual feedback untuk user action
- Add console.log untuk debugging

### 2. ❌ DON'T

- Jangan hardcode warna di canvas
- Jangan skip validasi input
- Jangan ubah state tanpa update UI
- Jangan gunakan deprecated color format
- Jangan forget event listener binding
- Jangan assume semua device support HTML5 color input

---

## Kontak & Support

Untuk pertanyaan atau issue, silakan:
1. Check dokumentasi ini terlebih dahulu
2. Run debugging script
3. Test di device berbeda
4. Check browser console untuk error

---

**Dokumentasi Terakhir Diupdate:** 19 February 2026
**Versi:** 2.0 (Improved)
**Status:** ✅ Fully Responsive & Tested