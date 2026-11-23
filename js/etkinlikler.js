/** Ana sayfa ve etkinlikler sayfasının ortak etkinlik/takvim mantığı. */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var WEEKLY_MEETING = {
    day: 0,
    dayName: 'Pazar',
    startHour: 18,
    endHour: 21,
    timeLabel: '18:00 - 21:00',
    place: 'Mark Antalya AVM, 4. Kat, Roberts Coffee (Muratpaşa, Antalya)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mark%20Antalya%20AVM%20Roberts%20Coffee',
    title: 'Haftalık Antalya Yazılımcıları Buluşması',
    description: 'Projelerimizi tanıtıyor, birlikte öğreniyor ve Antalya\'daki yazılımcılarla üretken bir akşam geçiriyoruz.'
  };

  var upcomingMeeting = document.getElementById('upcoming-meeting');
  var statsContainer = document.getElementById('community-stats');
  var eventList = document.getElementById('event-list');
  var countdownTimer;

  function escapeHTML(value) { return window.AYUtils.escapeHTML(value || ''); }
  function pad(number) { return String(number).padStart(2, '0'); }

  function getIstanbulParts() {
    var parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit',
      weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).formatToParts(new Date()).reduce(function (result, part) {
      result[part.type] = part.value;
      return result;
    }, {});
    return {
      year: Number(parts.year), month: Number(parts.month), day: Number(parts.day),
      hour: Number(parts.hour) === 24 ? 0 : Number(parts.hour), minute: Number(parts.minute), second: Number(parts.second),
      weekday: new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day))).getUTCDay()
    };
  }

  function dateKey(date) { return date.year + '-' + pad(date.month) + '-' + pad(date.day); }

  function addDays(date, amount) {
    var result = new Date(Date.UTC(date.year, date.month - 1, date.day + amount));
    return { year: result.getUTCFullYear(), month: result.getUTCMonth() + 1, day: result.getUTCDate(), weekday: result.getUTCDay(), hour: date.hour, minute: date.minute, second: date.second };
  }

  function getNextWeeklyMeeting() {
    var now = getIstanbulParts();
    var daysUntil = (WEEKLY_MEETING.day - now.weekday + 7) % 7;
    if (daysUntil === 0 && now.hour >= WEEKLY_MEETING.endHour) daysUntil = 7;
    var date = addDays(now, daysUntil);
    date.key = dateKey(date);
    date.isToday = daysUntil === 0;
    date.isLive = date.isToday && now.hour >= WEEKLY_MEETING.startHour && now.hour < WEEKLY_MEETING.endHour;
    return date;
  }

  function dateToInstant(date, hour) { return new Date(Date.UTC(date.year, date.month - 1, date.day, hour - 3, 0, 0)); }

  function formatDate(key) {
    var instant = new Date(key + 'T12:00:00Z');
    var date = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', day: 'numeric', month: 'long', year: 'numeric' }).format(instant);
    var weekday = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', weekday: 'long' }).format(instant);
    return date + ', ' + weekday;
  }

  function calendarIcon() {
    return '<svg class="meeting-calendar-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';
  }

  function renderCountdown(container, meetingDate) {
    if (!container) return;
    function update() {
      var now = new Date();
      var start = dateToInstant(meetingDate, WEEKLY_MEETING.startHour);
      var end = dateToInstant(meetingDate, WEEKLY_MEETING.endHour);
      if (now >= start && now < end) {
        container.innerHTML = '<span class="countdown-live">● Şu an toplantı var</span>';
        return;
      }
      if (now >= end) {
        clearInterval(countdownTimer);
        renderUpcomingMeeting();
        return;
      }
      var difference = Math.max(start - now, 0);
      var days = Math.floor(difference / 86400000);
      var hours = Math.floor((difference % 86400000) / 3600000);
      var minutes = Math.floor((difference % 3600000) / 60000);
      var seconds = Math.floor((difference % 60000) / 1000);
      container.innerHTML = '<span class="countdown-label">Başlamasına</span><strong>' + days + ' gün ' + pad(hours) + ':' + pad(minutes) + ':' + pad(seconds) + '</strong>';
    }
    update();
    countdownTimer = window.setInterval(update, 1000);
  }

  function renderUpcomingMeeting() {
    if (!upcomingMeeting) return;
    var meeting = getNextWeeklyMeeting();
    var badge = meeting.isLive ? 'Şu an toplantı var' : (meeting.isToday ? 'Bugün!' : 'Yaklaşan Toplantı');
    upcomingMeeting.innerHTML = '<span class="section-tag" style="background: rgba(6, 182, 212, 0.2);">' + badge + '</span><h3>' + escapeHTML(WEEKLY_MEETING.title) + '</h3><div class="meeting-date">' + calendarIcon() + '<span>' + escapeHTML(formatDate(meeting.key)) + ' · ' + escapeHTML(WEEKLY_MEETING.timeLabel) + '</span></div><p class="meeting-place"><strong>Yer:</strong> ' + escapeHTML(WEEKLY_MEETING.place) + '</p><p>' + escapeHTML(WEEKLY_MEETING.description) + '</p><div class="meeting-countdown" aria-live="polite"></div><div class="meeting-actions"><a href="' + WEEKLY_MEETING.mapsUrl + '" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Haritada Aç</a><a href="iletisim.html" class="btn btn-primary">Katılmak İstiyorum</a></div>';
    renderCountdown(upcomingMeeting.querySelector('.meeting-countdown'), meeting);
  }

  function animateNumber(element, value) {
    var startedAt = performance.now();
    function tick(timestamp) {
      var progress = Math.min((timestamp - startedAt) / 700, 1);
      element.textContent = Math.floor(value * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) window.requestAnimationFrame(tick);
      else element.textContent = value + (value === 100 ? '+' : '');
    }
    window.requestAnimationFrame(tick);
  }

  function renderStats(projects, community) {
    if (!statsContainer) return;
    [{ label: 'Üye sayısı', value: Number(community.uyeSayisi) || 0 }, { label: 'Proje sayısı', value: projects.length }, { label: 'Toplantı sayısı', value: Number(community.toplantiSayisi) || 0 }].forEach(function (stat) {
      var item = document.createElement('div');
      item.className = 'community-stat';
      item.innerHTML = '<strong class="community-stat-number">0</strong><span>' + escapeHTML(stat.label) + '</span>';
      statsContainer.appendChild(item);
      animateNumber(item.querySelector('.community-stat-number'), stat.value);
    });
  }

  function renderEventList(events) {
    if (!eventList) return;
    var weekly = getNextWeeklyMeeting();
    var weeklyItem = { key: weekly.key, title: WEEKLY_MEETING.title, time: WEEKLY_MEETING.timeLabel, place: WEEKLY_MEETING.place, description: WEEKLY_MEETING.description, upcoming: true };
    var now = new Date();
    var custom = events.filter(function (event) { return event.tarih; }).map(function (event) {
      return { key: event.tarih, title: event.baslik, time: event.saat, place: event.yer, description: event.aciklama, upcoming: new Date(event.tarih + 'T23:59:59') >= now };
    });
    var all = custom.concat([weeklyItem]).sort(function (a, b) {
      if (a.upcoming !== b.upcoming) return a.upcoming ? -1 : 1;
      return a.upcoming ? a.key.localeCompare(b.key) : b.key.localeCompare(a.key);
    });
    eventList.innerHTML = all.map(function (event) {
      return '<article class="event-card ' + (event.upcoming ? 'event-card-upcoming' : '') + '"><div class="event-card-date">' + calendarIcon() + '<span>' + escapeHTML(formatDate(event.key)) + '</span></div><h2>' + escapeHTML(event.title) + '</h2><p><strong>Saat:</strong> ' + escapeHTML(event.time) + '<br><strong>Yer:</strong> ' + escapeHTML(event.place) + '</p><p>' + escapeHTML(event.description) + '</p><span class="badge">' + (event.upcoming ? 'Yaklaşan' : 'Gerçekleşti') + '</span></article>';
    }).join('');
  }

  renderUpcomingMeeting();
  Promise.all([
    fetch('data/etkinlikler.json').then(function (response) { return response.json(); }),
    fetch('data/projeler.json').then(function (response) { return response.json(); }),
    fetch('data/topluluk.json').then(function (response) { return response.json(); })
  ]).then(function (result) {
    renderStats(result[1], result[2]);
    renderEventList(result[0]);
  }).catch(function (error) {
    console.error('Etkinlik verileri yüklenemedi:', error);
    if (eventList) eventList.innerHTML = '<div class="empty-state"><h3>Etkinlikler yüklenemedi</h3><p>Lütfen sayfayı yenileyin.</p></div>';
  });
});
