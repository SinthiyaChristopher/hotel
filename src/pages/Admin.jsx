import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { DESTINATIONS } from '../data.js';
import { fmt, money } from '../utils.js';
import { Img, Empty } from '../components/UI.jsx';

const Tabs = () => {
  const rooms = useLocation().pathname.endsWith('/rooms');
  return (
    <div className="tabs">
      <Link to="/admin"><button className={rooms ? '' : 'on'}>Booking dashboard</button></Link>
      <Link to="/admin/rooms"><button className={rooms ? 'on' : ''}>Rooms & pricing</button></Link>
    </div>
  );
};

export function AdminDashboard() {
  const { bookings, cancelBooking, notify } = useStore();
  const [st, setSt] = useState('All');
  const [term, setTerm] = useState('');
  const ok = bookings.filter(b => b.status === 'Confirmed');
  const rows = bookings.filter(b => (st === 'All' || b.status === st) && (b.ref + b.guest.name + b.roomName).toLowerCase().includes(term.toLowerCase()));
  const cancel = ref => { if (window.confirm(`Cancel ${ref}?`)) { cancelBooking(ref); notify('Cancelled', 'warn'); } };
  return (
    <section className="wrap">
      <h2>Admin</h2><Tabs />
      <div className="stats">
        <div><b>{bookings.length}</b><span>Total bookings</span></div><div><b>{ok.length}</b><span>Confirmed</span></div>
        <div><b>{bookings.length - ok.length}</b><span>Cancelled</span></div><div><b>{money(ok.reduce((s, b) => s + b.total, 0))}</b><span>Revenue</span></div>
      </div>
      <div className="filters">
        <input placeholder="Search ref, guest or room…" value={term} onChange={e => setTerm(e.target.value)} />
        <select value={st} onChange={e => setSt(e.target.value)}>{['All', 'Confirmed', 'Cancelled'].map(x => <option key={x}>{x}</option>)}</select>
      </div>
      <div className="table">
        <table>
          <thead><tr><th>Ref</th><th>Guest</th><th>Room</th><th>Dates</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map(b => (
              <tr key={b.ref}>
                <td>{b.ref}</td><td>{b.guest.name}<br /><small>{b.guest.email}</small></td><td>{b.roomName}</td>
                <td>{fmt(b.checkIn)} → {fmt(b.checkOut)}</td><td>{money(b.total)}</td><td><span className={`tag ${b.status}`}>{b.status}</span></td>
                <td>{b.status === 'Confirmed' && <button className="btn sm danger" onClick={() => cancel(b.ref)}>Cancel</button>}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="7"><Empty icon="📭" title="No bookings match" text="Try a different search or status filter." /></td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const BLANK = { name: '', type: 'Deluxe', destination: 'Goa', price: 3000, units: 1, maxGuests: 2, size: 300, bed: '1 Queen Bed', description: '' };

export function AdminRooms() {
  const { rooms, saveRoom, deleteRoom, notify } = useStore();
  const [draft, setDraft] = useState(null); // null = closed
  const [err, setErr] = useState('');
  const set = e => setDraft({ ...draft, [e.target.name]: e.target.value });
  const open = r => { setErr(''); setDraft(r || BLANK); };

  const submit = e => {
    e.preventDefault();
    const d = { ...draft };
    ['price', 'units', 'maxGuests', 'size'].forEach(k => (d[k] = +d[k]));
    if (!d.name.trim() || d.price < 500 || d.units < 1 || d.maxGuests < 1) return setErr('Enter a name, a price of at least ₹500, and positive numbers.');
    if (d.id) saveRoom(d);
    else {
      const id = Math.max(0, ...rooms.map(r => r.id)) + 1;
      saveRoom({ ...d, id, rating: 4.5, active: true, amenities: ['Free Wi-Fi', 'Air Conditioning'], images: rooms[3] ? rooms[3].images : rooms[0].images });
    }
    notify('Room saved'); setDraft(null);
  };
  const remove = r => { if (window.confirm('Delete this room?')) { deleteRoom(r.id); notify('Room deleted', 'warn'); } };

  return (
    <section className="wrap">
      <h2>Admin</h2><Tabs />
      <div className="row"><p className="muted">{rooms.length} rooms</p><button className="btn sm" onClick={() => open()}>+ Add room</button></div>
      <div className="table">
        <table>
          <thead><tr><th></th><th>Room</th><th>Destination</th><th>Price / night</th><th>Units</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rooms.map(r => (
              <tr key={r.id}>
                <td><Img src={r.images[0]} alt={r.name} className="mini" /></td>
                <td><b>{r.name}</b><br /><small>{r.type} · {r.maxGuests} guests</small></td><td>{r.destination}</td><td>{money(r.price)}</td><td>{r.units}</td>
                <td><span className={`tag ${r.active ? 'Confirmed' : 'Cancelled'}`}>{r.active ? 'Active' : 'Hidden'}</span></td>
                <td className="acts">
                  <button className="btn sm ghost" onClick={() => open(r)}>Edit</button>
                  <button className="btn sm ghost" onClick={() => saveRoom({ ...r, active: !r.active })}>{r.active ? 'Hide' : 'Show'}</button>
                  <button className="btn sm danger" onClick={() => remove(r)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {draft && (
        <div className="modal" onClick={e => e.target === e.currentTarget && setDraft(null)}>
          <form onSubmit={submit} noValidate>
            <h3>{draft.id ? 'Edit' : 'Add'} room</h3>
            <label>Name<input name="name" value={draft.name} onChange={set} /></label>
            <div className="two">
              <label>Type<input name="type" value={draft.type} onChange={set} /></label>
              <label>Destination<select name="destination" value={draft.destination} onChange={set}>{DESTINATIONS.map(d => <option key={d.name}>{d.name}</option>)}</select></label>
            </div>
            <div className="two">
              <label>Price / night (₹)<input name="price" type="number" value={draft.price} onChange={set} /></label>
              <label>Rooms available<input name="units" type="number" value={draft.units} onChange={set} /></label>
            </div>
            <div className="two">
              <label>Max guests<input name="maxGuests" type="number" value={draft.maxGuests} onChange={set} /></label>
              <label>Size (sq ft)<input name="size" type="number" value={draft.size} onChange={set} /></label>
            </div>
            <label>Bed<input name="bed" value={draft.bed} onChange={set} /></label>
            <label>Description<textarea name="description" rows="3" value={draft.description} onChange={set} /></label>
            <p className="err">{err}</p>
            <div className="actions"><button type="button" className="btn ghost" onClick={() => setDraft(null)}>Cancel</button><button className="btn gold">Save</button></div>
          </form>
        </div>
      )}
    </section>
  );
}
