/* ================================================================
   KINGS CITY — spaces.js
   Filter bar highlight on scroll
================================================================ */
(function () {
  'use strict';

  /* ── Filter bar: highlight active tab on click ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = document.querySelector(btn.dataset.target);
      if (target) {
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
        const filterH = 52;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navH - filterH - 8,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── Update active filter on scroll ── */
  const sections = document.querySelectorAll('[data-space-section]');
  if (sections.length && filterBtns.length) {
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY + navH + 100 >= sec.offsetTop) current = sec.id;
      });
      filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === '#' + current);
      });
    }, { passive: true });
  }

  /* ── Price table hover animation ── */
  document.querySelectorAll('.price-tbl-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.style.paddingLeft = '1.75rem';
    });
    row.addEventListener('mouseleave', () => {
      row.style.paddingLeft = '';
    });
  });

})();
