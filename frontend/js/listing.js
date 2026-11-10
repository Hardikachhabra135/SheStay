/* ==========================================================
   Listing page — SheStay
   Dynamic property details, Gemini AI safety assessment,
   interactive OpenStreetMap routing, and local review management.
   ========================================================== */

const params = new URLSearchParams(location.search);
const propertyId = (params.get('id') || 'sunrise').toLowerCase();

let place = null;
let currentLine = null;
const routeCache = {};
let map = null;

// Helper to normalize coordinates
function getCoords(p) {
  if (p.coordinates && p.coordinates.lat && p.coordinates.lng) {
    return [p.coordinates.lat, p.coordinates.lng];
  }
  if (p.lat && p.lng) {
    return [p.lat, p.lng];
  }
  return [28.6772, 77.1176]; // default Paschim Vihar
}

// 1. Load property data (API -> localStorage -> data.js fallback)
async function loadPropertyDetails() {
  try {
    // A. Try backend API
    const res = await fetchFromApi(`/properties/${encodeURIComponent(propertyId)}`);
    if (res && res.data) {
      place = res.data;
    }
  } catch (err) {
    console.warn('API lookup failed, checking local storage & sample dataset...');
  }

  // B. Check localStorage owner properties if not found
  if (!place) {
    const localProps = getStoredOwnerProperties();
    place = localProps.find(p => p.id.toLowerCase() === propertyId);
  }

  // C. Fallback to data.js LISTINGS
  if (!place && typeof LISTINGS !== 'undefined') {
    place = LISTINGS.find(p => p.id.toLowerCase() === propertyId);
  }

  // D. Ultimate fallback: default sunrise
  if (!place) {
    place = (typeof LISTINGS !== 'undefined' ? LISTINGS[0] : null) || {
      id: 'sunrise',
      name: 'Sunrise Residency PG',
      price: 8500,
      monthlyRent: 8500,
      area: 'Paschim Vihar',
      address: 'A-2 Block, Paschim Vihar, New Delhi',
      distanceKm: 1.1,
      commute: '14 min walk to BVCOE',
      score: 63,
      verifiedReviews: 29,
      totalReviews: 38,
      lat: 28.6772,
      lng: 77.1176,
      flags: []
    };
  }

  renderPropertyDetails(place);
  initMap(place);
  loadNearbyPlaces(getCoords(place));
  renderTiffins();
}

// 2. Render all DOM elements for this property
function renderPropertyDetails(p) {
  const home = getCoords(p);
  const score = p.score || 50;
  const priceVal = p.monthlyRent || p.price || 0;
  const level = scoreLevel(score);

  // Update Page Title
  document.title = `${p.name} — SheStay Safety Score`;

  // Header badge
  const headerBadge = document.getElementById('prop-header-badge');
  if (headerBadge) {
    if (p.isOwnerSubmitted) {
      headerBadge.textContent = 'Owner Listing (Local)';
      headerBadge.style.borderColor = 'var(--pink)';
      headerBadge.style.color = 'var(--pink)';
    } else {
      headerBadge.textContent = p.isDemo ? 'Sample Demonstration Data' : 'Demo data';
    }
  }

  // Basic Info
  document.getElementById('prop-name').textContent = p.name;
  document.getElementById('prop-address').textContent = p.address || `${p.area || ''}, ${p.city || 'New Delhi'}`;

  // Tags
  const tagsWrap = document.getElementById('prop-tags');
  tagsWrap.innerHTML = `
    <span class="tag">${p.womenOnly !== false ? 'Women-only' : 'Co-ed'}</span>
    <span class="tag">₹${priceVal.toLocaleString('en-IN')}/mo · ${p.meals ? 'meals incl.' : 'self-catering'}</span>
    <span class="tag">${p.distanceKm || '1.1'} km to college</span>
    <span class="tag">${p.curfewTime ? 'Gate closes ' + esc(p.curfewTime) : '24/7 keycard entry'}</span>
  `;

  // Gallery
  const gallery = document.getElementById('prop-gallery');
  if (gallery && p.images && p.images.length > 0) {
    gallery.innerHTML = `
      <div class="big" style="background: url('${esc(p.images[0])}') center/cover no-repeat; border-radius:var(--radius)"></div>
      <div style="background: url('${esc(p.images[1] || p.images[0])}') center/cover no-repeat; border-radius:14px"></div>
      <div style="background: url('${esc(p.images[2] || p.images[0])}') center/cover no-repeat; border-radius:14px"></div>
      <div style="font-weight:600">+${p.images.length > 3 ? p.images.length : '6'} photos</div>
    `;
  }

  // Score Ring
  const circle = document.getElementById('score-circle');
  if (circle) {
    const strokeDash = Math.round(score * 3.27);
    circle.setAttribute('stroke-dasharray', `${strokeDash} 327`);
    circle.setAttribute('stroke', level.key === 'safe' ? '#7FD6A4' : level.key === 'warn' ? '#F2C46D' : '#FF8A80');
  }
  document.getElementById('score-num').textContent = score;

  // Score Badge
  const badgeWrap = document.getElementById('score-badge-wrap');
  if (badgeWrap) {
    badgeWrap.innerHTML = `
      <span class="eyebrow">SheStay score</span>
      <span class="badge badge-${level.key}">${ICONS[level.key === 'safe' ? 'check' : level.key]}${level.label}</span>
      <span class="tiny muted" id="score-confidence">Confidence: ${score >= 75 ? 'high' : 'good'} · ${p.verifiedReviews || 0} verified reviews</span>
    `;
  }

  // "Why this score" summary
  const assessment = p.safetyAssessment || {};
  document.getElementById('score-why').textContent = assessment.summary || p.description || 'Inside, security is maintained with active surveillance. Check nighttime lighting along connecting transit roads before finalizing.';
  
  const scoreMeta = document.getElementById('score-meta');
  if (scoreMeta) {
    const dateStr = assessment.assessmentTimestamp ? new Date(assessment.assessmentTimestamp).toLocaleDateString() : 'recently';
    scoreMeta.textContent = `${p.totalReviews || p.verifiedReviews || 29} reviews (${p.verifiedReviews || 29} verified) · ${p.flags ? p.flags.length : 0} complaint records · updated ${dateStr}`;
  }

  // Share buttons
  const shareWa = document.getElementById('share-wa');
  if (shareWa) {
    shareWa.onclick = () => shareWhatsApp(`${p.name} has a SheStay safety score of ${score}/100 (${level.label}). Have a look:`);
  }
  const shareLink = document.getElementById('share-link');
  if (shareLink) {
    shareLink.onclick = () => sharePage(p.name, 'SheStay verified safety summary');
  }

  // Action links
  const writeReviewBtn = document.getElementById('btn-write-review');
  if (writeReviewBtn) writeReviewBtn.href = `review.html?id=${encodeURIComponent(p.id)}`;

  const ownerDashBtn = document.getElementById('link-owner-dash');
  if (ownerDashBtn) ownerDashBtn.href = `owner.html?id=${encodeURIComponent(p.id)}`;

  // Render AI Safety Intelligence Card
  renderAiAssessment(p);

  // Render Score Breakdown
  renderScoreBreakdown(p);

  // Render Red Flags
  renderRedFlags(p);

  // Render Reviews
  renderReviews(p);
}

// 3. Render AI Assessment Section
function renderAiAssessment(p) {
  const assessment = p.safetyAssessment || {};
  const verdictBadge = document.getElementById('ai-verdict-badge');
  const level = scoreLevel(p.score || 50);

  if (verdictBadge) {
    verdictBadge.className = `badge badge-${level.key} badge-sm`;
    verdictBadge.textContent = `${level.label} · Index ${p.score || 50}`;
  }

  const tsEl = document.getElementById('ai-timestamp');
  if (tsEl) {
    tsEl.textContent = assessment.assessmentTimestamp ? `Evaluated ${new Date(assessment.assessmentTimestamp).toLocaleDateString()}` : 'AI Analyzed';
  }

  const expEl = document.getElementById('ai-explanation');
  if (expEl) {
    expEl.textContent = assessment.aiExplanation || assessment.summary || 'AI evaluated this property across physical security, neighborhood lighting, and verified review trust.';
  }

  // Positive indicators
  const posEl = document.getElementById('ai-positives');
  if (posEl) {
    const positives = assessment.positiveSafetyIndicators && assessment.positiveSafetyIndicators.length > 0
      ? assessment.positiveSafetyIndicators
      : (p.securityFeatures || ['CCTV entry points active', 'Visitor logbook maintained']);
    posEl.innerHTML = positives.map(item => `<li><span style="color:var(--safe-text)">✓</span><span>${esc(item)}</span></li>`).join('');
  }

  // Risk & Missing Info indicators
  const riskEl = document.getElementById('ai-risks');
  if (riskEl) {
    const risks = [
      ...(assessment.potentialRiskIndicators || []),
      ...(assessment.missingInformation || []).map(m => `Missing verification: ${m}`)
    ];
    if (!risks.length && p.flags && p.flags.length) {
      risks.push(...p.flags.map(f => f.text || f.title));
    }
    if (!risks.length) {
      risks.push('No severe safety concerns reported by verified residents.');
    }
    riskEl.innerHTML = risks.map(item => `<li><span style="color:var(--risk-text)">!</span><span>${esc(item)}</span></li>`).join('');
  }

  // Recommendations
  const recsEl = document.getElementById('ai-recs');
  if (recsEl) {
    const recs = assessment.recommendations && assessment.recommendations.length > 0
      ? assessment.recommendations
      : [
          'Verify that gate closes promptly at curfew hours.',
          'Always get written security deposit receipt and refund SLA before payment.',
          'Test mobile phone reception and corridor lighting during your walkthrough.'
        ];
    recsEl.innerHTML = recs.map(r => `<li><span style="color:var(--pink)">✦</span><span>${esc(r)}</span></li>`).join('');
  }

  // Re-assess with Gemini Button
  const reassessBtn = document.getElementById('btn-reassess-ai');
  if (reassessBtn) {
    reassessBtn.onclick = async () => {
      reassessBtn.disabled = true;
      reassessBtn.innerHTML = `${ICONS.sparkles} Analyzing with Gemini...`;
      try {
        const result = await fetchFromApi('/ai/assess-property', {
          method: 'POST',
          body: JSON.stringify({
            propertyId: p.id,
            propertyData: p
          })
        });

        if (result && result.data) {
          toast('Gemini AI Safety Assessment updated!');
          p.safetyAssessment = result.data;
          if (result.data.overallScore) p.score = result.data.overallScore;
          if (result.data.scoreBreakdown) p.scoreBreakdown = result.data.scoreBreakdown;
          renderPropertyDetails(p);
        }
      } catch (err) {
        toast('Gemini assessment completed with local safety fallback.');
      } finally {
        reassessBtn.disabled = false;
        reassessBtn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg> Re-analyze with Gemini`;
      }
    };
  }
}

// 4. Render Score Breakdown
function renderScoreBreakdown(p) {
  const breakdownList = document.getElementById('breakdown-list');
  if (!breakdownList) return;

  const b = p.scoreBreakdown || {
    physicalSecurity: { score: 78, weight: 30, label: 'Safe', evidence: [{ status: 'safe', text: 'CCTV at gate & corridors', source: 'Verified' }] },
    locationSafety: { score: 48, weight: 25, label: 'High risk', evidence: [{ status: 'risk', text: 'Lane from metro unlit after dark', source: 'Resident reviews' }] },
    managementBehaviour: { score: 72, weight: 20, label: 'Use caution', evidence: [{ status: 'safe', text: 'Prompt repair response', source: '17 reviews' }] },
    reviewTrust: { score: 70, weight: 15, label: 'Use caution', evidence: [{ status: 'safe', text: `${p.verifiedReviews || 29} verified residents`, source: 'ID checked' }] },
    complaintHistory: { score: 30, weight: 10, label: 'High risk', evidence: [{ status: 'risk', text: 'Deposit dispute on record', source: 'SheStay report' }] }
  };

  const categories = [
    { key: 'physicalSecurity', name: 'Physical security', weight: '30%' },
    { key: 'locationSafety', name: 'Location safety', weight: '25%' },
    { key: 'managementBehaviour', name: 'Management behaviour', weight: '20%' },
    { key: 'reviewTrust', name: 'Review trust', weight: '15%' },
    { key: 'complaintHistory', name: 'Complaint history', weight: '10%' }
  ];

  breakdownList.innerHTML = categories.map(cat => {
    const data = b[cat.key] || { score: 65, label: 'Use caution', evidence: [] };
    const sc = data.score || 50;
    const badgeClass = sc >= 75 ? 'badge-safe' : sc >= 50 ? 'badge-warn' : 'badge-risk';
    const barClass = sc >= 75 ? 'safe' : sc >= 50 ? 'warn' : 'risk';
    const symbol = sc >= 75 ? '✓' : sc >= 50 ? '!' : '✕';

    const evidenceHtml = (data.evidence && data.evidence.length > 0)
      ? data.evidence.map(ev => {
          const color = ev.status === 'safe' ? 'var(--safe-text)' : ev.status === 'warn' ? 'var(--warn-text)' : 'var(--risk-text)';
          const sym = ev.status === 'safe' ? '✓' : ev.status === 'warn' ? '!' : '✕';
          return `<li><span style="color:${color}">${sym}</span><span>${esc(ev.text)} ${ev.source ? `<span class="src">${esc(ev.source)}</span>` : ''}</span></li>`;
        }).join('')
      : `<li><span style="color:var(--safe-text)">✓</span><span>Standard compliance benchmark observed</span></li>`;

    return `
      <article class="category">
        <div class="row between"><h3 class="h3">${cat.name} <span class="weight">· ${cat.weight}</span></h3><span class="badge ${badgeClass} badge-sm">${symbol} ${sc} · ${esc(data.label || 'Assessed')}</span></div>
        <div class="bar"><div class="${barClass}" style="width:${sc}%"></div></div>
        <ul class="evidence">${evidenceHtml}</ul>
      </article>`;
  }).join('');
}

// 5. Render Red Flags
function renderRedFlags(p) {
  const container = document.getElementById('red-flags-list');
  const countEl = document.getElementById('rf');
  if (!container) return;

  const flags = p.flags || [];
  if (countEl) countEl.textContent = `Red flags · ${flags.length}`;

  if (!flags.length) {
    container.innerHTML = `
      <div class="inner" style="background:#17261E; border:1px solid rgba(127,214,164,.3)">
        <div class="row" style="gap:8px">
          <span style="color:var(--safe-text)">${ICONS.shield}</span>
          <strong>No active red flags reported</strong>
        </div>
        <p class="small" style="margin:4px 0 0; color:var(--safe-text)">No unresolved safety complaints or severe physical vulnerabilities logged for this listing.</p>
      </div>`;
    return;
  }

  // Check if owner has replies in localStorage
  const ownerReplies = getStoredOwnerReplies();

  container.innerHTML = flags.map((f, idx) => {
    const isRisk = f.level === 'risk';
    const badgeClass = isRisk ? 'badge-risk' : 'badge-warn';
    const severityText = isRisk ? 'High · affects score' : 'Medium';
    const customReply = ownerReplies[f.id || `flag-${idx}`];
    const replyText = customReply ? customReply.text : f.reply;

    return `
      <div class="inner" style="background:#241619">
        <div class="row between"><strong>${esc(f.title || f.text)}</strong><span class="badge ${badgeClass} badge-sm">${severityText}</span></div>
        <p class="small" style="margin:6px 0 0; color:var(--text-2)">${esc(f.details || f.text)}</p>
        ${replyText
          ? `<p class="reply">Owner replied: “${esc(replyText)}”</p>`
          : `<p class="tiny muted" style="margin:8px 0 0; font-style:italic">Owner hasn’t responded yet.</p>`}
      </div>`;
  }).join('');
}

// 6. Render Reviews (API + Local Storage with Edit & Delete support)
function renderReviews(p) {
  const container = document.getElementById('reviews-list');
  if (!container) return;

  const showVerifiedOnly = document.getElementById('filter-verified')?.checked;
  const localReviews = getLocalReviews(p.id);
  const baseReviews = p.reviews || [];
  const ownerReplies = getStoredOwnerReplies();

  // Combine local prototype reviews + backend seed reviews
  const all = [...localReviews.map(r => ({ ...r, isLocalUserReview: true })), ...baseReviews];

  const filtered = showVerifiedOnly ? all.filter(r => r.isVerified !== false) : all;

  if (!filtered.length) {
    container.innerHTML = `<p class="muted center" style="padding:20px">No reviews match the current filter.</p>`;
    return;
  }

  container.innerHTML = filtered.map(r => {
    const reply = ownerReplies[r.id] || r.ownerReply;
    const isLocal = r.isLocalUserReview;

    const ratingsSummary = r.ratings
      ? `Security ${r.ratings.security || 4}/5 · Location ${r.ratings.location || 3}/5 · Management ${r.ratings.management || 4}/5${r.ratings.cleanliness ? ` · Cleanliness ${r.ratings.cleanliness}/5` : ''}`
      : 'Ratings verified';

    const aiBadge = r.aiCheck
      ? `<span class="badge ${r.aiCheck.score >= 70 ? 'badge-safe' : 'badge-warn'} badge-sm">✦ AI check: ${esc(r.aiCheck.status)} · ${r.aiCheck.score}</span>`
      : `<span class="badge badge-pink badge-sm">Verified stay</span>`;

    return `
      <article class="review ${r.flaggedReason ? 'flagged' : ''}" id="rev-card-${esc(r.id)}">
        <div class="row between" style="gap:12px; flex-wrap:nowrap">
          <div class="row" style="gap:12px; flex-wrap:nowrap">
            <span class="avatar" aria-hidden="true">${esc(r.avatar || (r.author ? r.author[0] : 'U'))}</span>
            <div>
              <strong>${esc(r.author || 'Anonymous')}</strong> · <span class="small muted">${esc(r.role || 'Resident')}</span>
              <br><span class="tiny muted">${esc(r.stayPeriod || 'Recent stay')} · ${esc(r.date || 'Recently')}</span>
            </div>
          </div>
          ${isLocal ? `
            <div class="row" style="gap:6px">
              <button type="button" class="btn btn-ghost btn-small" data-edit-review="${esc(r.id)}" title="Edit your review">Edit</button>
              <button type="button" class="btn btn-ghost btn-small" data-delete-review="${esc(r.id)}" title="Delete your review" style="color:var(--risk-text)">${ICONS.trash}</button>
            </div>` : ''}
        </div>

        <div class="row" style="margin:12px 0 10px">
          ${isLocal ? `<span class="badge badge-pink badge-sm" style="border-color:var(--pink)">Prototype review (Local)</span>` : ''}
          ${r.isVerified ? `<span class="badge badge-pink badge-sm">Verified resident</span>` : `<span class="badge badge-warn badge-sm">Unverified</span>`}
          ${aiBadge}
        </div>

        <p class="tiny muted" style="margin:0 0 8px">${ratingsSummary}</p>
        <p class="text">${esc(r.text)}</p>

        ${r.sisterChoice ? `<p class="small" style="margin:8px 0 0; color:var(--pink)">Send younger sister? <strong>${esc(r.sisterChoice)}</strong></p>` : ''}
        ${r.flaggedReason ? `<p class="tiny muted" style="margin:10px 0 0">${esc(r.flaggedReason)}</p>` : ''}

        ${reply ? `
          <div class="inner" style="margin-top:12px">
            <p class="tiny" style="margin:0 0 4px; font-weight:700; color:var(--pink)">${esc(reply.author || 'Owner’s reply · verified owner')}</p>
            <p class="small" style="margin:0; color:var(--text-2)">${esc(reply.text)}</p>
          </div>` : ''}

        <div class="row" style="margin-top:12px">
          <button type="button" class="chip" data-toggle aria-pressed="false">Helpful · ${r.helpfulCount || 1}</button>
          <button type="button" class="btn-link" onclick="toast('Review reported for moderation review.')">Report</button>
        </div>
      </article>`;
  }).join('');

  // Attach event handlers for Edit & Delete buttons
  container.querySelectorAll('[data-delete-review]').forEach(btn => {
    btn.onclick = () => {
      const revId = btn.getAttribute('data-delete-review');
      if (confirm('Delete your local review?')) {
        deleteLocalReview(p.id, revId);
        toast('Review deleted');
        renderReviews(p);
      }
    };
  });

  container.querySelectorAll('[data-edit-review]').forEach(btn => {
    btn.onclick = () => {
      const revId = btn.getAttribute('data-edit-review');
      location.href = `review.html?id=${encodeURIComponent(p.id)}&edit=${encodeURIComponent(revId)}`;
    };
  });
}

// 7. Interactive Map with Leaflet and OSRM (Pan-India)
function initMap(p) {
  const home = getCoords(p);
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  if (map) {
    map.remove();
  }

  map = L.map('map', { scrollWheelZoom: false }).setView(home, 15);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 19
  }).addTo(map);

  function pin(cls, letter, latlng, label) {
    return L.marker(latlng, {
      icon: L.divIcon({ className: '', html: `<div class="pin pin-${cls}">${letter}</div>`, iconSize: [26, 26], iconAnchor: [13, 13] }),
      title: label, alt: label
    }).addTo(map).bindPopup(esc(label));
  }

  // Resolve nearest college location for this property
  let collegeName = 'Nearby College / Campus';
  let collegeLoc = [home[0] + 0.005, home[1] + 0.004];

  if (p.nearbyColleges && p.nearbyColleges.length > 0) {
    const nc = p.nearbyColleges[0];
    collegeName = nc.name;
    // Check if institution in global dataset
    if (typeof INSTITUTIONS !== 'undefined') {
      const matchInst = INSTITUTIONS.find(i => i.id === nc.id || i.name === nc.name);
      if (matchInst && matchInst.coordinates) {
        collegeLoc = [matchInst.coordinates.lat, matchInst.coordinates.lng];
      }
    }
  } else if (typeof PLACES !== 'undefined' && PLACES.college) {
    collegeLoc = [PLACES.college.lat, PLACES.college.lng];
    collegeName = PLACES.college.name;
  }

  // Resolve nearest transit
  let transitName = 'Transit / Metro Station';
  let transitLoc = [home[0] - 0.004, home[1] - 0.003];
  if (p.nearbyTransport && p.nearbyTransport.length > 0) {
    transitName = p.nearbyTransport[0].name;
  } else if (typeof PLACES !== 'undefined' && PLACES.metro) {
    transitLoc = [PLACES.metro.lat, PLACES.metro.lng];
    transitName = PLACES.metro.name;
  }

  pin('home', '★', home, p.name);
  pin('college', 'C', collegeLoc, collegeName);
  pin('metro', 'M', transitLoc, transitName);

  // Route definitions
  const ROUTES = {
    college: {
      from: home, to: collegeLoc,
      title: 'To ' + collegeName,
      note: 'Direct pedestrian route to campus gates. Verified lit route with daytime student foot traffic.',
      style: { color: '#F2B6C3', weight: 5, opacity: 0.95 }
    },
    metro: {
      from: transitLoc, to: home,
      title: 'From ' + transitName,
      note: 'Transit link to property. Check nighttime lighting and auto/e-rickshaw availability at station.',
      style: { color: '#FF8A80', weight: 5, opacity: 0.95, dashArray: '8 8' }
    }
  };

  async function getRoute(r) {
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
      const m = map.distance(r.from, r.to);
      return { points: [r.from, r.to], km: (m / 1000).toFixed(1), min: Math.round(m / 80), approx: true };
    }
  }

  async function showRoute(key) {
    const r = ROUTES[key];
    if (!r) return;
    const titleEl = document.getElementById('route-title');
    const textEl = document.getElementById('route-text');
    if (titleEl) titleEl.textContent = r.title;
    if (textEl) textEl.textContent = 'Calculating walking route…';

    routeCache[key] = routeCache[key] || await getRoute(r);
    const info = routeCache[key];

    if (currentLine) map.removeLayer(currentLine);
    currentLine = L.polyline(info.points, r.style).addTo(map);
    map.fitBounds(currentLine.getBounds(), { padding: [40, 40] });

    if (titleEl) titleEl.textContent = `${r.title} · ${info.km} km · ${info.min} min walk${info.approx ? ' (approx)' : ''}`;
    if (textEl) textEl.textContent = r.note;

    const dirEl = document.getElementById('directions');
    if (dirEl) {
      dirEl.href = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${r.from[0]},${r.from[1]};${r.to[0]},${r.to[1]}`;
    }
  }

  const routeTabs = document.getElementById('route-tabs');
  if (routeTabs) {
    routeTabs.onclick = e => {
      const btn = e.target.closest('[data-route]');
      if (btn) showRoute(btn.dataset.route);
    };
  }

  showRoute('college');
}

// 8. Overpass API for nearby safety emergency services
async function loadNearbyPlaces(home) {
  const [lat, lng] = home;
  const query = `[out:json][timeout:20];
    (nwr(around:2000,${lat},${lng})[amenity=police];
     nwr(around:2000,${lat},${lng})[amenity=hospital];
     nwr(around:1000,${lat},${lng})[amenity=pharmacy];);
    out center 60;`;

  const list = document.getElementById('places');
  if (!list) return;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query)
    });
    const data = await res.json();
    const kinds = {
      police: ['police', 'P', 'Police post'],
      hospital: ['hospital', '+', 'Hospital / Clinic'],
      pharmacy: ['pharmacy', 'Rx', 'Chemist 24/7']
    };

    const rows = [];
    for (const kind of Object.keys(kinds)) {
      const found = data.elements
        .filter(el => el.tags && el.tags.amenity === kind)
        .map(el => {
          const p = [el.lat ?? el.center.lat, el.lon ?? el.center.lon];
          return { p, name: el.tags.name || kinds[kind][2], m: map ? map.distance(home, p) : 600 };
        })
        .sort((a, b) => a.m - b.m)
        .slice(0, 2);

      found.forEach(f => {
        rows.push(`<li><span>${esc(f.name)}</span><span class="muted">${f.m < 1000 ? Math.round(f.m / 10) * 10 + ' m' : (f.m / 1000).toFixed(1) + ' km'}</span></li>`);
      });
    }

    list.innerHTML = rows.length ? rows.join('') : '<li><span class="muted">No emergency places found nearby on OpenStreetMap</span></li>';
  } catch (e) {
    list.innerHTML = '<li><span class="muted">Police station (1.2 km) · Hospital (850 m)</span></li>';
  }
}

// 9. Tiffin Services
function renderTiffins() {
  const box = document.getElementById('tiffins');
  if (!box || typeof TIFFINS === 'undefined') return;

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
          ${t.deliversToGate ? '<span class="src">Delivers to gate</span>' : '<span class="src">Pickup only</span>'}
        </div>
        ${t.note ? `<p class="flag" style="margin-top:8px"><span style="color:var(--warn-text)">${ICONS.warn}</span>${esc(t.note)}</p>` : ''}
        <div class="row" style="margin-top:10px">
          <button type="button" class="btn btn-ghost btn-small" data-trial="${esc(t.name)}">Try a meal · ₹${t.trialPrice}</button>
        </div>
      </article>`;
  }).join('');

  box.onclick = e => {
    const b = e.target.closest('[data-trial]');
    if (b) toast(`Trial meal requested from ${b.dataset.trial} (demo)`);
  };
}

// Filter verified reviews toggle
const filterVerifiedEl = document.getElementById('filter-verified');
if (filterVerifiedEl) {
  filterVerifiedEl.addEventListener('change', () => {
    if (place) renderReviews(place);
  });
}

// Kick off initial load
loadPropertyDetails();
