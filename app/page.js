import { fetchTMDB, TMDB_IMG } from "../lib/tmdb";
import HomeClient from "./HomeClient";

export const metadata = {
  title: "Watchio - Watch Movies & TV Shows Online | fmovies.in.net",
  description:
    "Discover movies and TV shows on Watchio. Read reviews, explore cast information, and find similar content recommendations.",
  alternates: { canonical: "https://fmovies.in.net" },
};

export default async function HomePage() {
  const data = await fetchTMDB("/trending/all/week?language=en-US").catch(() => ({ results: [] }));
  const trending = data.results ?? [];
  return <HomeClient trending={trending} />;
}
