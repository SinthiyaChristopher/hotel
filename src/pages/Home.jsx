import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { DESTINATIONS } from '../data.js';
import { today, addDays, validate } from '../utils.js';
import { Img, RoomCard, candidates } from '../components/UI.jsx';

export default function Home() {
  const { rooms } = useStore();
  const nav = useNavigate();
  const t = today();
  const [f, setF] = useState({ dest: '', ci: addDays(t, 1), co: addDays(t, 3), g: 2 });
  const [err, setErr] = useState('');
  const set = e => setF({ ...f, [e.target.name]: e.target.value });
  const submit = e => {
    e.preventDefault();
    const m = validate(f.ci, f.co, f.g);
    if (m) return setErr(m);
    nav(`/search?${new URLSearchParams(f)}`);
  };
  const featured = [...rooms].filter(r => r.active).sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <>
      <section className="hero" style={{ backgroundImage: `linear-gradient(120deg,rgba(14,22,45,.78),rgba(14,22,45,.25)),${candidates('/images/photos/hero.jpg').map(u => `url('${u}')`).join(',')}` }}>
        <div className="hero-in">
          <p className="eyebrow">LUXURY · COMFORT · EXPERIENCE</p>
          <h1>Find stays you'll<br />never want to leave</h1>
          <p className="lead">Handpicked rooms, suites and villas across India's most loved destinations.</p>
          <form className="search" onSubmit={submit} noValidate>
            <label>Destination
              <select name="dest" value={f.dest} onChange={set}><option value="">All destinations</option>{DESTINATIONS.map(d => <option key={d.name}>{d.name}</option>)}</select>
            </label>
            <label>Check-in<input type="date" name="ci" min={t} value={f.ci} onChange={set} /></label>
            <label>Check-out<input type="date" name="co" min={t} value={f.co} onChange={set} /></label>
            <label>Guests<input type="number" name="g" min="1" max="10" value={f.g} onChange={set} /></label>
            <button className="btn gold">Search rooms</button>
          </form>
          {err && <p className="err">{err}</p>}
        </div>
      </section>

      <section className="wrap">
        <div className="stats">
          <div><b>{rooms.length}+</b><span>Signature rooms</span></div><div><b>4</b><span>Destinations</span></div>
          <div><b>4.7★</b><span>Avg. guest rating</span></div><div><b>24/7</b><span>Concierge</span></div>
        </div>
      </section>

      <section className="wrap">
        <h2>Featured rooms</h2><p className="muted sub">Our guests' top rated stays</p>
        <div className="grid">{featured.map(r => <RoomCard key={r.id} room={r} />)}</div>
        <p className="center"><Link className="btn ghost" to="/rooms">Browse all rooms →</Link></p>
      </section>

      <section className="wrap">
        <h2>Popular destinations</h2><p className="muted sub">Pick a place, we'll handle the rest</p>
        <div className="dest">
          {DESTINATIONS.map(d => (
            <Link key={d.name} to={`/rooms?dest=${d.name}`} className="tile">
              <Img src={d.img} alt={d.name} /><div><h3>{d.name}</h3><small>{d.tag}</small></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap why">
        <h2>Why book with Aurelia</h2>
        <div className="grid3">
          <div><span>💎</span><h4>Best price promise</h4><p className="muted">Transparent pricing with taxes shown upfront.</p></div>
          <div><span>🔓</span><h4>Free cancellation</h4><p className="muted">Cancel anytime from My Bookings.</p></div>
          <div><span>🛎️</span><h4>Concierge support</h4><p className="muted">Local experts available round the clock.</p></div>
        </div>
      </section>
    </>
  );
}
