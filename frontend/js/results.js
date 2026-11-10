/* ==========================================================
   Results page — SheStay Pan-India Accommodation Discovery
   Fetches from /api/properties/search across India,
   calculates distance to colleges & universities, and provides
   real-time radius, budget, type, and safety score filtering.
   ========================================================== */
const box = document.getElementById('results');
const countEl = document.getElementById('count');
const params = new URLSearchParams(location.search);

// 1. Parse Search Parameters
const college = (params.get('college') || '').trim();
const city = (params.get('city') || '').trim();
const institutionId = (params.get('institutionId') || '').trim();
const stateParam = (params.get('state') || '').trim();
const budgetParam = params.get('budget');
const typeParam = params.get('type');
const initialRadius = params.get('radius') || 'all';

// 2. Set Up Titles and Subtitles
let searchLocationLabel = '';
if (college && city) {
  searchLocationLabel = `${city} · near ${college.split(',')[0]}`;
} else if (college) {
  searchLocationLabel = `Near ${college.split(',')[0]}`;
} else if (city) {
  searchLocationLabel = city;
} else {
  searchLocationLabel = 'Pan-India Discovery';
}

let searchSubtitle = '';
if (budgetParam) {
  const parts = budgetParam.split('-');
  searchSubtitle += `₹${parseInt(parts[0], 10)/1000}k–${parseInt(parts[1], 10)/1000}k · `;
}
searchSubtitle += (typeParam ? typeParam : 'Hostel, PG, Flat') + ' · Edit';

const searchTitleEl = document.getElementById('search-title');
if (searchTitleEl) searchTitleEl.textContent = searchLocationLabel;
const subtitleEl = document.querySelector('.search-pill .tiny');
if (subtitleEl) subtitleEl.textContent = searchSubtitle;

const resultsTitleEl = document.getElementById('results-title');
if (resultsTitleEl) {
  if (college) {
    resultsTitleEl.textContent = `Places near ${college.split(',')[0]}`;
  } else if (city) {
    resultsTitleEl.textContent = `Places in ${city}`;
  } else {
    resultsTitleEl.textContent = 'Accommodations across India';
  }
}

// Set initial active radius chip if provided
if (initialRadius && initialRadius !== 'all') {
  const radiusBtn = document.querySelector(`[data-radius="${initialRadius}"]`);
  if (radiusBtn) {
    document.querySelectorAll('#radius-filters [data-radius]').forEach(b => b.setAttribute('aria-pressed', 'false'));
    radiusBtn.setAttribute('aria-pressed', 'true');
  }
}

let propertiesMasterList = [];
let targetInstitutionMeta = null;

function showLoading() {
  countEl.textContent = '';
  const placeName = college ? college.split(',')[0] : (city || 'your chosen location');
  const skel = `<div class="skeleton"><div class="ph"></div><div class="lines">
      <div class="line" style="width:70%;height:16px"></div><div class="line" style="width:50%"></div><div class="line" style="width:85%"></div></div></div>`;
  box.innerHTML = `
    <p role="status" class="h2" style="margin-bottom:6px">Finding safe places near ${esc(placeName)}…</p>
    <p class="small muted" style="margin:0 0 12px">Analyzing campus distance, pedestrian routes, and AI safety indicators.</p>
    <div class="progress" style="margin-bottom:16px"><div></div></div>
    <div class="cards">${skel}${skel}${skel}</div>`;
}

function showError() {
  countEl.textContent = '';
  box.innerHTML = `
    <div class="state-box">
      <div class="state-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FFA59C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 9.5-2.6M8.5 16a5 5 0 0 1 4-1.2M12 20h.01M3 3l18 18"/></svg></div>
      <h2 role="alert">We couldn’t load results</h2>
      <p class="muted" style="margin:0">Connection to backend server timed out. Your search criteria have been preserved.</p>
      <button type="button" class="btn btn-primary btn-block" id="retry">Try again</button>
    </div>`;
  document.getElementById('retry').onclick = () => load(false);
}

function showEmpty() {
  countEl.textContent = 'No matches';
  box.innerHTML = `
    <div class="state-box">
      <svg class="butterfly" viewBox="0 0 120 100" width="130" height="108" fill="none" stroke="#F2B6C3" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M60 48C46 20 18 6 9 20C1 34 28 52 60 50Z"/><path d="M60 48C74 20 102 6 111 20C119 34 92 52 60 50Z"/><path d="M60 53C42 58 20 70 27 85C34 97 54 80 60 56Z"/><path d="M60 53C78 58 100 70 93 85C86 97 66 80 60 56Z"/><path d="M60 40V70"/></svg>
      <h2>No places match all filters</h2>
      <p class="muted" style="margin:0">No accommodation fits all criteria in this radius. Try widening your distance radius or loosening filters.</p>
      <div class="row" style="margin-top:14px; width:100%">
        <button type="button" class="btn btn-primary btn-block" id="widen-radius">Widen radius to 15 km</button>
        <button type="button" class="btn btn-ghost btn-block" id="clear">Clear all filters</button>
      </div>
    </div>`;

  const widenBtn = document.getElementById('widen-radius');
  if (widenBtn) {
    widenBtn.onclick = () => {
      document.querySelectorAll('#radius-filters [data-radius]').forEach(b => b.setAttribute('aria-pressed', 'false'));
      const r15 = document.querySelector('[data-radius="15"]') || document.querySelector('[data-radius="all"]');
      if (r15) r15.setAttribute('aria-pressed', 'true');
      render();
    };
  }

  const clearBtn = document.getElementById('clear');
  if (clearBtn) {
    clearBtn.onclick = () => {
      document.querySelectorAll('#filters [data-toggle]').forEach(b => b.setAttribute('aria-pressed', 'false'));
      document.querySelectorAll('#radius-filters [data-radius]').forEach(b => b.setAttribute('aria-pressed', 'false'));
      const rAll = document.querySelector('[data-radius="all"]');
      if (rAll) rAll.setAttribute('aria-pressed', 'true');
      render();
    };
  }
}

function cardHTML(p) {
  const flags = (p.flags && p.flags.length)
    ? p.flags.slice(0, 2).map(f => `<p class="flag"><span style="color:var(--${f.level || 'warn'}-text)">${ICONS[f.level || 'warn'] || ICONS.warn}</span>${esc(f.text || f.title)}</p>`).join('')
    : `<p class="flag"><span style="color:var(--safe-text)">${ICONS.shield}</span>No major red flags · ${p.verifiedReviews || 0} verified reviews</p>`;

  const priceVal = p.monthlyRent || p.price || 0;
  const isOwnerListing = p.isOwnerSubmitted;
  const badgeLabel = isOwnerListing ? 'Owner Listing (Local)' : (p.isDemo ? 'Sample Data' : 'Demo data');
  const photoBg = (p.images && p.images[0]) 
    ? `<img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy">`
    : `<span style="display:flex;flex-direction:column;align-items:center;gap:6px">${ICONS.photo}Building photo</span>`;

  // Display distance relative to searched institution or city
  const instName = targetInstitutionMeta ? targetInstitutionMeta.shortName || targetInstitutionMeta.name : (college ? college.split(',')[0] : null);
  let distanceText = '';
  if (p.calculatedDistanceKm !== undefined && p.calculatedDistanceKm !== null) {
    distanceText = `${p.calculatedDistanceKm} km to ${instName || p.locality || p.city}`;
  } else if (p.distanceKm) {
    distanceText = `${p.distanceKm} km to ${instName || p.area || p.city}`;
  } else {
    distanceText = `${esc(p.locality || p.area || p.city)}`;
  }

  const commuteText = p.commute ? ` · ${esc(p.commute)}` : '';

  return `
    <a class="listing-card" href="listing.html?id=${encodeURIComponent(p.id)}">
      <div class="photo">
        ${photoBg}
        <span class="badge-demo" style="${isOwnerListing ? 'border-color:var(--pink); color:var(--pink)' : ''}">${badgeLabel}</span>
        ${scoreBadge(p.score || 50)}
      </div>
      <div class="body">
        <div class="row between" style="align-items:baseline;flex-wrap:nowrap">
          <h2>${esc(p.name)}</h2>
          <span class="price">₹${priceVal.toLocaleString('en-IN')}<span>/mo</span></span>
        </div>
        <p class="small muted" style="margin:0">${esc(p.type || 'Stay')} in ${esc(p.locality || p.area || p.city)}, ${esc(p.city)}</p>
        <p class="tiny" style="margin:2px 0 0; color:var(--pink); font-weight:600">${distanceText}${commuteText}</p>
        ${flags}
      </div>
    </a>`;
}

function render() {
  const on = key => {
    const el = document.querySelector(`[data-filter="${key}"]`);
    return el && el.getAttribute('aria-pressed') === 'true';
  };

  // Selected distance radius
  const activeRadiusEl = document.querySelector('#radius-filters [aria-pressed="true"]');
  const selectedRadius = activeRadiusEl ? activeRadiusEl.dataset.radius : 'all';

  // Budget range limits from query params if available
  let budgetMin = 0, budgetMax = 999999;
  if (budgetParam && budgetParam.includes('-')) {
    const [b1, b2] = budgetParam.split('-').map(Number);
    if (!isNaN(b1)) budgetMin = b1;
    if (!isNaN(b2)) budgetMax = b2;
  }

  // Allowed types from query param
  const allowedTypes = typeParam ? typeParam.split(',').map(t => t.trim().toLowerCase()) : [];

  let list = propertiesMasterList.filter(p => {
    const price = p.monthlyRent || p.price || 0;
    const pType = (p.type || '').toLowerCase();

    // Query param type filter (if not empty)
    if (allowedTypes.length > 0 && !allowedTypes.includes('all')) {
      const matchesType = allowedTypes.some(t => {
        if (t === 'flat' || t === 'room' || t === 'apartment') return pType === 'apartment' || pType === 'flat';
        return pType.includes(t);
      });
      if (!matchesType) return false;
    }

    // Distance Radius Filter
    if (selectedRadius && selectedRadius !== 'all') {
      const rNum = parseFloat(selectedRadius);
      const dist = p.calculatedDistanceKm !== undefined ? p.calculatedDistanceKm : (p.distanceKm || 0);
      if (dist > rNum) return false;
    }

    // Chip filters
    if (on('safe') && (p.score || 0) < 75) return false;
    if (on('meals') && !p.meals) return false;
    if (on('cheap') && price >= 9000) return false;
    if (on('tiffin') && !p.tiffinNearby) return false;

    return true;
  });

  const sort = document.getElementById('sort').value;
  const sorters = {
    score: (a, b) => (b.score || 0) - (a.score || 0),
    price: (a, b) => ((a.monthlyRent || a.price) - (b.monthlyRent || b.price)),
    distance: (a, b) => {
      const distA = a.calculatedDistanceKm !== undefined ? a.calculatedDistanceKm : (a.distanceKm || 999);
      const distB = b.calculatedDistanceKm !== undefined ? b.calculatedDistanceKm : (b.distanceKm || 999);
      return distA - distB;
    },
    reviews: (a, b) => ((b.verifiedReviews || 0) - (a.verifiedReviews || 0))
  };
  list.sort(sorters[sort] || sorters.score);

  if (!list.length) return showEmpty();
  countEl.textContent = `Showing ${list.length} of ${propertiesMasterList.length}`;
  box.innerHTML = `<div class="cards">${list.map(cardHTML).join('')}</div>`;
}

// Fetch properties from Express API across India
async function load(firstTime) {
  showLoading();
  const forced = firstTime ? params.get('state') : null;
  if (forced === 'loading') return;
  if (forced === 'error') return setTimeout(showError, 500);
  if (forced === 'empty') return setTimeout(showEmpty, 500);

  try {
    const apiQuery = new URLSearchParams();
    if (city) apiQuery.set('city', city);
    if (college) apiQuery.set('college', college);
    if (institutionId) apiQuery.set('institutionId', institutionId);
    if (stateParam) apiQuery.set('state', stateParam);
    if (typeParam) apiQuery.set('type', typeParam);

    let apiProperties = [];
    try {
      const response = await fetchFromApi(`/properties/search?${apiQuery.toString()}`);
      if (response && response.data) {
        apiProperties = response.data;
        if (response.targetInstitution) {
          targetInstitutionMeta = response.targetInstitution;
        }
      }
    } catch (e) {
      console.warn('Backend unavailable, using fallback dataset in data.js:', e.message);
      apiProperties = typeof LISTINGS !== 'undefined' ? LISTINGS : [];
    }

    // Owner-submitted properties from localStorage
    const localOwnerProps = getStoredOwnerProperties().map(p => ({
      ...p,
      isOwnerSubmitted: true
    }));

    // Filter local owner listings by city if searched
    let filteredOwnerProps = localOwnerProps;
    if (city && city.toLowerCase() !== 'all') {
      const cLow = city.toLowerCase();
      filteredOwnerProps = localOwnerProps.filter(p =>
        (p.city && p.city.toLowerCase().includes(cLow)) ||
        (p.address && p.address.toLowerCase().includes(cLow))
      );
    }

    propertiesMasterList = [...filteredOwnerProps, ...apiProperties];

    // If city or college specific query returned 0 from API, search all as fallback
    if (propertiesMasterList.length === 0 && apiProperties.length === 0) {
      try {
        const allRes = await fetchFromApi('/properties');
        if (allRes && allRes.data) {
          propertiesMasterList = [...localOwnerProps, ...allRes.data];
        }
      } catch (err) {}
    }

    render();
  } catch (err) {
    console.error('Failed to load listings:', err);
    showError();
  }
}

// Event Listeners for Filters
document.getElementById('filters').addEventListener('toggled', render);
document.getElementById('radius-filters').addEventListener('toggled', render);
document.getElementById('sort').addEventListener('change', render);

load(true);
