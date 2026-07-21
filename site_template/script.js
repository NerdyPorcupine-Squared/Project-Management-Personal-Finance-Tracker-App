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
   Transactions page
   ========================================================================== */
function initTransactionsPage(){
  const table = document.getElementById('txTable');
  if (!table) return;

  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const searchInput = document.getElementById('txSearch');
  const chips = Array.from(document.querySelectorAll('.chip[data-filter]'));
  const emptyState = document.getElementById('txEmpty');
  let activeFilter = 'all';

  function applyFilters(){
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
