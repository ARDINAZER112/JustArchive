        // ==================== SETTINGS MANAGEMENT ====================
        const STORAGE_KEYS = {
            THEME: 'app-theme',
            FONT_SIZE: 'app-font-size',
            LANGUAGE: 'app-language',
            HOVER_EFFECT: 'app-hover-effect'
        };

        const THEME_COLORS = {
            blue: {
                primary: '#1a237e',
                primaryDark: '#283593',
                primaryLight: '#3f51b5',
                accent: '#ffb300',
                accentOrange: '#f5650a'
            },
            purple: {
                primary: '#4a148c',
                primaryDark: '#6a1b9a',
                primaryLight: '#7b1fa2',
                accent: '#e91e63',
                accentOrange: '#c2185b'
            },
            teal: {
                primary: '#004d40',
                primaryDark: '#00695c',
                primaryLight: '#00897b',
                accent: '#00bcd4',
                accentOrange: '#0097a7'
            },
            red: {
                primary: '#b71c1c',
                primaryDark: '#d32f2f',
                primaryLight: '#f44336',
                accent: '#ffb300',
                accentOrange: '#ff5722'
            },
            green: {
                primary: '#1b5e20',
                primaryDark: '#2e7d32',
                primaryLight: '#388e3c',
                accent: '#ffb300',
                accentOrange: '#4caf50'
            },
            orange: {
                primary: '#e65100',
                primaryDark: '#ff6f00',
                primaryLight: '#fb8c00',
                accent: '#ffb300',
                accentOrange: '#ff9800'
            }
        };

        // Initialize Settings
        function initSettings() {
            loadSettings();
            setupEventListeners();
        }

        function loadSettings() {
            const theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
            const fontSize = localStorage.getItem(STORAGE_KEYS.FONT_SIZE) || 'normal';
            const language = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'id';
            const hoverEffect = localStorage.getItem(STORAGE_KEYS.HOVER_EFFECT) !== 'false';
            const themeColor = localStorage.getItem('app-theme-color') || 'blue';

            applyTheme(theme);
            applyFontSize(fontSize);
            applyLanguage(language);
            applyHoverEffect(hoverEffect);
            applyThemeColor(themeColor);

            updateSettingsUI(theme, fontSize, language, hoverEffect, themeColor);
        }

        function applyTheme(theme) {
            const isDark = theme === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            
            const darkModeToggle = document.getElementById('darkModeToggle');
            const darkModeLabel = document.getElementById('darkModeLabel');
            
            darkModeToggle.classList.toggle('active', isDark);
            darkModeLabel.textContent = isDark ? 'Aktif' : 'Nonaktif';
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

        function applyHoverEffect(enabled) {
            const toggle = document.getElementById('hoverEffectToggle');
            const label = document.getElementById('hoverEffectLabel');
            toggle.classList.toggle('active', enabled);
            label.textContent = enabled ? 'Aktif' : 'Nonaktif';

            // Apply hover effect class to body
            document.body.classList.toggle('hover-effects-disabled', !enabled);
        }

        function applyThemeColor(color) {
            const colors = THEME_COLORS[color] || THEME_COLORS.blue;
            const root = document.documentElement;
            root.style.setProperty('--primary-color', colors.primary);
            root.style.setProperty('--primary-dark', colors.primaryDark);
            root.style.setProperty('--primary-light', colors.primaryLight);
            root.style.setProperty('--accent-color', colors.accent);
            root.style.setProperty('--accent-orange', colors.accentOrange);
        }

        function updateSettingsUI(theme, fontSize, language, hoverEffect, themeColor) {
            document.getElementById('languageSelect').value = language;
            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.toggle('active', option.dataset.theme === themeColor);
            });
        }

        function setupEventListeners() {
            // Dark Mode Toggle
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.addEventListener('click', function() {
                    const isDarkNow = document.documentElement.getAttribute('data-theme') === 'dark';
                    const newTheme = isDarkNow ? 'light' : 'dark';
                    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
                    applyTheme(newTheme);
                });
            }

            // Language Select
            const languageSelect = document.getElementById('languageSelect');
            if (languageSelect) {
                languageSelect.addEventListener('change', function() {
                    localStorage.setItem(STORAGE_KEYS.LANGUAGE, this.value);
                    applyLanguage(this.value);
                });
            }

            // Font Size Buttons
            document.querySelectorAll('.font-size-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, this.dataset.size);
                    applyFontSize(this.dataset.size);
                });
            });

            // Theme Color Options
            document.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', function() {
                    localStorage.setItem('app-theme-color', this.dataset.theme);
                    applyThemeColor(this.dataset.theme);
                    document.querySelectorAll('.color-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    this.classList.add('active');
                });
            });

            // Hover Effect Toggle
            const hoverEffectToggle = document.getElementById('hoverEffectToggle');
            if (hoverEffectToggle) {
                hoverEffectToggle.addEventListener('click', function() {
                    const isCurrentlyEnabled = this.classList.contains('active');
                    const newValue = !isCurrentlyEnabled;
                    localStorage.setItem(STORAGE_KEYS.HOVER_EFFECT, newValue);
                    applyHoverEffect(newValue);
                });
            }

            // Reset Button
            const resetBtn = document.getElementById('resetBtn');
            if (resetBtn) {
                resetBtn.addEventListener('click', function() {
                    if (confirm('Apakah Anda yakin ingin mereset semua pengaturan ke default?')) {
                        localStorage.clear();
                        location.reload();
                    }
                });
            }

            // Settings Panel Controls
            const settingsBtn = document.getElementById('settingsBtn');
            const closeSettings = document.getElementById('closeSettings');
            const settingsOverlay = document.getElementById('settingsOverlay');

            if (settingsBtn) {
                settingsBtn.addEventListener('click', openSettings);
            }
            if (closeSettings) {
                closeSettings.addEventListener('click', closeSettingsPanel);
            }
            if (settingsOverlay) {
                settingsOverlay.addEventListener('click', closeSettingsPanel);
            }
        }

        function openSettings() {
            document.getElementById('settingsPanel').classList.add('active');
            document.getElementById('settingsOverlay').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeSettingsPanel() {
            document.getElementById('settingsPanel').classList.remove('active');
            document.getElementById('settingsOverlay').classList.remove('active');
            document.body.style.overflow = '';
        }

        // ==================== HAMBURGER MENU ====================
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const navMenu = document.getElementById('navMenu');

        if (hamburgerBtn) {
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

            document.addEventListener('click', function(event) {
                const isClickInsideNav = document.querySelector('nav').contains(event.target);
                if (!isClickInsideNav && navMenu.classList.contains('active')) {
                    hamburgerBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }

        function handleNavClick(event) {
            const href = event.target.getAttribute('href');
            if (href === '#home') {
                event.preventDefault();
                if (hamburgerBtn) {
                    hamburgerBtn.classList.remove('active');
                }
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        }

        // ==================== SMOOTH SCROLL ====================
        function smoothScroll(target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        smoothScroll(target);
                    }
                }
            });
        });

        // ==================== RESIZE HANDLER ====================
        window.addEventListener('resize', function() {
            if (window.innerWidth > 480) {
                if (hamburgerBtn) {
                    hamburgerBtn.classList.remove('active');
                }
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', initSettings);
