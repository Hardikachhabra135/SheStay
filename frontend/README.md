# SheStay — frontend

Plain HTML, CSS and JavaScript. No build step: open `index.html` in a browser, or deploy this folder on Vercel.

## Pages
| File | Screen |
|---|---|
| `index.html` | Home and search |
| `results.html` | Results ranked by safety score (try `?state=loading`, `?state=empty`, `?state=error`) |
| `listing.html` | Listing: score, breakdown, red flags, reviews, OpenStreetMap map with walking routes, checklist, share |
| `review.html` | Write a review or report an issue |
| `owner.html` | Owner dashboard: reply, dispute, what to improve |

## Files
- `css/style.css` — all styles; colours are CSS variables at the top
- `js/app.js` — shared helpers (score badge, toggles, share, toast)
- `js/data.js` — **demo data**. Backend: replace with API calls returning the same shape
- `js/results.js`, `js/listing.js` — page logic

## Where the backend plugs in
- `js/results.js` → `load()` : replace the `setTimeout` with `fetch('/api/listings?city=…&college=…')`
- `listing.html` content → later rendered from `/api/listings/:id`
- `review.html` submit handler → `POST /api/reviews` (FormData with files)
- `owner.html` reply button → `POST /api/reviews/:id/reply`

## Map
OpenStreetMap via Leaflet, dark tiles from CARTO, walking routes from the OSRM router at routing.openstreetmap.de, nearby police/hospitals/pharmacies from the Overpass API. All free, no API key. Check the coordinates in `js/data.js`.
