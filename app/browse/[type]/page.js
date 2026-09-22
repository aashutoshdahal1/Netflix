import { fetchTMDB } from "../../../lib/tmdb";
import BrowseClient from "./BrowseClient";

function getTitle(type, category) {
  if (type === "movies") {
    const map = { popular: "Popular Movies", top_rated: "Top Rated Movies", upcoming: "Upcoming Movies", now_playing: "Now Playing Movies" };
    return map[category] || "All Movies";
  }
  if (type === "tv") {
    const map = { popular: "Popular TV Shows", top_rated: "Top Rated TV Shows", airing_today: "Airing Today", on_the_air: "On The Air" };
    return map[category] || "All TV Shows";
  }
  return "Browse";
}

export async function generateMetadata({ params, searchParams }) {
  const { type } = await params;
  const { category } = await searchParams;
  const title = getTitle(type, category);
  return {
    title: `${title} - Watch Online Free | Watchio`,
    description: `Browse and watch ${title.toLowerCase()} online for free in HD quality. Stream unlimited content on Watchio.`,
    alternates: {
      canonical: `https://fmovies.in.net/browse/${type}${category ? `?category=${category}` : ""}`,
    },
  };
}

export default async function BrowsePage({ params, searchParams }) {
  const { type } = await params;
  const { category = "popular", page = "1" } = await searchParams;
  const mediaType = type === "tv" ? "tv" : "movie";
  const pageNum = parseInt(page) || 1;

  const data = await fetchTMDB(
    `/${mediaType}/${category}?language=en-US&page=${pageNum}`
  ).catch(() => ({ results: [] }));

  return (
    <BrowseClient
      type={type}
      category={category}
      initialContent={data.results || []}
      initialPage={pageNum}
      title={getTitle(type, category)}
    />
  );
}
