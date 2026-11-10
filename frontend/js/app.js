/* ==========================================================
   SheStay — small helpers shared by every page
   ========================================================== */

// Backend API configuration (Render backend URL or local port)
const API_BASE = window.SHESTAY_API_BASE || (window.location.protocol.startsWith('http') && window.location.port === '5000' ? '/api' : 'http://localhost:5000/api');

// Inline SVG icons (stroke style, use currentColor)
const ICONS = {
  check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>',
  warn:  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18h.01"/></svg>',
  risk:  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>',
  shield:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>',
  photo: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 8"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
};

// Score → level. Thresholds: 75+ safe, 50–74 caution, below 50 high risk.
function scoreLevel(score) {
  if (score >= 75) return { key: 'safe', label: 'Safe' };
  if (score >= 50) return { key: 'warn', label: 'Use caution' };
  return { key: 'risk', label: 'High risk' };
}

// Badge HTML: colour + icon + number + word (never colour alone)
function scoreBadge(score) {
  const l = scoreLevel(score);
  return `<span class="badge badge-${l.key}">${ICONS[l.key === 'safe' ? 'check' : l.key]}${score} · ${l.label}</span>`;
}

// Escape text before putting it in HTML (important once data comes from users)
function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Small pop-up message at the bottom of the screen
function toast(message) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.hidden = false;
  clearTimeout(el._t);
  el._t = setTimeout(() => (el.hidden = true), 2800);
}

// Toggle buttons. Add data-toggle to a button.
// Inside a container with data-single, only one button can be selected.
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-toggle]');
  if (!btn) return;
  const group = btn.closest('[data-single]');
  if (group) {
    group.querySelectorAll('[data-toggle]').forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
  } else {
    btn.setAttribute('aria-pressed', btn.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  }
  btn.dispatchEvent(new CustomEvent('toggled', { bubbles: true }));
});

// Share a page: uses the phone's share sheet when available, else copies the link
async function sharePage(title, text) {
  const url = location.href;
  if (navigator.share) {
    try { await navigator.share({ title, text, url }); } catch (e) { /* user closed it */ }
  } else {
    try { await navigator.clipboard.writeText(url); toast('Link copied — paste it to your family'); }
    catch (e) { toast('Copy this link: ' + url); }
  }
}
function shareWhatsApp(text) {
  window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + location.href), '_blank', 'noopener');
}

/* ==========================================================
   LocalStorage Persistence Helpers for Prototype
   ========================================================== */

// Owner-submitted listings in localStorage
function getStoredOwnerProperties() {
  try {
    const raw = localStorage.getItem('shestay_owner_properties');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredOwnerProperty(property) {
  try {
    const list = getStoredOwnerProperties();
    const existingIdx = list.findIndex(p => p.id === property.id);
    if (existingIdx >= 0) {
      list[existingIdx] = property;
    } else {
      list.unshift(property);
    }
    localStorage.setItem('shestay_owner_properties', JSON.stringify(list));
    return true;
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
    return false;
  }
}

// User-submitted prototype reviews in localStorage
function getLocalReviews(propertyId) {
  try {
    const raw = localStorage.getItem('shestay_reviews_' + propertyId);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalReview(propertyId, review) {
  try {
    const list = getLocalReviews(propertyId);
    const existingIdx = list.findIndex(r => r.id === review.id);
    if (existingIdx >= 0) {
      list[existingIdx] = review;
    } else {
      list.unshift(review);
    }
    localStorage.setItem('shestay_reviews_' + propertyId, JSON.stringify(list));
    return true;
  } catch (e) {
    console.error('Failed to save review:', e);
    return false;
  }
}

function deleteLocalReview(propertyId, reviewId) {
  try {
    let list = getLocalReviews(propertyId);
    list = list.filter(r => r.id !== reviewId);
    localStorage.setItem('shestay_reviews_' + propertyId, JSON.stringify(list));
    return true;
  } catch (e) {
    console.error('Failed to delete review:', e);
    return false;
  }
}

// Owner replies stored locally
function getStoredOwnerReplies() {
  try {
    const raw = localStorage.getItem('shestay_owner_replies');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveStoredOwnerReply(reviewId, replyText) {
  try {
    const replies = getStoredOwnerReplies();
    replies[reviewId] = {
      author: 'Owner’s reply · verified owner',
      date: 'Just now',
      text: replyText
    };
    localStorage.setItem('shestay_owner_replies', JSON.stringify(replies));
    return true;
  } catch (e) {
    console.error('Failed to save owner reply:', e);
    return false;
  }
}

/* ==========================================================
   Robust API Client with Fallback
   ========================================================== */
async function fetchFromApi(endpoint, options = {}, timeoutMs = 4500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(id);
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    console.warn(`[API] Call to ${endpoint} failed or timed out (${err.message}). Using local client state.`);
    throw err;
  }
}
