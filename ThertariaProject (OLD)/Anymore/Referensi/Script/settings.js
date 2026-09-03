// Settings Popup System
class SettingsManager {
    constructor() {
        this.modal = document.getElementById('settingsModal');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.closeBtn = document.getElementById('closeBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.resetBtn = document.getElementById('resetBtn');

        // Settings Elements
        this.language = document.getElementById('language');
        this.theme = document.getElementById('theme');
        this.volume = document.getElementById('volume');
        this.volumeValue = document.getElementById('volumeValue');
        this.soundEnabled = document.getElementById('soundEnabled');
        this.notificationEnabled = document.getElementById('notificationEnabled');
        this.brightness = document.getElementById('brightness');
        this.brightnessValue = document.getElementById('brightnessValue');
        this.textSize = document.getElementById('textSize');
        this.analytics = document.getElementById('analytics');
        this.cookies = document.getElementById('cookies');

        // Default Settings
        this.defaultSettings = {
            language: 'id',
            theme: 'light',
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
        // Modal Controls
        this.settingsBtn.addEventListener('click', () => this.openModal());
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.saveBtn.addEventListener('click', () => this.saveSettings());
        this.resetBtn.addEventListener('click', () => this.resetToDefault());

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });

        // Range inputs
        this.volume.addEventListener('input', (e) => {
            this.volumeValue.textContent = e.target.value + '%';
        });

        this.brightness.addEventListener('input', (e) => {
            this.brightnessValue.textContent = e.target.value + '%';
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    saveSettings() {
        // Collect current values
        this.currentSettings.language = this.language.value;
        this.currentSettings.theme = this.theme.value;
        this.currentSettings.volume = parseInt(this.volume.value);
        this.currentSettings.soundEnabled = this.soundEnabled.checked;
        this.currentSettings.notificationEnabled = this.notificationEnabled.checked;
        this.currentSettings.brightness = parseInt(this.brightness.value);
        this.currentSettings.textSize = this.textSize.value;
        this.currentSettings.analytics = this.analytics.checked;
        this.currentSettings.cookies = this.cookies.checked;

        // Save to localStorage
        localStorage.setItem('appSettings', JSON.stringify(this.currentSettings));

        // Apply settings
        this.applySettings();

        // Show feedback
        this.showNotification('Pengaturan berhasil disimpan!', 'success');

        // Close modal after delay
        setTimeout(() => this.closeModal(), 800);
    }

    loadSettings() {
        const saved = localStorage.getItem('appSettings');
        if (saved) {
            this.currentSettings = JSON.parse(saved);
        }
        this.updateUIFromSettings();
    }

    updateUIFromSettings() {
        this.language.value = this.currentSettings.language;
        this.theme.value = this.currentSettings.theme;
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
        // Apply Theme
        if (this.currentSettings.theme === 'dark') {
            document.documentElement.style.colorScheme = 'dark';
            document.body.style.backgroundColor = '#1a1a1a';
            document.body.style.color = '#e0e0e0';
        } else if (this.currentSettings.theme === 'light') {
            document.documentElement.style.colorScheme = 'light';
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#333333';
        }

        // Apply Brightness
        const brightnessValue = this.currentSettings.brightness;
        document.documentElement.style.filter = `brightness(${brightnessValue}%)`;

        // Apply Text Size
        switch (this.currentSettings.textSize) {
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

        // Apply Language
        this.applyLanguage(this.currentSettings.language);

        // Log settings (for development)
        console.log('Settings Applied:', this.currentSettings);
    }

    applyLanguage(lang) {
        const translations = {
            id: {
                header: 'Selamat Datang di Thertaria',
                settingsBtn: '⚙️ Pengaturan',
                settingsTitle: 'Pengaturan'
            },
            en: {
                header: 'Welcome to Thertaria',
                settingsBtn: '⚙️ Settings',
                settingsTitle: 'Settings'
            },
            ja: {
                header: 'Thertariaへようこそ',
                settingsBtn: '⚙️ 設定',
                settingsTitle: '設定'
            }
        };

        // You can extend this to update all UI text
        console.log('Language set to:', lang);
    }

    resetToDefault() {
        if (confirm('Apakah Anda yakin ingin mereset semua pengaturan ke default?')) {
            this.currentSettings = { ...this.defaultSettings };
            this.updateUIFromSettings();
            this.showNotification('Pengaturan direset ke default', 'info');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 2000;
            animation: slideInRight 0.3s ease-out;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;

        // Set type styles
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#4caf50';
                notification.style.color = 'white';
                break;
            case 'error':
                notification.style.backgroundColor = '#f44336';
                notification.style.color = 'white';
                break;
            case 'info':
                notification.style.backgroundColor = '#667eea';
                notification.style.color = 'white';
                break;
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Method to get current settings
    getSettings() {
        return { ...this.currentSettings };
    }

    // Method to update settings programmatically
    updateSetting(key, value) {
        if (key in this.currentSettings) {
            this.currentSettings[key] = value;
            this.updateUIFromSettings();
            localStorage.setItem('appSettings', JSON.stringify(this.currentSettings));
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
});
