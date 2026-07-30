/* ==========================================================================
   Ledgerline — shared data + behavior
   Seed data lives here so every page (transactions, goals, reports) can
   compute against the same source of truth. Edits/adds/deletes are layered
   on top and persisted in localStorage.
   ========================================================================== */

const TODAY_ISO = '2026-07-21';

/* ---- seed data ------------------------------------------------------------ */

const SEED_TRANSACTIONS = [
  { id: 'txn-1',  dateISO: '2026-07-20', description: 'Payroll deposit',              category: 'income',     type: 'credit', amount: 2560.00 },
  { id: 'txn-2',  dateISO: '2026-07-20', description: 'Fernwood Market',               category: 'groceries',  type: 'debit',  amount: 64.22 },
  { id: 'txn-3',  dateISO: '2026-07-19', description: 'Rooftop Noodle Bar',             category: 'dining',     type: 'debit',  amount: 32.50 },
  { id: 'txn-4',  dateISO: '2026-07-14', description: 'Northline Transit Pass',         category: 'transport',  type: 'debit',  amount: 88.00 },
  { id: 'txn-5',  dateISO: '2026-07-15', description: 'Cedar & Co. Rent',               category: 'housing',    type: 'debit',  amount: 1450.00 },
  { id: 'txn-6',  dateISO: '2026-07-13', description: 'Harvest Co-op',                  category: 'groceries',  type: 'debit',  amount: 41.90 },
  { id: 'txn-7',  dateISO: '2026-07-12', description: 'Pressed Juicery',                category: 'dining',     type: 'debit',  amount: 8.75 },
  { id: 'txn-8',  dateISO: '2026-07-11', description: 'Ridehail — evening trip',        category: 'transport',  type: 'debit',  amount: 18.40 },
  { id: 'txn-9',  dateISO: '2026-07-09', description: 'Freelance invoice #0042',        category: 'income',     type: 'credit', amount: 640.00 },
  { id: 'txn-10', dateISO: '2026-07-08', description: 'Brightline Power & Utilities',   category: 'housing',    type: 'debit',  amount: 96.30 },
  { id: 'txn-11', dateISO: '2026-07-06', description: 'Fernwood Market',                category: 'groceries',  type: 'debit',  amount: 71.14 },
  { id: 'txn-12', dateISO: '2026-07-05', description: 'Corner Diner — brunch',          category: 'dining',     type: 'debit',  amount: 27.60 },
  { id: 'txn-13', dateISO: '2026-07-04', description: 'Ridehail — airport run',         category: 'transport',  type: 'debit',  amount: 41.15 },
  { id: 'txn-14', dateISO: '2026-07-03', description: 'Clearwater Internet',            category: 'housing',    type: 'debit',  amount: 59.99 },
  { id: 'txn-15', dateISO: '2026-07-02', description: 'Fernwood Market',                category: 'groceries',  type: 'debit',  amount: 38.47 },
  { id: 'txn-16', dateISO: '2026-07-01', description: 'Payroll deposit',                category: 'income',     type: 'credit', amount: 2560.00 },
  { id: 'txn-17', dateISO: '2026-06-29', description: 'Two Rivers Café',                category: 'dining',     type: 'debit',  amount: 19.80 },
  { id: 'txn-18', dateISO: '2026-06-28', description: 'Bike share membership',          category: 'transport',  type: 'debit',  amount: 24.00 },
  { id: 'txn-19', dateISO: '2026-06-26', description: 'Brightline Power & Utilities',   category: 'housing',    type: 'debit',  amount: 102.14 },
  { id: 'txn-20', dateISO: '2026-06-24', description: 'Harvest Co-op',                  category: 'groceries',  type: 'debit',  amount: 55.32 },
  { id: 'txn-21', dateISO: '2026-06-22', description: 'Rooftop Noodle Bar',             category: 'dining',     type: 'debit',  amount: 29.90 },
  { id: 'txn-22', dateISO: '2026-06-20', description: 'Freelance invoice #0041',        category: 'income',     type: 'credit', amount: 580.00 },
  { id: 'txn-23', dateISO: '2026-06-15', description: 'Cedar & Co. Rent',               category: 'housing',    type: 'debit',  amount: 1450.00 },
  { id: 'txn-24', dateISO: '2026-06-14', description: 'Northline Transit Pass',         category: 'transport',  type: 'debit',  amount: 88.00 },
  { id: 'txn-25', dateISO: '2026-06-12', description: 'Fernwood Market',                category: 'groceries',  type: 'debit',  amount: 67.05 },
  { id: 'txn-26', dateISO: '2026-06-01', description: 'Payroll deposit',                category: 'income',     type: 'credit', amount: 2560.00 }
];

// Balance the ledger opens with, before any transactions — no default float.
const STARTING_BALANCE = 0;

const SEED_GOALS = [
  { id: 'goal-1', name: 'Emergency fund',      target: 5000,  saved: 3400, dueDate: '2026-12-31', icon: 'shield'  },
  { id: 'goal-2', name: 'Kyoto trip',           target: 3000,  saved: 1020, dueDate: '2027-03-31', icon: 'compass' },
  { id: 'goal-3', name: 'New laptop',           target: 2000,  saved: 1820, dueDate: '2026-09-30', icon: 'laptop'  },
  { id: 'goal-4', name: 'Home down payment',    target: 50000, saved: 6000, dueDate: '2029-12-31', icon: 'home'    }
];

const GOAL_ICONS = {
  shield:  { path: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z"/>',                                    bg: '#E4EDE6', fg: '#244936' },
  compass: { path: '<path d="M3 12l7-7 3 3-7 7-3-3z"/><path d="M13 8l7-4-4 7"/><path d="M8 16l-4 4"/>',            bg: '#F3E7D2', fg: '#8A5A20' },
  laptop:  { path: '<rect x="4" y="4" width="16" height="11" rx="1"/><path d="M2 19h20"/>',                        bg: '#E4EDE6', fg: '#244936' },
  home:    { path: '<path d="M3 11l9-7 9 7"/><path d="M5 10v9h14v-9"/>',                                           bg: '#F3E7D2', fg: '#8A5A20' },
  target:  { path: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.6"/>',                             bg: '#E4EDE6', fg: '#244936' }
};

const TX_CATEGORY_COLORS = {
  income: '#35654D', housing: '#7A5C3E', groceries: '#C98A3D',
  transport: '#4E6E86', dining: '#A6432D', savings: '#6B5CA5', other: '#5B6B60'
};
const TX_CATEGORY_LABELS = {
  income: 'Income', housing: 'Housing', groceries: 'Groceries',
  transport: 'Transport', dining: 'Dining', savings: 'Savings', other: 'Other'
};

/* ---- storage helpers -------------------------------------------------------
   Every user's financial data is namespaced by their account, so two people
   using this file on the same browser never see each other's ledger/goal
   changes. Note: since this is a static, backend-less app, "storing a file"
   for each account means storing it in the browser's localStorage — the
   closest thing JS running in a browser has to writing a private file to
   disk. It lives on this device only, scoped to this browser.
   ---------------------------------------------------------------------------- */

const LS_KEYS = {
  txRemoved: 'ledgerline_removed_ids',
  txCustom:  'ledgerline_custom_entries',
  txEdited:  'ledgerline_edited_entries',
  goalsRemoved: 'ledgerline_goals_removed',
  goalsCustom:  'ledgerline_goals_custom',
  goalsEdited:  'ledgerline_goals_edited'
};

const ACCOUNTS_KEY = 'ledgerline_accounts';
const SESSION_KEY = 'ledgerline_current_user';

function rawGet(key, fallback){
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function rawSet(key, value){
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
}

function getCurrentUser(){ return rawGet(SESSION_KEY, null); }
function setCurrentUser(usernameKey){ rawSet(SESSION_KEY, usernameKey); }
function clearCurrentUser(){ try { localStorage.removeItem(SESSION_KEY); } catch (e) {} }

// Every per-user data key is prefixed so each account's ledger/goal edits
// are stored separately, even though they're all in the same browser storage.
function namespacedKey(key){
  const user = getCurrentUser();
  return 'acct_' + (user || 'guest') + '_' + key;
}
function lsGet(key, fallback){ return rawGet(namespacedKey(key), fallback); }
function lsSet(key, value){ rawSet(namespacedKey(key), value); }

/* ---- authentication --------------------------------------------------------
   Passwords are never stored in plain text — each one is combined with a
   random per-account salt and hashed with SHA-256 before it touches storage.
   ---------------------------------------------------------------------------- */

const USERNAME_PATTERN = /^[A-Za-z ]+$/;

function validateUsername(username){
  const trimmed = (username || '').trim();
  if (!trimmed) return 'Enter a username.';
  if (!USERNAME_PATTERN.test(trimmed)) return 'Usernames can only contain letters and spaces.';
  return null;
}

function validatePassword(password){
  const pw = password || '';
  if (pw.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[a-z]/.test(pw)) return 'Password must include at least one lowercase letter.';
  if (!/[A-Z]/.test(pw)) return 'Password must include at least one uppercase letter.';
  if (!/[0-9]/.test(pw)) return 'Password must include at least one number.';
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Password must include at least one symbol.';
  return null;
}

function randomSaltHex(){
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function accountKeyFor(username){ return username.trim().toLowerCase(); }

async function registerAccount(username, password){
  const usernameError = validateUsername(username);
  if (usernameError) return { ok: false, error: usernameError };
  const passwordError = validatePassword(password);
  if (passwordError) return { ok: false, error: passwordError };

  const accounts = rawGet(ACCOUNTS_KEY, {});
  const key = accountKeyFor(username);
  if (accounts[key]) return { ok: false, error: 'An account with that username already exists.' };

  const salt = randomSaltHex();
  const hash = await sha256Hex(salt + password);
  accounts[key] = { displayName: username.trim(), salt, hash };
  rawSet(ACCOUNTS_KEY, accounts);
  setCurrentUser(key);

  // New accounts start with a blank ledger and no goals — hide the shared
  // demo seed data rather than inheriting it.
  lsSet(LS_KEYS.txRemoved, SEED_TRANSACTIONS.map(t => t.id));
  lsSet(LS_KEYS.goalsRemoved, SEED_GOALS.map(g => g.id));

  return { ok: true };
}

async function loginAccount(username, password){
  const accounts = rawGet(ACCOUNTS_KEY, {});
  const key = accountKeyFor(username);
  const account = accounts[key];
  if (!account) return { ok: false, error: 'That account doesn\u2019t exist. Double-check the username or register instead.' };

  const hash = await sha256Hex(account.salt + password);
  if (hash !== account.hash) return { ok: false, error: 'That password is wrong. Please try again.' };

  setCurrentUser(key);
  return { ok: true };
}

function getCurrentUserDisplayName(){
  const key = getCurrentUser();
  if (!key) return '';
  const accounts = rawGet(ACCOUNTS_KEY, {});
  return (accounts[key] && accounts[key].displayName) || key;
}

function getGreeting(){
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getSystemDateISO(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* ---- transactions data layer ---------------------------------------------- */

function getAllTransactions(){
  const removed = lsGet(LS_KEYS.txRemoved, []);
  const edited = lsGet(LS_KEYS.txEdited, {});
  const custom = lsGet(LS_KEYS.txCustom, []);

  const seed = SEED_TRANSACTIONS
    .filter(t => !removed.includes(t.id))
    .map(t => Object.assign({}, t, edited[t.id] || {}));

  const customActive = custom.filter(t => !removed.includes(t.id));

  return seed.concat(customActive);
}

function setTxOverride(id, fields){
  if (id.startsWith('custom-')){
    const custom = lsGet(LS_KEYS.txCustom, []);
    const idx = custom.findIndex(t => t.id === id);
    if (idx > -1){
      custom[idx] = Object.assign({}, custom[idx], fields);
      lsSet(LS_KEYS.txCustom, custom);
    }
  } else {
    const edited = lsGet(LS_KEYS.txEdited, {});
    edited[id] = Object.assign({}, edited[id], fields);
    lsSet(LS_KEYS.txEdited, edited);
  }
}

function addTransaction(entry){
  const custom = lsGet(LS_KEYS.txCustom, []);
  custom.unshift(entry);
  lsSet(LS_KEYS.txCustom, custom);
}

function deleteTransaction(id){
  if (id.startsWith('custom-')){
    const custom = lsGet(LS_KEYS.txCustom, []).filter(t => t.id !== id);
    lsSet(LS_KEYS.txCustom, custom);
  } else {
    const removed = lsGet(LS_KEYS.txRemoved, []);
    if (!removed.includes(id)) removed.push(id);
    lsSet(LS_KEYS.txRemoved, removed);
  }
}

/* ---- goals data layer ------------------------------------------------------ */

function getAllGoals(){
  const removed = lsGet(LS_KEYS.goalsRemoved, []);
  const edited = lsGet(LS_KEYS.goalsEdited, {});
  const custom = lsGet(LS_KEYS.goalsCustom, []);

  const seed = SEED_GOALS
    .filter(g => !removed.includes(g.id))
    .map(g => Object.assign({}, g, edited[g.id] || {}));

  const customActive = custom.filter(g => !removed.includes(g.id));

  return seed.concat(customActive);
}

function setGoalOverride(id, fields){
  if (id.startsWith('goal-custom-')){
    const custom = lsGet(LS_KEYS.goalsCustom, []);
    const idx = custom.findIndex(g => g.id === id);
    if (idx > -1){
      custom[idx] = Object.assign({}, custom[idx], fields);
      lsSet(LS_KEYS.goalsCustom, custom);
    }
  } else {
    const edited = lsGet(LS_KEYS.goalsEdited, {});
    edited[id] = Object.assign({}, edited[id], fields);
    lsSet(LS_KEYS.goalsEdited, edited);
  }
}

function addGoal(goal){
  const custom = lsGet(LS_KEYS.goalsCustom, []);
  custom.push(goal);
  lsSet(LS_KEYS.goalsCustom, custom);
}

function deleteGoal(id){
  if (id.startsWith('goal-custom-')){
    const custom = lsGet(LS_KEYS.goalsCustom, []).filter(g => g.id !== id);
    lsSet(LS_KEYS.goalsCustom, custom);
  } else {
    const removed = lsGet(LS_KEYS.goalsRemoved, []);
    if (!removed.includes(id)) removed.push(id);
    lsSet(LS_KEYS.goalsRemoved, removed);
  }
}

/* ---- shared formatting helpers -------------------------------------------- */

function formatDateLabel(isoDate){
  const d = new Date(isoDate + 'T00:00:00Z');
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}
function formatMonthYear(isoDate){
  const d = new Date(isoDate + 'T00:00:00Z');
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}
function formatMoney(n, decimals){
  const dec = decimals === undefined ? 2 : decimals;
  return '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function daysBetween(isoA, isoB){
  const a = new Date(isoA + 'T00:00:00Z');
  const b = new Date(isoB + 'T00:00:00Z');
  return Math.round((b - a) / 86400000);
}
function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}
function getMonthKey(isoDate){ return isoDate.slice(0, 7); }
function monthLabel(monthKey){
  const d = new Date(monthKey + '-01T00:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}
function groupTransactionsByMonth(tx){
  const map = {};
  tx.forEach(t => {
    const key = getMonthKey(t.dateISO);
    if (!map[key]) map[key] = { income: 0, spending: 0 };
    if (t.type === 'credit') map[key].income += t.amount;
    else map[key].spending += t.amount;
  });
  return map;
}
function getCategoryTotals(tx, typeFilter){
  const totals = {};
  tx.forEach(t => {
    if (typeFilter && t.type !== typeFilter) return;
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  });
  return totals;
}
function getCurrentBalance(tx){
  let running = STARTING_BALANCE;
  tx.slice().sort((a, b) => a.dateISO.localeCompare(b.dateISO)).forEach(t => {
    running += (t.type === 'credit' ? 1 : -1) * t.amount;
  });
  return running;
}

/* ==========================================================================
   Page bootstrap
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const here = location.pathname.split('/').pop() || 'index.html';
  const isLoginPage = here === '' || here === 'index.html';

  if (isLoginPage){
    // Already signed in on this browser — skip straight to the app.
    if (getCurrentUser()){
      location.href = 'dashboard.html';
      return;
    }
    initAuthPage();
    return;
  }

  // Every other page requires an active session.
  if (!getCurrentUser()){
    location.href = 'index.html';
    return;
  }

  initSignOutLinks();
  markActiveTab();
  animateCountUps();
  initDashboardPage();
  initTransactionsPage();
  initGoalsPage();
  initReportsPage();
});

function initSignOutLinks(){
  document.querySelectorAll('.rail__signout').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      clearCurrentUser();
      location.href = 'index.html';
    });
  });
}

function setFormError(elId, message){
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = message || '';
}

function initAuthPage(){
  const registerBtn = document.getElementById('registerTrigger');
  const loginBtn = document.getElementById('loginTrigger');
  const registerModal = document.getElementById('registerModal');
  const loginModal = document.getElementById('loginModal');

  function openModal(modal){ modal?.setAttribute('data-open', 'true'); }
  function closeModal(modal){ modal?.setAttribute('data-open', 'false'); }

  [registerModal, loginModal].forEach(modal => {
    if (!modal) return;
    modal.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', () => closeModal(modal)));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    [registerModal, loginModal].forEach(modal => {
      if (modal && modal.getAttribute('data-open') === 'true') closeModal(modal);
    });
  });

  registerBtn?.addEventListener('click', () => {
    document.getElementById('registerForm')?.reset();
    setFormError('registerError', '');
    openModal(registerModal);
    document.getElementById('registerUsername')?.focus();
  });
  loginBtn?.addEventListener('click', () => {
    document.getElementById('loginForm')?.reset();
    setFormError('loginError', '');
    openModal(loginModal);
    document.getElementById('loginUsername')?.focus();
  });

  const registerForm = document.getElementById('registerForm');
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const submitBtn = document.getElementById('registerSubmitBtn');
    setFormError('registerError', '');
    if (submitBtn) submitBtn.disabled = true;
    try {
      const result = await registerAccount(username, password);
      if (!result.ok){
        setFormError('registerError', result.error);
        return;
      }
      location.href = 'dashboard.html';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  const loginForm = document.getElementById('loginForm');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const submitBtn = document.getElementById('loginSubmitBtn');
    setFormError('loginError', '');
    if (submitBtn) submitBtn.disabled = true;
    try {
      const result = await loginAccount(username, password);
      if (!result.ok){
        setFormError('loginError', result.error);
        return;
      }
      location.href = 'dashboard.html';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function animateNumber(el, to, decimals, prefix){
  prefix = prefix || '';
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
}

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
   Dashboard page — everything derived from the actual ledger
   ========================================================================== */

function initDashboardPage(){
  const balanceEl = document.getElementById('dashBalance');
  if (!balanceEl) return;

  const greetingEl = document.getElementById('dashGreeting');
  if (greetingEl) greetingEl.textContent = `${getGreeting()}, ${getCurrentUserDisplayName()}.`;

  const tx = getAllTransactions();
  const currentBalance = getCurrentBalance(tx);
  animateNumber(balanceEl, currentBalance, 2);

  const currentMonthKey = getMonthKey(TODAY_ISO);
  const monthStartISO = currentMonthKey + '-01';
  const beforeMonth = tx.filter(t => t.dateISO < monthStartISO);
  const balanceAtMonthStart = getCurrentBalance(beforeMonth);

  const deltaEl = document.getElementById('dashBalanceDelta');
  if (deltaEl){
    if (balanceAtMonthStart !== 0){
      const pct = ((currentBalance - balanceAtMonthStart) / Math.abs(balanceAtMonthStart)) * 100;
      const up = pct >= 0;
      deltaEl.textContent = `${up ? '\u2191' : '\u2193'} ${Math.abs(pct).toFixed(1)}% since the start of the month`;
      deltaEl.classList.toggle('balance-card__delta--down', !up);
    } else {
      deltaEl.textContent = '';
    }
  }

  const monthTx = tx.filter(t => getMonthKey(t.dateISO) === currentMonthKey);
  const income = monthTx.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const spending = monthTx.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  const incomeEl = document.getElementById('dashIncome');
  if (incomeEl) incomeEl.textContent = '+' + formatMoney(income);
  const spendingEl = document.getElementById('dashSpending');
  if (spendingEl) spendingEl.textContent = '\u2212' + formatMoney(spending);

  const recentList = document.getElementById('dashRecentList');
  if (recentList){
    const recent = tx.slice().sort((a, b) => b.dateISO.localeCompare(a.dateISO)).slice(0, 5);
    if (recent.length === 0){
      recentList.innerHTML = '<li><div><div class="who">No entries yet</div><div class="meta">Add one from the ledger to see it here.</div></div></li>';
    } else {
      recentList.innerHTML = recent.map(t => {
        const label = TX_CATEGORY_LABELS[t.category] || 'Other';
        const isCredit = t.type === 'credit';
        return `
          <li>
            <div>
              <div class="who">${escapeHtml(t.description)}</div>
              <div class="meta">${escapeHtml(label)} · ${escapeHtml(formatDateLabel(t.dateISO))}</div>
            </div>
            <span class="amount ${isCredit ? 'amount--credit' : 'amount--debit'}">${isCredit ? '+' : '\u2212'}${formatMoney(t.amount)}</span>
          </li>
        `;
      }).join('');
    }
  }

  const barsEl = document.getElementById('dashCategoryBars');
  if (barsEl){
    const totals = getCategoryTotals(monthTx, 'debit');
    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0){
      barsEl.innerHTML = '<p style="font-size:12.5px;color:var(--text-muted);margin:0;">No spending recorded this month yet.</p>';
    } else {
      const max = entries[0][1];
      barsEl.innerHTML = entries.slice(0, 5).map(([cat, total]) => {
        const label = TX_CATEGORY_LABELS[cat] || 'Other';
        const pct = max > 0 ? Math.round((total / max) * 100) : 0;
        return `
          <div class="cat-row">
            <span class="cat-row__label">${escapeHtml(label)}</span>
            <span class="cat-row__track"><span class="cat-row__fill" style="width:${pct}%"></span></span>
            <span class="cat-row__value">${formatMoney(total, 0)}</span>
          </div>
        `;
      }).join('');
    }
  }
}

/* ==========================================================================
   Transactions page
   ========================================================================== */

function buildTxRow(entry){
  const tr = document.createElement('tr');
  tr.id = entry.id;
  tr.setAttribute('data-category', entry.category);

  const label = TX_CATEGORY_LABELS[entry.category] || 'Other';
  const dot = TX_CATEGORY_COLORS[entry.category] || TX_CATEGORY_COLORS.other;
  const isCredit = entry.type === 'credit';
  const dateLabel = formatDateLabel(entry.dateISO);
  const amountStr = (isCredit ? '+' : '\u2212') + formatMoney(entry.amount);

  tr.setAttribute('data-search', `${entry.description} ${label} ${dateLabel}`.toLowerCase());

  tr.innerHTML = `
    <td>${escapeHtml(dateLabel)}</td>
    <td>${escapeHtml(entry.description)}</td>
    <td><span class="tx-cat"><span class="tx-cat__dot" style="background:${dot}"></span>${label}</span></td>
    <td class="amount ${isCredit ? 'amount--credit' : 'amount--debit'}">${amountStr}</td>
    <td class="row-actions">
      <button class="row-icon-btn" type="button" data-edit-row aria-label="Edit this entry">
        <svg viewBox="0 0 24 24"><path d="M4 20h4L18 10l-4-4L4 16v4z"/><path d="M13 5l4 4"/></svg>
      </button>
      <button class="row-icon-btn row-icon-btn--danger" type="button" data-remove-row aria-label="Delete this entry">
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

  function renderRows(){
    tbody.innerHTML = '';
    const all = getAllTransactions().sort((a, b) => b.dateISO.localeCompare(a.dateISO));
    all.forEach(entry => tbody.appendChild(buildTxRow(entry)));
    if (countEl) countEl.textContent = all.length;
    applyFilters();
  }

  function applyFilters(){
    const rows = Array.from(tbody.querySelectorAll('tr'));
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

  // ---- add / edit modal ----
  const modal = document.getElementById('txnModal');
  const openBtn = document.getElementById('addEntryTrigger');
  const form = document.getElementById('txnForm');

  if (modal && form){
    const titleEl = document.getElementById('txnModalTitle');
    const submitBtn = document.getElementById('txnSubmitBtn');
    const closeBtns = modal.querySelectorAll('[data-close-modal]');
    const dateInput = document.getElementById('txnDate');
    const descInput = document.getElementById('txnDesc');
    const typeInput = document.getElementById('txnType');
    const categoryInput = document.getElementById('txnCategory');
    const amountInput = document.getElementById('txnAmount');
    let editingId = null;

    const openModal = () => modal.setAttribute('data-open', 'true');
    const closeModal = () => { modal.setAttribute('data-open', 'false'); editingId = null; };

    const openForAdd = () => {
      editingId = null;
      form.reset();
      if (titleEl) titleEl.textContent = 'New ledger entry';
      if (submitBtn) submitBtn.textContent = 'Add entry';
      dateInput.value = TODAY_ISO;
      openModal();
      descInput?.focus();
    };

    const openForEdit = (entry) => {
      editingId = entry.id;
      if (titleEl) titleEl.textContent = 'Edit ledger entry';
      if (submitBtn) submitBtn.textContent = 'Save changes';
      descInput.value = entry.description;
      dateInput.value = entry.dateISO;
      typeInput.value = entry.type;
      categoryInput.value = entry.category;
      amountInput.value = entry.amount;
      openModal();
      descInput?.focus();
    };

    openBtn?.addEventListener('click', openForAdd);
    closeBtns.forEach(b => b.addEventListener('click', closeModal));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('data-open') === 'true') closeModal();
    });

    if (location.hash === '#add'){
      openForAdd();
      history.replaceState(null, '', location.pathname + location.search);
    }

    tbody.addEventListener('click', (e) => {
      const editBtn = e.target.closest('[data-edit-row]');
      const delBtn = e.target.closest('[data-remove-row]');

      if (editBtn){
        const row = editBtn.closest('tr');
        const entry = getAllTransactions().find(t => t.id === row.id);
        if (entry) openForEdit(entry);
        return;
      }

      if (delBtn){
        const row = delBtn.closest('tr');
        const entry = getAllTransactions().find(t => t.id === row.id);
        const label = entry ? entry.description : 'this entry';
        const confirmed = window.confirm(`Delete "${label}"? This can't be undone.`);
        if (!confirmed) return;
        deleteTransaction(row.id);
        renderRows();
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = {
        description: (descInput.value || 'Untitled entry').trim(),
        dateISO: dateInput.value || TODAY_ISO,
        type: typeInput.value === 'credit' ? 'credit' : 'debit',
        category: categoryInput.value || 'other',
        amount: Math.max(0.01, parseFloat(amountInput.value) || 0)
      };

      if (editingId){
        setTxOverride(editingId, fields);
      } else {
        addTransaction(Object.assign({ id: 'custom-' + Date.now() }, fields));
      }

      closeModal();
      renderRows();
    });
  }

  renderRows();
}

/* ==========================================================================
   Goals page
   ========================================================================== */

function buildGoalCard(goal){
  const pct = goal.target > 0 ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0;
  const theme = GOAL_ICONS[goal.icon] || GOAL_ICONS.target;

  const card = document.createElement('article');
  card.className = 'card goal-card';
  card.id = goal.id;
  card.innerHTML = `
    <div class="goal-card__top">
      <div>
        <p class="goal-card__title">${escapeHtml(goal.name)}</p>
        <p class="goal-card__sub">Target by ${escapeHtml(formatMonthYear(goal.dueDate))}</p>
      </div>
      <div class="goal-card__icon" style="background:${theme.bg};color:${theme.fg};">
        <svg viewBox="0 0 24 24">${theme.path}</svg>
      </div>
    </div>
    <div class="goal-progress">
      <div class="goal-progress__track"><div class="goal-progress__fill" style="width:${pct}%"></div></div>
      <div class="goal-progress__nums">
        <span>${formatMoney(goal.saved, 0)} <span style="opacity:.6">saved</span></span>
        <span><strong>${formatMoney(goal.target, 0)}</strong> goal</span>
      </div>
    </div>
    <div class="goal-card__foot">
      <span class="goal-card__pct">${pct}%</span>
      <div class="goal-card-actions">
        <button class="btn btn--ghost btn--sm" type="button" data-add-funds>Add funds</button>
        <button class="row-icon-btn" type="button" data-remove-funds aria-label="Remove funds">
          <svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>
        </button>
        <button class="row-icon-btn" type="button" data-edit-goal aria-label="Edit goal">
          <svg viewBox="0 0 24 24"><path d="M4 20h4L18 10l-4-4L4 16v4z"/><path d="M13 5l4 4"/></svg>
        </button>
        <button class="row-icon-btn row-icon-btn--danger" type="button" data-delete-goal aria-label="Delete goal">
          <svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v13a1 1 0 01-1 1H8a1 1 0 01-1-1V7h10z"/></svg>
        </button>
      </div>
    </div>
  `;
  return card;
}

function initGoalsPage(){
  const grid = document.getElementById('goalsGrid');
  if (!grid) return;

  const addTile = document.getElementById('addGoalCard');

  function renderGoals(){
    grid.querySelectorAll('.goal-card').forEach(el => el.remove());
    const goals = getAllGoals();
    goals.forEach(goal => {
      grid.insertBefore(buildGoalCard(goal), addTile);
    });
    const countEl = document.getElementById('goalCount');
    if (countEl) countEl.textContent = goals.length;
  }

  // ---- add / edit goal modal ----
  const goalModal = document.getElementById('goalModal');
  const goalForm = document.getElementById('goalForm');
  let editingGoalId = null;

  if (goalModal && goalForm){
    const titleEl = document.getElementById('goalModalTitle');
    const submitBtn = document.getElementById('goalSubmitBtn');
    const closeBtns = goalModal.querySelectorAll('[data-close-modal]');
    const nameInput = document.getElementById('goalName');
    const targetInput = document.getElementById('goalTarget');
    const savedInput = document.getElementById('goalSaved');
    const dueInput = document.getElementById('goalDue');

    const openModal = () => goalModal.setAttribute('data-open', 'true');
    const closeModal = () => { goalModal.setAttribute('data-open', 'false'); editingGoalId = null; };

    const openForAdd = () => {
      editingGoalId = null;
      goalForm.reset();
      if (titleEl) titleEl.textContent = 'New savings goal';
      if (submitBtn) submitBtn.textContent = 'Create goal';
      openModal();
      nameInput?.focus();
    };

    const openForEdit = (goal) => {
      editingGoalId = goal.id;
      if (titleEl) titleEl.textContent = 'Edit goal';
      if (submitBtn) submitBtn.textContent = 'Save changes';
      nameInput.value = goal.name;
      targetInput.value = goal.target;
      savedInput.value = goal.saved;
      dueInput.value = goal.dueDate;
      openModal();
      nameInput?.focus();
    };

    document.getElementById('addGoalCard')?.addEventListener('click', openForAdd);
    closeBtns.forEach(b => b.addEventListener('click', closeModal));
    goalModal.addEventListener('click', (e) => { if (e.target === goalModal) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && goalModal.getAttribute('data-open') === 'true') closeModal();
    });

    goalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = {
        name: (nameInput.value || 'Untitled goal').trim(),
        target: Math.max(1, parseFloat(targetInput.value) || 1000),
        saved: Math.max(0, parseFloat(savedInput.value) || 0),
        dueDate: dueInput.value || TODAY_ISO
      };

      if (editingGoalId){
        setGoalOverride(editingGoalId, fields);
      } else {
        addGoal(Object.assign({ id: 'goal-custom-' + Date.now(), icon: 'target' }, fields));
      }

      closeModal();
      renderGoals();
    });

    grid.addEventListener('click', (e) => {
      const editBtn = e.target.closest('[data-edit-goal]');
      if (!editBtn) return;
      const card = editBtn.closest('.goal-card');
      const goal = getAllGoals().find(g => g.id === card.id);
      if (goal) openForEdit(goal);
    });
  }

  // ---- add / remove funds modal ----
  const fundsModal = document.getElementById('fundsModal');
  const fundsForm = document.getElementById('fundsForm');
  let fundingGoalId = null;
  let fundsMode = 'add';

  if (fundsModal && fundsForm){
    const fundsTitle = document.getElementById('fundsModalTitle');
    const fundsLabel = document.getElementById('fundsGoalLabel');
    const fundsSubmitBtn = document.getElementById('fundsSubmitBtn');
    const fundsInput = document.getElementById('fundsAmount');
    const closeBtns = fundsModal.querySelectorAll('[data-close-modal]');

    const openFundsModal = (goal, mode) => {
      fundingGoalId = goal.id;
      fundsMode = mode;
      if (fundsTitle) fundsTitle.textContent = mode === 'add' ? 'Add funds' : 'Remove funds';
      if (fundsSubmitBtn) fundsSubmitBtn.textContent = mode === 'add' ? 'Add funds' : 'Remove funds';
      if (fundsLabel){
        fundsLabel.textContent = mode === 'add'
          ? `Adding to "${goal.name}" — currently ${formatMoney(goal.saved, 0)} of ${formatMoney(goal.target, 0)}.`
          : `Removing from "${goal.name}" — currently ${formatMoney(goal.saved, 0)} of ${formatMoney(goal.target, 0)}.`;
      }
      fundsForm.reset();
      if (fundsInput) fundsInput.max = mode === 'remove' ? goal.saved : '';
      fundsModal.setAttribute('data-open', 'true');
      fundsInput?.focus();
    };
    const closeFundsModal = () => { fundsModal.setAttribute('data-open', 'false'); fundingGoalId = null; };

    closeBtns.forEach(b => b.addEventListener('click', closeFundsModal));
    fundsModal.addEventListener('click', (e) => { if (e.target === fundsModal) closeFundsModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fundsModal.getAttribute('data-open') === 'true') closeFundsModal();
    });

    grid.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-add-funds]');
      const removeBtn = e.target.closest('[data-remove-funds]');
      if (!addBtn && !removeBtn) return;
      const card = (addBtn || removeBtn).closest('.goal-card');
      const goal = getAllGoals().find(g => g.id === card.id);
      if (goal) openFundsModal(goal, addBtn ? 'add' : 'remove');
    });

    fundsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!fundingGoalId) return;
      const goal = getAllGoals().find(g => g.id === fundingGoalId);
      if (!goal) return;

      const requested = Math.max(0.01, parseFloat(fundsInput.value) || 0);

      if (fundsMode === 'add'){
        setGoalOverride(fundingGoalId, { saved: goal.saved + requested });
        addTransaction({
          id: 'custom-' + Date.now(),
          description: `Transfer to "${goal.name}"`,
          dateISO: getSystemDateISO(),
          category: 'savings',
          type: 'debit',
          amount: requested
        });
      } else {
        const amount = Math.min(requested, goal.saved);
        setGoalOverride(fundingGoalId, { saved: Math.max(0, goal.saved - amount) });
        if (amount > 0){
          addTransaction({
            id: 'custom-' + Date.now(),
            description: `Transfer from "${goal.name}"`,
            dateISO: getSystemDateISO(),
            category: 'savings',
            type: 'credit',
            amount: amount
          });
        }
      }

      closeFundsModal();
      renderGoals();
    });
  }

  // ---- delete goal (with confirmation) ----
  grid.addEventListener('click', (e) => {
    const delBtn = e.target.closest('[data-delete-goal]');
    if (!delBtn) return;
    const card = delBtn.closest('.goal-card');
    const goal = getAllGoals().find(g => g.id === card.id);
    const label = goal ? goal.name : 'this goal';
    const confirmed = window.confirm(`Delete the "${label}" goal? This can't be undone.`);
    if (!confirmed) return;
    deleteGoal(card.id);
    renderGoals();
  });

  renderGoals();
}

/* ==========================================================================
   Reports page — trend chart from real ledger data + goal comparison
   ========================================================================== */

function computeBalanceTrend(){
  const tx = getAllTransactions().slice().sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  let running = STARTING_BALANCE;
  const points = tx.map(t => {
    running += (t.type === 'credit' ? 1 : -1) * t.amount;
    return { x: t.dateISO, y: running };
  });
  const startDate = tx.length ? tx[0].dateISO : TODAY_ISO;
  return [{ x: startDate, y: STARTING_BALANCE }].concat(points);
}

function renderReportKPIs(tx){
  const monthMap = groupTransactionsByMonth(tx);
  const months = Object.keys(monthMap).sort();
  const savingsEl = document.getElementById('kpiAvgSavings');
  const spendingEl = document.getElementById('kpiAvgSpending');
  const catEl = document.getElementById('kpiLargestCategory');

  if (months.length === 0){
    if (savingsEl) savingsEl.textContent = '—';
    if (spendingEl) spendingEl.textContent = '—';
    if (catEl) catEl.textContent = '—';
    return;
  }

  const totalNet = months.reduce((s, m) => s + (monthMap[m].income - monthMap[m].spending), 0);
  const totalSpend = months.reduce((s, m) => s + monthMap[m].spending, 0);
  const avgSavings = totalNet / months.length;
  const avgSpending = totalSpend / months.length;

  if (savingsEl){
    savingsEl.textContent = (avgSavings >= 0 ? '' : '\u2212') + formatMoney(Math.abs(avgSavings), 0);
    savingsEl.className = 'kpi__value ' + (avgSavings >= 0 ? 'up' : 'down');
  }
  if (spendingEl) spendingEl.textContent = formatMoney(avgSpending, 0);

  const catTotals = getCategoryTotals(tx, 'debit');
  const catEntries = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  if (catEl) catEl.textContent = catEntries.length ? (TX_CATEGORY_LABELS[catEntries[0][0]] || 'Other') : '—';
}

function renderDonutChart(tx){
  const wrap = document.getElementById('donutWrap');
  if (!wrap) return;

  const totals = getCategoryTotals(tx, 'debit');
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const grandTotal = entries.reduce((s, [, v]) => s + v, 0);

  if (entries.length === 0 || grandTotal === 0){
    wrap.innerHTML = '<p style="font-size:12.5px;color:var(--text-muted);margin:0;">No spending recorded yet.</p>';
    return;
  }

  let cumulative = 0;
  const circles = entries.map(([cat, total]) => {
    const pct = (total / grandTotal) * 100;
    const dashoffset = (((25 - cumulative) % 100) + 100) % 100;
    cumulative += pct;
    const color = TX_CATEGORY_COLORS[cat] || TX_CATEGORY_COLORS.other;
    return `<circle cx="21" cy="21" r="15.915" fill="transparent" stroke="${color}" stroke-width="6" stroke-dasharray="${pct.toFixed(2)} ${(100 - pct).toFixed(2)}" stroke-dashoffset="${dashoffset.toFixed(2)}" transform="rotate(-90 21 21)"></circle>`;
  }).join('');

  const legendItems = entries.map(([cat, total]) => {
    const pct = Math.round((total / grandTotal) * 100);
    const label = TX_CATEGORY_LABELS[cat] || 'Other';
    const color = TX_CATEGORY_COLORS[cat] || TX_CATEGORY_COLORS.other;
    return `<span class="legend__item"><span class="legend__dot" style="background:${color}"></span>${escapeHtml(label)} — ${pct}%</span>`;
  }).join('');

  wrap.innerHTML = `
    <svg width="140" height="140" viewBox="0 0 42 42" role="img" aria-label="Donut chart of spending by category">
      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#DAD3BE" stroke-width="6"></circle>
      ${circles}
    </svg>
    <div class="legend" style="flex-direction:column; gap:8px;">${legendItems}</div>
  `;
}

function renderInsights(tx){
  const list = document.getElementById('insightList');
  if (!list) return;

  if (tx.length === 0){
    list.innerHTML = `<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>Add a few ledger entries to start seeing insights here.</li>`;
    return;
  }

  const insights = [];

  const catTotals = getCategoryTotals(tx, 'debit');
  const catEntries = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  if (catEntries.length){
    const [cat, total] = catEntries[0];
    const label = TX_CATEGORY_LABELS[cat] || 'Other';
    insights.push(`<strong>${escapeHtml(label)}</strong> is your largest spending category, totaling ${formatMoney(total, 2)} across your ledger.`);
  }

  const expenses = tx.filter(t => t.type === 'debit').sort((a, b) => b.amount - a.amount);
  if (expenses.length){
    const top = expenses[0];
    insights.push(`Your largest single entry was "${escapeHtml(top.description)}" for ${formatMoney(top.amount, 2)} on ${escapeHtml(formatDateLabel(top.dateISO))}.`);
  }

  const monthMap = groupTransactionsByMonth(tx);
  const months = Object.keys(monthMap).sort();
  if (months.length >= 2){
    const prevKey = months[months.length - 2];
    const curKey = months[months.length - 1];
    const prevSpend = monthMap[prevKey].spending;
    const curSpend = monthMap[curKey].spending;
    if (prevSpend > 0){
      const pct = ((curSpend - prevSpend) / prevSpend) * 100;
      const direction = pct >= 0 ? 'higher' : 'lower';
      insights.push(`Spending in ${escapeHtml(monthLabel(curKey))} is ${Math.abs(pct).toFixed(0)}% ${direction} than ${escapeHtml(monthLabel(prevKey))}.`);
    }
  } else {
    insights.push(`You have one month of ledger history so far — add more entries to see month-over-month trends.`);
  }

  const icons = [
    '<path d="M12 3v18M3 12h18"/>',
    '<circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/>',
    '<path d="M4 12l5 5L20 6"/>'
  ];

  list.innerHTML = insights.map((text, i) => `
    <li>
      <svg viewBox="0 0 24 24">${icons[i % icons.length]}</svg>
      ${text}
    </li>
  `).join('');
}

function initReportsPage(){
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;

  const tx = getAllTransactions();
  renderReportKPIs(tx);
  renderDonutChart(tx);
  renderInsights(tx);

  const select = document.getElementById('goalCompareSelect');
  const statusEl = document.getElementById('goalCompareStatus');

  if (select){
    select.innerHTML = '<option value="">No comparison</option>' +
      getAllGoals().map(g => `<option value="${g.id}">${escapeHtml(g.name)}</option>`).join('');
    select.addEventListener('change', () => draw());
  }

  function draw(){
    const actual = computeBalanceTrend();
    const goalId = select ? select.value : '';
    const goal = goalId ? getAllGoals().find(g => g.id === goalId) : null;

    let comparison = null;
    if (goal && actual.length){
      const last = actual[actual.length - 1];
      const first = actual[0];
      const spanDays = Math.max(1, daysBetween(first.x, last.x));
      const dailyRate = (last.y - first.y) / spanDays;

      const shortfall = Math.max(0, goal.target - goal.saved);
      const daysUntilDue = Math.max(1, daysBetween(TODAY_ISO, goal.dueDate));
      const projectedGrowth = dailyRate * daysUntilDue;
      const projectedAtDue = last.y + projectedGrowth;
      const onTrack = projectedGrowth >= shortfall;

      comparison = {
        goal,
        requiredStart: { x: TODAY_ISO, y: last.y },
        requiredEnd: { x: goal.dueDate, y: last.y + shortfall },
        onTrack,
        projectedAtDue,
        shortfall
      };

      if (statusEl){
        statusEl.className = 'goal-compare-status ' + (onTrack ? 'goal-compare-status--good' : 'goal-compare-status--bad');
        statusEl.innerHTML = onTrack
          ? `<strong>On pace.</strong> At your current savings rate you'd have about ${formatMoney(projectedAtDue, 0)} by ${escapeHtml(formatMonthYear(goal.dueDate))} — enough to cover the ${formatMoney(shortfall, 0)} still needed for "${escapeHtml(goal.name)}."`
          : `<strong>Behind pace.</strong> At your current savings rate you'd have about ${formatMoney(projectedAtDue, 0)} by ${escapeHtml(formatMonthYear(goal.dueDate))} — short of the ${formatMoney(shortfall, 0)} still needed for "${escapeHtml(goal.name)}."`;
      }
    } else if (statusEl){
      statusEl.className = 'goal-compare-status';
      statusEl.innerHTML = '';
    }

    drawTrendChart(canvas, actual, comparison);
  }

  draw();
  window.addEventListener('resize', debounce(draw, 150));
}

function drawTrendChart(canvas, actual, comparison){
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const w = rect.width, h = rect.height;
  const padL = 48, padR = 14, padT = 16, padB = 26;
  const plotW = w - padL - padR, plotH = h - padT - padB;

  let minDate = actual[0].x, maxDate = actual[actual.length - 1].x;
  let maxVal = Math.max(...actual.map(p => p.y));
  let minVal = Math.min(0, ...actual.map(p => p.y));

  if (comparison){
    if (comparison.requiredEnd.x > maxDate) maxDate = comparison.requiredEnd.x;
    maxVal = Math.max(maxVal, comparison.requiredEnd.y);
  }

  const totalDays = Math.max(1, daysBetween(minDate, maxDate));
  maxVal *= 1.12;

  function xFor(iso){ return padL + (daysBetween(minDate, iso) / totalDays) * plotW; }
  function yFor(val){ return padT + plotH - ((val - minVal) / (maxVal - minVal)) * plotH; }

  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = '#DAD3BE';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 3; i++){
    const y = padT + (plotH / 3) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - padR, y);
    ctx.stroke();
  }

  const lineColor = comparison && !comparison.onTrack ? '#A6432D' : '#35654D';
  const fillTop = comparison && !comparison.onTrack ? 'rgba(166,67,45,0.24)' : 'rgba(53,101,77,0.28)';
  const fillBottom = comparison && !comparison.onTrack ? 'rgba(166,67,45,0.02)' : 'rgba(53,101,77,0.02)';

  const pts = actual.map(p => ({ x: xFor(p.x), y: yFor(p.y) }));

  const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
  grad.addColorStop(0, fillTop);
  grad.addColorStop(1, fillBottom);
  ctx.beginPath();
  ctx.moveTo(pts[0].x, padT + plotH);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, padT + plotH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2.4;
  ctx.lineJoin = 'round';
  ctx.stroke();

  pts.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, i === pts.length - 1 ? 4 : 2.2, 0, Math.PI * 2);
    ctx.fillStyle = i === pts.length - 1 ? '#C98A3D' : lineColor;
    ctx.fill();
  });

  if (comparison){
    const rs = { x: xFor(comparison.requiredStart.x), y: yFor(comparison.requiredStart.y) };
    const re = { x: xFor(comparison.requiredEnd.x), y: yFor(comparison.requiredEnd.y) };
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(rs.x, rs.y);
    ctx.lineTo(re.x, re.y);
    ctx.strokeStyle = '#C98A3D';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(re.x, re.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#C98A3D';
    ctx.fill();
  }

  ctx.fillStyle = '#5B6B60';
  ctx.font = '11px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(formatDateLabel(minDate), xFor(minDate), h - 6);
  ctx.fillText(formatDateLabel(actual[actual.length - 1].x), xFor(actual[actual.length - 1].x), h - 6);
  if (comparison) ctx.fillText(formatDateLabel(maxDate), xFor(maxDate) - 4, h - 6);
}

function debounce(fn, ms){
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
