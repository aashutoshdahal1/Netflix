const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fmovies.in.net";

const STATIC_PAGES = [
  { url: "/", priority: 1.0 },
  { url: "/browse/movies?category=popular", priority: 0.8 },
  { url: "/browse/movies?category=top_rated", priority: 0.8 },
  { url: "/browse/movies?category=upcoming", priority: 0.7 },
  { url: "/browse/movies?category=now_playing", priority: 0.7 },
  { url: "/browse/tv?category=popular", priority: 0.8 },
  { url: "/browse/tv?category=top_rated", priority: 0.8 },
  { url: "/search", priority: 0.6 },
];

const FEATURED_SLUGS = [
  { slug: "inception-27205", type: "movie" },
  { slug: "the-dark-knight-155", type: "movie" },
  { slug: "interstellar-157336", type: "movie" },
  { slug: "avengers-endgame-299534", type: "movie" },
  { slug: "breaking-bad-1396", type: "series" },
  { slug: "the-witcher-71912", type: "series" },
  { slug: "squid-game-93405", type: "series" },
];

const CONTENT_PATHS = ["review", "cast", "ending-explained", "similar"];

export default function sitemap() {
  const staticEntries = STATIC_PAGES.map(({ url, priority }) => ({
    url: `${SITE_URL}${url}`,
    lastModified: new Date(),
    priority,
  }));

  const contentEntries = FEATURED_SLUGS.flatMap(({ slug, type }) =>
    CONTENT_PATHS.map((path) => ({
      url: `${SITE_URL}/${type}/${slug}/${path}`,
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: "weekly",
    }))
  );

  return [...staticEntries, ...contentEntries];
}
