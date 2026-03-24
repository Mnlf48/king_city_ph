/* ================================================================
   KINGS CITY — apply.js
   Form validation and submission simulation for both Coworking & Offshoring
================================================================ */
(function(){
  'use strict';

  const form = document.querySelector('#apply-form');
  const success = document.querySelector('#apply-success');
  if (!form) return;

  // 1. Toggling functionality
  const radios = document.querySelectorAll('input[name="application_type"]');
  const coworkFields = document.getElementById('coworking-fields');
  const offshorFields = document.getElementById('offshoring-fields');

  function updateView() {
    const selected = document.querySelector('input[name="application_type"]:checked').value;
    
    // Update active label styles
    document.querySelectorAll('.apply-type-group label').forEach(lbl => {
      lbl.style.background = 'transparent';
      lbl.style.borderColor = 'var(--ink-20)';
    });
    
    const activeLabel = document.querySelector(`input[name="application_type"]:checked`).parentElement;
    activeLabel.style.background = 'rgba(159,211,175,0.1)';
    activeLabel.style.borderColor = 'var(--clr-green-dk)';

    // Toggle fields
    if (selected === 'coworking') {
      coworkFields.style.display = 'block';
      offshorFields.style.display = 'none';
      // disable offshoring required inputs to not block form submission
      document.getElementById('off-firstname').required = false;
      document.getElementById('off-lastname').required = false;
      document.getElementById('off-email').required = false;
      document.getElementById('off-phone').required = false;
      
      document.getElementById('ap-firstname').required = true;
      document.getElementById('ap-lastname').required = true;
      document.getElementById('ap-email').required = true;
      document.getElementById('ap-phone').required = true;
      document.getElementById('ap-consent-co').required = true;
    } else {
      coworkFields.style.display = 'none';
      offshorFields.style.display = 'block';
      
      // swap required attributes so form validation passes
      document.getElementById('ap-firstname').required = false;
      document.getElementById('ap-lastname').required = false;
      document.getElementById('ap-email').required = false;
      document.getElementById('ap-phone').required = false;
      document.getElementById('ap-consent-co').required = false;

      document.getElementById('off-firstname').required = true;
      document.getElementById('off-lastname').required = true;
      document.getElementById('off-email').required = true;
      document.getElementById('off-phone').required = true;
    }
  }

  radios.forEach(r => r.addEventListener('change', updateView));
  updateView(); // initial state


  // 2. Real-time validation
  function validateField(input) {
    if(!input.required && !input.value) return true; // skip if not required
    const group = input.closest('.form-group') || input.parentElement;
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
    
    if(group.classList) group.classList.toggle('has-error', !valid);
    return valid;
  }

  form.querySelectorAll('input,select,textarea').forEach(el => {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => {
      if (el.closest('.form-group')?.classList.contains('has-error')) validateField(el);
    });
  });


  // 3. Form Submit wrapper
  function doSubmit(btn) {
    let allValid = true;
    // only validate visible, required fields
    form.querySelectorAll('input,select,textarea').forEach(el => {
      if (el.offsetWidth > 0 && el.offsetHeight > 0) { // is visible
        if (!validateField(el)) allValid = false;
      }
    });
    
    if (!allValid) return;

    if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; btn.style.opacity = '.7' }

    setTimeout(() => {
      form.closest('.apply-form-section') && (form.closest('.apply-form-section').style.display = 'none');
      if (success) { success.style.display = 'block'; success.scrollIntoView({ behavior:'smooth', block:'center' }) }
    }, 900);
  }

  // Hook submit button (Coworking)
  form.addEventListener('submit', e => {
    e.preventDefault();
    doSubmit(form.querySelector('button[type="submit"]'));
  });

  // Hook request quote button (Offshoring)
  const reqQuoteBtn = document.getElementById('btn-request-quote');
  if(reqQuoteBtn) {
    reqQuoteBtn.addEventListener('click', () => {
      doSubmit(reqQuoteBtn);
    });
  }

  // 4. Character counter for message field
  const msgField = document.querySelector('#apply-message');
  const msgCount = document.querySelector('#apply-msg-count');
  if (msgField && msgCount) {
    msgField.addEventListener('input', () => {
      msgCount.textContent = msgField.value.length;
    });
  }


  // ==========================================
  // TEAM BUILDER LOGIC
  // ==========================================
  
  const roleCatalog = [
    { cat: "Operations & Management", roles: [
      { id: 'op-head', name: "Operations Head", desc: "Strategic oversight and operational management", base: 2500 },
      { id: 'bldg-admin', name: "Building Administrator", desc: "Facility management and tenant relations", base: 1200 },
      { id: 'culinary', name: "Culinary Administrator", desc: "Food service operations and culinary management", base: 1000 }
    ]},
    { cat: "Finance & Accounting", roles: [
      { id: 'acct-head', name: "Accounting and Finance Head", desc: "Financial strategy, reporting, and team leadership", base: 2200 },
      { id: 'acct-mgr', name: "Accounting Manager", desc: "Account management and financial operations", base: 1500 },
      { id: 'acct-sup', name: "Accounting Supervisor", desc: "Supervise accounting staff and daily operations", base: 1000 }
    ]},
    { cat: "Human Resources", roles: [
      { id: 'hr-coord', name: "HR Coordinator", desc: "Employee relations, onboarding, and HR support", base: 900 },
      { id: 'recruiter', name: "Recruitment Officer", desc: "Talent sourcing, interviewing, and hiring", base: 1100 },
      { id: 'payroll-master', name: "Payroll Master", desc: "Complex payroll processing and compliance", base: 1400 }
    ]},
    { cat: "Technology & Marketing", roles: [
      { id: 'dev', name: "Software Developer", desc: "Frontend, Backend, and Full Stack development", base: 2000 },
      { id: 'ba', name: "Business Analyst", desc: "Data analysis, process improvement, reporting", base: 1600 },
      { id: 'mktg', name: "Marketing Officer", desc: "Campaign management, branding, and communications", base: 1200 }
    ]}
  ];

  let selectedTeam = [];

  const modal = document.getElementById('tb-modal');
  const btnAddMember = document.getElementById('btn-add-member');
  const btnGetStarted = document.getElementById('btn-get-started');
  const btnCloseModal = document.getElementById('tb-modal-close');
  const modalRoles = document.getElementById('tb-modal-roles');

  const emptyState = document.getElementById('tb-empty');
  const rolesList = document.getElementById('tb-roles-list');
  const rolesInner = document.getElementById('tb-roles-inner');
  const tbTotalSize = document.getElementById('tb-total-size');
  const tbTotalBase = document.getElementById('tb-total-base');
  const tbFinalTotal = document.getElementById('tb-final-total');
  const tbSavingsBox = document.getElementById('tb-savings');
  const tbSaveAmount = document.getElementById('tb-save-amount');

  // Populate Modal
  function renderCatalog() {
    let ht = '';
    roleCatalog.forEach(c => {
      ht += `<div class="tb-cat-title">${c.cat}</div>`;
      c.roles.forEach(r => {
        ht += `
          <div class="tb-role-card">
            <div class="tb-role-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div class="tb-role-info">
              <strong>${r.name}</strong>
              <span>${r.desc}</span>
            </div>
            <button type="button" class="btn-add-role" data-id="${r.id}">+ Add</button>
          </div>
        `;
      });
    });
    modalRoles.innerHTML = ht;

    modalRoles.querySelectorAll('.btn-add-role').forEach(btn => {
      btn.addEventListener('click', (e) => {
        addRoleToTeam(e.target.dataset.id);
        closeModal();
      });
    });
  }
  
  function getRoleData(id) {
    for(let c of roleCatalog) {
      let r = c.roles.find(x => x.id === id);
      if(r) return r;
    }
    return null;
  }

  function addRoleToTeam(id) {
    const d = getRoleData(id);
    if(!d) return;

    // Check if already in array
    let ex = selectedTeam.find(t => t.id === id);
    if(ex) {
      ex.count++;
    } else {
      selectedTeam.push({
        id: id,
        name: d.name,
        base: d.base,
        level: 1, // 1=Junior, 1.3=Mid, 1.7=Senior
        count: 1
      });
    }
    renderTeam();
  }

  function removeRole(id) {
    selectedTeam = selectedTeam.filter(t => t.id !== id);
    renderTeam();
  }

  function renderTeam() {
    if(selectedTeam.length === 0) {
      emptyState.style.display = 'block';
      rolesList.style.display = 'none';
      updateTotals();
      return;
    }

    emptyState.style.display = 'none';
    rolesList.style.display = 'block';

    let ht = '';
    selectedTeam.forEach(t => {
      const price = t.base * t.level;
      ht += `
        <div class="tbr-item" data-id="${t.id}">
          <div class="tbr-name">
            <div class="tbr-name-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div class="tbr-name-text">
              <strong>${t.name}</strong>
              <span>Dedicated Offshore Talent</span>
            </div>
          </div>
          <div class="tbr-level">
            <select class="level-sel">
              <option value="1" ${t.level == 1 ? 'selected':''}>Junior</option>
              <option value="1.3" ${t.level == 1.3 ? 'selected':''}>Mid-Level</option>
              <option value="1.7" ${t.level == 1.7 ? 'selected':''}>Senior</option>
            </select>
          </div>
          <div class="tbr-count">
            <div class="tbr-count-ctl">
              <button type="button" class="count-minus">-</button>
              <input type="text" value="${t.count}" readonly>
              <button type="button" class="count-plus">+</button>
            </div>
          </div>
          <div class="tbr-price">
            $${price.toLocaleString('en-US')}<span style="color:var(--ink-50);font-weight:500;font-size:0.75rem;">/mo</span>
          </div>
          <div class="tbr-remove">
            <button type="button" class="btn-rem" title="Remove">&times;</button>
          </div>
        </div>
      `;
    });
    rolesInner.innerHTML = ht;

    // Bind events
    rolesInner.querySelectorAll('.tbr-item').forEach(item => {
      const id = item.dataset.id;
      const t = selectedTeam.find(x => x.id === id);

      item.querySelector('.btn-rem').addEventListener('click', () => removeRole(id));
      
      item.querySelector('.level-sel').addEventListener('change', (e) => {
        t.level = parseFloat(e.target.value);
        renderTeam();
      });

      item.querySelector('.count-minus').addEventListener('click', () => {
        if(t.count > 1) { t.count--; renderTeam(); }
      });
      item.querySelector('.count-plus').addEventListener('click', () => {
        t.count++; renderTeam();
      });
    });

    updateTotals();
  }

  function updateTotals() {
    let size = 0;
    let baseTotal = 0;
    
    selectedTeam.forEach(t => {
      size += t.count;
      baseTotal += (t.base * t.level) * t.count;
    });

    tbTotalSize.textContent = size;
    tbTotalBase.textContent = '$' + baseTotal.toLocaleString('en-US');
    tbFinalTotal.textContent = '$' + baseTotal.toLocaleString('en-US');

    // Assume 2.5x local hire cost
    if(size > 0) {
      let localCost = baseTotal * 2.5;
      let savings = localCost - baseTotal;
      tbSaveAmount.textContent = '~ $' + savings.toLocaleString('en-US');
      tbSavingsBox.style.display = 'flex';
    } else {
      tbSavingsBox.style.display = 'none';
    }
  }

  // Modal actions
  function openModal() { modal.setAttribute('aria-hidden', 'false'); }
  function closeModal() { modal.setAttribute('aria-hidden', 'true'); }

  if(btnAddMember) btnAddMember.addEventListener('click', openModal);
  if(btnGetStarted) btnGetStarted.addEventListener('click', openModal);
  if(btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });

  renderCatalog();

})();
