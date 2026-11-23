/**
 * Antalya Yazılımcıları - Tema Yöneticisi (js/theme.js)
 * Koyu / Açık tema durumunu yönetir, localStorage'da saklar ve
 * sistem tercihi ile uyumlu çalışır.
 */

(function () {
  'use strict';

  var THEME_STORAGE_KEY = 'ay_theme_preference';
  var root = document.documentElement;

  // 1. Kaydedilmiş tercihi veya varsayılan koyu temayı al
  function getPreferredTheme() {
    var storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    // Sistem tercihi kontrolü (isteğe bağlı), varsayılan olarak koyu tema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  // 2. Temayı sayfaya uygula
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    updateToggleButtons(theme);
  }

  // 3. Tema butonlarındaki ikonları ve erişilebilirlik etiketlerini güncelle
  function updateToggleButtons(theme) {
    var buttons = document.querySelectorAll('.theme-toggle-btn');
    var isDark = theme === 'dark';

    buttons.forEach(function (btn) {
      btn.setAttribute('aria-label', isDark ? 'Açık temaya geç' : 'Koyu temaya geç');
      btn.setAttribute('title', isDark ? 'Açık temaya geç' : 'Koyu temaya geç');

      // Güneş (Açık tema için) veya Ay (Koyu tema için) ikonu
      if (isDark) {
        // Şu an koyu, tıklandığında açık olacak (Güneş ikonu göster)
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
      } else {
        // Şu an açık, tıklandığında koyu olacak (Ay ikonu göster)
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      }
    });
  }

  // 4. Temayı tersine çevir
  function toggleTheme() {
    var currentTheme = root.getAttribute('data-theme') || 'dark';
    var nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  // Sayfa yüklenmeden önce anında uygula (beyaz parlamayı önler)
  var initialTheme = getPreferredTheme();
  root.setAttribute('data-theme', initialTheme);

  // DOM hazır olduğunda dinleyicileri bağla
  document.addEventListener('DOMContentLoaded', function () {
    updateToggleButtons(initialTheme);

    var buttons = document.querySelectorAll('.theme-toggle-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });
  });

  // Global erişim
  window.AYTheme = {
    toggle: toggleTheme,
    get: function () { return root.getAttribute('data-theme'); },
    set: applyTheme
  };
})();
