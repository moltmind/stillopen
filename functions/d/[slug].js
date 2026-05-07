// Cloudflare Pages Function: serves the dynamic demo at /d/{slug}.
// Fetches the kb config from the worker and injects it into the demo template
// via window.STILLOPEN_DEMO_DATA, so visitors see a clean URL while the page
// still renders the right business name, city, services, and chatbot config.

export async function onRequest(context) {
  const slug = (context.params.slug || "").trim();

  if (!slug) {
    return new Response("Missing demo slug", { status: 400 });
  }

  // Fetch the kb config from the worker
  let cfg = null;
  try {
    const cfgRes = await fetch(
      `https://app.stillopen.ai/api/demo-config?slug=${encodeURIComponent(slug)}`,
      { cf: { cacheTtl: 60 } }
    );
    if (cfgRes.ok) {
      cfg = await cfgRes.json();
    }
  } catch (e) {
    // fall through to expired page
  }

  // If demo expired or never existed, return a graceful page that points back
  // to the homepage form so the visitor can rebuild their demo in 30 seconds.
  if (!cfg) {
    const expiredHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>This demo expired | StillOpen</title>
<style>
  body { font-family: -apple-system, system-ui, 'Inter', sans-serif; background: #050506; color: #fafafa; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; line-height: 1.6; -webkit-font-smoothing: antialiased; margin: 0; }
  .wrap { max-width: 520px; text-align: center; }
  .logo { font-size: 18px; font-weight: 700; letter-spacing: -0.03em; margin-bottom: 32px; }
  .logo span { color: #fb923c; }
  h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 16px; line-height: 1.2; }
  p { color: #b4b4bd; font-size: 16px; margin-bottom: 28px; }
  .slug { color: #fb923c; font-family: 'JetBrains Mono', monospace; font-size: 13px; word-break: break-all; }
  a.btn { display: inline-block; background: #f97316; color: #fff; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none; transition: background 0.15s; }
  a.btn:hover { background: #fb923c; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="logo">Still<span>Open</span></div>
    <h1>This demo expired.</h1>
    <p>The demo for <span class="slug">${escapeHtml(slug)}</span> is no longer available. Demos auto-expire after 30 days of no activity. Build a fresh one in 30 seconds.</p>
    <a class="btn" href="https://stillopen.ai/">Build a new demo</a>
  </div>
</body>
</html>`;
    return new Response(expiredHtml, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Fetch the existing demo template from the same Pages site
  const templateUrl = new URL("/demo/builder/index.html", context.request.url);
  let templateRes;
  try {
    templateRes = await context.env.ASSETS.fetch(templateUrl);
  } catch (e) {
    return new Response("Template fetch failed", { status: 500 });
  }
  if (!templateRes.ok) {
    return new Response("Template not available", { status: 500 });
  }

  let html = await templateRes.text();

  // Inject the kb config into a window global so the existing template JS
  // can read it directly without parsing the URL query string.
  const inject = `<script>window.STILLOPEN_DEMO_DATA = ${JSON.stringify(cfg).replace(/</g, "\\u003c")};</script>`;
  html = html.replace("</head>", `${inject}\n</head>`);

  // Update the title/description for the clean URL so social shares preview right
  const biz = cfg.business_name || "Your Business";
  const city = (cfg.service_area && cfg.service_area[0]) || "Your City";
  const tradeLabel = cfg.trade_label || "service";
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(biz)} | Sample StillOpen Demo | ${escapeHtml(city)}</title>`
  );
  html = html.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="A live AI front desk demo built for ${escapeHtml(biz)} in ${escapeHtml(city)}. Try the chat in the corner. Built in 30 seconds.">`
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=120",
    },
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
