/**
 * Antalya Yazılımcıları - Projeler Sayfası Mantığı (js/projeler.js)
 * Projeleri JSON'dan dinamik çeker, arama ve filtreleme (kategori, teknoloji, üye) sunar.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var grid = document.getElementById('projects-grid');
  var searchInput = document.getElementById('search-input');
  var categoryFilter = document.getElementById('category-filter');
  var techFilter = document.getElementById('tech-filter');
  var resultCount = document.getElementById('result-count');
  var resetBtn = document.getElementById('reset-filters-btn');

  if (!grid) return;

  var allProjects = [];

  // URL parametrelerini oku (örn: ?uye=ahmet-yilmaz veya ?kategori=IoT)
  var urlParams = new URLSearchParams(window.location.search);
  var initialMemberFilter = urlParams.get('uye') || '';
  var initialCategoryFilter = urlParams.get('kategori') || '';
  var initialSearch = urlParams.get('q') || '';

  // 1. Projeleri Yükle
  fetch('data/projeler.json')
    .then(function (response) {
      if (!response.ok) throw new Error('Projeler verisi alınamadı');
      return response.json();
    })
    .then(function (data) {
      allProjects = data;
      populateFilterDropdowns(allProjects);

      // URL'den gelen başlangıç değerleri varsa uygula
      if (initialCategoryFilter && categoryFilter) {
        categoryFilter.value = initialCategoryFilter;
      }
      if (initialSearch && searchInput) {
        searchInput.value = initialSearch;
      }

      applyFilters();
    })
    .catch(function (err) {
      console.error(err);
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h3>Projeler Yüklenemedi</h3>
          <p>Veriler alınırken bir sorun oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.</p>
        </div>
      `;
    });

  // 2. Filtre Seçeneklerini Dinamik Olarak Doldur
  function populateFilterDropdowns(projects) {
    if (!categoryFilter || !techFilter) return;

    var categories = new Set();
    var technologies = new Set();

    projects.forEach(function (p) {
      if (p.kategori) categories.add(p.kategori);
      if (Array.isArray(p.teknolojiler)) {
        p.teknolojiler.forEach(function (t) { technologies.add(t); });
      }
    });

    // Kategori dropdown
    Array.from(categories).sort().forEach(function (cat) {
      var opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });

    // Teknoloji dropdown
    Array.from(technologies).sort().forEach(function (tech) {
      var opt = document.createElement('option');
      opt.value = tech;
      opt.textContent = tech;
      techFilter.appendChild(opt);
    });
  }

  // 3. Filtreleme ve Arama Mantığı
  function applyFilters() {
    var query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    var selectedCategory = categoryFilter ? categoryFilter.value : '';
    var selectedTech = techFilter ? techFilter.value : '';

    var filtered = allProjects.filter(function (p) {
      // Üye filtresi (URL parametresinden)
      if (initialMemberFilter) {
        var memberMatch = (p.uyeId === initialMemberFilter) || 
                          (p.uye && p.uye.toLowerCase().includes(initialMemberFilter.toLowerCase()));
        if (!memberMatch) return false;
      }

      // Kategori filtresi
      if (selectedCategory && p.kategori !== selectedCategory) {
        return false;
      }

      // Teknoloji filtresi
      if (selectedTech) {
        var hasTech = Array.isArray(p.teknolojiler) && p.teknolojiler.some(function (t) {
          return t.toLowerCase() === selectedTech.toLowerCase();
        });
        if (!hasTech) return false;
      }

      // Arama kutusu (Ad, Açıklama, Teknolojiler veya Üye Adı)
      if (query) {
        var inName = (p.ad || '').toLowerCase().includes(query);
        var inShortDesc = (p.kisaAciklama || '').toLowerCase().includes(query);
        var inLongDesc = (p.uzunAciklama || '').toLowerCase().includes(query);
        var inAuthor = (p.uye || '').toLowerCase().includes(query);
        var inTech = Array.isArray(p.teknolojiler) && p.teknolojiler.some(function (t) {
          return t.toLowerCase().includes(query);
        });

        if (!inName && !inShortDesc && !inLongDesc && !inAuthor && !inTech) {
          return false;
        }
      }

      return true;
    });

    renderProjects(filtered);
    updateResultCount(filtered.length);

    // Filtre temizleme butonunun görünürlüğü
    var isFiltered = query !== '' || selectedCategory !== '' || selectedTech !== '' || initialMemberFilter !== '';
    if (resetBtn) {
      resetBtn.style.display = isFiltered ? 'inline-block' : 'none';
    }
  }

  // 4. Projeleri Ekrana Basma
  function renderProjects(projects) {
    if (projects.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3>Sonuç Bulunamadı</h3>
          <p>Aradığınız kriterlere uygun bir proje bulunamadı. Lütfen arama teriminizi veya filtrelerinizi değiştirin.</p>
          <button id="empty-reset-btn" class="btn btn-secondary btn-sm">Tüm Projeleri Göster</button>
        </div>
      `;

      var emptyResetBtn = document.getElementById('empty-reset-btn');
      if (emptyResetBtn) {
        emptyResetBtn.addEventListener('click', resetAllFilters);
      }
      return;
    }

    grid.innerHTML = projects.map(function (p) {
      return window.AYUtils.createProjectCardHTML(p);
    }).join('');
  }

  // 5. Sonuç Sayacı Güncelleme
  function updateResultCount(count) {
    if (!resultCount) return;
    if (initialMemberFilter) {
      resultCount.innerHTML = `<strong>${count}</strong> proje listeleniyor (Üye filtresi aktif)`;
    } else {
      resultCount.innerHTML = `Toplam <strong>${count}</strong> proje gösteriliyor`;
    }
  }

  // 6. Tüm Filtreleri Sıfırla
  function resetAllFilters() {
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (techFilter) techFilter.value = '';
    initialMemberFilter = '';

    // URL'deki query parametrelerini temizle (sayfayı yenilemeden)
    if (window.history.pushState) {
      var newUrl = window.location.pathname;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    applyFilters();
  }

  // Olay Dinleyicileri (Event Listeners)
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
  }
  if (techFilter) {
    techFilter.addEventListener('change', applyFilters);
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', resetAllFilters);
  }
});
