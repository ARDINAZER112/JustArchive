// Translation data
const translations = {
  id: {
    // Navigation
    nav_home: 'Beranda',
    nav_features: 'Fitur',
    nav_menu: 'Menu',
    nav_about: 'Tentang',
    nav_social: 'Sosial Media',
    nav_project: 'Project',

    // Settings
    settings_title: 'Pengaturan',
    settings_general: 'Umum',
    settings_language: 'Bahasa:',
    settings_audio: 'Audio & Notifikasi',
    settings_volume: 'Volume:',
    settings_sound: 'Aktifkan Suara',
    settings_notification: 'Aktifkan Notifikasi',
    settings_display: 'Tampilan',
    settings_brightness: 'Kecerahan:',
    settings_textsize: 'Ukuran Teks:',
    settings_textsize_small: 'Kecil',
    settings_textsize_normal: 'Normal',
    settings_textsize_large: 'Besar',
    settings_privacy: 'Privasi & Keamanan',
    settings_analytics: 'Izinkan Analytics',
    settings_cookies: 'Izinkan Cookies',
    settings_reset: 'Reset',
    settings_save: 'Simpan',

    // Hero Section
    hero_welcome: 'Selamat Datang di Website Kami',
    hero_subtitle: 'Temukan solusi terbaik untuk kebutuhan digital Anda',
    hero_social: 'Social Media',
    hero_project: 'Project',

    // Menu Section
    menu_title: 'MENU',
    menu_history: 'Histori Of World',
    menu_coding: 'Belajar Koding',
    menu_design: 'Belajar Design',
    menu_marketing: 'Belajar Marketing',
    menu_business: 'Belajar Bisnis',
    menu_productivity: 'Belajar Produktivitas',
    menu_tools: 'Belajar Tools',
    menu_other: 'Lainnya',

    // Project Section
    project_title: 'PROJECT',

    // Herta Section
    herta_title: 'HERTA',

    // About Section
    about_title: 'Tentang Kami',
    about_desc1: 'Kami adalah tim profesional yang berdedikasi untuk memberikan solusi digital terbaik bagi klien kami.',
    about_desc2: 'Dengan menyediakan pengalaman pembelajaran yang luar biasa, kami membantu pengguna mencapai tujuan mereka dengan mudah dan efisien.',
    about_desc3: 'Komitmen kami adalah memberikan hasil yang cukup luar biasa dan membantu pengguna mencapai tujuan mereka.',

    // Social Media Section
    social_title: 'Social Media',

    // Footer
    namespace: 'Gerbang Anda menuju pengalaman komputasi yang lebih sederhana dan aman. Ringan, cepat, dan ramah pengguna.',
    footer_copyright: '&copy; 2026 Thertaria Project. Semua hak dilindungi.'
  },
  en: {
    // Navigation
    nav_home: 'Home',
    nav_features: 'Features',
    nav_menu: 'Menu',
    nav_about: 'About',
    nav_social: 'Social Media',
    nav_project: 'Project',

    // Settings
    settings_title: 'Settings',
    settings_general: 'General',
    settings_language: 'Language:',
    settings_audio: 'Audio & Notifications',
    settings_volume: 'Volume:',
    settings_sound: 'Enable Sound',
    settings_notification: 'Enable Notifications',
    settings_display: 'Display',
    settings_brightness: 'Brightness:',
    settings_textsize: 'Text Size:',
    settings_textsize_small: 'Small',
    settings_textsize_normal: 'Normal',
    settings_textsize_large: 'Large',
    settings_privacy: 'Privacy & Security',
    settings_analytics: 'Allow Analytics',
    settings_cookies: 'Allow Cookies',
    settings_reset: 'Reset',
    settings_save: 'Save',

    // Hero Section
    hero_welcome: 'Welcome to Our Website',
    hero_subtitle: 'Find the best solutions for your digital needs',
    hero_social: 'Social Media',
    hero_project: 'Project',

    // Menu Section
    menu_title: 'MENU',
    menu_history: 'History of World',
    menu_coding: 'Learn Coding',
    menu_design: 'Learn Design',
    menu_marketing: 'Learn Marketing',
    menu_business: 'Learn Business',
    menu_productivity: 'Learn Productivity',
    menu_tools: 'Learn Tools',
    menu_other: 'Others',

    // Project Section
    project_title: 'PROJECT',

    // Herta Section
    herta_title: 'HERTA',

    // About Section
    about_title: 'About Us',
    about_desc1: 'We are a professional team dedicated to providing the best digital solutions for our clients.',
    about_desc2: 'By providing an amazing learning experience, we help users achieve their goals easily and efficiently.',
    about_desc3: 'Our commitment is to deliver amazing results and help users achieve their goals.',

    // Social Media Section
    social_title: 'Social Media',

    // Footer
    namespace: 'Your gateway to a simpler, more secure computing experience. Lightweight, fast, and user-friendly.',
    footer_copyright: '&copy; 2026 Thertaria Project. All rights reserved.'
  }
};

// Get stored language or default to Indonesian
function getCurrentLanguage() {
  return localStorage.getItem('language') || 'id';
}

// Set language in localStorage
function setLanguage(lang) {
  localStorage.setItem('language', lang);
  applyTranslations(lang);
}

// Apply translations to all elements with data-i18n attribute
function applyTranslations(lang) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (element.tagName === 'OPTION') {
        element.textContent = translations[lang][key];
      } else if (key === 'footer_copyright') {
        element.innerHTML = translations[lang][key];
      } else {
        element.textContent = translations[lang][key];
      }
    }
  });

  // Update html lang attribute
  document.documentElement.lang = lang;
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
  const currentLang = getCurrentLanguage();
  applyTranslations(currentLang);

  // Set language selector to current language
  const languageSelect = document.getElementById('language');
  if (languageSelect) {
    languageSelect.value = currentLang;

    // Add event listener for language change
    languageSelect.addEventListener('change', function(e) {
      setLanguage(e.target.value);
    });
  }
});
