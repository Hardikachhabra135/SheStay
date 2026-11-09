/* ==========================================================
   Listing page — real OpenStreetMap with walking routes
   Map tiles: CARTO dark (free, OSM data)
   Routes:    OSRM walking router (routing.openstreetmap.de)
   Nearby:    Overpass API (police, hospitals, pharmacies from OSM)
   ========================================================== */
const place = LISTINGS.find(p => p.id === 'sunrise');   // later: from ?id= + API
const home = [place.lat, place.lng];

// Share buttons
document.getElementById('share-wa').onclick = () =>
  shareWhatsApp(`${place.name} has a SheStay safety score of ${place.score}/100 (${scoreLevel(place.score).label}). Have a look:`);
document.getElementById('share-link').onclick = () => sharePage(place.name, 'SheStay safety summary');

// ---------- map ----------
const map = L.map('map', { scrollWheelZoom: false }).setView(home, 15);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 19
}).addTo(map);

function pin(cls, letter, latlng, label) {
  return L.marker(latlng, {
    icon: L.divIcon({ className: '', html: `<div class="pin pin-${cls}">${letter}</div>`, iconSize: [26, 26], iconAnchor: [13, 13] }),
    title: label, alt: label
  }).addTo(map).bindPopup(esc(label));
}
pin('home', '★', home, place.name + ' (demo)');
pin('college', 'C', [PLACES.college.lat, PLACES.college.lng], PLACES.college.name);
pin('metro', 'M', [PLACES.metro.lat, PLACES.metro.lng], PLACES.metro.name);

// ---------- routes ----------
const ROUTES = {
  college: {
    from: home, to: [PLACES.college.lat, PLACES.college.lng],
    title: 'To ' + PLACES.college.name,
    note: 'Main roads most of the way, with shops open until about 10 pm.',
    style: { color: '#F2B6C3', weight: 5, opacity: .95 }
  },
  metro: {
    from: [PLACES.metro.lat, PLACES.metro.lng], to: home,
    title: 'From ' + PLACES.metro.name,
    note: 'Residents report this lane is unlit after 8 pm. Take an e-rickshaw (about ₹20) or ask the guard to meet you.',
    style: { color: '#FF8A80', weight: 5, opacity: .95, dashArray: '8 8' }
  }
};
const cache = {};
let currentLine = null;

async function getRoute(r) {
  // OSRM wants lng,lat order
  const url = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${r.from[1]},${r.from[0]};${r.to[1]},${r.to[0]}?overview=full&geometries=geojson`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const route = data.routes[0];
    return {
      points: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
      km: (route.distance / 1000).toFixed(1),
      min: Math.round(route.duration / 60)
    };
  } catch (e) {
    // Router unavailable → straight line so the page still works
    const m = map.distance(r.from, r.to);
    return { points: [r.from, r.to], km: (m / 1000).toFixed(1), min: Math.round(m / 80), approx: true };
  }
}

async function showRoute(key) {
  const r = ROUTES[key];
  document.getElementById('route-title').textContent = r.title;
  document.getElementById('route-text').textContent = 'Finding the walking route…';
  cache[key] = cache[key] || await getRoute(r);
  const info = cache[key];
  if (currentLine) map.removeLayer(currentLine);
  currentLine = L.polyline(info.points, r.style).addTo(map);
  map.fitBounds(currentLine.getBounds(), { padding: [40, 40] });
  document.getElementById('route-title').textContent = `${r.title} · ${info.km} km · ${info.min} min walk${info.approx ? ' (approx.)' : ''}`;
  document.getElementById('route-text').textContent = r.note;
  document.getElementById('directions').href =
    `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${r.from[0]},${r.from[1]};${r.to[0]},${r.to[1]}`;
}

document.getElementById('route-tabs').addEventListener('toggled', e => showRoute(e.target.dataset.route));
showRoute('college');

// ---------- nearby safety places from OpenStreetMap ----------
async function loadNearby() {
  const [lat, lng] = home;
  const query = `[out:json][timeout:20];
    (nwr(around:2000,${lat},${lng})[amenity=police];
     nwr(around:2000,${lat},${lng})[amenity=hospital];
     nwr(around:1000,${lat},${lng})[amenity=pharmacy];);
    out center 60;`;
  const list = document.getElementById('places');
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: 'data=' + encodeURIComponent(query) });
    const data = await res.json();
    const kinds = { police: ['police', 'P', 'Police'], hospital: ['hospital', '+', 'Hospital'], pharmacy: ['pharmacy', 'Rx', 'Chemist'] };
    const rows = [];
    for (const kind of Object.keys(kinds)) {
      const found = data.elements
        .filter(el => el.tags.amenity === kind)
        .map(el => {
          const p = [el.lat ?? el.center.lat, el.lon ?? el.center.lon];
          return { p, name: el.tags.name || kinds[kind][2], m: map.distance(home, p) };
        })
        .sort((a, b) => a.m - b.m)
        .slice(0, 2);   // two closest of each kind
      found.forEach(f => {
        pin(kinds[kind][0], kinds[kind][1], f.p, f.name);
        rows.push(`<li><span>${esc(f.name)}</span><span class="muted">${f.m < 1000 ? Math.round(f.m / 10) * 10 + ' m' : (f.m / 1000).toFixed(1) + ' km'}</span></li>`);
      });
    }
    list.innerHTML = rows.length ? rows.join('') : '<li><span class="muted">No places found nearby on OpenStreetMap</span></li>';
  } catch (e) {
    list.innerHTML = '<li><span class="muted">Couldn’t load nearby places. Check your connection.</span></li>';
  }
}
loadNearby();

// ---------- tiffin services ----------
function renderTiffins() {
  const box = document.getElementById('tiffins');
  box.innerHTML = TIFFINS.map(t => {
    const good = t.hygiene >= 4;
    return `
      <article class="inner">
        <div class="row between" style="flex-wrap:nowrap; align-items:baseline">
          <strong>${esc(t.name)}</strong>
          <span class="price">₹${t.pricePerMonth.toLocaleString('en-IN')}<span>/mo</span></span>
        </div>
        <p class="tiny muted" style="margin:2px 0 8px">${esc(t.food)} · ${esc(t.meals)} · ${t.distanceKm} km away</p>
        <div class="row" style="gap:6px">
          <span class="badge badge-sm ${good ? 'badge-safe' : 'badge-warn'}">${good ? '✓' : '!'} Hygiene ${t.hygiene}/5 · ${t.reviews} reviews</span>
          ${t.womenRun ? '<span class="badge badge-pink badge-sm">Women-run</span>' : ''}
          ${t.deliversToGate ? '<span class="src">Delivers to the gate</span>' : '<span class="src">Pickup only</span>'}
        </div>
        ${t.note ? `<p class="flag" style="margin-top:8px"><span style="color:var(--warn-text)">${ICONS.warn}</span>${esc(t.note)}</p>` : ''}
        <div class="row" style="margin-top:10px">
          <button type="button" class="btn btn-ghost btn-small" data-trial="${esc(t.name)}">Try a meal · ₹${t.trialPrice}</button>
        </div>
      </article>`;
  }).join('');
  box.addEventListener('click', e => {
    const b = e.target.closest('[data-trial]');
    if (b) toast(`Trial meal requested from ${b.dataset.trial} (demo)`);
  });
}
renderTiffins();
