import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { DESTINATIONS, AMENITIES, PHOTO_CAPTIONS } from '../data.js';
import { today, addDays, nights, fmt, money, price, validate } from '../utils.js';
import { Img, RoomCard, Stars, Empty, qs } from '../components/UI.jsx';

// Used for both the catalogue (/rooms) and availability results (/search)
export default function Rooms({ search }) {
  const { rooms, isAvailable } = useStore();
  const [sp] = useSearchParams();
  const q = Object.fromEntries(sp);
  const searching = !!(search && q.ci);
  const err = searching ? validate(q.ci, q.co, q.g) : '';
  const [f, setF] = useState({ s: '', d: q.dest || '', t: 'All', p: 0, o: 'rating' });
  useEffect(() => setF(x => ({ ...x, d: q.dest || '' })), [q.dest]);
  const set = e => setF({ ...f, [e.target.name]: e.target.value });
  const types = ['All', ...new Set(rooms.map(r => r.type))];

  let list = rooms.filter(r => r.active && (!f.d || r.destination === f.d) && (f.t === 'All' || r.type === f.t) && (!+f.p || r.price < +f.p)
    && (!f.s || (r.name + r.amenities.join(' ') + r.destination).toLowerCase().includes(f.s.toLowerCase())));
  if (searching && !err) list = list.filter(r => +q.g <= r.maxGuests && isAvailable(r, q.ci, q.co));
  list.sort((a, b) => (f.o === 'low' ? a.price - b.price : f.o === 'high' ? b.price - a.price : b.rating - a.rating));

  return (
    <section className="wrap">
      <h2>{searching ? 'Available rooms' : 'Our rooms & suites'}</h2>
      <p className="muted sub">
        {searching && !err ? `${q.dest || 'All destinations'} · ${fmt(q.ci)} → ${fmt(q.co)} · ${nights(q.ci, q.co)} nights · ${q.g} guest(s)` : 'Filter and compare every room'}
      </p>
      {err && <p className="err">{err} <Link to="/">Change search</Link></p>}
      <div className="filters">
        <input name="s" placeholder="Search by name or amenity…" value={f.s} onChange={set} />
        <select name="d" value={f.d} onChange={set}><option value="">All destinations</option>{DESTINATIONS.map(d => <option key={d.name}>{d.name}</option>)}</select>
        <select name="t" value={f.t} onChange={set}>{types.map(t => <option key={t}>{t}</option>)}</select>
        <select name="p" value={f.p} onChange={set}><option value="0">Any price</option><option value="4000">Under ₹4,000</option><option value="7000">Under ₹7,000</option><option value="10000">Under ₹10,000</option></select>
        <select name="o" value={f.o} onChange={set}><option value="rating">Top rated</option><option value="low">Price: low → high</option><option value="high">Price: high → low</option></select>
      </div>
      <div className="grid">
        {list.length ? list.map(r => <RoomCard key={r.id} room={r} q={searching && !err ? q : null} />)
          : <Empty icon="🛏️" title="No rooms found" text="Try different dates, fewer guests or clear the filters."><Link className="btn" to="/rooms">Reset</Link></Empty>}
      </div>
    </section>
  );
}

export function RoomDetails() {
  const { id } = useParams();
  const { rooms, isAvailable } = useStore();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const t = today();
  const [ci, setCi] = useState(sp.get('ci') || addDays(t, 1));
  const [co, setCo] = useState(sp.get('co') || addDays(t, 3));
  const [g, setG] = useState(sp.get('g') || 2);
  const [active, setActive] = useState(0);
  const [msg, setMsg] = useState('');
  const room = rooms.find(r => r.id === +id);
  if (!room) return <section className="wrap"><Empty icon="🧭" title="Room not found" text="This room does not exist."><Link className="btn" to="/rooms">All rooms</Link></Empty></section>;

  const err = validate(ci, co, g, room.maxGuests);
  const p = err ? null : price(room, ci, co);
  const reserve = () => {
    if (err) return;
    if (!isAvailable(room, ci, co)) return setMsg('Sorry, this room is fully booked for those dates.');
    nav(`/book/${room.id}${qs({ ci, co, g })}`);
  };
  const on = setter => e => { setter(e.target.value); setMsg(''); };

  return (
    <section className="wrap">
      <Link to="/rooms" className="back">← All rooms</Link>
      <div className="detail">
        <div>
          <div className="gal">
            <Img src={room.images[active]} alt={room.name} className="main" />
            <div className="thumbs">
              {room.images.map((s, i) => (
                <figure key={s} onClick={() => setActive(i)}>
                  <Img src={s} alt={`${room.name} – ${PHOTO_CAPTIONS[i]}`} className={i === active ? 'on' : ''} />
                  <figcaption>{PHOTO_CAPTIONS[i]}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="row"><h1>{room.name}</h1><Stars value={room.rating} /></div>
          <p className="muted">📍 {room.destination} · {room.type} · {room.bed} · {room.size} sq ft · sleeps {room.maxGuests}</p>
          <p>{room.description}</p>
          <h3>Amenities</h3>
          <div className="amen">{room.amenities.map(a => <div key={a}>{AMENITIES[a] || '•'}<span>{a}</span></div>)}</div>
          <h3>Policies</h3>
          <ul className="muted"><li>Check-in from 2 PM · Check-out by 11 AM</li><li>Free cancellation from My Bookings</li><li>12% taxes added to the room rate</li></ul>
        </div>
        <aside className="panel">
          <div className="price"><b>{money(room.price)}</b> / night</div>
          <label>Check-in<input type="date" min={t} value={ci} onChange={on(setCi)} /></label>
          <label>Check-out<input type="date" min={t} value={co} onChange={on(setCo)} /></label>
          <label>Guests<input type="number" min="1" max={room.maxGuests} value={g} onChange={on(setG)} /></label>
          {p && (
            <div className="sum">
              <div><span>{money(room.price)} × {p.nights} nights</span><span>{money(p.subtotal)}</span></div>
              <div><span>Taxes (12%)</span><span>{money(p.tax)}</span></div>
              <div className="tot"><span>Total</span><span>{money(p.total)}</span></div>
            </div>
          )}
          <p className="err">{err || msg}</p>
          <button className="btn gold block" onClick={reserve}>Reserve now</button>
        </aside>
      </div>
    </section>
  );
}
