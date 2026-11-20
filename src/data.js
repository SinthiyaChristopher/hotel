import { today, addDays, price } from './utils.js';

export const DESTINATIONS = [
  { name: 'Goa', tag: 'Beaches & nightlife', img: '/images/photos/goa.jpg' },
  { name: 'Jaipur', tag: 'Palaces & heritage', img: '/images/photos/jaipur.jpg' },
  { name: 'Ooty', tag: 'Hills & tea gardens', img: '/images/photos/ooty.jpg' },
  { name: 'Chennai', tag: 'Culture & coastline', img: '/images/photos/chennai.jpg' }
];
export const AMENITIES = { 'Free Wi-Fi': '📶', Breakfast: '🍳', Pool: '🏊', Spa: '💆', 'Air Conditioning': '❄️', Parking: '🅿️', 'Sea View': '🌊', 'Mini Bar': '🍷', Gym: '🏋️', Balcony: '🌇', 'Room Service': '🛎️', Bathtub: '🛁' };
export const PHOTO_CAPTIONS = ['Bedroom', 'Bathroom', 'Balcony & view'];
const gallery = n => [1, 2, 3].map(v => `/images/photos/room${n}-${v}.jpg`);

export const SEED_ROOMS = [
  { id: 1, name: 'Ocean Breeze Deluxe', type: 'Deluxe', destination: 'Goa', price: 5200, maxGuests: 2, size: 380, bed: '1 King Bed', rating: 4.7, units: 3, active: true,
    description: 'A sun-washed retreat with floor-to-ceiling windows opening onto the Arabian Sea. Wake up to the sound of waves and enjoy sunset cocktails on your private balcony.',
    amenities: ['Free Wi-Fi', 'Breakfast', 'Sea View', 'Balcony', 'Air Conditioning', 'Pool'], images: gallery(1) },
  { id: 2, name: 'Royal Maharaja Suite', type: 'Suite', destination: 'Jaipur', price: 12500, maxGuests: 4, size: 820, bed: '1 King + 2 Singles', rating: 4.9, units: 2, active: true,
    description: 'Live like royalty in a heritage suite with hand-painted ceilings, a marble bathtub and a private lounge. Includes a personal butler and a complimentary palace tour.',
    amenities: ['Free Wi-Fi', 'Breakfast', 'Spa', 'Bathtub', 'Mini Bar', 'Room Service', 'Air Conditioning'], images: gallery(2) },
  { id: 3, name: 'Misty Hills Cottage', type: 'Cottage', destination: 'Ooty', price: 4200, maxGuests: 3, size: 450, bed: '1 Queen + 1 Single', rating: 4.6, units: 4, active: true,
    description: 'A cosy wooden cottage surrounded by tea gardens and pine forests. Fireplace evenings, mountain-view mornings and fresh-brewed Nilgiri tea on arrival.',
    amenities: ['Free Wi-Fi', 'Breakfast', 'Balcony', 'Parking', 'Room Service'], images: gallery(3) },
  { id: 4, name: 'City Comfort Standard', type: 'Standard', destination: 'Chennai', price: 2800, maxGuests: 2, size: 260, bed: '1 Queen Bed', rating: 4.3, units: 6, active: true,
    description: 'Smart, comfortable and perfectly located for business or quick city breaks. Quiet work desk, blackout curtains and a rainfall shower.',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Gym', 'Parking', 'Breakfast'], images: gallery(4) },
  { id: 5, name: 'Palm Grove Family Villa', type: 'Villa', destination: 'Goa', price: 9800, maxGuests: 6, size: 1200, bed: '2 King Beds + Sofa Bed', rating: 4.8, units: 2, active: true,
    description: 'A private villa with its own pool, tropical garden and open-air dining deck. Ideal for families and groups who want space, privacy and a personal chef.',
    amenities: ['Free Wi-Fi', 'Pool', 'Breakfast', 'Parking', 'Mini Bar', 'Air Conditioning', 'Room Service'], images: gallery(5) },
  { id: 6, name: 'Pink City Heritage Room', type: 'Deluxe', destination: 'Jaipur', price: 6400, maxGuests: 3, size: 410, bed: '1 King Bed', rating: 4.5, units: 3, active: true,
    description: 'Rajasthani artwork, carved furniture and a courtyard view. Rooftop dining is just an elevator ride away.',
    amenities: ['Free Wi-Fi', 'Breakfast', 'Spa', 'Air Conditioning', 'Balcony'], images: gallery(6) }
];

const d = n => addDays(today(), n);
const mk = (ref, r, a, b, g, name, status) => ({
  ref, roomId: r.id, roomName: r.name, destination: r.destination, checkIn: d(a), checkOut: d(b), guests: g,
  ...price(r, d(a), d(b)), guest: { name, email: name.split(' ')[0].toLowerCase() + '@example.com', phone: '9876543210', requests: '' },
  status, createdAt: new Date().toISOString()
});
export const SEED_BOOKINGS = [
  mk('AUR-1001', SEED_ROOMS[0], 5, 8, 2, 'Priya Nair', 'Confirmed'),
  mk('AUR-1002', SEED_ROOMS[1], 12, 15, 3, 'Rahul Mehta', 'Confirmed'),
  mk('AUR-1003', SEED_ROOMS[2], -10, -7, 2, 'Anita Rao', 'Confirmed'),
  mk('AUR-1004', SEED_ROOMS[4], 20, 24, 5, 'Karthik S', 'Cancelled')
];

// Real photos loaded from the internet by keyword (loremflickr.com). Used when no file exists in images/photos/.
const _EXTRA = { 1: 'sea', 2: 'suite', 3: 'cottage', 4: 'modern', 5: 'villa', 6: 'heritage' };
const _KW = [n => `hotel,bedroom,${_EXTRA[n]}`, () => 'hotel,bathroom,luxury', () => 'hotel,balcony,view'];
export const REMOTE = {
  'hero.jpg': 'https://loremflickr.com/1600/900/resort,pool,hotel?lock=1',
  'goa.jpg': 'https://loremflickr.com/1000/667/goa,beach?lock=2',
  'jaipur.jpg': 'https://loremflickr.com/1000/667/jaipur,palace?lock=3',
  'ooty.jpg': 'https://loremflickr.com/1000/667/tea,plantation,hills?lock=4',
  'chennai.jpg': 'https://loremflickr.com/1000/667/india,temple?lock=5'
};
[1, 2, 3, 4, 5, 6].forEach(n => [1, 2, 3].forEach(v => { REMOTE[`room${n}-${v}.jpg`] = `https://loremflickr.com/1000/667/${_KW[v - 1](n)}?lock=${n * 10 + v}`; }));
