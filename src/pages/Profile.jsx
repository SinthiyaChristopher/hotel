import { useState } from 'react';
import { useStore } from '../store.jsx';

export default function Profile() {
  const { profile, setProfile, bookings, notify, resetDemo } = useStore();
  const [f, setF] = useState(profile);
  const [err, setErr] = useState('');
  const set = e => setF({ ...f, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const submit = e => {
    e.preventDefault();
    if (f.name.trim().length < 2) return setErr('Name is required.');
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr('Enter a valid email.');
    if (f.phone && !/^\d{10}$/.test(f.phone)) return setErr('Phone must be 10 digits.');
    setErr(''); setProfile({ ...f, name: f.name.trim(), email: f.email.trim() }); notify('Profile saved');
  };
  const reset = () => {
    if (window.confirm('Reset all rooms, bookings and profile to demo data?')) {
      resetDemo(); setF({ name: 'Guest User', email: 'guest@example.com', phone: '', notify: true }); notify('Demo data restored');
    }
  };
  return (
    <section className="wrap narrow">
      <h2>Profile & settings</h2>
      <div className="panel">
        <div className="avatar">{(profile.name || 'G')[0].toUpperCase()}</div>
        <p className="muted center">{bookings.filter(b => b.status === 'Confirmed').length} active booking(s)</p>
        <form onSubmit={submit} noValidate>
          <label>Full name<input name="name" value={f.name} onChange={set} /></label>
          <label>Email<input type="email" name="email" value={f.email} onChange={set} /></label>
          <label>Phone<input name="phone" value={f.phone} onChange={set} /></label>
          <label className="check"><input type="checkbox" name="notify" checked={!!f.notify} onChange={set} /> Email me booking updates and offers</label>
          <p className="err">{err}</p>
          <button className="btn gold block">Save changes</button>
        </form>
        <hr /><button className="btn sm danger" onClick={reset}>Reset demo data</button>
      </div>
    </section>
  );
}
