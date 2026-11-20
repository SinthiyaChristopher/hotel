import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AMENITIES, REMOTE } from '../data.js';
import { money, price } from '../utils.js';

const FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><rect width="900" height="600" fill="#1b2a4a"/><text x="450" y="310" font-size="42" fill="#c9a24d" text-anchor="middle" font-family="serif">Aurelia Stays</text></svg>');

const EXTS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

// Every place we try, in order: your photo in /images/photos, your photo in /images/rooms or /images/destinations
// (any of jpg/jpeg/png/webp/avif), a real photo from the internet, the drawn picture, then a placeholder.
export function candidates(src) {
  if (!src.includes('/images/photos/')) return [src];
  const n = src.split('/').pop().replace(/\.\w+$/, '');
  const own = /^room/.test(n) ? '/images/rooms' : n === 'hero' ? '/images' : '/images/destinations';
  const list = [];
  ['/images/photos', own].forEach(d => EXTS.forEach(e => list.push(`${d}/${n}.${e}`)));
  list.push(REMOTE[n + '.jpg'], `${own}/${n}.svg`);
  return list.filter(Boolean);
}

export function Img({ src, alt, className }) {
  const list = useMemo(() => candidates(src), [src]);
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [src]);
  return <img className={className} src={i < list.length ? list[i] : FALLBACK} alt={alt} loading="lazy" onError={() => setI(k => k + 1)} />;
}

export const Stars = ({ value }) => <span className="star">★ {Number(value).toFixed(1)}</span>;

export const Empty = ({ icon, title, text, children }) => (
  <div className="empty"><div className="big">{icon}</div><h3>{title}</h3><p>{text}</p>{children}</div>
);

export const qs = q => (q && q.ci ? `?ci=${q.ci}&co=${q.co}&g=${q.g}` : '');

export function RoomCard({ room, q }) {
  const total = q && q.ci ? price(room, q.ci, q.co) : null;
  return (
    <article className="card">
      <Link to={`/room/${room.id}${qs(q)}`} className="thumb">
        <Img src={room.images[0]} alt={room.name} />
        <span className="badge">{room.type}</span>
      </Link>
      <div className="card-body">
        <div className="row"><small>📍 {room.destination}</small><Stars value={room.rating} /></div>
        <h3>{room.name}</h3>
        <p className="muted">{room.bed} · {room.size} sq ft · up to {room.maxGuests} guests</p>
        <div className="chips">{room.amenities.slice(0, 4).map(a => <span key={a}>{AMENITIES[a] || '•'} {a}</span>)}</div>
        <div className="row foot">
          <div>
            <strong>{money(room.price)}</strong><small> / night</small>
            {total && <><br /><small>{total.nights} nights: {money(total.total)} incl. tax</small></>}
          </div>
          <Link className="btn sm" to={`/room/${room.id}${qs(q)}`}>View</Link>
        </div>
      </div>
    </article>
  );
}
