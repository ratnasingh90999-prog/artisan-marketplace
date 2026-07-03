import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage({ initialView }) {
  const [mode, setMode] = useState(initialView || 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', village: '', craftCategory: '', story: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      navigate(from, { replace: true });
    } catch {
      setError('Invalid login or registration information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMode(initialView);
  }, [initialView]);

  return (
    <section className="auth-page container">
      <div className="auth-card">
        <div className="auth-switch">
          <button className={mode === 'login' ? 'button-pill active' : 'button-pill'} onClick={() => setMode('login')}>Login</button>
          <button className={mode === 'register' ? 'button-pill active' : 'button-pill'} onClick={() => setMode('register')}>Register</button>
        </div>
        <form onSubmit={onSubmit} className="auth-form">
          {mode === 'register' && (
            <label>
              Name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </label>
          )}
          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </label>
          {mode === 'register' && (
            <>
              <label>
                Role
                <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                  <option value="customer">Customer</option>
                  <option value="artisan">Artisan</option>
                </select>
              </label>
              {form.role === 'artisan' && (
                <>
                  <label>
                    Village
                    <input value={form.village} onChange={(event) => setForm({ ...form, village: event.target.value })} />
                  </label>
                  <label>
                    Craft category
                    <input value={form.craftCategory} onChange={(event) => setForm({ ...form, craftCategory: event.target.value })} />
                  </label>
                  <label>
                    Story
                    <textarea value={form.story} onChange={(event) => setForm({ ...form, story: event.target.value })} rows="4" />
                  </label>
                </>
              )}
            </>
          )}
          <button type="submit" className="button-primary" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}</button>
          {error && <p className="status-error">{error}</p>}
        </form>
      </div>
    </section>
  );
}
