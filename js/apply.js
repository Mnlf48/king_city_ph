/* ================================================================
   KINGS CITY — apply.js
   Form validation and submission simulation
================================================================ */
(function(){
  'use strict';

  const form    = document.querySelector('#apply-form');
  const success = document.querySelector('#apply-success');

  if (!form) return;

  /* ── Real-time validation ── */
  function validateField(input) {
    const group = input.closest('.form-group');
    if (!group) return true;
    const errEl = group.querySelector('.form-error-msg');
    let valid = true;
    if (input.required && !input.value.trim()) {
      valid = false;
      if (errEl) errEl.textContent = 'This field is required.';
    } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      valid = false;
      if (errEl) errEl.textContent = 'Please enter a valid email.';
    }
    group.classList.toggle('has-error', !valid);
    return valid;
  }

  form.querySelectorAll('input,select,textarea').forEach(el => {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => {
      if (el.closest('.form-group')?.classList.contains('has-error')) validateField(el);
    });
  });

  /* ── Submit ── */
  form.addEventListener('submit', e => {
    e.preventDefault();
    let allValid = true;
    form.querySelectorAll('input,select,textarea').forEach(el => {
      if (!validateField(el)) allValid = false;
    });
    if (!allValid) return;

    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; btn.style.opacity = '.7' }

    setTimeout(() => {
      form.closest('.apply-form-section') && (form.closest('.apply-form-section').style.display = 'none');
      if (success) { success.style.display = 'block'; success.scrollIntoView({ behavior:'smooth', block:'center' }) }
    }, 900);
  });

  /* ── Character counter for message field ── */
  const msgField = document.querySelector('#apply-message');
  const msgCount = document.querySelector('#apply-msg-count');
  if (msgField && msgCount) {
    msgField.addEventListener('input', () => {
      msgCount.textContent = msgField.value.length;
    });
  }

})();
