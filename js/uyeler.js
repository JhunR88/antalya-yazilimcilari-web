/**
 * Antalya Yazılımcıları - Üyeler Sayfası Mantığı (js/uyeler.js)
 * Üyeleri JSON'dan çeker ve kartlarını oluşturur.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var grid = document.getElementById('members-grid');
  var totalMembersStat = document.getElementById('stat-total-members');

  if (!grid) return;

  Promise.all([
    fetch('data/uyeler.json').then(function (r) { return r.json(); }),
    fetch('data/projeler.json').then(function (r) { return r.json(); }),
    fetch('data/topluluk.json').then(function (r) { return r.json(); })
  ])
    .then(function (results) {
      var members = results[0];
      var projects = results[1];
      var community = results[2];

      if (totalMembersStat) {
        totalMembersStat.textContent = (Number(community.uyeSayisi) || members.length) + '+';
      }

      // Her üyenin kaç projesi olduğunu hesapla
      var projectCountMap = {};
      projects.forEach(function (p) {
        var key = p.uyeId || p.uye;
        projectCountMap[key] = (projectCountMap[key] || 0) + 1;
        if (p.uye) projectCountMap[p.uye] = (projectCountMap[p.uye] || 0) + 1;
      });

      grid.innerHTML = members.map(function (m) {
        var count = (projectCountMap[m.id] || projectCountMap[m.ad] || 0);
        var skillsHTML = (m.uzmanliklar || []).map(function (s) {
          return '<span class="badge" style="font-size: 0.72rem;">' + window.AYUtils.escapeHTML(s) + '</span>';
        }).join('');

        return `
          <article class="member-card">
            <div class="member-avatar-wrap">
              <img 
                src="${window.AYUtils.escapeHTML(m.foto || 'assets/images/placeholder.svg')}" 
                alt="${window.AYUtils.escapeHTML(m.ad)}" 
                class="member-avatar"
                loading="lazy"
                onerror="this.onerror=null;this.src='photos/profil.jpg';"
              >
            </div>

            <h3 class="member-name">${window.AYUtils.escapeHTML(m.ad)}</h3>
            <p class="member-title">${window.AYUtils.escapeHTML(m.unvan || 'Topluluk Üyesi')}</p>

            <p class="member-bio">${window.AYUtils.escapeHTML(m.bio || '')}</p>

            <div class="member-skills" aria-label="Uzmanlık Alanları">
              ${skillsHTML}
            </div>

            <div style="margin-bottom: 1.25rem;">
              <a href="projeler.html?uye=${encodeURIComponent(m.id || m.ad)}" class="btn btn-secondary btn-sm" style="width: 100%;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                Projeleri Gör (${count})
              </a>
            </div>

            <div class="member-social-links">
              ${m.linkedin ? `
                <a href="${window.AYUtils.escapeHTML(m.linkedin)}" target="_blank" rel="noopener noreferrer" class="icon-btn" aria-label="${window.AYUtils.escapeHTML(m.ad)} LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              ` : ''}
            </div>
          </article>
        `;
      }).join('');
    })
    .catch(function (err) {
      console.error(err);
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h3>Üyeler Yüklenemedi</h3>
          <p>Veriler alınırken bir sorun meydana geldi.</p>
        </div>
      `;
    });
});
