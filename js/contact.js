document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var button = form && form.querySelector('button[type="submit"]');
  if (!form || !status || !button) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (form.elements['contact-name'].value.trim().length < 2 || form.elements['contact-message'].value.trim().length < 10) {
      status.textContent = 'Lütfen adınızı ve en az 10 karakterlik bir mesajı eksiksiz girin.';
      status.className = 'form-status is-error';
      status.hidden = false;
      return;
    }
    if (form.elements._honey.value) return;
    var originalContent = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<span class="loading-spinner" aria-hidden="true"></span> Gönderiliyor...';
    status.hidden = true;
    status.className = 'form-status';

    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (response) {
        if (!response.ok) throw new Error('Mesaj gönderilemedi.');
        return response.json();
      })
      .then(function () {
        form.reset();
        status.textContent = 'Mesajın gönderildi, teşekkürler!';
        status.className = 'form-status is-success';
        status.hidden = false;
      })
      .catch(function (error) {
        status.textContent = error.message || 'Bir hata oluştu. Lütfen biraz sonra tekrar deneyin.';
        status.className = 'form-status is-error';
        status.hidden = false;
      })
      .finally(function () {
        window.setTimeout(function () {
          button.disabled = false;
          button.innerHTML = originalContent;
        }, 3500);
      });
  });
});
