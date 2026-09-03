        // Settings Management System
        class HeaderSettingsManager {
            constructor() {
                this.modal = document.getElementById('settingsModal');
                this.headerSettingsBtn = document.getElementById('headerSettingsBtn');
                this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
                this.saveBtn = document.getElementById('saveBtn');
                this.resetBtn = document.getElementById('resetBtn');

                // Settings elements
                this.language = document.getElementById('language');
                this.volume = document.getElementById('volume');
                this.volumeValue = document.getElementById('volumeValue');
                this.soundEnabled = document.getElementById('soundEnabled');
                this.notificationEnabled = document.getElementById('notificationEnabled');
                this.brightness = document.getElementById('brightness');
                this.brightnessValue = document.getElementById('brightnessValue');
                this.textSize = document.getElementById('textSize');
                this.analytics = document.getElementById('analytics');
                this.cookies = document.getElementById('cookies');

                this.defaultSettings = {
                    language: 'id',
                    volume: 70,
                    soundEnabled: true,
                    notificationEnabled: true,
                    brightness: 100,
                    textSize: 'normal',
                    analytics: true,
                    cookies: true
                };

                this.currentSettings = { ...this.defaultSettings };
                this.init();
            }

            init() {
                this.loadSettings();
                this.attachEventListeners();
                this.applySettings();
            }

            attachEventListeners() {
                if (this.headerSettingsBtn) {
                    this.headerSettingsBtn.addEventListener('click', () => this.openSettings());
                }
                this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
                this.saveBtn.addEventListener('click', () => this.saveSettings());
                this.resetBtn.addEventListener('click', () => this.resetToDefault());

                // Volume control
                this.volume.addEventListener('input', (e) => {
                    this.volumeValue.textContent = e.target.value + '%';
                });

                // Brightness control
                this.brightness.addEventListener('input', (e) => {
                    this.brightnessValue.textContent = e.target.value + '%';
                });

                // Text size change real-time
                this.textSize.addEventListener('change', (e) => {
                    this.applyTextSize(e.target.value);
                });

                // Close on background click
                this.modal.addEventListener('click', (event) => {
                    if (event.target === this.modal) {
                        this.closeSettings();
                    }
                });

                // Close on Escape key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                        this.closeSettings();
                    }
                });
            }

            openSettings() {
                this.modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closeSettings() {
                this.modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            saveSettings() {
                this.currentSettings.language = this.language.value;
                this.currentSettings.volume = parseInt(this.volume.value);
                this.currentSettings.soundEnabled = this.soundEnabled.checked;
                this.currentSettings.notificationEnabled = this.notificationEnabled.checked;
                this.currentSettings.brightness = parseInt(this.brightness.value);
                this.currentSettings.textSize = this.textSize.value;
                this.currentSettings.analytics = this.analytics.checked;
                this.currentSettings.cookies = this.cookies.checked;

                localStorage.setItem('headerSettings', JSON.stringify(this.currentSettings));
                this.applySettings();
                this.showNotification('✓ Pengaturan berhasil disimpan!', 'success');
                
                setTimeout(() => this.closeSettings(), 800);
            }

            loadSettings() {
                const saved = localStorage.getItem('headerSettings');
                if (saved) {
                    try {
                        this.currentSettings = JSON.parse(saved);
                    } catch(e) {
                        console.error('Error loading settings:', e);
                        this.currentSettings = { ...this.defaultSettings };
                    }
                }
                this.updateUI();
            }

            updateUI() {
                this.language.value = this.currentSettings.language;
                this.volume.value = this.currentSettings.volume;
                this.volumeValue.textContent = this.currentSettings.volume + '%';
                this.soundEnabled.checked = this.currentSettings.soundEnabled;
                this.notificationEnabled.checked = this.currentSettings.notificationEnabled;
                this.brightness.value = this.currentSettings.brightness;
                this.brightnessValue.textContent = this.currentSettings.brightness + '%';
                this.textSize.value = this.currentSettings.textSize;
                this.analytics.checked = this.currentSettings.analytics;
                this.cookies.checked = this.currentSettings.cookies;
            }

            applySettings() {
                this.applyBrightness(this.currentSettings.brightness);
                this.applyTextSize(this.currentSettings.textSize);
            }

            applyBrightness(value) {
                document.documentElement.style.filter = `brightness(${value}%)`;
            }

            applyTextSize(size) {
                switch (size) {
                    case 'small':
                        document.documentElement.style.fontSize = '14px';
                        break;
                    case 'normal':
                        document.documentElement.style.fontSize = '16px';
                        break;
                    case 'large':
                        document.documentElement.style.fontSize = '18px';
                        break;
                }
            }

            resetToDefault() {
                if (confirm('Apakah Anda yakin ingin mereset ke pengaturan default?')) {
                    this.currentSettings = { ...this.defaultSettings };
                    localStorage.removeItem('headerSettings');
                    this.updateUI();
                    this.applySettings();
                    this.showNotification('↻ Pengaturan direset ke default', 'info');
                }
            }

            showNotification(message, type = 'info') {
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    z-index: 3000;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    animation: slideInRight 0.3s ease-out;
                `;

                switch (type) {
                    case 'success':
                        notification.style.backgroundColor = '#4caf50';
                        notification.style.color = 'white';
                        break;
                    case 'info':
                        notification.style.backgroundColor = '#667eea';
                        notification.style.color = 'white';
                        break;
                }

                notification.textContent = message;
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.style.animation = 'slideOutRight 0.3s ease-out';
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
            }
        }

        // Initialize settings when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            new HeaderSettingsManager();
        });

        // Smooth scroll untuk anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
var LANGUAGES = {
    "_": { defaultLanguage: "en"},
    "en": {      
        texts: {
            "settingsTitle": "Settings",
            "languageLabel": "Language",
            "volumeLabel": "Volume",
            "soundEnabledLabel": "Enable Sound",
            "notificationEnabledLabel": "Enable Notifications",
            "brightnessLabel": "Brightness",
            "textSizeLabel": "Text Size",
            "analyticsLabel": "Enable Analytics",
            "cookiesLabel": "Enable Cookies",
            "saveButton": "Save Settings",
            "resetButton": "Reset to Default",
        },
    },
    "id": {      
        texts: {
            "settingsTitle": "Pengaturan",
            "languageLabel": "Bahasa",
            "volumeLabel": "Volume",
            "soundEnabledLabel": "Aktifkan Efek Suara",
            "notificationEnabledLabel": "Aktifkan Notifikasi",
            "brightnessLabel": "Kecerahan",
            "textSizeLabel": "Ukuran Teks",
            "analyticsLabel": "Aktifkan Analitik",
            "cookiesLabel": "Aktifkan Cookies",
            "saveButton": "Simpan Pengaturan",
            "resetButton": "Atur Ulang ke Default",
        },
    }};