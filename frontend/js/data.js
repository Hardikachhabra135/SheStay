/* ==========================================================
   SheStay — DEMO DATA
   Everything here is made up for the prototype.
   When the backend is ready, replace this file with API calls
   (e.g. fetch('/api/listings?city=...')) that return the same shape.
   ========================================================== */

// TODO: check exact coordinates on openstreetmap.org
// (right-click the place → "Show address" shows lat/lng)
const PLACES = {
  college: { name: 'BVCOE', lat: 28.6754, lng: 77.1151 },
  metro:   { name: 'Paschim Vihar East metro', lat: 28.6789, lng: 77.1124 }
};

const LISTINGS = [
  {
    id: 'lotus-nest',
    tiffinNearby: true,
    name: 'Lotus Nest Girls PG',
    area: 'Paschim Vihar',
    price: 11500,
    distanceKm: 0.8,
    commute: '10 min walk',
    type: 'PG',
    womenOnly: true,
    meals: true,
    score: 86,
    verifiedReviews: 41,
    flags: []   // no major red flags
  },
  {
    id: 'aashiyana',
    tiffinNearby: true,
    name: 'Aashiyana Women’s Hostel',
    area: 'Meera Bagh',
    price: 9800,
    distanceKm: 1.6,
    commute: '1 metro stop',
    type: 'Hostel',
    womenOnly: true,
    meals: true,
    score: 78,
    verifiedReviews: 33,
    flags: [{ level: 'warn', text: 'Warden changed 3 times this year' }]
  },
  {
    id: 'sunrise',
    tiffinNearby: true,
    name: 'Sunrise Residency PG',
    area: 'Paschim Vihar',
    price: 8500,
    distanceKm: 1.1,
    commute: '14 min walk',
    type: 'PG',
    womenOnly: true,
    meals: true,
    score: 63,
    verifiedReviews: 29,
    lat: 28.6772, lng: 77.1176,   // demo location
    flags: [
      { level: 'warn', text: 'Lane from metro unlit after 8 pm (4 reviews)' },
      { level: 'warn', text: 'Slow deposit refunds (2 complaints)' }
    ]
  },
  {
    id: 'comfort-stay',
    tiffinNearby: false,
    name: 'Comfort Stay Rooms',
    area: 'Jwalaheri',
    price: 7200,
    distanceKm: 2.4,
    commute: 'bus or auto',
    type: 'Flat',
    womenOnly: true,
    meals: false,
    score: 41,
    verifiedReviews: 12,
    flags: [
      { level: 'risk', text: 'Male staff enter rooms without notice (3 reviews)' },
      { level: 'risk', text: 'No CCTV or guard at entrance' }
    ]
  }
];

// Tiffin (home-cooked meal) services near a listing — demo data.
// Backend: GET /api/listings/:id/tiffins
const TIFFINS = [
  {
    name: 'Maa Ki Rasoi Tiffins',
    food: 'Veg', meals: 'Lunch + dinner', pricePerMonth: 3200, trialPrice: 80,
    hygiene: 4.6, reviews: 58, womenRun: true, deliversToGate: true, distanceKm: 0.4
  },
  {
    name: 'Ghar Ka Khana by Sunita',
    food: 'Veg', meals: 'Dinner only', pricePerMonth: 1800, trialPrice: 70,
    hygiene: 4.4, reviews: 23, womenRun: true, deliversToGate: true, distanceKm: 0.7
  },
  {
    name: 'Punjabi Dhaba Tiffin Co.',
    food: 'Veg & non-veg', meals: 'Lunch + dinner', pricePerMonth: 3800, trialPrice: 100,
    hygiene: 3.6, reviews: 41, womenRun: false, deliversToGate: false, distanceKm: 1.2,
    note: '3 reviews mention late deliveries after 9 pm'
  }
];
