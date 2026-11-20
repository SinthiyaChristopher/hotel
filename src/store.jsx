import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { SEED_ROOMS, SEED_BOOKINGS } from './data.js';
import { price } from './utils.js';

const Ctx = createContext(null);
const K = { rooms: 'aur_rooms', bookings: 'aur_bookings', profile: 'aur_profile' };
const DEFAULT_PROFILE = { name: 'Guest User', email: 'guest@example.com', phone: '', notify: true };
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };

export function StoreProvider({ children }) {
  const [rooms, setRooms] = useState(() => load(K.rooms, SEED_ROOMS));
  const [bookings, setBookings] = useState(() => load(K.bookings, SEED_BOOKINGS));
  const [profile, setProfile] = useState(() => load(K.profile, DEFAULT_PROFILE));
  const [toast, setToast] = useState({ msg: '', type: 'ok', show: false });

  useEffect(() => localStorage.setItem(K.rooms, JSON.stringify(rooms)), [rooms]);
  useEffect(() => localStorage.setItem(K.bookings, JSON.stringify(bookings)), [bookings]);
  useEffect(() => localStorage.setItem(K.profile, JSON.stringify(profile)), [profile]);

  const notify = useCallback((msg, type = 'ok') => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3200);
  }, []);

  const isAvailable = (room, ci, co) => {
    const clash = bookings.filter(b => b.roomId === room.id && b.status === 'Confirmed' && b.checkIn < co && b.checkOut > ci).length;
    return room.active && clash < room.units;
  };
  const addBooking = (room, ci, co, guests, guest) => {
    const b = { ref: 'AUR-' + (Date.now() % 100000), roomId: room.id, roomName: room.name, destination: room.destination, checkIn: ci, checkOut: co,
      guests: +guests, ...price(room, ci, co), guest, status: 'Confirmed', createdAt: new Date().toISOString() };
    setBookings(list => [b, ...list]);
    return b;
  };
  const cancelBooking = ref => setBookings(list => list.map(b => (b.ref === ref ? { ...b, status: 'Cancelled' } : b)));
  const saveRoom = room => setRooms(list => (list.some(r => r.id === room.id) ? list.map(r => (r.id === room.id ? room : r)) : [...list, room]));
  const deleteRoom = id => setRooms(list => list.filter(r => r.id !== id));
  const resetDemo = () => { setRooms(SEED_ROOMS); setBookings(SEED_BOOKINGS); setProfile(DEFAULT_PROFILE); };

  return (
    <Ctx.Provider value={{ rooms, bookings, profile, setProfile, toast, notify, isAvailable, addBooking, cancelBooking, saveRoom, deleteRoom, resetDemo }}>
      {children}
    </Ctx.Provider>
  );
}
export const useStore = () => useContext(Ctx);
