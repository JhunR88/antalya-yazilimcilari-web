/**
 * Antalya Yazılımcıları - Proje Detay Sayfası Mantığı (js/proje-detay.js)
 * URL'deki ?id=... parametresini okur, projeler.json ve uyeler.json ile birleştirip
 * zengin detay sayfasını oluşturur.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var detailContainer = document.getElementById('project-detail-container');
  if (!detailContainer) return;

  var urlParams = new URLSearchParams(window.location.search);
  var projectId = urlParams.get('id');

  if (!projectId) {
    showNotFound('Herhangi bir proje seçilmedi. Lütfen projeler listesinden bir proje seçin.');
    return;
  }

  // Hem projeleri hem de üyeleri eşzamanlı çek
  Promise.all([
    fetch('data/projeler.json').then(function (r) { return r.json(); }),
    fetch('data/uyeler.json').then(function (r) { return r.json(); })
  ])
    .then(function (results) {
      var projects = results[0];
      var members = results[1];

      var project = projects.find(function (p) {
        return p.id === projectId;
      });

      if (!project) {
        showNotFound('Belirtilen ID değerine sahip proje sistemde bulunamadı.');
        return;
      }

      // Proje sahibini uyeler.json içinden bul (uyeId veya isim eşleşmesi)
      var author = members.find(function (m) {
        return (project.uyeId && m.id === project.uyeId) || (m.ad === project.uye);
      });

      renderProjectDetail(project, author);
    })
    .catch(function (error) {
      console.error(error);
      showNotFound('Proje verileri yüklenirken bir sorun oluştu.');
    });

  function renderProjectDetail(project, author) {
    // Sayfa başlığını ve meta etiketlerini güncelle
    document.title = project.ad + ' - Proje Detayı | Antalya Yazılımcıları';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && project.kisaAciklama) {
      metaDesc.setAttribute('content', project.kisaAciklama);
    }

    var fallbackImage = 'assets/images/placeholder.svg';
    var imageSrc = project.gorsel || fallbackImage;

    // Teknoloji etiketleri
    var techBadges = (project.teknolojiler || []).map(function (tech) {
      return '<span class="badge badge-tech" style="font-size: 0.85rem; padding: 0.35rem 0.85rem;">' + window.AYUtils.escapeHTML(tech) + '</span>';
    }).join('');

    // Yazar kartı HTML
    var authorHTML = '';
    if (author) {
      authorHTML = `
        <div class="sidebar-card">
          <h3 class="sidebar-card-title">Geliştirici Hakkında</h3>
          <div class="author-profile-box">
            <img 
              src="${window.AYUtils.escapeHTML(author.foto || 'assets/images/placeholder.svg')}" 
              alt="${window.AYUtils.escapeHTML(author.ad)}" 
              class="author-avatar"
            >
            <div class="author-info">
              <h4>${window.AYUtils.escapeHTML(author.ad)}</h4>
              <p>${window.AYUtils.escapeHTML(author.unvan || 'Topluluk Üyesi')}</p>
            </div>
          </div>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
            ${window.AYUtils.escapeHTML(author.bio || '')}
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a href="projeler.html?uye=${encodeURIComponent(author.id || author.ad)}" class="btn btn-secondary btn-sm" style="flex: 1;">
              Üyenin Tüm Projeleri
            </a>
            <a href="uyeler.html" class="btn btn-secondary btn-sm" title="Tüm Üyeler">
              Profili İncele
            </a>
          </div>
        </div>
      `;
    } else {
      authorHTML = `
        <div class="sidebar-card">
          <h3 class="sidebar-card-title">Geliştirici</h3>
          <p><strong>${window.AYUtils.escapeHTML(project.uye || 'Anonim Üye')}</strong></p>
        </div>
      `;
    }

    // Ana detay düzenini oluştur
    detailContainer.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <a href="projeler.html" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Tüm Projelere Dön
        </a>
      </div>

      <div class="project-detail-layout">
        <!-- Sol: Proje İçeriği -->
        <article class="project-detail-main">
          <img 
            src="${window.AYUtils.escapeHTML(imageSrc)}" 
            alt="${window.AYUtils.escapeHTML(project.ad)}" 
            class="project-detail-hero-img"
            onerror="this.onerror=null;this.src='${fallbackImage}';"
          >
          <div class="project-detail-content">
            <header class="project-detail-header">
              <span class="badge badge-category" style="font-size: 0.85rem; padding: 0.35rem 0.85rem;">
                ${window.AYUtils.escapeHTML(project.kategori || 'Genel')}
              </span>
              <h1 class="project-detail-title">${window.AYUtils.escapeHTML(project.ad)}</h1>
              <p class="project-detail-lead">${window.AYUtils.escapeHTML(project.kisaAciklama || '')}</p>
            </header>

            <h2 class="detail-section-title">Kullanılan Teknolojiler &amp; Araçlar</h2>
            <div class="project-tech-tags" style="margin-bottom: 2rem;">
              ${techBadges}
            </div>

            <h2 class="detail-section-title">Proje Detayları &amp; Hikayesi</h2>
            <div class="project-detail-desc">
              ${window.AYUtils.escapeHTML(project.uzunAciklama || project.kisaAciklama || 'Proje detay açıklaması bulunmamaktadır.')}
            </div>
          </div>
        </article>

        <!-- Sağ: Bağlantılar & Geliştirici Bilgisi -->
        <aside class="project-detail-sidebar">
          <div class="sidebar-card">
            <h3 class="sidebar-card-title">Proje Bağlantıları</h3>
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${project.demoLink ? `
                <a href="${window.AYUtils.escapeHTML(project.demoLink)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  Canlı Demo / Web Sitesi
                </a>
              ` : `
                <button class="btn btn-secondary" disabled style="opacity: 0.6; cursor: not-allowed; width: 100%;">
                  Canlı Demo Mevcut Değil
                </button>
              `}

            </div>
          </div>

          ${authorHTML}

          <div class="sidebar-card" style="background: var(--color-accent-subtle); border-color: var(--color-accent-glow);">
            <h4 style="font-family: var(--font-heading); font-size: 1rem; color: var(--color-accent); margin-bottom: 0.5rem;">
              🚀 Kendi Projeni Tanıt
            </h4>
            <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">
              Sen de geliştirdiğin açık kaynak veya ticari projenin bu vitrinde yer almasını ister misin?
            </p>
            <a href="iletisim.html" class="btn btn-outline btn-sm" style="width: 100%;">
              Bize Ulaş &amp; Projeni Ekle
            </a>
          </div>
        </aside>
      </div>
    `;
  }

  function showNotFound(msg) {
    detailContainer.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2>Proje Bulunamadı</h2>
        <p>${window.AYUtils.escapeHTML(msg)}</p>
        <a href="projeler.html" class="btn btn-primary">Projeler Listesine Dön</a>
      </div>
    `;
  }
});
