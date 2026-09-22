"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import styles from "./Detail.module.css";

export default function DetailClient() {
  const { type, id } = useParams();
  const router = useRouter();
  const mediaType = type || "movie";

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [seasonOpen, setSeasonOpen] = useState(false);
  const [watchedEpisodes, setWatchedEpisodes] = useState(new Set());

  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  };

  useEffect(() => {
    const endpoint = mediaType === "tv"
      ? `https://api.themoviedb.org/3/tv/${id}?language=en-US`
      : `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
    fetch(endpoint, { headers })
      .then((r) => r.json())
      .then((d) => { setDetails(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id, mediaType]);

  // Fetch season episodes when season changes (TV only)
  useEffect(() => {
    if (mediaType !== "tv") return;
    fetch(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?language=en-US`, { headers })
      .then((r) => r.json())
      .then((d) => setSeasonDetails(d))
      .catch(console.error);

    // Load watched episodes for this show+season from localStorage
    try {
      const key = `watchio_watched_${id}`;
      const all = JSON.parse(localStorage.getItem(key) || "{}");
      const eps = all[selectedSeason] ?? [];
      setWatchedEpisodes(new Set(eps));
    } catch {}
  }, [id, mediaType, selectedSeason]);

  // Save to recently watched
  useEffect(() => {
    if (!details) return;
    try {
      const key = "watchio_library";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const entry = {
        id: details.id, type: mediaType,
        title: details.title || details.name,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        vote_average: details.vote_average,
        release_date: details.release_date || details.first_air_date,
        watchedAt: Date.now(),
      };
      const filtered = existing.filter((e) => !(e.id === entry.id && e.type === mediaType));
      localStorage.setItem(key, JSON.stringify([entry, ...filtered].slice(0, 50)));
    } catch {}
  }, [details, mediaType]);

  // Sync liked state
  useEffect(() => {
    if (!details) return;
    try {
      const favs = JSON.parse(localStorage.getItem("watchio_favorites") || "[]");
      setLiked(favs.some((f) => f.id === details.id && f.type === mediaType));
    } catch {}
  }, [details, mediaType]);

  const toggleLike = () => {
    if (!details) return;
    try {
      const key = "watchio_favorites";
      const favs = JSON.parse(localStorage.getItem(key) || "[]");
      const entry = {
        id: details.id, type: mediaType,
        title: details.title || details.name,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        vote_average: details.vote_average,
        release_date: details.release_date || details.first_air_date,
      };
      const exists = favs.some((f) => f.id === entry.id && f.type === mediaType);
      localStorage.setItem(key, JSON.stringify(exists
        ? favs.filter((f) => !(f.id === entry.id && f.type === mediaType))
        : [entry, ...favs]
      ));
      setLiked(!exists);
    } catch {}
  };

  const handleWatch = (episode = 1) =>
    router.push(`/player/${mediaType}/${id}${mediaType === "tv" ? `?season=${selectedSeason}&episode=${episode}` : ""}`);

  if (loading) {
    return <div className={styles.loading}><div className={styles.spinner} /></div>;
  }
  if (!details) return null;

  const title = details.title || details.name || "";
  const genres = details.genres?.map((g) => g.name).join(", ") || "";
  const rating = details.vote_average?.toFixed(1);
  const year = (details.release_date || details.first_air_date || "").slice(0, 4);
  const runtime = details.runtime
    ? `${details.runtime} min`
    : details.episode_run_time?.[0]
    ? `${details.episode_run_time[0]} min/ep`
    : null;
  const overview = details.overview || "";
  const shortOverview = overview.length > 120 ? overview.slice(0, 120) + "…" : overview;
  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : details.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : null;
  const seasons = details.seasons?.filter((s) => s.season_number > 0) ?? [];

  return (
    <div className={styles.page}>
      {/* Poster */}
      <div className={styles.posterWrap}>
        {posterUrl && (
          <Image src={posterUrl} alt={title} fill priority className={styles.poster} sizes="100vw" />
        )}
        <div className={styles.posterGradient} />

        <button className={styles.backBtn} onClick={() => router.back()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className={styles.topActions}>
          <button className={styles.actionBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <button className={styles.actionBtn} onClick={toggleLike} aria-label={liked ? "Unlike" : "Like"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "#e50914" : "none"} stroke={liked ? "#e50914" : "currentColor"} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button className={styles.actionBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Info card */}
      <div className={styles.infoCard}>

        {/* TV: poster + title side by side like reference */}
        {mediaType === "tv" ? (
          <div className={styles.tvHeader}>
            {posterUrl && (
              <div className={styles.tvPosterThumb}>
                <Image src={posterUrl} alt={title} width={90} height={130} className={styles.tvPosterImg} />
              </div>
            )}
            <div className={styles.tvHeaderInfo}>
              <div className={styles.tvBadges}>
                {details.content_ratings?.results?.find((r) => r.iso_3166_1 === "US")?.rating && (
                  <span className={styles.badge}>{details.content_ratings.results.find((r) => r.iso_3166_1 === "US").rating}</span>
                )}
                <span className={styles.badge}>HD</span>
                <span className={styles.badge}>4K</span>
              </div>
              <h1 className={styles.title}>{title}</h1>
              {year && <p className={styles.tvYear}>{new Date(details.first_air_date).toLocaleString("en-US", { month: "short", year: "numeric" })}</p>}
            </div>
          </div>
        ) : (
          <>
            <div className={styles.hdBadge}>HD</div>
            <h1 className={styles.title}>{title}</h1>
          </>
        )}

        {/* Movie only: genres + meta */}
        {mediaType !== "tv" && (
          <>
            {genres && <p className={styles.genres}>{genres}</p>}
            <div className={styles.meta}>
              {rating && rating !== "0.0" && (
                <span className={styles.rating}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffd700">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                  {rating}
                </span>
              )}
              {year && <span className={styles.dot}>·</span>}
              {year && <span>{year}</span>}
              {runtime && <span className={styles.dot}>·</span>}
              {runtime && <span>{runtime}</span>}
            </div>
          </>
        )}

        {overview && mediaType !== "tv" && (
          <p className={styles.overview}>
            {expanded ? overview : shortOverview}
            {overview.length > 120 && (
              <button className={styles.moreBtn} onClick={() => setExpanded((e) => !e)}>
                {expanded ? " less" : " more"}
              </button>
            )}
          </p>
        )}

        {/* Movie buttons */}
        {mediaType !== "tv" && (
          <div className={styles.buttons}>
            <button className={styles.watchBtn} onClick={() => handleWatch()}>Watch now</button>
            <button className={styles.trailerBtn} onClick={() => handleWatch()}>Trailer</button>
          </div>
        )}

        {/* TV: season selector + episode list */}
        {mediaType === "tv" && (
          <>
            {/* Season dropdown */}
            <div className={styles.seasonDropdownWrap}>
              <button className={styles.seasonDropdown} onClick={() => setSeasonOpen((o) => !o)}>
                <span>Season {selectedSeason}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ transform: seasonOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {seasonOpen && (
                <div className={styles.seasonMenu}>
                  {seasons.map((s) => (
                    <button
                      key={s.id}
                      className={`${styles.seasonMenuItem} ${selectedSeason === s.season_number ? styles.seasonMenuItemActive : ""}`}
                      onClick={() => { setSelectedSeason(s.season_number); setSeasonOpen(false); }}
                    >
                      Season {s.season_number}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Episode list */}
            <div className={styles.episodeList}>
              {seasonDetails?.episodes?.map((ep) => {
                const watched = watchedEpisodes.has(ep.episode_number);
                return (
                  <button
                    key={ep.id}
                    className={styles.episodeRow}
                    onClick={() => handleWatch(ep.episode_number)}
                  >
                    <div className={styles.episodeInfo}>
                      <span className={styles.episodeNum}>Episode {ep.episode_number}</span>
                      <span className={styles.episodeName}>{ep.name}</span>
                    </div>
                    <div className={styles.episodeMeta}>
                      {ep.runtime && (
                        <span className={styles.episodeRuntime}>{ep.runtime} min</span>
                      )}
                      {watched && (
                        <span className={styles.watchedDot} title="Watched">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#46d369" strokeWidth="2.5">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
