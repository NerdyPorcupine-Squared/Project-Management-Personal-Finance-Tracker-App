/* ==========================================================================
   Ledgerline — shared behavior
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  markActiveTab();
  animateCountUps();
  initTransactionsPage();
  initGoalsPage();
  initReportsPage();
});

/* ---- nav: highlight the tab matching the current file -------------------- */
function markActiveTab(){
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.rail .tab').forEach(tab => {
    const target = tab.getAttribute('href');
    if (target === here) {
      tab.setAttribute('aria-current', 'page');
    } else {
      tab.removeAttribute('aria-current');
    }
  });
}

/* ---- gentle count-up for big ledger numbers ------------------------------ */
function animateCountUps(){
  const els = document.querySelectorAll('[data-count-to]');
  els.forEach(el => {
    const to = parseFloat(el.getAttribute('data-count-to'));
    const prefix = el.getAttribute('data-prefix') || '';
    const decimals = el.hasAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    const duration = 900;
    const start = performance.now();
    function frame(now){
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = to * eased;
      el.textContent = prefix + val.toLocaleString(undefined, {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
      });
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

/* ==========================================================================
   Transactions page — filter/search, plus add + remove entries
   (custom entries and deletions persist in localStorage)
   ========================================================================== */

const TX_REMOVED_KEY = 'ledgerline_removed_ids';
const TX_CUSTOM_KEY = 'ledgerline_custom_entries';

const TX_CATEGORY_COLORS = {
  income: '#35654D', housing: '#7A5C3E', groceries: '#C98A3D',
  transport: '#4E6E86', dining: '#A6432D', other: '#5B6B60'
};
const TX_CATEGORY_LABELS = {
  income: 'Income', housing: 'Housing', groceries: 'Groceries',
  transport: 'Transport', dining: 'Dining', other: 'Other'
};

function txReadJSON(key, fallback){
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function txWriteJSON(key, value){
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
}

function formatDateLabel(isoDate){
  const d = new Date(isoDate + 'T00:00:00Z');
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function buildTxRow(entry){
  const tr = document.createElement('tr');
  tr.id = entry.id;
  tr.setAttribute('data-category', entry.category);

  const label = TX_CATEGORY_LABELS[entry.category] || 'Other';
  const dot = TX_CATEGORY_COLORS[entry.category] || TX_CATEGORY_COLORS.other;
  const isCredit = entry.type === 'credit';
  const amountStr = (isCredit ? '+' : '\u2212') + '$' + Number(entry.amount).toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });

  tr.setAttribute('data-search', `${entry.description} ${label} ${entry.dateLabel}`.toLowerCase());

  tr.innerHTML = `
    <td>${escapeHtml(entry.dateLabel)}</td>
    <td>${escapeHtml(entry.description)}</td>
    <td><span class="tx-cat"><span class="tx-cat__dot" style="background:${dot}"></span>${label}</span></td>
    <td class="amount ${isCredit ? 'amount--credit' : 'amount--debit'}">${amountStr}</td>
    <td class="row-actions">
      <button class="row-delete" type="button" data-remove-row aria-label="Delete this entry">
        <svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v13a1 1 0 01-1 1H8a1 1 0 01-1-1V7h10z"/></svg>
      </button>
    </td>
  `;
  return tr;
}

function initTransactionsPage(){
  const table = document.getElementById('txTable');
  if (!table) return;

  const tbody = table.querySelector('tbody');
  const searchInput = document.getElementById('txSearch');
  const chips = Array.from(document.querySelectorAll('.chip[data-filter]'));
  const emptyState = document.getElementById('txEmpty');
  const countEl = document.getElementById('txCount');
  let activeFilter = 'all';

  // 1. Remove any seed rows the person has previously deleted
  const removedIds = txReadJSON(TX_REMOVED_KEY, []);
  removedIds.forEach(id => {
    const row = document.getElementById(id);
    if (row) row.remove();
  });

  // 2. Re-render any custom entries added in a previous visit (newest first)
  const customEntries = txReadJSON(TX_CUSTOM_KEY, []);
  for (let i = customEntries.length - 1; i >= 0; i--){
    tbody.insertBefore(buildTxRow(customEntries[i]), tbody.firstChild);
  }

  function currentRows(){
    return Array.from(tbody.querySelectorAll('tr'));
  }

  function updateCount(){
    if (countEl) countEl.textContent = currentRows().length;
  }

  function applyFilters(){
    const rows = currentRows();
    const query = (searchInput?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    rows.forEach(row => {
      const cat = row.getAttribute('data-category');
      const text = row.getAttribute('data-search') || row.textContent.toLowerCase();
      const matchesFilter = activeFilter === 'all' || cat === activeFilter;
      const matchesSearch = !query || text.toLowerCase().includes(query);
      const show = matchesFilter && matchesSearch;
      row.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    table.style.display = visibleCount === 0 ? 'none' : 'table';
  }

  searchInput?.addEventListener('input', applyFilters);

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', 'true');
      activeFilter = chip.getAttribute('data-filter');
      applyFilters();
    });
  });

  // 3. Deleting a row — works for both seed rows and custom rows
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-row]');
    if (!btn) return;
    const row = btn.closest('tr');
    if (!row) return;

    if (row.id.startsWith('custom-')){
      const remaining = txReadJSON(TX_CUSTOM_KEY, []).filter(entry => entry.id !== row.id);
      txWriteJSON(TX_CUSTOM_KEY, remaining);
    } else if (row.id){
      const removed = txReadJSON(TX_REMOVED_KEY, []);
      if (!removed.includes(row.id)) removed.push(row.id);
      txWriteJSON(TX_REMOVED_KEY, removed);
    }

    row.classList.add('row-leaving');
    row.addEventListener('transitionend', () => {
      row.remove();
      updateCount();
      applyFilters();
    }, { once: true });
  });

  // 4. Adding a new entry via the modal
  const modal = document.getElementById('txnModal');
  const openBtn = document.getElementById('addEntryTrigger');
  const form = document.getElementById('txnForm');

  if (modal && openBtn && form){
    const closeBtns = modal.querySelectorAll('[data-close-modal]');
    const dateInput = document.getElementById('txnDate');
    const descInput = document.getElementById('txnDesc');
    const typeInput = document.getElementById('txnType');
    const categoryInput = document.getElementById('txnCategory');
    const amountInput = document.getElementById('txnAmount');

    const openModal = () => {
      modal.setAttribute('data-open', 'true');
      if (dateInput && !dateInput.value) dateInput.value = new Date().toISOString().slice(0, 10);
      descInput?.focus();
    };
    const closeModal = () => modal.setAttribute('data-open', 'false');

    openBtn.addEventListener('click', openModal);
    closeBtns.forEach(b => b.addEventListener('click', closeModal));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('data-open') === 'true') closeModal();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const entry = {
        id: 'custom-' + Date.now(),
        description: (descInput.value || 'Untitled entry').trim(),
        dateLabel: formatDateLabel(dateInput.value || new Date().toISOString().slice(0, 10)),
        type: typeInput.value === 'credit' ? 'credit' : 'debit',
        category: categoryInput.value || 'other',
        amount: Math.max(0.01, parseFloat(amountInput.value) || 0)
      };

      tbody.insertBefore(buildTxRow(entry), tbody.firstChild);

      const stored = txReadJSON(TX_CUSTOM_KEY, []);
      stored.unshift(entry);
      txWriteJSON(TX_CUSTOM_KEY, stored);

      form.reset();
      closeModal();
      updateCount();
      applyFilters();
    });
  }

  updateCount();
  applyFilters();
}

/* ==========================================================================
   Goals page — add-goal modal
   ========================================================================== */
function initGoalsPage(){
  const openBtn = document.getElementById('addGoalCard');
  const backdrop = document.getElementById('goalModal');
  if (!openBtn || !backdrop) return;

  const closeBtns = backdrop.querySelectorAll('[data-close-modal]');
  const form = document.getElementById('goalForm');
  const grid = document.getElementById('goalsGrid');
  const nameInput = document.getElementById('goalName');
  const targetInput = document.getElementById('goalTarget');
  const savedInput = document.getElementById('goalSaved');

  const openModal = () => {
    backdrop.setAttribute('data-open', 'true');
    nameInput?.focus();
  };
  const closeModal = () => backdrop.setAttribute('data-open', 'false');

  openBtn.addEventListener('click', openModal);
  closeBtns.forEach(b => b.addEventListener('click', closeModal));
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.getAttribute('data-open') === 'true') closeModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (nameInput.value || 'Untitled goal').trim();
    const target = Math.max(1, parseFloat(targetInput.value) || 1000);
    const saved = Math.max(0, parseFloat(savedInput.value) || 0);
    const pct = Math.min(100, Math.round((saved / target) * 100));

    const card = document.createElement('article');
    card.className = 'card goal-card';
    card.innerHTML = `
      <div class="goal-card__top">
        <div>
          <p class="goal-card__title">${escapeHtml(name)}</p>
          <p class="goal-card__sub">Added just now</p>
        </div>
        <div class="goal-card__icon" style="background:#E4EDE6;color:#244936;">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.6"/></svg>
        </div>
      </div>
      <div class="goal-progress">
        <div class="goal-progress__track"><div class="goal-progress__fill" style="width:${pct}%"></div></div>
        <div class="goal-progress__nums">
          <span>$${saved.toLocaleString()} <span style="opacity:.6">saved</span></span>
          <span><strong>$${target.toLocaleString()}</strong> goal</span>
        </div>
      </div>
      <div class="goal-card__foot">
        <span class="goal-card__pct">${pct}%</span>
        <button class="btn btn--ghost btn--sm" type="button">Add funds</button>
      </div>
    `;
    grid.insertBefore(card, document.getElementById('addGoalCard'));
    form.reset();
    closeModal();
  });
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ==========================================================================
   Reports page — canvas line chart
   ========================================================================== */
function initReportsPage(){
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;

  const data = [1240, 1380, 1120, 1510, 1690, 1440, 1810, 1720, 1990, 1860, 2140, 2050];
  const labels = ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul'];

  function draw(){
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width, h = rect.height;
    const padL = 36, padR = 12, padT = 16, padB = 26;
    const plotW = w - padL - padR, plotH = h - padT - padB;

    const max = Math.max(...data) * 1.1;
    const min = 0;

    ctx.clearRect(0, 0, w, h);

    // gridlines
    ctx.strokeStyle = '#DAD3BE';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++){
      const y = padT + (plotH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();
    }

    const pts = data.map((v, i) => ({
      x: padL + (plotW / (data.length - 1)) * i,
      y: padT + plotH - ((v - min) / (max - min)) * plotH
    }));

    // filled area
    const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
    grad.addColorStop(0, 'rgba(53,101,77,0.28)');
    grad.addColorStop(1, 'rgba(53,101,77,0.02)');
    ctx.beginPath();
    ctx.moveTo(pts[0].x, padT + plotH);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, padT + plotH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // line
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#35654D';
    ctx.lineWidth = 2.4;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // dots
    pts.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, i === pts.length - 1 ? 4 : 2.6, 0, Math.PI * 2);
      ctx.fillStyle = i === pts.length - 1 ? '#C98A3D' : '#35654D';
      ctx.fill();
    });

    // x labels
    ctx.fillStyle = '#5B6B60';
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    labels.forEach((l, i) => {
      if (i % 2 === 0 || i === labels.length - 1){
        ctx.fillText(l, pts[i].x, h - 6);
      }
    });
  }

  draw();
  window.addEventListener('resize', debounce(draw, 150));
}

function debounce(fn, ms){
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
