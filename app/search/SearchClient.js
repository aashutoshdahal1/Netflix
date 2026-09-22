"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import styles from "./Search.module.css";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 99, name: "Documentary" },
  { id: 878, name: "Sci-Fi" },
  { id: 18, name: "Drama" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 53, name: "Thriller" },
  { id: 16, name: "Animation" },
  { id: 12, name: "Adventure" },
];

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeGenre, setActiveGenre] = useState(null);

  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  };

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/trending/all/week?language=en-US", { headers })
      .then((r) => r.json())
      .then((data) => setTrending(data.results?.slice(0, 20) ?? []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
          { headers }
        );
        const data = await res.json();
        setResults((data.results || []).filter((i) => i.media_type === "movie" || i.media_type === "tv"));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!activeGenre) return;
    setLoading(true);
    fetch(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${activeGenre}&sort_by=popularity.desc&language=en-US&page=1`,
      { headers }
    )
      .then((r) => r.json())
      .then((data) => { setResults(data.results ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeGenre]);

  const displayItems = query.trim() || activeGenre ? results : trending;
  const activeGenreName = GENRES.find((g) => g.id === activeGenre)?.name;
  const sectionLabel = query.trim()
    ? `Results for "${query}"`
    : activeGenreName
    ? `${activeGenreName} movies`
    : "Trending This Week";

  return (
    <div className={styles.searchPage}>
      <Navbar />

      <div className={styles.searchTop}>
        {/* Search bar */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search movies, TV shows..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveGenre(null); }}
            className={styles.searchInput}
            autoFocus
          />
          <span className={styles.searchIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery("")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Genre chips — horizontal scroll */}
        <div className={styles.genreRow}>
          {GENRES.map((g) => (
            <button
              key={g.id}
              className={`${styles.chip} ${activeGenre === g.id ? styles.chipActive : ""}`}
              onClick={() => { setActiveGenre(activeGenre === g.id ? null : g.id); setQuery(""); }}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {/* Section header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{sectionLabel}</h2>
          <div className={styles.sectionActions}>
            <button className={styles.iconActionBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
              </svg>
            </button>
            <button className={styles.iconActionBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className={styles.list}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeletonRow}>
                <div className={styles.skeletonThumb} />
                <div className={styles.skeletonText}>
                  <div className={styles.skeletonLine} style={{ width: "40%" }} />
                  <div className={styles.skeletonLine} style={{ width: "70%" }} />
                  <div className={styles.skeletonLine} style={{ width: "30%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && query.trim() && results.length === 0 && (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <p>No results for <strong>&ldquo;{query}&rdquo;</strong></p>
          </div>
        )}

        {/* Results list */}
        {!loading && (
          <div className={styles.list}>
            {displayItems.map((item) => {
              const year = (item.release_date || item.first_air_date || "").slice(0, 4);
              const title = item.title || item.name || "";
              const rating = item.vote_average?.toFixed(1);
              const thumb = item.backdrop_path || item.poster_path;
              return (
                <Link
                  href={`/detail/${item.media_type || "movie"}/${item.id}`}
                  className={styles.row}
                  key={item.id}
                >
                  <div className={styles.thumb}>
                    {thumb ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${thumb}`}
                        alt={title}
                        width={300}
                        height={169}
                        className={styles.thumbImg}
                      />
                    ) : (
                      <div className={styles.thumbFallback}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={styles.info}>
                    {year && <span className={styles.year}>{year}</span>}
                    <h3 className={styles.title}>{title}</h3>
                    {rating && rating !== "0.0" && (
                      <span className={styles.rating}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffd700">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                        {rating}
                      </span>
                    )}
                  </div>
                  <button className={styles.moreBtn} onClick={(e) => e.preventDefault()}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
