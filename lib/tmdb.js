const BASE_URL = "https://api.themoviedb.org/3";

function getHeaders() {
  return {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  };
}

export async function fetchTMDB(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`TMDB fetch failed: ${path}`);
  return res.json();
}

export function slugToIdAndType(slug) {
  const parts = slug.split("-");
  const id = parts.pop();
  const isTv = slug.startsWith("tv-");
  return { id, contentType: isTv ? "tv" : "movie" };
}

export function buildSlug(title, id) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id}`;
}

export const TMDB_IMG = "https://image.tmdb.org/t/p";
