import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../store.jsx';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { toast, notify } = useStore();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);

  return (
    <>
      <header className="nav">
        <Link to="/" className="brand">✦ Aurelia <span>Stays</span></Link>
        <button className="burger" aria-label="Menu" onClick={() => setOpen(o => !o)}>☰</button>
        <nav id="menu" className={open ? 'open' : ''}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/rooms">Rooms</NavLink>
          <NavLink to="/bookings">My Bookings</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/admin" className="pill">Admin</NavLink>
        </nav>
      </header>
      <main><Outlet /></main>
      <footer className="footer">
        <div className="f-top">
          <div className="f-col f-brand">
            <Link to="/" className="brand">✦ Aurelia <span>Stays</span></Link>
            <p>Handpicked rooms, suites and villas across India's most loved destinations. Book in minutes, stay in comfort.</p>
            <div className="social"><a href="#top" aria-label="Instagram">📸</a><a href="#top" aria-label="Facebook">📘</a><a href="#top" aria-label="X">🐦</a><a href="#top" aria-label="YouTube">▶️</a></div>
          </div>
          <div className="f-col"><h4>Explore</h4><Link to="/">Home</Link><Link to="/rooms">All rooms</Link><Link to="/bookings">My bookings</Link><Link to="/profile">Profile</Link><Link to="/admin">Admin</Link></div>
          <div className="f-col"><h4>Destinations</h4>{['Goa', 'Jaipur', 'Ooty', 'Chennai'].map(d => <Link key={d} to={`/rooms?dest=${d}`}>{d}</Link>)}</div>
          <div className="f-col">
            <h4>Contact</h4>
            <p>📍 12 Palm Avenue, Chennai</p><p>📞 +91 98765 43210</p><p>✉️ stay@aureliastays.com</p><p>🛎️ Concierge 24/7</p>
            <form className="news" onSubmit={e => { e.preventDefault(); notify('Thanks for subscribing!'); e.target.reset(); }}>
              <input type="email" required placeholder="Your email for offers" /><button>Join</button>
            </form>
          </div>
        </div>
        <div className="f-bottom"><span>© 2026 Aurelia Stays. All rights reserved.</span><span>Free cancellation · Best price promise · Secure booking</span></div>
      </footer>
      <div id="toast" className={toast.show ? `show ${toast.type}` : ''}>{toast.msg}</div>
    </>
  );
}
