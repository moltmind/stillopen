/**
 * StillOpen Chatbot — Standalone embed script
 *
 * The 24/7 AI front desk widget. Plumbers (and other home services trades)
 * drop this single script tag into their site and get a floating chat bubble
 * that answers customer questions, books jobs, and captures deposits via the
 * StillOpen Cloudflare Worker.
 *
 * HOW TO EMBED:
 * Add this single line before </body> in the customer's website:
 *   <script src="https://app.stillopen.ai/chatbot.js"></script>
 *
 * The WORKER_URL below points at the deployed Cloudflare Worker for StillOpen.
 */

(function () {
  "use strict";

  // ─── CONFIG ──────────────────────────────────────────────────────────────────
  const WORKER_URL =
    "https://app.stillopen.ai";

  // Per-plumber ID read from the script tag's data-plumber-id attribute.
  // Embed pattern:
  //   <script src=".../chatbot.js" data-plumber-id="mike-ingrilli"></script>
  // The worker uses this to load kb:{plumberId} from KV and prepend the
  // per-plumber context block to the base SYSTEM_PROMPT. If absent, the
  // worker falls back to a generic home-services front-desk prompt.
  const PLUMBER_ID = (function () {
    try {
      if (document.currentScript && document.currentScript.dataset) {
        return document.currentScript.dataset.plumberId || null;
      }
      const scripts = document.querySelectorAll('script[src*="chatbot.js"]');
      for (const s of scripts) {
        if (s.dataset && s.dataset.plumberId) return s.dataset.plumberId;
      }
    } catch (e) {}
    return null;
  })();

  // Inline mode: renders inside a container div instead of as a floating bubble.
  // Used by the demo funnel on the landing page.
  // Embed: <script src="chatbot.js" data-mode="inline" data-container="my-div"></script>
  const INLINE_MODE = (function () {
    try {
      if (document.currentScript && document.currentScript.dataset) {
        return document.currentScript.dataset.mode === "inline";
      }
      const scripts = document.querySelectorAll('script[src*="chatbot.js"]');
      for (const s of scripts) {
        if (s.dataset && s.dataset.mode === "inline") return true;
      }
    } catch (e) {}
    return false;
  })();

  const INLINE_CONTAINER = (function () {
    try {
      if (document.currentScript && document.currentScript.dataset) {
        return document.currentScript.dataset.container || null;
      }
      const scripts = document.querySelectorAll('script[src*="chatbot.js"]');
      for (const s of scripts) {
        if (s.dataset && s.dataset.container) return s.dataset.container;
      }
    } catch (e) {}
    return null;
  })();

  const IS_SALES_MODE = !PLUMBER_ID || PLUMBER_ID === "stillopen" || PLUMBER_ID === "stillopen-sales";

  const OPENING_MESSAGE = IS_SALES_MODE
    ? "Hi, I'm Paul, the AI front desk on this site. Ask me anything about StillOpen, the pricing, how it works, or what it would do for your shop. I can also book you a 10 minute demo with Cole if you want to talk to the guy who built it."
    : "Hi there. I'm the front desk. I can answer questions about our services, check availability, and book a job for you right now. What's going on?";

  // ─── COLORS (Day 2 placeholder palette) ──────────────────────────────────────
  // PLACEHOLDER from the Day 2 rip pass. Neutral white-bg + dark slate text +
  // single blue accent. Aaron's call: do NOT carry HomeEdge's navy+cyan+gold
  // into StillOpen's first deployable surface.
  //
  // The KEY NAMES below are legacy from HomeEdge (navy, cyan, gold). The
  // VALUES are StillOpen neutral. Paul rewrites both keys and values during
  // the brand voice session by Day 10. Until then, a search-and-replace on
  // ${COLORS.navy} → background, ${COLORS.cyan} → accent, etc. is the migration.
  const COLORS = {
    navy:        "#0c0c0e",              // chat window background (dark)
    navyLight:   "#111114",              // header + input row background
    navyBorder:  "rgba(255,255,255,0.08)", // border lines
    cyan:        "#4f5bbd",              // primary accent (brand indigo)
    cyanDim:     "rgba(79,91,189,0.10)",
    gold:        "#4f5bbd",              // send button (brand indigo)
    goldHover:   "#6d7cf0",              // send button hover
    white:       "#fafafa",              // primary text
    textMuted:   "#71717a",              // muted/placeholder text
    userBubble:  "#4f5bbd",              // user message background (brand)
    userText:    "#FFFFFF",              // user message text
    botBubble:   "#18181b",              // bot message background (dark raised)
    botText:     "#b4b4bd",              // bot message text (secondary)
    online:      "#34d399",              // online dot (success green)
    shadow:      "rgba(0,0,0,0.4)",      // drop shadow
  };
  // ─────────────────────────────────────────────────────────────────────────────

  // State
  let isOpen = false;
  let sessionCount = 0;
  let isLimited = false;
  let isTyping = false;
  let hasUnread = false;
  let conversationHistory = [];

  // ─── INJECT STYLES ───────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #he-chat-root * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Bubble */
    #he-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${COLORS.cyan};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(37,99,235,0.25), 0 2px 8px ${COLORS.shadow};
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      z-index: 9998;
    }
    #he-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(37,99,235,0.35), 0 2px 10px ${COLORS.shadow};
    }
    #he-bubble:active {
      transform: scale(0.96);
    }
    #he-bubble svg {
      width: 28px;
      height: 28px;
      fill: #FFFFFF;
      transition: opacity 0.2s ease;
    }
    #he-bubble .he-close-icon {
      display: none;
    }
    #he-bubble.open .he-chat-icon {
      display: none;
    }
    #he-bubble.open .he-close-icon {
      display: block;
    }

    /* Unread badge */
    #he-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: ${COLORS.gold};
      color: ${COLORS.navy};
      font-size: 11px;
      font-weight: 700;
      display: none;
      align-items: center;
      justify-content: center;
      border: 2px solid ${COLORS.navy};
      animation: he-badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    #he-badge.visible {
      display: flex;
    }
    @keyframes he-badge-pop {
      from { transform: scale(0); }
      to   { transform: scale(1); }
    }

    /* Chat window */
    #he-window {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 350px;
      height: 500px;
      background: ${COLORS.navy};
      border: 1px solid ${COLORS.navyBorder};
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(37,99,235,0.06);
      z-index: 9997;
      transform-origin: bottom right;
      transform: scale(0.85) translateY(16px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.25s cubic-bezier(0.34,1.4,0.64,1), opacity 0.2s ease;
    }
    #he-window.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    /* Header */
    #he-header {
      background: ${COLORS.navyLight};
      border-bottom: 1px solid ${COLORS.navyBorder};
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    #he-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: ${COLORS.cyan};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
    }
    #he-avatar svg {
      width: 20px;
      height: 20px;
      fill: #FFFFFF;
    }
    #he-online-dot {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${COLORS.online};
      border: 2px solid ${COLORS.navyLight};
    }
    #he-header-info {
      flex: 1;
    }
    #he-header-title {
      font-size: 14px;
      font-weight: 700;
      color: ${COLORS.white};
      letter-spacing: 0.01em;
    }
    #he-header-status {
      font-size: 11px;
      color: ${COLORS.online};
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 1px;
    }
    #he-header-status::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${COLORS.online};
      display: inline-block;
    }

    /* Messages area */
    #he-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }
    #he-messages::-webkit-scrollbar {
      width: 4px;
    }
    #he-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    #he-messages::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
    }

    /* Message bubbles */
    .he-msg {
      display: flex;
      flex-direction: column;
      max-width: 82%;
      animation: he-msg-in 0.2s ease;
    }
    @keyframes he-msg-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .he-msg.user {
      align-self: flex-end;
      align-items: flex-end;
    }
    .he-msg.bot {
      align-self: flex-start;
      align-items: flex-start;
    }
    .he-bubble-text {
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 1.5;
      word-break: break-word;
    }
    .he-msg.user .he-bubble-text {
      background: ${COLORS.userBubble};
      color: ${COLORS.userText};
      border-bottom-right-radius: 4px;
    }
    .he-msg.bot .he-bubble-text {
      background: ${COLORS.botBubble};
      color: ${COLORS.botText};
      border-bottom-left-radius: 4px;
      border: 1px solid ${COLORS.navyBorder};
    }

    /* Typing indicator */
    #he-typing {
      display: none;
      align-self: flex-start;
      padding: 10px 14px;
      background: ${COLORS.botBubble};
      border: 1px solid ${COLORS.navyBorder};
      border-radius: 14px;
      border-bottom-left-radius: 4px;
      gap: 5px;
      align-items: center;
    }
    #he-typing.visible {
      display: flex;
    }
    .he-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: ${COLORS.cyan};
      animation: he-bounce 1.2s infinite ease-in-out;
    }
    .he-dot:nth-child(1) { animation-delay: 0s; }
    .he-dot:nth-child(2) { animation-delay: 0.2s; }
    .he-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes he-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-5px); opacity: 1; }
    }

    /* Input row */
    #he-input-row {
      padding: 12px;
      background: ${COLORS.navyLight};
      border-top: 1px solid ${COLORS.navyBorder};
      display: flex;
      gap: 8px;
      align-items: flex-end;
      flex-shrink: 0;
    }
    #he-input {
      flex: 1;
      background: ${COLORS.navy};
      border: 1px solid ${COLORS.navyBorder};
      border-radius: 10px;
      color: ${COLORS.white};
      font-size: 13.5px;
      padding: 9px 12px;
      resize: none;
      outline: none;
      max-height: 100px;
      min-height: 38px;
      line-height: 1.45;
      transition: border-color 0.15s ease;
      overflow-y: auto;
    }
    #he-input::placeholder {
      color: ${COLORS.textMuted};
    }
    #he-input:focus {
      border-color: ${COLORS.cyan};
    }
    #he-input:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    #he-send {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: ${COLORS.gold};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.15s ease, transform 0.1s ease;
    }
    #he-send:hover:not(:disabled) {
      background: ${COLORS.goldHover};
    }
    #he-send:active:not(:disabled) {
      transform: scale(0.93);
    }
    #he-send:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    #he-send svg {
      width: 18px;
      height: 18px;
      fill: #FFFFFF;
    }

    /* Mobile */
    @media (max-width: 480px) {
      #he-window {
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100dvh;
        border-radius: 0;
        border: none;
        transform-origin: bottom center;
      }
      #he-bubble {
        bottom: 16px;
        right: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  // ─── BUILD DOM ───────────────────────────────────────────────────────────────
  const root = document.createElement("div");
  root.id = "he-chat-root";

  // Bubble button
  root.innerHTML = `
    <button id="he-bubble" aria-label="Open chat">
      <svg class="he-chat-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.163 2 11.333c0 2.742 1.234 5.204 3.2 6.933L4 22l4.933-1.867A10.8 10.8 0 0 0 12 20.667c5.523 0 10-4.163 10-9.334C22 6.163 17.523 2 12 2Z"/>
      </svg>
      <svg class="he-close-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6 6 18M6 6l12 12" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      </svg>
      <span id="he-badge" role="status" aria-label="Unread messages">1</span>
    </button>

    <div id="he-window" role="dialog" aria-label="Chat window">
      <div id="he-header">
        <div id="he-avatar">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.163 2 11.333c0 2.742 1.234 5.204 3.2 6.933L4 22l4.933-1.867A10.8 10.8 0 0 0 12 20.667c5.523 0 10-4.163 10-9.334C22 6.163 17.523 2 12 2Z"/>
          </svg>
          <div id="he-online-dot"></div>
        </div>
        <div id="he-header-info">
          <div id="he-header-title">Front Desk</div>
          <div id="he-header-status">Online</div>
        </div>
      </div>

      <div id="he-messages" role="log" aria-live="polite">
        <div id="he-typing">
          <div class="he-dot"></div>
          <div class="he-dot"></div>
          <div class="he-dot"></div>
        </div>
      </div>

      <div id="he-input-row">
        <textarea
          id="he-input"
          placeholder="Ask me anything..."
          rows="1"
          aria-label="Your message"
        ></textarea>
        <button id="he-send" aria-label="Send message">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Mount: inline mode goes into the specified container, floating mode appends to body
  if (INLINE_MODE && INLINE_CONTAINER) {
    const container = document.getElementById(INLINE_CONTAINER);
    if (container) {
      container.appendChild(root);
      // In inline mode: hide the bubble, show the window immediately, fill the container
      const bubbleEl = root.querySelector("#he-bubble");
      if (bubbleEl) bubbleEl.style.display = "none";
      const windowEl = root.querySelector("#he-window");
      if (windowEl) {
        windowEl.style.position = "relative";
        windowEl.style.bottom = "auto";
        windowEl.style.right = "auto";
        windowEl.style.width = "100%";
        windowEl.style.height = "100%";
        windowEl.style.borderRadius = "0";
        windowEl.style.border = "none";
        windowEl.style.display = "flex";
        windowEl.style.opacity = "1";
        windowEl.style.pointerEvents = "auto";
        windowEl.style.transform = "none";
      }
    } else {
      document.body.appendChild(root);
    }
  } else {
    document.body.appendChild(root);
  }

  // ─── ELEMENT REFS ────────────────────────────────────────────────────────────
  const bubble    = document.getElementById("he-bubble");
  const badge     = document.getElementById("he-badge");
  const chatWin   = document.getElementById("he-window");
  const messages  = document.getElementById("he-messages");
  const typingEl  = document.getElementById("he-typing");
  const input     = document.getElementById("he-input");
  const sendBtn   = document.getElementById("he-send");

  // ─── HELPERS ─────────────────────────────────────────────────────────────────

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function appendMessage(role, text) {
    // Remove typing indicator before inserting, then put it back at end
    if (typingEl.parentNode === messages) {
      messages.removeChild(typingEl);
    }

    const wrapper = document.createElement("div");
    wrapper.className = `he-msg ${role}`;

    const bubble = document.createElement("div");
    bubble.className = "he-bubble-text";
    bubble.textContent = text;

    wrapper.appendChild(bubble);
    messages.appendChild(wrapper);
    messages.appendChild(typingEl); // keep typing at bottom
    scrollToBottom();

    // Show unread badge if window is closed
    if (!isOpen && role === "bot") {
      hasUnread = true;
      badge.classList.add("visible");
    }
  }

  function setTyping(visible) {
    isTyping = visible;
    typingEl.classList.toggle("visible", visible);
    if (visible) scrollToBottom();
  }

  function setInputDisabled(disabled) {
    input.disabled = disabled;
    sendBtn.disabled = disabled;
  }

  // Auto-grow textarea
  function autoResize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 100) + "px";
  }

  // ─── TOGGLE WINDOW ───────────────────────────────────────────────────────────
  function toggleChat() {
    isOpen = !isOpen;
    chatWin.classList.toggle("open", isOpen);
    bubble.classList.toggle("open", isOpen);

    if (isOpen) {
      // Clear badge
      hasUnread = false;
      badge.classList.remove("visible");
      setTimeout(() => input.focus(), 250);
    }
  }

  // ─── SEND MESSAGE ────────────────────────────────────────────────────────────
  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isTyping || isLimited) return;

    input.value = "";
    autoResize();
    appendMessage("user", text);

    sessionCount++;
    conversationHistory.push({ role: "user", content: text });

    setInputDisabled(true);
    setTyping(true);

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          sessionCount: sessionCount,
          plumberId: PLUMBER_ID,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setTyping(false);

      const reply = data.reply || "Sorry, something went wrong. Try again!";
      appendMessage("bot", reply);
      conversationHistory.push({ role: "assistant", content: reply });

      if (data.limitReached) {
        isLimited = true;
        setInputDisabled(true);
        input.placeholder = "Chat session ended — see above to connect.";
      } else {
        setInputDisabled(false);
        input.focus();
      }
    } catch (err) {
      setTyping(false);
      appendMessage(
        "bot",
        "I'm having trouble connecting right now. Please call the business directly or try again in a moment."
      );
      setInputDisabled(false);
    }
  }

  // ─── SHOW OPENING MESSAGE ────────────────────────────────────────────────────
  function showOpening() {
    // Slight delay so the window animation plays first
    setTimeout(() => {
      appendMessage("bot", OPENING_MESSAGE);
      conversationHistory.push({ role: "assistant", content: OPENING_MESSAGE });
    }, 300);
  }

  // ─── EVENT LISTENERS ─────────────────────────────────────────────────────────
  bubble.addEventListener("click", () => {
    const wasOpened = !isOpen;
    toggleChat();

    // Show opening message on first open
    if (wasOpened && conversationHistory.length === 0) {
      showOpening();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  input.addEventListener("input", autoResize);

  sendBtn.addEventListener("click", sendMessage);

  // ─── PASSIVE BADGE (unread while closed) ─────────────────────────────────────
  // Show a badge on the bubble after 4 seconds to entice engagement
  setTimeout(() => {
    if (!isOpen && conversationHistory.length === 0) {
      hasUnread = true;
      badge.classList.add("visible");
    }
  }, 4000);

  // ─── INLINE MODE: auto-open and show opening message immediately ────────────
  if (INLINE_MODE && INLINE_CONTAINER) {
    isOpen = true;
    showOpening();
    // Focus the input after a short delay
    setTimeout(() => { if (input) input.focus(); }, 500);
  }
})();
