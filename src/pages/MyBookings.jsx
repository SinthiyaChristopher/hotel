import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { today, fmt, money } from '../utils.js';
import { Img, Empty } from '../components/UI.jsx';

export default function MyBookings() {
  const { bookings, rooms, cancelBooking, notify } = useStore();
  const [tab, setTab] = useState('All');
  const t = today();
  const list = bookings.filter(b => tab === 'All' || (tab === 'Cancelled' ? b.status === 'Cancelled'
    : b.status === 'Confirmed' && (tab === 'Upcoming' ? b.checkOut >= t : b.checkOut < t)));
  const cancel = ref => {
    if (window.confirm(`Cancel booking ${ref}? This cannot be undone.`)) { cancelBooking(ref); notify('Booking cancelled', 'warn'); }
  };
  return (
    <section className="wrap">
      <h2>My bookings</h2><p className="muted sub">{bookings.length} reservation(s)</p>
      <div className="tabs">{['All', 'Upcoming', 'Past', 'Cancelled'].map(x => <button key={x} className={x === tab ? 'on' : ''} onClick={() => setTab(x)}>{x}</button>)}</div>
      <div className="list">
        {list.length ? list.map(b => {
          const room = rooms.find(r => r.id === b.roomId);
          const can = b.status === 'Confirmed' && b.checkIn >= t;
          return (
            <article key={b.ref} className={`bk ${b.status === 'Cancelled' ? 'off' : ''}`}>
              <Img src={room ? room.images[0] : ''} alt={b.roomName} />
              <div>
                <span className={`tag ${b.status}`}>{b.status}</span>
                <h3>{b.roomName}</h3><p className="muted">📍 {b.destination} · Ref {b.ref}</p>
                <p>{fmt(b.checkIn)} → {fmt(b.checkOut)} · {b.nights} night(s) · {b.guests} guest(s)</p>
              </div>
              <div className="end">
                <strong>{money(b.total)}</strong>
                <Link className="btn sm ghost" to={`/confirm/${b.ref}`}>Details</Link>
                {can && <button className="btn sm danger" onClick={() => cancel(b.ref)}>Cancel</button>}
              </div>
            </article>
          );
        }) : <Empty icon="🧳" title="No bookings here yet" text="When you book a stay, it will show up on this page."><Link className="btn" to="/rooms">Explore rooms</Link></Empty>}
      </div>
    </section>
  );
}
