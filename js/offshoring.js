/* ================================================================
   KINGS CITY — offshoring.js
   Animated counters, parallax, role icon assignment
================================================================ */
(function () {
  'use strict';

  /* ── Role icons (no emoji API, pure JS) ── */
  const roleIconMap = {
    'Accountants': '&#x1F4CA;',
    'Bookkeepers': '&#x1F4D2;',
    'Virtual Assistants': '&#x1F4BB;',
    'Graphic Designers': '&#x1F3A8;',
    'Web Developers': '&#x1F5A5;',
    'Customer Service': '&#x1F4DE;',
    'Digital Marketers': '&#x1F4F1;',
    'Data Analysts': '&#x1F4C8;',
    'HR Specialists': '&#x1F465;',
    'IT Support': '&#x1F527;',
    'Content Writers': '&#x270D;',
    'Project Managers': '&#x1F4CB;',
  };

  document.querySelectorAll('.role-icon').forEach(el => {
    const parentH4 = el.closest('.role-item')?.querySelector('h4');
    if (parentH4) {
      const key = Object.keys(roleIconMap).find(k => parentH4.textContent.includes(k));
      if (key) el.innerHTML = roleIconMap[key];
    }
  });

  /* ── Parallax on offshoring hero ── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.off-hero-bg .img-ph');
  if (!prefersReduced && hero && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) hero.style.transform = `translateY(${scrolled * 0.2}px)`;
    }, { passive: true });
  }

  /* ── Accordion: Why Philippines facts ── */
  document.querySelectorAll('.off-accordion-item').forEach(item => {
    const trigger = item.querySelector('.off-accordion-trigger');
    const content = item.querySelector('.off-accordion-content');
    if (!trigger || !content) return;
    trigger.addEventListener('click', () => {
      const open = item.classList.contains('open');
      document.querySelectorAll('.off-accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.off-accordion-content') && (i.querySelector('.off-accordion-content').style.maxHeight = null);
      });
      if (!open) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

})();
