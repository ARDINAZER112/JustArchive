        // =================== Translation Data =======================
      // Translation data
const translations = {
   id: {
     // Navigation
  

     // Settings
    

  
     // Footer
  
   },
   en: {
     // Navigation
   

     // Settings
   
  

     // Footer
    
}};

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