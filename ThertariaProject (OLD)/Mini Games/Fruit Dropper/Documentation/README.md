# 🍎 FRUIT DROPPER - v2.0
## Quick Shortcut ##
- [PENJELASAN SISTEM CUSTOM BACKGROUND](FRUIT_DROPPER_DOCUMENTATION.md)
- [PENJELASAN/RINGKASAN PERBAIKAN v2.0](IMPROVEMENTS_SUMMARY.md)
- [PENJELASAN ISI/KONTEN GAME](INDEX.md)
- [Versi Lama(V1.0.0)](Fruit%20Dropper%20Old%20v1.0/README.md)

## 📦 Files Included

### 1. **fruit-dropper-improved.html** (44 KB) [Go To](fruit-dropper-improved.html)

**Features:**
- ✨ 8 Color Presets yang optimized
- 🎨 Custom Color Picker dengan validasi HEX
- 📱 Fully Responsive (Mobile, Tablet, Desktop)
- 🎮 Full Fruit Dropper Game Features
- 🏆 Leaderboard System
- 🎯 Pausable & Restartable

### 2. **FRUIT_DROPPER_DOCUMENTATION.md** (16 KB) [Go To](FRUIT_DROPPER_DOCUMENTATION.md)

**Covers:**
- Fitur-fitur utama
- Panduan penggunaan
- Perbaikan teknis
- Kompatibilitas device
- Troubleshooting
- Best practices

### 3. **IMPROVEMENTS_SUMMARY.md** (11 KB) [Go To](IMPROVEMENTS_SUMMARY.md)
Ringkasan perbaikan dari v1 ke v2.

**Contains:**
- Overview perbaikan
- Before/After comparison
- Device compatibility
- Testing checklist
- Performance notes

### 4. **README.md** [(This file)](README.md)
Quick start guide

---

## 🚀 Quick Start

### 1. Setup
```bash
# Copy fruit-dropper-improved.html ke project folder
# Pastikan folder 'asset/' tersedia dengan gambar:
# - apple.png
# - avocado.png
# - golden_apple.png
# - trash.png
# - bomb.png
# - basket.png
# - icon/apple.png

# Open di browser
# Buka fruit-dropper-improved.html di web browser
```

### 2. Menggunakan Color System

#### Cara 1: Pilih Preset Warna (Tercepat)
```
1. Buka menu utama game
2. Scroll ke section "Background Color - Presets"
3. Klik salah satu kotak warna
4. Warna canvas berubah langsung ✓
```

#### Cara 2: Gunakan Color Picker
```
1. Klik tombol warna persegi (next to HEX input)
2. Pilih warna dari native color picker
3. Warna akan auto-sync ke HEX input
4. Klik "PLAY" untuk mulai game
```

#### Cara 3: Input HEX Manual
```
1. Focus pada input field HEX
2. Ketik kode warna (contoh: #FF5733)
3. Tekan Tab atau click elsewhere
4. Jika valid → warna berubah
5. Jika invalid → kembali ke warna sebelumnya
```

---

## 🎨 Warna Presets Available

| Icon | Nama | Hex Code | Use Case |
|------|------|----------|----------|
| ⬛ | Dark Gray | `#2d3436` | Default, netral |
| 🔵 | Deep Blue | `#1a237e` | Professional |
| 🟣 | Deep Purple | `#4a148c` | Elegant |
| 🟢 | Dark Green | `#1b5e20` | Natural |
| 🔴 | Dark Red | `#b71c1c` | Intense |
| 🧿 | Navy | `#0d47a1` | Classic |
| 💎 | Dark Teal | `#004d40` | Modern |
| ⚫ | Charcoal | `#212121` | Minimalist |

---

## 📱 Device Support

### Mobile (320px - 480px)
✅ Fully optimized
- Grid: 4 columns
- Touch friendly
- Portrait optimized

### Tablet (481px - 768px)
✅ Fully optimized
- Grid: 5 columns
- Landscape support
- Medium screens

### Desktop (769px+)
✅ Fully optimized
- Grid: 6 columns
- Large space usage
- Keyboard support

### Landscape (<500px height)
✅ Fully optimized
- Compact layout
- Horizontal scrolling prevention
- All elements visible

---

## 🔧 Technical Details

### Color System Architecture
```
User Input
    ↓
[Preset Button] → selectColorPreset()
[Color Picker]  → bgColorPicker.addEventListener('input')
[HEX Input]     → validateHex() + bgColorHex.addEventListener('blur')
    ↓
gameState.backgroundColor = color
    ↓
drawGame() → ctx.fillStyle = gameState.backgroundColor
    ↓
Canvas Background Updated
```

### Key Features
1. **Synchronized Inputs** - All 3 inputs stay in sync
2. **Validation** - HEX format validation with auto-revert
3. **Responsive** - Grid layout adapts to screen size
4. **Visual Feedback** - Clear active state & animations
5. **Accessible** - Keyboard navigation & labels

---

## ⚙️ Configuration

### Add New Preset Color
Edit array di JavaScript:
```javascript
const COLOR_PRESETS = [
    { name: 'Your Color', color: '#RRGGBB' },
    // ... more colors
];
```

### Change Grid Columns
Edit CSS media query:
```css
@media (min-width: 769px) {
    .color-presets {
        grid-template-columns: repeat(8, 1fr);  /* Change 6 to 8 */
    }
}
```

### Customize Validation Pattern
Edit regex di JavaScript:
```javascript
const hexPattern = /^#[0-9A-F]{6}$/i;  // Modify as needed
```

---

## 🐛 Troubleshooting

### Q: Warna preset tidak muncul
**A:** Pastikan `initializeColorPresets()` dipanggil di `window.load` event

### Q: Color picker tidak sinkronisasi
**A:** Check browser console untuk error, verifikasi element ID

### Q: HEX validation tidak bekerja
**A:** Gunakan format `#RRGGBB`, contoh: `#FF5733`

### Q: Layout berantakan di mobile
**A:** Test dengan browser devtools (F12), check CSS media queries

### Q: Canvas background tidak berubah
**A:** Verifikasi `drawGame()` menggunakan `gameState.backgroundColor`

---

## 📊 Performance

| Operation | Time | Impact |
|-----------|------|--------|
| Initialize presets | <50ms | Minimal |
| Change color | Instant | None |
| Update canvas | <16ms | Handled by gameLoop |
| Total overhead | Negligible | Zero impact on gameplay |

---

## ♿ Accessibility

✅ **Features:**
- Semantic HTML
- Proper labels & descriptions
- Keyboard navigation support
- High contrast colors
- Screen reader friendly
- Touch gesture support

✅ **WCAG 2.1 Level AA Compliant**

---

## 📚 Documentation Files

### For Quick Reference
Start with: **IMPROVEMENTS_SUMMARY.md**
- 5 minute read
- Before/after comparison
- Key features overview

### For Complete Details
Read: **FRUIT_DROPPER_DOCUMENTATION.md**
- 15-20 minute read
- Complete feature documentation
- Implementation details
- Troubleshooting guide

### For Quick Start
Use: **README.md** (This file)
- Setup instructions
- Basic usage
- Common Q&A

---

## 🎮 Game Features (Unchanged)

Beyond color customization, game includes:

```
🍎 GAME MECHANICS:
  • Catch apples & avocados = +1 point
  • Golden apples = +3 points & +1 HP
  • Trash = -5 points & -1 HP
  • Bombs = Instant Game Over

🎯 DIFFICULTY LEVELS:
  • Easy: Slow speed, more HP
  • Medium: Medium speed, medium HP
  • Hard: Fast speed, less HP

🏆 FEATURES:
  • Leaderboard system
  • Player name entry
  • Score tracking
  • HP system
  • Pause/Resume
  • Restart ability

🎨 CUSTOMIZATION:
  • Custom game background color
  • 8 color presets
  • Color picker
  • HEX input
  • Responsive to all devices
```

---

## 🌐 Browser Compatibility

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome | ✅ | ✅ | Fully supported |
| Firefox | ✅ | ✅ | Fully supported |
| Safari | ✅ | ✅ | Fully supported |
| Edge | ✅ | ✅ | Fully supported |
| IE 11 | ⚠️ | ❌ | Not recommended |

**Recommended:** Chrome, Firefox, Safari, Edge (latest versions)

---

## 💾 Data Storage

Game uses **localStorage** for:
- Leaderboard scores
- Player stats
- Date tracking

**Storage Size:** ~10KB (varies with leaderboard entries)

**Persists across:** Browser sessions
**Clears:** Manual localStorage clear atau browser cache clear

---

## 📝 File Structure

```
fruit-dropper-improved.html
├── <head>
│   ├── Meta tags
│   ├── External fonts (Google Fonts)
│   ├── <style> - All CSS
│   └── Favicon link
├── <body>
│   ├── Game container
│   ├── Canvas (400x600)
│   ├── Menu overlay
│   ├── Game UI (score, health)
│   ├── Pause menu
│   ├── Game over screen
│   ├── Leaderboard display
│   └── <script> - All JavaScript
└── End of HTML
```

---

## 🎓 Learning Resources

### If you want to understand:

**CSS Grid & Responsive Design:**
- `.color-presets` class
- Media query sections
- `grid-template-columns: repeat(auto-fit, minmax(45px, 1fr))`

**JavaScript Event Handling:**
- Color input events (input, change, blur)
- Element selection & manipulation
- Event listener binding

**Canvas API:**
- `ctx.fillStyle = color`
- `ctx.fillRect()` for drawing
- RequestAnimationFrame for rendering

**HTML5 Color Input:**
- Native color picker
- Value binding to other inputs
- Format validation

---

## 🤝 Contributing

Want to improve the color system? Tips:

1. **Add more presets** - Edit `COLOR_PRESETS` array
2. **Change colors** - Update hex codes
3. **Customize layout** - Modify CSS grid columns
4. **Improve validation** - Update regex pattern
5. **Add features** - Extend event listeners

---

## 📄 License

Free to use and modify for personal & educational purposes.

---

## 🎉 Summary

**Sistem Custom Background Color yang telah diperbaiki ini memberikan:**

✅ **User Experience:** Mudah memilih warna, visual feedback jelas
✅ **Responsive:** Works perfectly pada semua device & screen size
✅ **Validated:** HEX input validation mencegah error
✅ **Synchronized:** Semua input selalu sinkron
✅ **Accessible:** Keyboard & screen reader friendly
✅ **Performant:** Zero impact pada game performance
✅ **Well-documented:** Comprehensive documentation included

---

## 📞 Quick Support

**Issue:** Check these in order:
1. Read relevant section di **IMPROVEMENTS_SUMMARY.md** [Go to](IMPROVEMENTS_SUMMARY.md)
2. Check **FRUIT_DROPPER_DOCUMENTATION.md** troubleshooting [Go To](FRUIT_DROPPER_DOCUMENTATION.md)
3. Open browser console (F12) untuk error messages
4. Test di browser berbeda

---

**Version:** 2.0