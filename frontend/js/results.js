/* ==========================================================
   Results page
   Try the states:  results.html?state=loading | empty | error
   ========================================================== */
const box = document.getElementById('results');
const countEl = document.getElementById('count');
const params = new URLSearchParams(location.search);

// Show what was searched
const college = (params.get('college') || 'BVCOE').split(',')[0];
const city = params.get('city') || 'New Delhi';
document.getElementById('search-title').textContent = `${city} · near ${college}`;
document.getElementById('results-title').textContent = `Places near ${college}`;

function showLoading() {
  countEl.textContent = '';
  const skel = `<div class="skeleton"><div class="ph"></div><div class="lines">
      <div class="line" style="width:70%;height:16px"></div><div class="line" style="width:50%"></div><div class="line" style="width:85%"></div></div></div>`;
  box.innerHTML = `
    <p role="status" class="h2" style="margin-bottom:6px">Checking places near ${esc(college)}…</p>
    <p class="small muted" style="margin:0 0 12px">Reading reviews and complaint records.</p>
    <div class="progress" style="margin-bottom:16px"><div></div></div>
    <div class="cards">${skel}${skel}${skel}</div>`;
}

function showError() {
  countEl.textContent = '';
  box.innerHTML = `
    <div class="state-box">
      <div class="state-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FFA59C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 9.5-2.6M8.5 16a5 5 0 0 1 4-1.2M12 20h.01M3 3l18 18"/></svg></div>
      <h2 role="alert">We couldn’t load results</h2>
      <p class="muted" style="margin:0">Looks like the connection dropped. Your search is saved — nothing is lost.</p>
      <button type="button" class="btn btn-primary btn-block" id="retry">Try again</button>
    </div>`;
  document.getElementById('retry').onclick = () => load(false);
}

function showEmpty() {
  countEl.textContent = 'No matches';
  box.innerHTML = `
    <div class="state-box">
      <svg class="butterfly" viewBox="0 0 120 100" width="130" height="108" fill="none" stroke="#F2B6C3" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M60 48C46 20 18 6 9 20C1 34 28 52 60 50Z"/><path d="M60 48C74 20 102 6 111 20C119 34 92 52 60 50Z"/><path d="M60 53C42 58 20 70 27 85C34 97 54 80 60 56Z"/><path d="M60 53C78 58 100 70 93 85C86 97 66 80 60 56Z"/><path d="M60 40V70"/></svg>
      <h2>No places match yet</h2>
      <p class="muted" style="margin:0">Nothing fits all your filters. Try loosening one.</p>
      <button type="button" class="btn btn-ghost btn-block" id="clear">Clear all filters</button>
    </div>`;
  document.getElementById('clear').onclick = () => {
    document.querySelectorAll('#filters [data-toggle]').forEach(b => b.setAttribute('aria-pressed', 'false'));
    render();
  };
}

function cardHTML(p) {
  const flags = p.flags.length
    ? p.flags.slice(0, 2).map(f => `<p class="flag"><span style="color:var(--${f.level}-text)">${ICONS[f.level]}</span>${esc(f.text)}</p>`).join('')
    : `<p class="flag"><span style="color:var(--safe-text)">${ICONS.shield}</span>No major red flags · ${p.verifiedReviews} verified reviews</p>`;
  return `
    <a class="listing-card" href="listing.html?id=${encodeURIComponent(p.id)}">
      <div class="photo">
        <span style="display:flex;flex-direction:column;align-items:center;gap:6px">${ICONS.photo}Building photo</span>
        <span class="badge-demo">Demo data</span>
        ${scoreBadge(p.score)}
      </div>
      <div class="body">
        <div class="row between" style="align-items:baseline;flex-wrap:nowrap">
          <h2>${esc(p.name)}</h2>
          <span class="price">₹${p.price.toLocaleString('en-IN')}<span>/mo</span></span>
        </div>
        <p class="small muted" style="margin:0">${esc(p.area)} · ${p.distanceKm} km to ${esc(college)} · ${esc(p.commute)}</p>
        ${flags}
      </div>
    </a>`;
}

function render() {
  const on = key => document.querySelector(`[data-filter="${key}"]`).getAttribute('aria-pressed') === 'true';
  let list = LISTINGS.filter(p =>
    (!on('near') || p.distanceKm <= 3) &&
    (!on('safe') || p.score >= 75) &&
    (!on('meals') || p.meals) &&
    (!on('cheap') || p.price < 9000) &&
    (!on('tiffin') || p.tiffinNearby)
  );
  const sort = document.getElementById('sort').value;
  const sorters = {
    score: (a, b) => b.score - a.score,
    price: (a, b) => a.price - b.price,
    distance: (a, b) => a.distanceKm - b.distanceKm,
    reviews: (a, b) => b.verifiedReviews - a.verifiedReviews
  };
  list.sort(sorters[sort]);

  if (!list.length) return showEmpty();
  countEl.textContent = `Showing ${list.length} of ${LISTINGS.length}`;
  box.innerHTML = `<div class="cards">${list.map(cardHTML).join('')}</div>`;
}

// Fake a network request. Later: replace with fetch('/api/listings?...')
function load(firstTime) {
  showLoading();
  const forced = firstTime ? params.get('state') : null;
  if (forced === 'loading') return;
  setTimeout(() => {
    if (forced === 'error') return showError();
    if (forced === 'empty') return showEmpty();
    render();
  }, 700);
}

document.getElementById('filters').addEventListener('toggled', render);
document.getElementById('sort').addEventListener('change', render);
load(true);
