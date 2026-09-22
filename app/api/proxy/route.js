import { NextResponse } from "next/server";

export const runtime = "edge";

// Known ad/tracker script patterns to strip from proxied HTML
const AD_PATTERNS = [
  /<!--\s*ads?\s*-->[\s\S]*?<!--\s*\/ads?\s*-->/gi,
  /<script[^>]*>([\s\S]*?(google|doubleclick|adsbygoogle|googletag|adsystem|popunder|popads|popcash|trafficjunky|exoclick|juicyads|adsterra|hilltopads|propellerads|pushcrew|onesignal)[\s\S]*?)<\/script>/gi,
  /<script[^>]*(googletag|adsbygoogle|doubleclick|popunder|popads|popcash|trafficjunky|exoclick|juicyads|adsterra|hilltopads|propellerads|pushcrew|onesignal)[^>]*>[\s\S]*?<\/script>/gi,
  /<script[^>]*src=["'][^"']*?(googlesyndication|doubleclick|adnxs|moatads|scorecardresearch|openx|adsafeprotected|casalemedia|pubmatic|rubiconproject|indexww|smartadserver|taboola|outbrain|revcontent|mgid|ads\.yahoo|adblade|spotxchange|sovrn|conversantmedia|criteo|appnexus|sharethrough|triplelift|yieldmo|undertone|districtm|33across|vidoomy)[^"']*?["'][^>]*>[\s\S]*?<\/script>/gi,
  /<ins\s[^>]*class=["'][^"']*adsbygoogle[^"']*["'][^>]*>[\s\S]*?<\/ins>/gi,
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");

  if (!target) {
    return new NextResponse("Missing url param", { status: 400 });
  }

  const allowed = ["vidsrc.to", "vidsrc.me", "vidsrc.net", "vidsrc.xyz", "vidsrc.in"];
  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  const hostname = targetUrl.hostname.replace(/^www\./, "");
  if (!allowed.some((d) => hostname === d || hostname.endsWith("." + d))) {
    return new NextResponse("Domain not allowed", { status: 403 });
  }

  try {
    const upstream = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        // No Referer header — key to avoiding ad injection
      },
      redirect: "follow",
    });

    const contentType = upstream.headers.get("content-type") || "text/html";
    let body = await upstream.text();

    // Strip known ad scripts
    for (const pattern of AD_PATTERNS) {
      body = body.replace(pattern, "");
    }

    // Rewrite root-relative and protocol-relative URLs to the upstream origin
    const origin = targetUrl.origin;
    body = body
      .replace(/(src|href|action)=(["'])\//g, `$1=$2${origin}/`)
      .replace(/(src|href)=(["'])\/\//g, `$1=$2https://`);

    // Inject a script to block window.open and top-level navigation (popup ads)
    const blocker = `<script>
      (function(){
        var _open = window.open;
        window.open = function(url, name, features) {
          if (!url || url === 'about:blank') return _open.apply(this, arguments);
          var a = document.createElement('a');
          try { a.href = url; } catch(e) { return; }
          // Allow only same-origin opens
          if (a.hostname && a.hostname !== location.hostname) return null;
          return _open.apply(this, arguments);
        };
        // Block top navigation
        Object.defineProperty(window, 'top', { get: function(){ return window; } });
      })();
    </script>`;
    body = body.replace(/<head>/i, "<head>" + blocker);

    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new NextResponse("Proxy error: " + err.message, { status: 502 });
  }
}
