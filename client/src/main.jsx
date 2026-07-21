import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { api } from './api.js';
import './styles.css';

const money = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount));
const today = () => new Date().toISOString().slice(0, 10);

function AuthPage({ register }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setError('');
    try { const data = await api(`/auth/${register ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(form) }); localStorage.setItem('token', data.token); navigate('/'); }
    catch (err) { setError(err.message); }
  }
  return <main className="auth-page"><form className="card auth-card" onSubmit={submit}><h1>Personal Finance Tracker</h1><p>{register ? 'Create an account to start tracking.' : 'Log in to view your finances.'}</p>{error && <p className="error">{error}</p>}<label>Email<input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label><label>Password<input type="password" minLength="6" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label><button>{register ? 'Create account' : 'Log in'}</button><p>{register ? 'Already have an account?' : 'Need an account?'} <NavLink to={register ? '/login' : '/register'}>{register ? 'Log in' : 'Register'}</NavLink></p></form></main>;
}

function Layout({ children }) {
  const navigate = useNavigate();
  function logout() { localStorage.removeItem('token'); navigate('/login'); }
  return <><header><NavLink className="brand" to="/">Finance Tracker</NavLink><nav><NavLink to="/">Dashboard</NavLink><NavLink to="/transactions">Transactions</NavLink><NavLink to="/goals">Goals</NavLink><button className="link-button" onClick={logout}>Log out</button></nav></header><main className="page">{children}</main></>;
}

function Dashboard() {
  const [transactions, setTransactions] = useState([]), [goals, setGoals] = useState([]), [error, setError] = useState('');
  useEffect(() => { Promise.all([api('/transactions'), api('/goals')]).then(([t, g]) => { setTransactions(t); setGoals(g); }).catch(e => setError(e.message)); }, []);
  const income = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + Number(t.amount), 0);
  return <Layout><h1>Dashboard</h1>{error && <p className="error">{error}</p>}<section className="summary"><Stat label="Total income" amount={income} /><Stat label="Total expenses" amount={expenses} /><Stat label="Current balance" amount={income - expenses} /></section><section className="card"><h2>Recent transactions</h2><TransactionList transactions={transactions.slice(0, 5)} /></section><section className="card"><h2>Financial goals</h2>{goals.length ? goals.map(g => <p key={g.id}>{g.name}: {money(g.amount)} {g.period.toLowerCase()}</p>) : <p>No goals yet. Add one from the Goals page.</p>}</section></Layout>;
}
function Stat({ label, amount }) { return <article className="card stat"><span>{label}</span><strong className={amount < 0 ? 'expense' : ''}>{money(amount)}</strong></article>; }
function TransactionList({ transactions }) { return transactions.length ? <div className="transaction-list">{transactions.map(t => <div className="transaction" key={t.id}><span><b>{t.category}</b>{t.description && ` — ${t.description}`}<small>{new Date(t.date).toLocaleDateString()}</small></span><strong className={t.type === 'INCOME' ? 'income' : 'expense'}>{t.type === 'INCOME' ? '+' : '-'}{money(t.amount)}</strong></div>)}</div> : <p>No transactions yet.</p>; }

const blankTransaction = { amount: '', type: 'EXPENSE', category: '', description: '', date: today() };
function Transactions() {
  const [items, setItems] = useState([]), [form, setForm] = useState(blankTransaction), [editing, setEditing] = useState(null), [error, setError] = useState('');
  const load = () => api('/transactions').then(setItems).catch(e => setError(e.message)); useEffect(load, []);
  async function submit(e) { e.preventDefault(); setError(''); try { await api(`/transactions${editing ? `/${editing}` : ''}`, { method: editing ? 'PUT' : 'POST', body: JSON.stringify(form) }); setForm(blankTransaction); setEditing(null); load(); } catch (err) { setError(err.message); } }
  function edit(t) { setEditing(t.id); setForm({ ...t, date: t.date.slice(0, 10) }); }
  async function remove(id) { if (confirm('Delete this transaction?')) { await api(`/transactions/${id}`, { method: 'DELETE' }); load(); } }
  return <Layout><h1>Transactions</h1><section className="card"><h2>{editing ? 'Edit transaction' : 'Add transaction'}</h2><TransactionForm form={form} setForm={setForm} submit={submit} cancel={() => { setEditing(null); setForm(blankTransaction); }} editing={editing} error={error} /></section><section className="card"><h2>Transaction history</h2>{items.length ? <div className="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th></th></tr></thead><tbody>{items.map(t => <tr key={t.id}><td>{new Date(t.date).toLocaleDateString()}</td><td>{t.type}</td><td>{t.category}{t.description && ` — ${t.description}`}</td><td className={t.type === 'INCOME' ? 'income' : 'expense'}>{money(t.amount)}</td><td><button className="text-button" onClick={() => edit(t)}>Edit</button><button className="text-button danger" onClick={() => remove(t.id)}>Delete</button></td></tr>)}</tbody></table></div> : <p>No transactions yet.</p>}</section></Layout>;
}
function TransactionForm({ form, setForm, submit, cancel, editing, error }) { const update = e => setForm({ ...form, [e.target.name]: e.target.value }); return <form onSubmit={submit} className="form-grid">{error && <p className="error full">{error}</p>}<label>Type<select name="type" value={form.type} onChange={update}><option value="EXPENSE">Expense</option><option value="INCOME">Income</option></select></label><label>Amount<input name="amount" type="number" min="0.01" step="0.01" required value={form.amount} onChange={update}/></label><label>Category<input name="category" required value={form.category} onChange={update}/></label><label>Date<input name="date" type="date" required value={form.date} onChange={update}/></label><label className="full">Description (optional)<input name="description" value={form.description} onChange={update}/></label><div className="full"><button>{editing ? 'Save changes' : 'Add transaction'}</button>{editing && <button type="button" className="secondary" onClick={cancel}>Cancel</button>}</div></form>; }

const blankGoal = { name: '', amount: '', period: 'MONTHLY' };
function Goals() {
  const [goals, setGoals] = useState([]), [transactions, setTransactions] = useState([]), [form, setForm] = useState(blankGoal), [editing, setEditing] = useState(null), [error, setError] = useState('');
  const load = () => Promise.all([api('/goals'), api('/transactions')]).then(([g, t]) => { setGoals(g); setTransactions(t); }).catch(e => setError(e.message)); useEffect(load, []);
  async function submit(e) { e.preventDefault(); try { await api(`/goals${editing ? `/${editing}` : ''}`, { method: editing ? 'PUT' : 'POST', body: JSON.stringify(form) }); setForm(blankGoal); setEditing(null); load(); } catch (err) { setError(err.message); } }
  async function remove(id) { if (confirm('Delete this financial goal?')) { await api(`/goals/${id}`, { method: 'DELETE' }); load(); } }
  const spentFor = (period) => transactions.filter(t => t.type === 'EXPENSE' && inCurrentPeriod(t.date, period)).reduce((sum, t) => sum + Number(t.amount), 0);
  return <Layout><h1>Financial Goals</h1><section className="card"><h2>{editing ? 'Edit goal' : 'Create a spending goal'}</h2><form className="form-grid" onSubmit={submit}>{error && <p className="error full">{error}</p>}<label>Goal name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Food budget" /></label><label>Spending limit<input type="number" min="0.01" step="0.01" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></label><label>Period<select value={form.period} onChange={e => setForm({ ...form, period: e.target.value })}><option value="DAILY">Daily</option><option value="WEEKLY">Weekly</option><option value="MONTHLY">Monthly</option></select></label><div className="full"><button>{editing ? 'Save changes' : 'Create goal'}</button>{editing && <button type="button" className="secondary" onClick={() => { setEditing(null); setForm(blankGoal); }}>Cancel</button>}</div></form></section><section className="card"><h2>Your goals</h2>{goals.length ? <div className="goal-list">{goals.map(goal => { const spent = spentFor(goal.period), percent = Math.min(100, (spent / Number(goal.amount)) * 100); return <article className="goal" key={goal.id}><div><h3>{goal.name}</h3><p>{money(spent)} of {money(goal.amount)} spent this {goal.period.toLowerCase().replace('ly', '')}</p><div className="progress"><span className={spent > Number(goal.amount) ? 'over' : ''} style={{ width: `${percent}%` }} /></div>{spent > Number(goal.amount) && <p className="error">This goal has been exceeded.</p>}</div><div><button className="text-button" onClick={() => { setEditing(goal.id); setForm({ name: goal.name, amount: goal.amount, period: goal.period }); }}>Edit</button><button className="text-button danger" onClick={() => remove(goal.id)}>Delete</button></div></article>; })}</div> : <p>No goals yet.</p>}</section></Layout>;
}
function inCurrentPeriod(value, period) { const date = new Date(value), now = new Date(); if (period === 'DAILY') return date.toDateString() === now.toDateString(); if (period === 'WEEKLY') { const start = new Date(now); start.setHours(0, 0, 0, 0); start.setDate(now.getDate() - now.getDay()); return date >= start && date <= now; } return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth(); }
function Protected({ children }) { return localStorage.getItem('token') ? children : <Navigate to="/login" replace />; }
function App() { return <Routes><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage register />} /><Route path="/" element={<Protected><Dashboard /></Protected>} /><Route path="/transactions" element={<Protected><Transactions /></Protected>} /><Route path="/goals" element={<Protected><Goals /></Protected>} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>; }
createRoot(document.getElementById('root')).render(<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>);
