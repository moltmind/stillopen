// StillOpen Founders Offer Popup — exit-intent, shop-aware, opens Paul sales chat
// Inlined into every demo page. One-popup-per-session, respects dismissal.
(function() {
  'use strict';
  if (sessionStorage.getItem('so-founders-popup-seen')) return;

  // Shop identity from the page itself (title tag + URL slug)
  var titleText = (document.title || '').split('|')[0].trim();
  var shopFirstWord = (titleText.split(/\s+/)[0] || 'there').replace(/[^A-Za-z0-9'&]/g, '');
  var pathParts = (window.location.pathname || '').split('/').filter(Boolean);
  var shopSlug = pathParts[pathParts.length - 1] || '';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  // Inject styles
  var style = document.createElement('style');
  style.textContent =
    '#so-fp { position: fixed; inset: 0; z-index: 10000; display: none; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }' +
    '#so-fp.visible { display: flex; align-items: center; justify-content: center; }' +
    '#so-fp .so-fp-bg { position: absolute; inset: 0; background: rgba(0,0,0,0.66); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); animation: so-fp-fadein 0.2s ease; }' +
    '#so-fp .so-fp-card { position: relative; background: #f7f5f0; color: #1a1a1a; max-width: 480px; width: calc(100% - 40px); padding: 36px 32px 28px; border-radius: 14px; box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 0 2px #f97316; animation: so-fp-pop 0.28s cubic-bezier(0.34,1.4,0.64,1); }' +
    '#so-fp .so-fp-close { position: absolute; top: 10px; right: 14px; background: transparent; border: none; font-size: 30px; line-height: 1; color: #5a5a5a; cursor: pointer; padding: 4px 10px; }' +
    '#so-fp .so-fp-close:hover { color: #1a1a1a; }' +
    '#so-fp .so-fp-eyebrow { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #f97316; margin-bottom: 12px; }' +
    '#so-fp .so-fp-title { font-size: clamp(20px, 4.5vw, 26px); font-weight: 800; letter-spacing: -0.5px; line-height: 1.2; margin-bottom: 14px; color: #1a1a1a; }' +
    '#so-fp .so-fp-body { font-size: 15px; line-height: 1.55; color: #3a3a3a; margin-bottom: 22px; }' +
    '#so-fp .so-fp-body strong { color: #1a1a1a; background: rgba(249,115,22,0.16); padding: 2px 6px; border-radius: 4px; font-weight: 700; }' +
    '#so-fp .so-fp-cta-row { display: flex; gap: 10px; flex-wrap: wrap; }' +
    '#so-fp .so-fp-cta-primary { flex: 1 1 200px; background: #f97316; color: #fff; border: none; padding: 14px 20px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; text-decoration: none; text-align: center; display: inline-block; transition: background 0.15s; }' +
    '#so-fp .so-fp-cta-primary:hover { background: #ea580c; }' +
    '#so-fp .so-fp-cta-secondary { background: transparent; color: #5a5a5a; border: 1px solid #d9d4c7; padding: 14px 20px; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; transition: border-color 0.15s, color 0.15s; }' +
    '#so-fp .so-fp-cta-secondary:hover { border-color: #1a1a1a; color: #1a1a1a; }' +
    '@keyframes so-fp-fadein { from { opacity: 0; } to { opacity: 1; } }' +
    '@keyframes so-fp-pop { from { opacity: 0; transform: scale(0.92) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }' +
    '@media (max-width: 480px) { #so-fp .so-fp-card { padding: 28px 20px 22px; } #so-fp .so-fp-cta-row { flex-direction: column; } #so-fp .so-fp-cta-primary, #so-fp .so-fp-cta-secondary { width: 100%; flex: 1; } }';
  document.head.appendChild(style);

  // Build DOM
  var popup = document.createElement('div');
  popup.id = 'so-fp';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-modal', 'true');
  popup.setAttribute('aria-labelledby', 'so-fp-title');
  popup.setAttribute('aria-hidden', 'true');
  popup.innerHTML =
    '<div class="so-fp-bg"></div>' +
    '<div class="so-fp-card">' +
      '<button class="so-fp-close" aria-label="Close">&times;</button>' +
      '<div class="so-fp-eyebrow">Founders offer</div>' +
      '<h2 class="so-fp-title" id="so-fp-title">Hey ' + escapeHtml(shopFirstWord) + ' team, before you close this.</h2>' +
      '<p class="so-fp-body">I am looking for the first 100 plumbing shops to lock this in. <strong>$47/mo, locked for life.</strong> No contract, cancel anytime. After 100 shops claim a spot, the price goes up and never comes back down.</p>' +
      '<div class="so-fp-cta-row">' +
        '<a class="so-fp-cta-primary" href="https://stillopen.ai/?lead=founder&shop=' + encodeURIComponent(shopSlug) + '">Lock my $47 spot &rarr;</a>' +
        '<button class="so-fp-cta-secondary" type="button">Maybe later</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(popup);

  function showPopup() {
    if (sessionStorage.getItem('so-founders-popup-seen')) return;
    popup.classList.add('visible');
    popup.setAttribute('aria-hidden', 'false');
    sessionStorage.setItem('so-founders-popup-seen', '1');
  }

  function hidePopup() {
    popup.classList.remove('visible');
    popup.setAttribute('aria-hidden', 'true');
  }

  popup.querySelector('.so-fp-close').addEventListener('click', hidePopup);
  popup.querySelector('.so-fp-cta-secondary').addEventListener('click', hidePopup);
  popup.querySelector('.so-fp-bg').addEventListener('click', hidePopup);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') hidePopup(); });

  var fired = false;

  // Desktop: mouse leaves top of viewport (toward close button or URL bar)
  document.addEventListener('mouseleave', function(e) {
    if (fired) return;
    if (e.clientY < 10) {
      fired = true;
      showPopup();
    }
  });

  // Mobile: user scrolls down then scrolls back up significantly (signal of losing interest)
  var maxScroll = 0;
  var scrollCheckTimer = null;
  window.addEventListener('scroll', function() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (y > maxScroll) maxScroll = y;
    if (fired) return;
    // Must have scrolled at least 600px, then come back up 250px
    if (maxScroll > 600 && y < maxScroll - 250) {
      if (scrollCheckTimer) clearTimeout(scrollCheckTimer);
      scrollCheckTimer = setTimeout(function() {
        if (!fired) { fired = true; showPopup(); }
      }, 700);
    }
  }, { passive: true });
})();
