
        const STORAGE = {
            THEME: 'theme',
            FONT: 'fontSize',
            LANG: 'language',
            CODE_THEME: 'codeTheme'
        };

        const COLORS = {
            blue: { primary: '#1a237e', dark: '#283593', light: '#3f51b5' },
            purple: { primary: '#4a148c', dark: '#6a1b9a', light: '#7b1fa2' },
            teal: { primary: '#004d40', dark: '#00695c', light: '#00897b' },
            red: { primary: '#b71c1c', dark: '#d32f2f', light: '#f44336' },
            green: { primary: '#1b5e20', dark: '#2e7d32', light: '#388e3c' },
            orange: { primary: '#e65100', dark: '#ff6f00', light: '#fb8c00' }
        };

        function init() {
            loadSettings();
            setupListeners();
        }

        function loadSettings() {
            const theme = localStorage.getItem(STORAGE.THEME) || 'light';
            const font = localStorage.getItem(STORAGE.FONT) || 'normal';
            const lang = localStorage.getItem(STORAGE.LANG) || 'id';
            const codeTheme = localStorage.getItem(STORAGE.CODE_THEME) || 'monokai';
            const color = localStorage.getItem('theme-color') || 'blue';

            applyTheme(theme);
            applyFont(font);
            applyLanguage(lang);
            applyCodeTheme(codeTheme);
            applyColor(color);
        }

        function applyTheme(theme) {
            const isDark = theme === 'dark';
            document.documentElement.setAttribute('data-theme', theme);
            const toggle = document.getElementById('darkModeToggle');
            const label = document.getElementById('darkModeLabel');
            toggle.classList.toggle('active', isDark);
            if (label) label.textContent = isDark ? (label.getAttribute('data-lang-en') === 'On' ? 'On' : 'Aktif') : (label.getAttribute('data-lang-id') === 'Nonaktif' ? 'Nonaktif' : 'Off');
        }

        function applyFont(size) {
            document.documentElement.setAttribute('data-font-size', size);
            document.querySelectorAll('.font-size-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.size === size);
            });
        }

        function applyLanguage(lang) {
            document.querySelectorAll('[data-lang-en][data-lang-id]').forEach(el => {
                const text = el.getAttribute(`data-lang-${lang}`);
                if (text) el.textContent = text;
            });
            document.documentElement.setAttribute('lang', lang);
        }

        function applyCodeTheme(theme) {
            document.documentElement.setAttribute('data-code-theme', theme);
        }

        function applyColor(color) {
            const c = COLORS[color] || COLORS.blue;
            document.documentElement.style.setProperty('--primary-color', c.primary);
            document.documentElement.style.setProperty('--primary-dark', c.dark);
            document.documentElement.style.setProperty('--primary-light', c.light);
        }

        function setupListeners() {
            // Dark Mode
            const darkToggle = document.getElementById('darkModeToggle');
            if (darkToggle) {
                darkToggle.onclick = function() {
                    const newTheme = this.classList.contains('active') ? 'light' : 'dark';
                    localStorage.setItem(STORAGE.THEME, newTheme);
                    applyTheme(newTheme);
                };
            }

            // Language
            const langSelect = document.getElementById('languageSelect');
            if (langSelect) {
                langSelect.onchange = function() {
                    localStorage.setItem(STORAGE.LANG, this.value);
                    applyLanguage(this.value);
                };
            }

            // Font Size
            document.querySelectorAll('.font-size-btn').forEach(btn => {
                btn.onclick = () => {
                    localStorage.setItem(STORAGE.FONT, btn.dataset.size);
                    applyFont(btn.dataset.size);
                };
            });

            // Colors
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.onclick = () => {
                    localStorage.setItem('theme-color', opt.dataset.theme);
                    applyColor(opt.dataset.theme);
                    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                };
            });

            // Code Themes
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.onclick = () => {
                    localStorage.setItem(STORAGE.CODE_THEME, btn.dataset.codeTheme);
                    applyCodeTheme(btn.dataset.codeTheme);
                    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                };
            });

            // Reset
            const resetBtn = document.getElementById('resetBtn');
            if (resetBtn) {
                resetBtn.onclick = () => {
                    if (confirm('Reset semua pengaturan?')) {
                        localStorage.clear();
                        location.reload();
                    }
                };
            }

            // Settings
            document.getElementById('settingsBtn').onclick = () => {
                document.getElementById('settingsPanel').classList.add('active');
                document.getElementById('settingsOverlay').classList.add('active');
            };

            document.getElementById('closeSettings').onclick = () => {
                document.getElementById('settingsPanel').classList.remove('active');
                document.getElementById('settingsOverlay').classList.remove('active');
            };

            document.getElementById('settingsOverlay').onclick = () => {
                document.getElementById('settingsPanel').classList.remove('active');
                document.getElementById('settingsOverlay').classList.remove('active');
            };

            // Hamburger
            document.getElementById('hamburgerBtn').onclick = function() {
                this.classList.toggle('active');
                document.getElementById('navMenu').classList.toggle('active');
            };

            document.querySelectorAll('#navMenu a').forEach(link => {
                link.onclick = () => {
                    document.getElementById('hamburgerBtn').classList.remove('active');
                    document.getElementById('navMenu').classList.remove('active');
                };
            });
        }

        function switchTab(e, id) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            e.target.classList.add('active');
        }

        function copyToClipboard(btn) {
            const code = btn.nextElementSibling.innerText;
            navigator.clipboard.writeText(code).then(() => {
                const orig = btn.innerText;
                btn.innerText = '✓ Copied!';
                setTimeout(() => btn.innerText = orig, 2000);
            });
        }

        function runCode() {
            const code = document.getElementById('codeEditor').value;
            const iframe = document.getElementById('preview');
            iframe.srcdoc = code;
        }

        function resetPlayground() {
            document.getElementById('codeEditor').value = `<!DOCTYPE html>
<html>
<head>
<style>
body {
    font-family: Arial;
    margin: 0;
    background: #f0f0f0;
}
.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
h1 {
    color: #1a237e;
    text-align: center;
}
button {
    background: #ff8c3a;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}
button:hover {
    background: #e8440f;
    transform: scale(1.05);
}
</style>
</head>
<body>
<div class="container">
    <h1>🎨 Hello World!</h1>
    <p>Edit kode di sebelah kiri</p>
    <button onclick="alert('Berhasil!')">Klik!</button>
</div>
</body>
</html>`;
            runCode();
        }

        document.addEventListener('DOMContentLoaded', init);
        runCode();
    