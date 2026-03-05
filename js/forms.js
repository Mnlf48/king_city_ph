/* ================================================================
   KINGS CITY — forms.js
   Shared form helpers
================================================================ */
(function () {
  'use strict';

  /* ── Phone number auto-format ── */
  document.querySelectorAll('input[type="tel"]').forEach(inp => {
    inp.addEventListener('input', () => {
      inp.value = inp.value.replace(/[^\d\s\+\-\(\)]/g, '');
    });
  });

  /* ── Floating label effect ── */
  document.querySelectorAll('.form-input, .form-textarea').forEach(inp => {
    const label = inp.closest('.form-group')?.querySelector('.form-label');
    if (!label) return;
    const check = () => inp.value ? label.classList.add('filled') : label.classList.remove('filled');
    inp.addEventListener('input', check);
    inp.addEventListener('blur', check);
    check();
  });

  /* ── Global error reset on focus ── */
  document.querySelectorAll('.form-input,.form-select,.form-textarea').forEach(el => {
    el.addEventListener('focus', () => {
      el.closest('.form-group')?.classList.remove('has-error');
    });
  });

})();
