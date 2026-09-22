const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fmovies.in.net";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/movie/*/review",
          "/movie/*/cast",
          "/movie/*/ending-explained",
          "/movie/*/similar",
          "/series/*/review",
          "/series/*/cast",
          "/series/*/ending-explained",
          "/series/*/similar",
          "/browse/",
          "/search",
          "/$",
        ],
        disallow: ["/player/", "/embed/", "/watch/", "/login", "/api/", "/admin/"],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: ["/movie/*/review", "/movie/*/cast", "/movie/*/ending-explained", "/movie/*/similar", "/series/*/review", "/series/*/cast", "/series/*/ending-explained", "/series/*/similar"],
        disallow: ["/player/", "/watch/"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/movie/*/review", "/movie/*/cast", "/movie/*/ending-explained", "/movie/*/similar", "/series/*/review", "/series/*/cast", "/series/*/ending-explained", "/series/*/similar"],
        disallow: ["/player/", "/watch/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
