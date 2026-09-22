"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Search.module.css";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 10749, name: "Romance" },
  { id: 53, name: "Thriller" },
  { id: 16, name: "Animation" },
];

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeGenre, setActiveGenre] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  };

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/trending/all/week?language=en-US", { headers })
      .then((r) => r.json())
      .then((data) => setTrending(data.results?.slice(0, 12) ?? []))
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
  const showTrendingLabel = !query.trim() && !activeGenre;

  return (
    <div className={styles.searchPage}>
      <Navbar />

      <div className={styles.heroSearch}>
        <h1 className={styles.heroTitle}>Find Your Next Obsession</h1>
        <p className={styles.heroSubtitle}>Search millions of movies & TV shows</p>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search movies, TV shows, people..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveGenre(null); }}
            className={styles.searchInput}
            autoFocus
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery("")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className={styles.genres}>
          {GENRES.map((g) => (
            <button
              key={g.id}
              className={`${styles.genreChip} ${activeGenre === g.id ? styles.genreActive : ""}`}
              onClick={() => { setActiveGenre(activeGenre === g.id ? null : g.id); setQuery(""); }}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {showTrendingLabel && (
          <h2 className={styles.sectionTitle}>
            <span className={styles.trendingDot} />
            Trending This Week
          </h2>
        )}
        {query.trim() && !loading && (
          <h2 className={styles.sectionTitle}>
            Results for <span className={styles.queryHighlight}>&ldquo;{query}&rdquo;</span>
          </h2>
        )}
        {activeGenre && !loading && (
          <h2 className={styles.sectionTitle}>
            {GENRES.find((g) => g.id === activeGenre)?.name} Movies
          </h2>
        )}

        {loading && (
          <div className={styles.loadingGrid}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        )}

        {!loading && query.trim() && results.length === 0 && (
          <div className={styles.emptyState}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <p>No results for <strong>&ldquo;{query}&rdquo;</strong></p>
            <span>Try a different keyword or browse by genre</span>
          </div>
        )}

        {!loading && (
          <div className={styles.grid}>
            {displayItems.map((item) => (
              <Link
                href={`/player/${item.media_type || "movie"}/${item.id}`}
                className={styles.card}
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={styles.cardImgWrap}>
                  {(item.backdrop_path || item.poster_path) ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`}
                      alt={item.title || item.name}
                      width={500}
                      height={281}
                      className={styles.cardImg}
                    />
                  ) : (
                    <div className={styles.noImage}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                    </div>
                  )}
                  <div className={`${styles.cardOverlay} ${hoveredId === item.id ? styles.cardOverlayVisible : ""}`}>
                    <div className={styles.playBtn}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                    <p className={styles.overviewSnippet}>
                      {item.overview ? item.overview.slice(0, 100) + "…" : "No description available."}
                    </p>
                  </div>
                  <div className={styles.badge}>
                    {item.media_type === "tv" ? "TV" : "Film"}
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{item.title || item.name}</h3>
                  <div className={styles.cardMeta}>
                    <span className={styles.year}>
                      {(item.release_date || item.first_air_date || "").slice(0, 4)}
                    </span>
                    {item.vote_average > 0 && (
                      <span className={styles.rating}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffd700">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                        {item.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
