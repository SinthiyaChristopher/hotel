import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Rooms, { RoomDetails } from './pages/Rooms.jsx';
import Booking, { Confirmation } from './pages/Booking.jsx';
import MyBookings from './pages/MyBookings.jsx';
import { AdminDashboard, AdminRooms } from './pages/Admin.jsx';
import Profile from './pages/Profile.jsx';
import { Empty } from './components/UI.jsx';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/search" element={<Rooms search />} />
        <Route path="/room/:id" element={<RoomDetails />} />
        <Route path="/book/:id" element={<Booking />} />
        <Route path="/confirm/:ref" element={<Confirmation />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/rooms" element={<AdminRooms />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<section className="wrap"><Empty icon="🧭" title="Page not found" text="The page you are looking for does not exist."><Link className="btn" to="/">Back to home</Link></Empty></section>} />
      </Route>
    </Routes>
  );
}
