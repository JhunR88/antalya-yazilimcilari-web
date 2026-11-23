/**
 * Antalya Yazılımcıları - Ana Sayfa Mantığı (js/home.js)
 * Ana sayfadaki öne çıkan projeleri JSON'dan dinamik olarak yükler ve render eder.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var container = document.getElementById('featured-projects-grid');
  var totalProjectsStat = document.getElementById('stat-total-projects');

  var typingTarget = document.getElementById('typing-text');
  if (typingTarget && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var phrases = ['Birlikte öğreniyoruz.', 'Birlikte üretiyoruz.', 'Projelerimizi sergiliyoruz.'];
    var phraseIndex = 0;
    var characterIndex = 0;
    var deleting = false;
    function typePhrase() {
      var phrase = phrases[phraseIndex];
      characterIndex += deleting ? -1 : 1;
      typingTarget.textContent = phrase.slice(0, characterIndex);
      var delay = deleting ? 42 : 78;
      if (!deleting && characterIndex === phrase.length) { deleting = true; delay = 1500; }
      if (deleting && characterIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 350; }
      window.setTimeout(typePhrase, delay);
    }
    window.setTimeout(typePhrase, 900);
  }
  // Öne Çıkan Projeleri Yükle (data/projeler.json)
  if (container) {
    fetch('data/projeler.json')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Projeler yüklenirken hata oluştu: ' + response.statusText);
        }
        return response.json();
      })
      .then(function (projects) {
        if (totalProjectsStat) {
          totalProjectsStat.textContent = projects.length + '+';
        }

        // Öne çıkanları seç (oneCikan: true) veya ilk 3 taneyi al
        var featured = projects.filter(function (p) {
          return p.oneCikan === true;
        });

        if (featured.length === 0) {
          featured = projects.slice(0, 3);
        } else {
          featured = featured.slice(0, 3);
        }

        var html = featured.map(function (project) {
          return window.AYUtils.createProjectCardHTML(project);
        }).join('');

        container.innerHTML = html;
      })
      .catch(function (error) {
        console.error('Hata:', error);
        container.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <p>Projeler yüklenirken bir problem meydana geldi. Lütfen sayfayı yenileyiniz.</p>
          </div>
        `;
      });
  }
});
