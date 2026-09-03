// 1. Definisikan pengaturan default
const defaultSettings = {
    theme: 'light',
    volume: 50,
    language: 'id'
};

// 2. Variabel untuk menyimpan pengaturan saat ini
let currentSettings = { ...defaultSettings };

// 3. Fungsi untuk Load/Memuat Pengaturan
function loadSettings() {
    // Di aplikasi nyata, Anda membaca dari file JSON atau LocalStorage
    // const storedSettings = localStorage.getItem('appSettings');
    // if (storedSettings) currentSettings = JSON.parse(storedSettings);
    console.log("Pengaturan dimuat:", currentSettings);
    return currentSettings;
}

// 4. Fungsi untuk Update/Mengubah Pengaturan
function updateSetting(key, value) {
    if (currentSettings.hasOwnProperty(key)) {
        currentSettings[key] = value;
        console.log(`Setting ${key} diubah menjadi: ${value}`);
        saveSettings(); // Simpan otomatis setelah diubah
    } else {
        console.error("Setting tidak ditemukan");
    }
}

// 5. Fungsi untuk Save/Menyimpan Pengaturan
function saveSettings() {
    // Di aplikasi nyata, Anda menulis ke file JSON atau LocalStorage
    // localStorage.setItem('appSettings', JSON.stringify(currentSettings));
    console.log("Pengaturan disimpan:", currentSettings);
}

// --- PENGGUNAAN ---
loadSettings(); // Memuat default
updateSetting('theme', 'dark'); // Mengubah tema
updateSetting('volume', 80); // Mengubah volume