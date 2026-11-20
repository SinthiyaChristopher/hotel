export const iso = d => { const x = new Date(d); return new Date(x.getTime() - x.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
export const today = () => iso(new Date());
export const addDays = (s, n) => { const d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return iso(d); };
export const nights = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);
export const fmt = s => new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const money = n => '₹' + Number(n).toLocaleString('en-IN');
export const price = (room, ci, co) => {
  const n = nights(ci, co), subtotal = n * room.price, tax = Math.round(subtotal * 0.12);
  return { nights: n, subtotal, tax, total: subtotal + tax };
};
export const validate = (ci, co, g, max) => {
  if (!ci || !co) return 'Please select check-in and check-out dates.';
  if (ci < today()) return 'Check-in date cannot be in the past.';
  if (co <= ci) return 'Check-out must be after check-in.';
  if (nights(ci, co) > 30) return 'Stays are limited to 30 nights.';
  if (!Number.isInteger(+g) || +g < 1) return 'Guests must be at least 1.';
  if (max && +g > max) return `This room sleeps up to ${max} guests.`;
  return '';
};
