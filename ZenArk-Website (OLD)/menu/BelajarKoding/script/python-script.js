        // ==================== SETTINGS MANAGEMENT ====================
        const STORAGE_KEYS = {
            THEME: 'app-theme',
            FONT_SIZE: 'app-font-size',
            LANGUAGE: 'app-language',
            CODE_THEME: 'app-code-theme',
            AUTO_RUN: 'app-auto-run'
        };

        const THEME_COLORS = {
            blue: { primary: '#1a237e', primaryDark: '#283593', primaryLight: '#3f51b5' },
            purple: { primary: '#4a148c', primaryDark: '#6a1b9a', primaryLight: '#7b1fa2' },
            teal: { primary: '#004d40', primaryDark: '#00695c', primaryLight: '#00897b' },
            red: { primary: '#b71c1c', primaryDark: '#d32f2f', primaryLight: '#f44336' },
            green: { primary: '#1b5e20', primaryDark: '#2e7d32', primaryLight: '#388e3c' },
            orange: { primary: '#e65100', primaryDark: '#ff6f00', primaryLight: '#fb8c00' }
        };

        function initSettings() {
            loadSettings();
            setupEventListeners();
        }

        function loadSettings() {
            const theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
            const fontSize = localStorage.getItem(STORAGE_KEYS.FONT_SIZE) || 'normal';
            const language = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'id';
            const codeTheme = localStorage.getItem(STORAGE_KEYS.CODE_THEME) || 'monokai';
            const autoRun = localStorage.getItem(STORAGE_KEYS.AUTO_RUN) !== 'false';
            const themeColor = localStorage.getItem('app-theme-color') || 'blue';

            applyTheme(theme);
            applyFontSize(fontSize);
            applyLanguage(language);
            applyCodeTheme(codeTheme);
            applyAutoRun(autoRun);
            applyThemeColor(themeColor);

            updateSettingsUI(theme, fontSize, language, codeTheme, autoRun, themeColor);
        }

        function applyTheme(theme) {
            const isDark = theme === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            document.getElementById('darkModeToggle').classList.toggle('active', isDark);
            document.getElementById('darkModeLabel').textContent = isDark ? 'active' : 'Non-active';
        }

        function applyFontSize(size) {
            document.documentElement.setAttribute('data-font-size', size);
            document.querySelectorAll('.font-size-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.size === size);
            });
        }

        function applyLanguage(lang) {
            document.querySelectorAll('[data-lang-en][data-lang-id]').forEach(element => {
                element.textContent = element.getAttribute(`data-lang-${lang}`);
            });
            document.documentElement.setAttribute('lang', lang);
        }

        function applyCodeTheme(theme) {
            document.documentElement.setAttribute('data-code-theme', theme);
        }

        function applyAutoRun(enabled) {
            document.getElementById('autoRunToggle').classList.toggle('active', enabled);
            document.getElementById('autoRunLabel').textContent = enabled ? 'active' : 'Non-active';
        }

        function applyThemeColor(color) {
            const colors = THEME_COLORS[color] || THEME_COLORS.blue;
            const root = document.documentElement;
            root.style.setProperty('--primary-color', colors.primary);
            root.style.setProperty('--primary-dark', colors.primaryDark);
            root.style.setProperty('--primary-light', colors.primaryLight);
        }

        function updateSettingsUI(theme, fontSize, language, codeTheme, autoRun, themeColor) {
            document.getElementById('languageSelect').value = language;
            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.toggle('active', option.dataset.theme === themeColor);
            });
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.codeTheme === codeTheme);
            });
        }

        function setupEventListeners() {
            document.getElementById('darkModeToggle').addEventListener('click', function() {
                const newTheme = this.classList.contains('active') ? 'light' : 'dark';
                localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
                applyTheme(newTheme);
            });

            document.getElementById('languageSelect').addEventListener('change', function() {
                localStorage.setItem(STORAGE_KEYS.LANGUAGE, this.value);
                applyLanguage(this.value);
            });

            document.querySelectorAll('.font-size-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, this.dataset.size);
                    applyFontSize(this.dataset.size);
                });
            });

            document.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', function() {
                    localStorage.setItem('app-theme-color', this.dataset.theme);
                    applyThemeColor(this.dataset.theme);
                    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    localStorage.setItem(STORAGE_KEYS.CODE_THEME, this.dataset.codeTheme);
                    applyCodeTheme(this.dataset.codeTheme);
                    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            document.getElementById('autoRunToggle').addEventListener('click', function() {
                const newValue = !this.classList.contains('active');
                localStorage.setItem(STORAGE_KEYS.AUTO_RUN, newValue);
                applyAutoRun(newValue);
            });

            document.getElementById('resetBtn').addEventListener('click', function() {
                if (confirm('Reset semua pengaturan ke default?')) {
                    localStorage.clear();
                    location.reload();
                }
            });

            document.getElementById('settingsBtn').addEventListener('click', openSettings);
            document.getElementById('closeSettings').addEventListener('click', closeSettings);
            document.getElementById('settingsOverlay').addEventListener('click', closeSettings);
        }

        function openSettings() {
            document.getElementById('settingsPanel').classList.add('active');
            document.getElementById('settingsOverlay').classList.add('active');
        }

        function closeSettings() {
            document.getElementById('settingsPanel').classList.remove('active');
            document.getElementById('settingsOverlay').classList.remove('active');
        }

        // ==================== HAMBURGER MENU ====================
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const navMenu = document.getElementById('navMenu');

        hamburgerBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('#navMenu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // ==================== TAB SWITCHING ====================
        function switchTab(event, tabId) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            event.target.classList.add('active');
        }

        // ==================== COPY TO CLIPBOARD ====================
        function copyToClipboard(button) {
            const code = button.nextElementSibling.textContent;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = button.textContent;
                button.textContent = '✓ Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            });
        }

        // ==================== IDE FUNCTIONS ====================
        const examples = {
            hello: `print('Hello, World!')`,
            loop: `i = [1,2,3,4,5]
            for i in range(5):
    print(i)`,
            function: `def greet(name):
    return f'Halo, {name}!'

result = greet('Budi')
print(result)`
        };

        function loadExample(exampleName) {
            document.getElementById('codeInput').value = examples[exampleName];
        }

        function runCode() {
            const code = document.getElementById('codeInput').value;
            const output = document.getElementById('output');
            
            if (!code.trim()) {
                output.textContent = 'Tulis kode terlebih dahulu!';
                output.classList.add('error');
                return;
            }

            output.classList.remove('error');
            output.textContent = 'Kode sedang dijalankan...\n(Simulator browser - fitur terbatas)\n\n';

            try {
                let capturedOutput = [];
                const originalLog = console.log;
                console.log = function(...args) {
                    capturedOutput.push(args.join(' '));
                    originalLog.apply(console, args);
                };

                // Simulasi Python sederhana
                eval(code.replace(/print\(/g, 'console.log(').replace(/range/g, 'Array.from({length:arguments[0]}).map((_,i)=>i)'));
                
                console.log = originalLog;
                output.textContent = capturedOutput.length ? capturedOutput.join('\n') : 'Kode berhasil dijalankan (tidak ada output)';
            } catch (error) {
                output.classList.add('error');
                output.textContent = `Error: ${error.message}`;
            }
        }

        function clearOutput() {
            document.getElementById('output').textContent = 'Output akan muncul di sini...';
            document.getElementById('output').classList.remove('error');
        }

        // ==================== SMOOTH SCROLL ====================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', initSettings);
