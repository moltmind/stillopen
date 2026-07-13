/* demo-tour.js: StillOpen interactive sales layer for private clone demos.
 * Rides on a cloned prospect homepage next to the chat widget. Reads
 * data-business and data-question off its own <script> tag, then shows a small
 * charcoal card bottom-left that lets the owner try the live bot, see what a
 * closed night looks like, and read the price. Vanilla JS, no dependencies.
 * Built 2026-07-12. Loaded ONLY on private clone demos, never on stillopen.ai. */
(function () {
  "use strict";
  var me = document.currentScript;
  if (!me) {
    var all = document.getElementsByTagName("script");
    for (var i = all.length - 1; i >= 0; i--) {
      if (all[i].src && all[i].src.indexOf("demo-tour.js") !== -1) { me = all[i]; break; }
    }
  }
  var BUSINESS = (me && me.getAttribute("data-business")) || "your business";
  var QUESTION = (me && me.getAttribute("data-question")) || "Are you open right now?";
  var KEY = "so-tour-dismissed";
  try { if (localStorage.getItem(KEY) === "1") return; } catch (e) {}

  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  // ── Icons (Lucide-style, stroke-width 2) ─────────────────────────────────
  function svg(paths) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }
  var IC = {
    moon: svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
    inbox: svg('<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.5z"/>'),
    coffee: svg('<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>'),
    x: svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
    chat: svg('<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 20l1-4.1A8.4 8.4 0 1 1 21 11.5z"/>'),
    clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    tag: svg('<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-6.2-6.2A2 2 0 0 1 4 12.9V6a2 2 0 0 1 2-2h6.9a2 2 0 0 1 1.4.6l6.3 6.2a2 2 0 0 1 0 2.6z"/><circle cx="8.5" cy="8.5" r="1"/>')
  };

  var esc = function (s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; };

  // ── Styles ───────────────────────────────────────────────────────────────
  var css = document.createElement("style");
  css.textContent = [
    "#so-tour{position:fixed;left:16px;bottom:52px;z-index:99993;width:320px;max-width:calc(100vw - 32px);",
      "background:#15110E;color:#fff;border-radius:14px;overflow:hidden;",
      "box-shadow:0 10px 40px rgba(0,0,0,.45),0 2px 8px rgba(0,0,0,.3);",
      "font:14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;",
      "opacity:0;transform:translateY(12px);transition:opacity .4s ease,transform .4s ease}",
    "#so-tour.so-in{opacity:1;transform:translateY(0)}",
    "#so-tour .so-bar{height:3px;background:#f97316}",
    "#so-tour .so-body{padding:15px 16px 16px}",
    "#so-tour .so-head{display:flex;align-items:flex-start;gap:8px}",
    "#so-tour h4{margin:0;font-size:14.5px;font-weight:700;line-height:1.35;letter-spacing:-.1px;flex:1}",
    "#so-tour .so-sub{margin:6px 0 0;font-size:12.5px;color:#b9b2ab}",
    "#so-tour .so-x{background:none;border:0;color:#8c857e;cursor:pointer;padding:2px;margin:-2px -2px 0 0;line-height:0;border-radius:6px;transition:color .15s}",
    "#so-tour .so-x svg{width:16px;height:16px}",
    "#so-tour .so-x:hover{color:#fff}",
    "#so-tour .so-chips{display:flex;flex-direction:column;gap:8px;margin-top:13px}",
    "#so-tour .so-chip{opacity:0;transform:translateY(6px);transition:opacity .35s ease,transform .35s ease,background .15s,border-color .15s}",
    "#so-tour .so-chip.so-cin{opacity:1;transform:translateY(0)}",
    "#so-tour button.so-chip{display:flex;align-items:center;gap:9px;width:100%;text-align:left;",
      "background:#221c17;border:1px solid #33291f;color:#fff;padding:10px 12px;border-radius:9px;",
      "font:600 13px inherit;cursor:pointer}",
    "#so-tour button.so-chip:hover{background:#2a2219;border-color:#f97316}",
    "#so-tour button.so-chip svg{width:16px;height:16px;flex:0 0 auto;color:#f97316}",
    "#so-tour button.so-chip .so-lbl{flex:1}",
    "#so-tour button.so-chip .so-car{color:#8c857e;transition:transform .2s}",
    "#so-tour button.so-chip.so-open .so-car{transform:rotate(90deg)}",
    "#so-tour .so-panel{max-height:0;overflow:hidden;transition:max-height .3s ease;margin-top:-2px}",
    "#so-tour .so-panel.so-show{max-height:260px}",
    "#so-tour .so-panel .so-inner{padding:11px 4px 3px}",
    "#so-tour .so-line{display:flex;align-items:flex-start;gap:9px;font-size:12.5px;color:#d6d0c9;padding:5px 0}",
    "#so-tour .so-line svg{width:15px;height:15px;flex:0 0 auto;color:#f97316;margin-top:1px}",
    "#so-tour .so-price{font-size:13px;color:#e8e3dd;padding:6px 4px 3px;line-height:1.6}",
    "#so-tour .so-price .so-p1{font-weight:700;color:#fff}",
    "#so-tour .so-price .so-p3{color:#b9b2ab;font-size:12.5px}",
    "@media (prefers-reduced-motion: reduce){#so-tour,#so-tour .so-chip{transition:opacity .2s ease}#so-tour.so-in,#so-tour .so-chip.so-cin{transform:none}#so-tour .so-panel{transition:none}}",
    "@media (max-width:480px){#so-tour{left:0;right:0;bottom:38px;width:auto;max-width:none;border-radius:14px 14px 0 0}#so-tour .so-body{padding-bottom:56px}}"
  ].join("\n");
  document.head.appendChild(css);

  // ── Markup ───────────────────────────────────────────────────────────────
  var card = document.createElement("div");
  card.id = "so-tour";
  card.setAttribute("role", "complementary");
  card.setAttribute("aria-label", "StillOpen demo tour");
  card.innerHTML =
    '<div class="so-bar"></div>' +
    '<div class="so-body">' +
      '<div class="so-head">' +
        '<h4>Cole built this working demo for ' + esc(BUSINESS) + '.</h4>' +
        '<button class="so-x" type="button" aria-label="Close">' + IC.x + '</button>' +
      '</div>' +
      '<p class="so-sub">Everything on this page is live. Try it.</p>' +
      '<div class="so-chips">' +
        '<button class="so-chip" type="button" data-act="ask">' + IC.chat +
          '<span class="so-lbl">Ask it: &ldquo;' + esc(QUESTION) + '&rdquo;</span></button>' +
        '<button class="so-chip" type="button" data-act="monday">' + IC.moon +
          '<span class="so-lbl">What happens Monday morning?</span>' +
          '<span class="so-car">&rsaquo;</span></button>' +
        '<div class="so-panel" data-panel="monday"><div class="so-inner">' +
          '<div class="so-line">' + IC.moon + '<span>Every after-hours question answered while you&rsquo;re closed.</span></div>' +
          '<div class="so-line">' + IC.inbox + '<span>Leads and bookings collected, nothing lost.</span></div>' +
          '<div class="so-line">' + IC.coffee + '<span>One tidy list waiting with your coffee.</span></div>' +
        '</div></div>' +
        '<button class="so-chip" type="button" data-act="cost">' + IC.tag +
          '<span class="so-lbl">What&rsquo;s this cost?</span>' +
          '<span class="so-car">&rsaquo;</span></button>' +
        '<div class="so-panel" data-panel="cost"><div class="so-inner">' +
          '<div class="so-price">' +
            '<div class="so-p1">One-time install: $297. Then $47/mo. First 30 days free.</div>' +
            '<div>Pro (booking + priority): $497 install, $97/mo.</div>' +
            '<div class="so-p3">Like it? Text Cole back and it&rsquo;s on your real site within 48 hours.</div>' +
          '</div>' +
        '</div></div>' +
      '</div>' +
    '</div>';

  function mount() {
    document.body.appendChild(card);

    // Ask chip: only keep if the widget is on the page.
    var askChip = card.querySelector('[data-act="ask"]');
    if (!document.getElementById("he-bubble")) { if (askChip) askChip.style.display = "none"; }

    card.querySelector(".so-x").addEventListener("click", function () {
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
      card.classList.remove("so-in");
      setTimeout(function () { if (card.parentNode) card.parentNode.removeChild(card); }, reduce ? 200 : 420);
    });

    card.addEventListener("click", function (ev) {
      var btn = ev.target.closest ? ev.target.closest(".so-chip") : null;
      if (!btn) return;
      var act = btn.getAttribute("data-act");
      if (act === "ask") { askBot(); return; }
      if (act === "monday" || act === "cost") {
        var panel = card.querySelector('[data-panel="' + act + '"]');
        var open = panel.classList.toggle("so-show");
        btn.classList.toggle("so-open", open);
      }
    });

    // Reveal card, then stagger chips.
    setTimeout(function () {
      card.classList.add("so-in");
      var chips = card.querySelectorAll(".so-chip");
      for (var j = 0; j < chips.length; j++) {
        (function (el, d) {
          setTimeout(function () { el.classList.add("so-cin"); }, reduce ? 0 : d);
        })(chips[j], 120 + j * 150);
      }
    }, reduce ? 0 : 30);
  }

  function askBot() {
    try {
      var win = document.getElementById("he-window");
      var bubble = document.getElementById("he-bubble");
      var input = document.getElementById("he-input");
      if (!bubble || !input) return;
      var isOpen = win && win.classList.contains("open");
      if (!isOpen) bubble.click();
      setTimeout(function () {
        input.value = QUESTION;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.focus();
        var send = document.getElementById("he-send") ||
          (win && win.querySelector('button[type="submit"], .he-send, [aria-label*="end" i]'));
        if (send) { try { send.click(); } catch (e) {} }
      }, isOpen ? 60 : 360);
    } catch (e) {}
  }

  var start = function () { setTimeout(mount, reduce ? 300 : 1500); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
