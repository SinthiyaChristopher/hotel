import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { fmt, money, price, validate } from '../utils.js';
import { Img, Empty, qs } from '../components/UI.jsx';

export default function Booking() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const { rooms, profile, isAvailable, addBooking, notify } = useStore();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: profile.name === 'Guest User' ? '' : profile.name,
    email: profile.email === 'guest@example.com' ? '' : profile.email,
    phone: profile.phone || '', requests: '', terms: false
  });
  const [err, setErr] = useState('');
  const room = rooms.find(r => r.id === +id);
  const [ci, co, g] = [sp.get('ci'), sp.get('co'), sp.get('g')];
  if (!room) return <section className="wrap"><Empty icon="🧭" title="Room not found" text="This room does not exist."><Link className="btn" to="/rooms">All rooms</Link></Empty></section>;
  const dateErr = validate(ci, co, g, room.maxGuests);
  if (dateErr) return <section className="wrap"><Empty icon="📅" title="Check your dates" text={dateErr}><Link className="btn" to={`/room/${room.id}`}>Back to room</Link></Empty></section>;
  const p = price(room, ci, co);
  const set = e => setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = e => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setErr('Please enter your full name.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErr('Please enter a valid email address.');
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) return setErr('Phone number must be 10 digits.');
    if (!form.terms) return setErr('Please accept the terms to continue.');
    if (!isAvailable(room, ci, co)) return setErr('This room was just booked for these dates. Please pick other dates.');
    const b = addBooking(room, ci, co, g, { name: form.name.trim(), email: form.email.trim(), phone: form.phone.replace(/\s/g, ''), requests: form.requests.trim() });
    notify('Booking confirmed! 🎉');
    nav(`/confirm/${b.ref}`);
  };

  return (
    <section className="wrap">
      <Link to={`/room/${room.id}${qs({ ci, co, g })}`} className="back">← Back to room</Link>
      <h2>Complete your booking</h2>
      <div className="detail">
        <form className="panel wide" onSubmit={submit} noValidate>
          <h3>Guest information</h3>
          <label>Full name<input name="name" value={form.name} onChange={set} /></label>
          <label>Email<input type="email" name="email" value={form.email} onChange={set} /></label>
          <label>Phone (10 digits)<input name="phone" value={form.phone} onChange={set} /></label>
          <label>Special requests<textarea name="requests" rows="3" placeholder="Late check-in, extra bed, dietary needs…" value={form.requests} onChange={set} /></label>
          <label className="check"><input type="checkbox" name="terms" checked={form.terms} onChange={set} /> I agree to the booking terms and cancellation policy</label>
          <p className="err">{err}</p>
          <button className="btn gold block">Confirm booking · {money(p.total)}</button>
        </form>
        <aside className="panel">
          <Img src={room.images[0]} alt={room.name} className="sumimg" />
          <h3>{room.name}</h3><p className="muted">📍 {room.destination}</p>
          <div className="sum">
            <div><span>Check-in</span><span>{fmt(ci)}</span></div><div><span>Check-out</span><span>{fmt(co)}</span></div>
            <div><span>Duration</span><span>{p.nights} night(s)</span></div><div><span>Guests</span><span>{g}</span></div>
            <div><span>Room total</span><span>{money(p.subtotal)}</span></div><div><span>Taxes (12%)</span><span>{money(p.tax)}</span></div>
            <div className="tot"><span>Total</span><span>{money(p.total)}</span></div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function Confirmation() {
  const { ref } = useParams();
  const { bookings, rooms } = useStore();
  const b = bookings.find(x => x.ref === ref);
  if (!b) return <section className="wrap"><Empty icon="🔍" title="Booking not found" text="We could not find that booking reference."><Link className="btn" to="/bookings">My bookings</Link></Empty></section>;
  const room = rooms.find(r => r.id === b.roomId);
  return (
    <section className="wrap narrow">
      <div className="ok-box">
        <div className="tick">✓</div><h2>Booking confirmed!</h2>
        <p className="muted">A confirmation has been sent to <b>{b.guest.email}</b></p>
        <div className="ref">{b.ref}</div>
      </div>
      <div className="panel">
        {room && <Img src={room.images[0]} alt={room.name} className="sumimg" />}
        <h3>{b.roomName} · {b.destination}</h3>
        <div className="sum">
          <div><span>Guest</span><span>{b.guest.name}</span></div><div><span>Check-in</span><span>{fmt(b.checkIn)}</span></div>
          <div><span>Check-out</span><span>{fmt(b.checkOut)}</span></div><div><span>Duration</span><span>{b.nights} night(s) · {b.guests} guest(s)</span></div>
          <div><span>Taxes</span><span>{money(b.tax)}</span></div><div className="tot"><span>Total paid</span><span>{money(b.total)}</span></div>
        </div>
        <div className="actions"><Link className="btn" to="/bookings">View my bookings</Link><button className="btn ghost" onClick={() => window.print()}>Print</button></div>
      </div>
    </section>
  );
}
