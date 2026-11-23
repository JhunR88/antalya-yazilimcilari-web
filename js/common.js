/**
 * Antalya Yazılımcıları - Ortak Fonksiyonlar (js/common.js)
 * Mobil menü, navigasyon vurgulama ve ortak kart şablonları
 */

(function () {
  'use strict';

  // 1. Mobil Gezinme Menüsü Yönetimi
  function setupMobileMenu() {
    var menuBtn = document.getElementById('mobile-menu-btn');
    var navDrawer = document.getElementById('mobile-nav-drawer');

    if (!menuBtn || !navDrawer) return;

    function toggleMenu() {
      var isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      navDrawer.classList.toggle('open', !isExpanded);
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    }

    function closeMenu() {
      menuBtn.setAttribute('aria-expanded', 'false');
      navDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', toggleMenu);

    // ESC tuşuna basıldığında menüyü kapat
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
        closeMenu();
      }
    });

    // Menü dışına veya linklere tıklandığında kapat
    navDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // 2. Aktif Navigasyon Bağlantısını Vurgulama
  function highlightActiveNav() {
    var currentPath = window.location.pathname;
    var currentPage = currentPath.split('/').pop() || 'index.html';

    // Eğer parametresiz / veya boş ise index.html sayılır
    if (!currentPage || currentPage === '') currentPage = 'index.html';

    var allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;

      var linkPage = href.split('/').pop();
      if (linkPage === currentPage || (currentPage === 'proje.html' && linkPage === 'projeler.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // 3. Proje Kartı HTML Şablon Üreticisi
  // Tüm sayfalarda tutarlı, erişilebilir ve modern kart yapısı
  function createProjectCardHTML(project) {
    var fallbackImage = 'assets/images/placeholder.svg';
    var imageSrc = project.gorsel || fallbackImage;

    // Teknolojiler rozetleri (ilk 3-4 teknoloji gösterilir)
    var techBadges = (project.teknolojiler || []).slice(0, 4).map(function (tech) {
      return '<span class="badge badge-tech">' + escapeHTML(tech) + '</span>';
    }).join('');

    // Güvenli HTML üretimi
    return `
      <article class="project-card" data-category="${escapeHTML(project.kategori || '')}">
        <div class="project-card-image-wrap">
          <span class="badge badge-category project-card-badge">${escapeHTML(project.kategori || 'Genel')}</span>
          <img 
            src="${escapeHTML(imageSrc)}" 
            alt="${escapeHTML(project.ad)} proje görseli" 
            class="project-card-image"
            loading="lazy"
            onerror="this.onerror=null;this.src='${fallbackImage}';"
          >
        </div>
        <div class="project-card-body">
          <div class="project-card-author">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Geliştirici: <strong>${escapeHTML(project.uye || 'Topluluk Üyesi')}</strong></span>
          </div>

          <h3 class="project-card-title">
            <a href="proje.html?id=${encodeURIComponent(project.id)}">${escapeHTML(project.ad)}</a>
          </h3>

          <p class="project-card-desc">${escapeHTML(project.kisaAciklama || '')}</p>

          <div class="project-tech-tags" aria-label="Kullanılan Teknolojiler">
            ${techBadges}
          </div>

          <div class="project-card-footer">
            <a href="proje.html?id=${encodeURIComponent(project.id)}" class="btn btn-sm btn-primary">
              Detayları Gör
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>

            <div class="card-links-left">
              ${project.demoLink ? `
                <a href="${escapeHTML(project.demoLink)}" target="_blank" rel="noopener noreferrer" class="icon-btn" title="Canlı Önizleme" aria-label="${escapeHTML(project.ad)} Canlı Önizleme">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
              ` : ''}

            </div>
          </div>
        </div>
      </article>
    `;
  }

  // 4. XSS Güvenliği için HTML Kaçırma Fonksiyonu
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupHeaderEnhancements() {
    var header = document.querySelector('.site-header');
    var actions = document.querySelector('.header-actions');
    if (!header || !actions) return;
    if (!actions.querySelector('.header-join-button')) {
      var join = document.createElement('a');
      join.className = 'header-join-button magnetic-btn';
      join.href = 'iletisim.html';
      join.textContent = 'Topluluğa Katıl';
      actions.insertBefore(join, actions.firstChild);
    }
    var progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    header.appendChild(progress);
    function update() {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      header.classList.toggle('is-scrolled', window.scrollY > 20);
      progress.style.transform = 'scaleX(' + ratio + ')';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function setupFooterEnhancements() {
    document.querySelectorAll('.footer-brand').forEach(function (brand) {
      if (brand.querySelector('.footer-meeting')) return;
      var meeting = document.createElement('div');
      meeting.className = 'footer-meeting';
      meeting.innerHTML = '<strong>Haftalık Buluşma</strong><span>Her Pazar · 18:00 - 21:00<br>Antalya Muratpaşa, Mark Antalya AVM 4. Kat, Roberts Coffee</span>';
      brand.appendChild(meeting);
    });
  }

  function setupTiltAndReveal() {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(pointer: fine)').matches;
    var revealObserver = 'IntersectionObserver' in window && !reducedMotion ? new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 }) : null;
    function enhance(root) {
      var targets = root.matches && root.matches('.section, .project-card, .member-card, .event-card, .meeting-banner, .contact-grid > div') ? [root] : Array.from(root.querySelectorAll('.section, .project-card, .member-card, .event-card, .meeting-banner, .contact-grid > div'));
      targets.forEach(function (element, index) {
        if (revealObserver && !element.classList.contains('reveal-item')) {
          element.classList.add('reveal-item');
          element.style.setProperty('--reveal-delay', Math.min(index * 55, 260) + 'ms');
          revealObserver.observe(element);
        }
        if (finePointer && !reducedMotion && !element.classList.contains('tilt-card')) {
          element.classList.add('tilt-card');
          element.addEventListener('pointermove', function (event) {
            var rect = element.getBoundingClientRect();
            var x = (event.clientX - rect.left) / rect.width;
            var y = (event.clientY - rect.top) / rect.height;
            element.style.setProperty('--tilt-x', ((0.5 - y) * 7).toFixed(2) + 'deg');
            element.style.setProperty('--tilt-y', ((x - 0.5) * 7).toFixed(2) + 'deg');
            element.style.setProperty('--shine-x', (x * 100).toFixed(1) + '%');
            element.style.setProperty('--shine-y', (y * 100).toFixed(1) + '%');
          });
          element.addEventListener('pointerleave', function () {
            element.style.setProperty('--tilt-x', '0deg');
            element.style.setProperty('--tilt-y', '0deg');
          });
        }
      });
    }
    enhance(document.body);
    new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) { if (node.nodeType === 1) enhance(node); });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  function setupMagneticButtons() {
    if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.magnetic-btn').forEach(function (button) {
        button.addEventListener('pointermove', function (event) {
          var rect = button.getBoundingClientRect();
          button.style.transform = 'translate(' + ((event.clientX - rect.left - rect.width / 2) * 0.12).toFixed(1) + 'px, ' + ((event.clientY - rect.top - rect.height / 2) * 0.12).toFixed(1) + 'px)';
        });
        button.addEventListener('pointerleave', function () { button.style.transform = ''; });
      });
    }
  }

  // DOM hazır olduğunda ortak işlemleri başlat
  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    highlightActiveNav();
    setupHeaderEnhancements();
    setupFooterEnhancements();
    setupTiltAndReveal();
    setupMagneticButtons();
  });

  // Global yardımcılar
  window.AYUtils = {
    createProjectCardHTML: createProjectCardHTML,
    escapeHTML: escapeHTML
  };
})();
