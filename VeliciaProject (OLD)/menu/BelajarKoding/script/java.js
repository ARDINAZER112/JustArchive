        // ==================== SETTINGS MANAGEMENT ====================
        const STORAGE_KEYS = {
            THEME: 'app-theme',
            FONT_SIZE: 'app-font-size',
            CODE_THEME: 'app-code-theme'
        };

        const THEME_COLORS = {
            blue: {
                primary: '#1a237e',
                primaryDark: '#283593',
                primaryLight: '#3f51b5',
                accentColor: '#ffed4e',
                accentOrange: '#ff8c3a',
                accentOrangeDark: '#e8440f'
            },
            purple: {
                primary: '#4a148c',
                primaryDark: '#6a1b9a',
                primaryLight: '#7b1fa2',
                accentColor: '#e91e63',
                accentOrange: '#c2185b',
                accentOrangeDark: '#ad1457'
            },
            teal: {
                primary: '#004d40',
                primaryDark: '#00695c',
                primaryLight: '#00897b',
                accentColor: '#00bcd4',
                accentOrange: '#0097a7',
                accentOrangeDark: '#00838f'
            },
            red: {
                primary: '#b71c1c',
                primaryDark: '#d32f2f',
                primaryLight: '#f44336',
                accentColor: '#ffed4e',
                accentOrange: '#ff5722',
                accentOrangeDark: '#e64a19'
            },
            green: {
                primary: '#1b5e20',
                primaryDark: '#2e7d32',
                primaryLight: '#388e3c',
                accentColor: '#ffed4e',
                accentOrange: '#4caf50',
                accentOrangeDark: '#388e3c'
            },
            orange: {
                primary: '#e65100',
                primaryDark: '#ff6f00',
                primaryLight: '#fb8c00',
                accentColor: '#ffed4e',
                accentOrange: '#ff9800',
                accentOrangeDark: '#f57c00'
            }
        };

        function initSettings() {
            loadSettings();
            setupEventListeners();
        }

        function loadSettings() {
            const theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
            const fontSize = localStorage.getItem(STORAGE_KEYS.FONT_SIZE) || 'normal';
            const codeTheme = localStorage.getItem(STORAGE_KEYS.CODE_THEME) || 'monokai';
            const language = localStorage.getItem('app-language') || 'id';
            const themeColor = localStorage.getItem('app-theme-color') || 'blue';

            applyTheme(theme);
            applyFontSize(fontSize);
            applyLanguage(language);
            applyCodeTheme(codeTheme);
            applyThemeColor(themeColor);

            updateSettingsUI(theme, fontSize, language, codeTheme, themeColor);
        }

        function applyTheme(theme) {
            const isDark = theme === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            document.getElementById('darkModeToggle').classList.toggle('active', isDark);
            document.getElementById('darkModeLabel').textContent = isDark ? 'Aktif' : 'Nonaktif';
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

        function applyThemeColor(color) {
            const colors = THEME_COLORS[color] || THEME_COLORS.blue;
            const root = document.documentElement;
            root.style.setProperty('--primary-color', colors.primary);
            root.style.setProperty('--primary-dark', colors.primaryDark);
            root.style.setProperty('--primary-light', colors.primaryLight);
            root.style.setProperty('--accent-color', colors.accentColor);
            root.style.setProperty('--accent-orange', colors.accentOrange);
            root.style.setProperty('--accent-orange-dark', colors.accentOrangeDark);
        }

        function updateSettingsUI(theme, fontSize, language, codeTheme, themeColor) {
            document.getElementById('languageSelect').value = language;
            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.toggle('active', option.dataset.theme === themeColor);
            });
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.codeTheme === codeTheme);
            });
        }

        function setupEventListeners() {
            // Dark Mode Toggle
            document.getElementById('darkModeToggle').addEventListener('click', function() {
                const newTheme = this.classList.contains('active') ? 'light' : 'dark';
                localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
                applyTheme(newTheme);
            });

            // Language Select
            document.getElementById('languageSelect').addEventListener('change', function() {
                localStorage.setItem('app-language', this.value);
                applyLanguage(this.value);
            });

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

            // Code Theme Options
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    localStorage.setItem(STORAGE_KEYS.CODE_THEME, this.dataset.codeTheme);
                    applyCodeTheme(this.dataset.codeTheme);
                    document.querySelectorAll('.theme-btn').forEach(b => {
                        b.classList.remove('active');
                    });
                    this.classList.add('active');
                });
            });

            // Reset Button
            document.getElementById('resetBtn').addEventListener('click', function() {
                if (confirm('Reset semua pengaturan ke default?')) {
                    localStorage.clear();
                    location.reload();
                }
            });

            // Settings Panel Controls
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

        document.addEventListener('click', function(event) {
            const isClickInsideNav = document.querySelector('nav').contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // ==================== TAB SWITCHING ====================
        function switchTab(event, tabId) {
            const tabs = document.querySelectorAll('.tab-content');
            const buttons = document.querySelectorAll('.tab-btn');
            
            tabs.forEach(tab => tab.classList.remove('active'));
            buttons.forEach(btn => btn.classList.remove('active'));
            
            document.getElementById(tabId).classList.add('active');
            event.target.classList.add('active');
        }

        // ==================== COPY TO CLIPBOARD ====================
        function copyToClipboard(button) {
            const codeBlock = button.nextElementSibling;
            const text = codeBlock.innerText;
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.innerText;
                button.innerText = '✓ Copied!';
                setTimeout(() => {
                    button.innerText = originalText;
                }, 2000);
            });
        }

        // ==================== JAVA PLAYGROUND ====================
        function simulateJavaOutput() {
            const code = document.getElementById('javaCode').value;
            const output = document.getElementById('output');
            
            // Simulasi output Java
            let simulatedOutput = '';
            
            // Cek apakah ada main method
            if (code.includes('public static void main')) {
                // Parse simple statements
                const lines = code.split('\n');
                simulatedOutput = 'Output Program:\n' +
                    '==================\n\n';
                
                // Simulasi output berdasarkan println statements
                if (code.includes('System.out.println("Nama:')) {
                    simulatedOutput += 'Nama: Budi\n';
                }
                if (code.includes('System.out.println("Umur:')) {
                    simulatedOutput += 'Umur: 25\n';
                }
                if (code.includes('System.out.println("Tinggi:')) {
                    simulatedOutput += 'Tinggi: 175.5 cm\n';
                }
                if (code.includes('System.out.println("Tahun Lahir:')) {
                    simulatedOutput += 'Tahun Lahir: 1999\n';
                }
                if (code.includes('Status: Dewasa')) {
                    simulatedOutput += 'Status: Dewasa\n';
                }
                if (code.includes('for (int i = 1; i <= 5; i++)')) {
                    simulatedOutput += '\nAngka 1-5:\n';
                    simulatedOutput += 'Angka: 1\nAngka: 2\nAngka: 3\nAngka: 4\nAngka: 5\n';
                }
                if (code.includes('String[] buah =')) {
                    simulatedOutput += '\nBuah-buahan:\n';
                    simulatedOutput += '- Apel\n- Mangga\n- Jeruk\n';
                }
                
                if (simulatedOutput === 'Output Program:\n==================\n\n') {
                    simulatedOutput = 'Program berhasil dikompilasi!\n\n(Kode Anda tidak memiliki output println yang terdeteksi)';
                }
            } else {
                simulatedOutput = '❌ Error: Main method tidak ditemukan!\n\nUntuk menjalankan program Java, harus ada:\npublic static void main(String[] args) { }';
            }
            
            output.textContent = simulatedOutput;
        }

        function resetPlayground() {
            document.getElementById('javaCode').value = `public class Main {
    public static void main(String[] args) {
        // Variables
        String nama = "Budi";
        int umur = 25;
        double tinggi = 175.5;
        
        // Output
        System.out.println("Nama: " + nama);
        System.out.println("Umur: " + umur);
        System.out.println("Tinggi: " + tinggi + " cm");
        
        // Kalkulasi
        int tahunLahir = 2024 - umur;
        System.out.println("Tahun Lahir: " + tahunLahir);
        
        // Conditional
        if (umur >= 18) {
            System.out.println("Status: Dewasa");
        } else {
            System.out.println("Status: Anak-anak");
        }
        
        // Loop
        System.out.println("\\nAngka 1-5:");
        for (int i = 1; i <= 5; i++) {
            System.out.println("Angka: " + i);
        }
        
        // Array
        String[] buah = {"Apel", "Mangga", "Jeruk"};
        System.out.println("\\nBuah-buahan:");
        for (String b : buah) {
            System.out.println("- " + b);
        }
    }
}`;
            document.getElementById('output').textContent = 
                'Klik "Jalankan Kode" untuk melihat output...';
        }

        // ==================== RESIZE HANDLER ====================
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // ==================== SMOOTH SCROLL ====================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            initSettings();
        });
