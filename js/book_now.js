/* ================================================================
   KINGS CITY — book_now.js
   Tab navigation, booking form, price preview
================================================================ */
(function () {
  'use strict';

  /* ── Tab navigation ── */
  const tabs = document.querySelectorAll('.book-tab');
  const sections = document.querySelectorAll('.book-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      const sec = document.querySelector(`[data-book-section="${target}"]`);
      if (sec) sec.classList.add('active');
    });
  });

  /* ── Price preview update ── */
  const priceConfig = {
    coworking: { day: 500, week: 2500, month: 6000, annual: 60000 },
    meeting_small: { hourly: 500, day: 4000 },
    meeting_conf: { hourly: 1000, day: 8000 },
    events: { hourly: 5000, '4hr': 18000, fullday: 40000 },
    office: { '6seat': 48000, '9seat': 55000, '14seat': 112000 },
    virtual: { std_month: 3000, std_year: 30000, pro_month: 5000, pro_year: 50000 },
  };

  document.querySelectorAll('.book-duration-select').forEach(sel => {
    const formId = sel.closest('.book-section')?.dataset.bookSection;
    const priceEl = sel.closest('.book-form-body')?.querySelector('.bfp-price');
    sel.addEventListener('change', () => {
      if (!priceEl || !formId) return;
      const config = priceConfig[formId];
      if (config) {
        const price = config[sel.value];
        if (price !== undefined) {
          priceEl.textContent = 'Php ' + price.toLocaleString();
        }
      }
    });
    // Trigger initial
    sel.dispatchEvent(new Event('change'));
  });

  /* ── Booking form submit ── */
  document.querySelectorAll('.book-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const section = form.closest('.book-section');
      const conf = document.querySelector('#booking-confirm');

      if (btn) { btn.disabled = true; btn.textContent = 'Processing…'; btn.style.opacity = '.7' }

      setTimeout(() => {
        // Hide all sections
        document.querySelectorAll('.book-section').forEach(s => s.classList.remove('active'));
        tabs.forEach(t => t.classList.remove('active'));
        if (conf) { conf.style.display = 'block'; conf.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
      }, 1000);
    });
  });

  /* ── Date picker min date ── */
  document.querySelectorAll('input[type="date"]').forEach(inp => {
    const today = new Date().toISOString().split('T')[0];
    inp.min = today;
  });

  /* ── Summary updater ── */
  document.querySelectorAll('.book-section').forEach(sec => {
    const inputs = sec.querySelectorAll('input,select');
    inputs.forEach(inp => inp.addEventListener('change', updateSummary));

    function updateSummary() {
      const nameEl = sec.querySelector('.summary-val-name');
      const dateEl = sec.querySelector('.summary-val-date');
      const persEl = sec.querySelector('.summary-val-persons');
      const nameInp = sec.querySelector('input[name="full_name"]');
      const dateInp = sec.querySelector('input[type="date"]');
      const persInp = sec.querySelector('input[name="persons"], select[name="persons"]');
      if (nameEl && nameInp) nameEl.textContent = nameInp.value || '—';
      if (dateEl && dateInp) dateEl.textContent = dateInp.value || '—';
      if (persEl && persInp) persEl.textContent = persInp.value || '—';
    }
  });

})();
