import SearchClient from "./SearchClient";

export const metadata = {
  title: "Search Movies & TV Shows - Watchio",
  description: "Search and discover thousands of movies and TV shows. Find your favorite content to watch online.",
  alternates: { canonical: "https://fmovies.in.net/search" },
};

export default function SearchPage() {
  return <SearchClient />;
}
