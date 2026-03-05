/* ================================================================
   KINGS CITY — footer.js
   Newsletter form
================================================================ */
(function () {
  'use strict';

  const form = document.querySelector('#nl-form');
  const suc = document.querySelector('#nl-success');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const inp = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    if (!inp || !inp.value.trim()) return;

    inp.disabled = true;
    if (btn) { btn.disabled = true; btn.textContent = 'Joining…' }

    setTimeout(() => {
      form.querySelectorAll('input,button').forEach(el => el.style.display = 'none');
      if (suc) suc.style.display = 'block';

      setTimeout(() => {
        form.querySelectorAll('input,button').forEach(el => el.style.display = '');
        if (suc) suc.style.display = '';
        inp.disabled = false; inp.value = '';
        if (btn) { btn.disabled = false; btn.textContent = 'Join' }
      }, 5000);
    }, 500);
  });

})();
