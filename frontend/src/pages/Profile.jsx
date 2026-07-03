import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', avatar: '', village: '', craftCategory: '', story: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        village: user.village || '',
        craftCategory: user.craftCategory || '',
        story: user.story || '',
      });
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await updateUserProfile(form);
      setMessage('Profile updated successfully.');
    } catch {
      setError('Unable to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="profile-page container">
      <div className="profile-card">
        <h1>Profile</h1>
        <form onSubmit={handleSubmit} className="profile-form">
          <label>
            Name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label>
            Avatar URL
            <input value={form.avatar} onChange={(event) => setForm({ ...form, avatar: event.target.value })} />
          </label>
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
          <button type="submit" className="button-primary" disabled={loading}>{loading ? 'Saving…' : 'Save profile'}</button>
          {message && <p className="status-success">{message}</p>}
          {error && <p className="status-error">{error}</p>}
        </form>
      </div>
    </section>
  );
}
