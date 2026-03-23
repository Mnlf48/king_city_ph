/* ================================================================
   KINGS CITY — main.js
   Shared: announcement bar, navbar, mobile drawer,
           dropdown menus, scroll reveal, newsletter,
           smooth scroll, hero slider (index)
================================================================ */
(function () {
    'use strict';

    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];

    /* ── Announcement bar ── */
    const annBar = $('#ann-bar');
    const annClose = $('#ann-close');
    const navbar = $('#navbar');

    if (annBar) {
        document.body.classList.add('has-ann');
        annClose && annClose.addEventListener('click', () => {
            annBar.style.display = 'none';
            document.body.classList.remove('has-ann');
        });
    }

    /* ── Sticky navbar ── */
    if (navbar) {
        const THRESH = 60;
        const tick = () => navbar.classList.toggle('scrolled', window.scrollY > THRESH);
        window.addEventListener('scroll', tick, { passive: true });
        tick();
    }

    /* ── Dropdown menus ── */
    $$('.nav-drop').forEach(drop => {
        const btn = drop.querySelector('.nav-drop-btn');
        const menu = drop.querySelector('.drop-menu');
        if (!btn || !menu) return;
        const open = () => { drop.classList.add('open'); btn.setAttribute('aria-expanded', 'true') };
        const close = () => { drop.classList.remove('open'); btn.setAttribute('aria-expanded', 'false') };
        drop.addEventListener('mouseenter', open);
        drop.addEventListener('mouseleave', close);
        btn.addEventListener('click', () => drop.classList.contains('open') ? close() : open());
        document.addEventListener('click', e => { if (!drop.contains(e.target)) close() });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close() });
    });

    /* ── Flag dropdown logic ── */
    const countryList = [
        { c: 'ph', n: 'Philippines', p: '+63' },
        { c: 'us', n: 'United States', p: '+1' },
        { c: 'gb', n: 'United Kingdom', p: '+44' },
        { c: 'au', n: 'Australia', p: '+61' },
        { c: 'ca', n: 'Canada', p: '+1' },
        { c: 'sg', n: 'Singapore', p: '+65' },
        { c: 'nz', n: 'New Zealand', p: '+64' },
        { c: 'jp', n: 'Japan', p: '+81' },
        { c: 'kr', n: 'South Korea', p: '+82' },
        { c: 'cn', n: 'China', p: '+86' },
        { c: 'tw', n: 'Taiwan', p: '+886' },
        { c: 'hk', n: 'Hong Kong', p: '+852' },
        { c: 'in', n: 'India', p: '+91' },
        { c: 'my', n: 'Malaysia', p: '+60' },
        { c: 'id', n: 'Indonesia', p: '+62' },
        { c: 'th', n: 'Thailand', p: '+66' },
        { c: 'vn', n: 'Vietnam', p: '+84' },
        { c: 'ae', n: 'United Arab Emirates', p: '+971' },
        { c: 'sa', n: 'Saudi Arabia', p: '+966' },
        { c: 'il', n: 'Israel', p: '+972' },
        { c: 'tr', n: 'Turkey', p: '+90' },
        { c: 'de', n: 'Germany', p: '+49' },
        { c: 'fr', n: 'France', p: '+33' },
        { c: 'it', n: 'Italy', p: '+39' },
        { c: 'es', n: 'Spain', p: '+34' },
        { c: 'nl', n: 'Netherlands', p: '+31' },
        { c: 'se', n: 'Sweden', p: '+46' },
        { c: 'no', n: 'Norway', p: '+47' },
        { c: 'fi', n: 'Finland', p: '+358' },
        { c: 'dk', n: 'Denmark', p: '+45' },
        { c: 'ch', n: 'Switzerland', p: '+41' },
        { c: 'at', n: 'Austria', p: '+43' },
        { c: 'be', n: 'Belgium', p: '+32' },
        { c: 'ie', n: 'Ireland', p: '+353' },
        { c: 'za', n: 'South Africa', p: '+27' },
        { c: 'br', n: 'Brazil', p: '+55' },
        { c: 'mx', n: 'Mexico', p: '+52' },
        { c: 'ar', n: 'Argentina', p: '+54' },
        { c: 'co', n: 'Colombia', p: '+57' },
        { c: 'cl', n: 'Chile', p: '+56' },
        { c: 'pe', n: 'Peru', p: '+51' }
    ];

    function updateAllPhones(countryCode) {
        const country = countryList.find(item => item.c === countryCode);
        if (!country) return;

        localStorage.setItem('selectedCountry', countryCode);

        const placeholder = `${country.p} --- --- ---`;
        const telValue = `tel:${country.p.replace('+', '')}000000000`;

        $$('a[href^="tel:"]').forEach(a => {
            a.href = telValue;
            a.textContent = placeholder;
        });

        $$('.flag-btn').forEach(btn => {
            btn.innerHTML = `<img src="https://flagcdn.com/w20/${countryCode}.png" alt="${country.n}" width="20" style="border-radius: 2px;"><span class="caret" aria-hidden="true"></span>`;
        });
    }

    const savedCountry = localStorage.getItem('selectedCountry') || 'ph';
    
    $$('.flag-drop').forEach(drop => {
        const btn = drop.querySelector('.flag-btn');
        const menu = drop.querySelector('.flag-menu');

        if (menu) {
            menu.innerHTML = countryList.map(c => `
                <li>
                    <a href="#" role="menuitem" data-code="${c.c}" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.5rem; font-size: 0.85rem;">
                        <img src="https://flagcdn.com/w20/${c.c}.png" alt="${c.n}" width="20" style="border-radius: 2px; flex-shrink: 0;"> 
                        <span style="white-space: nowrap;">${c.n} (${c.p})</span>
                    </a>
                </li>
            `).join('');

            menu.style.maxHeight = '300px';
            menu.style.overflowY = 'auto';
        }

        menu && menu.addEventListener('click', e => {
            const item = e.target.closest('a[data-code]');
            if (!item) return;
            e.preventDefault();
            updateAllPhones(item.getAttribute('data-code'));
            drop.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        });
    });

    updateAllPhones(savedCountry);

    /* ── Mobile drawer ── */
    const hamburger = $('#hamburger');
    const drawer = $('#mobile-drawer');
    const drawerClose = $('#drawer-close');
    const overlay = $('#drawer-overlay');
    let isOpen = false;

    function openDrawer() {
        isOpen = true;
        drawer && drawer.classList.add('active');
        overlay && overlay.classList.add('active');
        navbar && navbar.classList.add('menu-open', 'scrolled');
        hamburger && hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        if (hamburger) {
            const spans = hamburger.querySelectorAll('span');
            if (spans[0]) spans[0].style.transform = 'rotate(38deg) translateY(1px)';
            if (spans[1]) { spans[1].style.opacity = '0'; spans[1].style.transform = 'translateX(-8px)'; }
            if (spans[2]) spans[2].style.transform = 'rotate(-38deg) translateY(-1px)';
        }
    }
    function closeDrawer() {
        isOpen = false;
        drawer && drawer.classList.remove('active');
        overlay && overlay.classList.remove('active');
        navbar && navbar.classList.remove('menu-open');
        hamburger && hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (hamburger) hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
    }

    hamburger && hamburger.addEventListener('click', () => isOpen ? closeDrawer() : openDrawer());
    drawerClose && drawerClose.addEventListener('click', closeDrawer);
    overlay && overlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeDrawer() });
    $$('.drawer-nav a, .drawer-foot a').forEach(a => a.addEventListener('click', () => isOpen && closeDrawer()));

    /* ── Hero slider ── */
    const slides = $$('.slide');
    const dots = $$('.dot');
    const prev = $('#arrow-prev');
    const next = $('#arrow-next');
    let cur = 0;
    const total = slides.length;

    if (total > 1) {
        function goTo(idx) {
            idx = ((idx % total) + total) % total;
            slides[cur].classList.remove('active'); slides[cur].setAttribute('aria-hidden', 'true');
            dots[cur] && dots[cur].classList.remove('active');
            cur = idx;
            slides[cur].classList.add('active'); slides[cur].setAttribute('aria-hidden', 'false');
            dots[cur] && dots[cur].classList.add('active');
        }
        prev && prev.addEventListener('click', () => goTo(cur - 1));
        next && next.addEventListener('click', () => goTo(cur + 1));
        dots.forEach(d => d.addEventListener('click', () => { const i = parseInt(d.dataset.index, 10); if (!isNaN(i)) goTo(i) }));

        const hero = $('#hero');
        if (hero) {
            hero.addEventListener('keydown', e => {
                if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(cur - 1) }
                if (e.key === 'ArrowRight') { e.preventDefault(); goTo(cur + 1) }
            });
            let tx = null;
            hero.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX }, { passive: true });
            hero.addEventListener('touchend', e => {
                if (tx === null) return;
                const dx = e.changedTouches[0].clientX - tx;
                if (Math.abs(dx) > 50) goTo(dx < 0 ? cur + 1 : cur - 1);
                tx = null;
            }, { passive: true });
        }

        // Auto-play
        let autoPlay = setInterval(() => goTo(cur + 1), 5500);
        const hero2 = $('#hero');
        if (hero2) {
            hero2.addEventListener('mouseenter', () => clearInterval(autoPlay));
            hero2.addEventListener('mouseleave', () => { autoPlay = setInterval(() => goTo(cur + 1), 5500) });
        }
    }

    /* ── Scroll reveal ── */
    const revEls = $$('[data-reveal]');
    if ('IntersectionObserver' in window && revEls.length) {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const siblings = $$('[data-reveal]', entry.target.parentElement);
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${idx * 70}ms`;
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            });
        }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
        revEls.forEach(el => io.observe(el));
    } else {
        revEls.forEach(el => el.classList.add('visible'));
    }

    /* ── Newsletter ── */
    const nlForm = $('#nl-form');
    if (nlForm) {
        nlForm.addEventListener('submit', e => {
            e.preventDefault();
            const inp = nlForm.querySelector('input[type="email"]');
            const btn = nlForm.querySelector('button');
            const suc = $('#nl-success');
            if (!inp || !inp.value.trim()) return;
            inp.disabled = true;
            if (btn) { btn.disabled = true; btn.textContent = 'Joining…' }
            setTimeout(() => {
                $$('input,button', nlForm).forEach(el => el.style.display = 'none');
                if (suc) suc.style.display = 'block';
                setTimeout(() => {
                    $$('input,button', nlForm).forEach(el => el.style.display = '');
                    if (suc) suc.style.display = '';
                    inp.disabled = false; inp.value = '';
                    if (btn) { btn.disabled = false; btn.textContent = 'Join' }
                }, 5000);
            }, 500);
        });
    }

    /* ── Smooth scroll ── */
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const tgt = $(a.getAttribute('href'));
            if (!tgt) return;
            e.preventDefault();
            const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
            window.scrollTo({ top: tgt.getBoundingClientRect().top + window.scrollY - navH - 8, behavior: 'smooth' });
        });
    });

    /* ── Animated counters ── */
    const counters = $$('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
        const cio = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                const suffix = el.dataset.suffix || '';
                let start = 0; const dur = 1800;
                const step = ts => {
                    if (!start) start = ts;
                    const p = Math.min((ts - start) / dur, 1);
                    el.textContent = Math.floor(p * target).toLocaleString() + suffix;
                    if (p < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
                cio.unobserve(el);
            });
        }, { threshold: .5 });
        counters.forEach(el => cio.observe(el));
    }

    /* ── Active nav link highlight ── */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-links a, .drawer-nav a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href === currentPath) a.classList.add('nav-active');
    });

})();
