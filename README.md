# Aurelia Stays – Hotel Booking Management System (React)

React 18 + Vite + React Router. Data is saved in localStorage.

## Run
```
npm install
npm run dev
```
Open the address shown in the terminal (usually http://localhost:5173).

## Structure
```
src/
  main.jsx            entry
  App.jsx             routes
  data.js             sample rooms, destinations, seed bookings
  utils.js            dates, price, validation helpers
  store.jsx           context: rooms, bookings, profile, toast (localStorage)
  components/         Layout (navbar, footer, toast), UI (Img, RoomCard, Empty)
  pages/              Home, Rooms (+RoomDetails), Booking (+Confirmation),
                      MyBookings, Admin (dashboard + rooms), Profile
public/images/        drawn pictures + photos/ folder for your real photos
```
## Real photos
Put JPGs in `public/images/photos/` using the names in its README.txt.
Missing photos fall back to the drawn pictures automatically.

## Routes
/ · /rooms · /search · /room/:id · /book/:id · /confirm/:ref · /bookings · /admin · /admin/rooms · /profile
