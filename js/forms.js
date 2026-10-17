/* Frontend-only form handling. Nothing is transmitted anywhere. */
(function () {
  'use strict';
  const F = window.FORME;
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  F.validEmail = (v) => EMAIL.test(String(v).trim());

  document.addEventListener('submit', (e) => {
    const f = e.target.closest('.js-newsletter'); if (!f) return;
    e.preventDefault();
    const input = f.querySelector('input[type=email]'), msg = f.querySelector('.nl-msg'), v = input.value.trim();
    msg.className = 'nl-msg';
    if (!v) { input.setAttribute('aria-invalid', 'true'); msg.textContent = 'Please enter your email address.'; msg.classList.add('is-err'); input.focus(); return; }
    if (!F.validEmail(v)) { input.setAttribute('aria-invalid', 'true'); msg.textContent = 'That email does not look right. Check it and try again.'; msg.classList.add('is-err'); input.focus(); return; }
    input.removeAttribute('aria-invalid');
    msg.textContent = `Thanks. This is a demo, so ${v} was not sent or saved anywhere.`;
    msg.classList.add('is-ok'); input.value = '';
  });
  document.addEventListener('input', (e) => { if (e.target.matches('.js-newsletter input')) e.target.removeAttribute('aria-invalid'); });
})();
