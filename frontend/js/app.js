/* ==========================================================
   SheStay — small helpers shared by every page
   ========================================================== */

// Inline SVG icons (stroke style, use currentColor)
const ICONS = {
  check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>',
  warn:  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18h.01"/></svg>',
  risk:  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>',
  shield:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>',
  photo: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 8"/></svg>'
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
  el._t = setTimeout(() => (el.hidden = true), 2600);
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
