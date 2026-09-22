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

  // Save to recently watched in localStorage
  useEffect(() => {
    if (!details) return;
    try {
      const key = "watchio_library";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const entry = {
        id: details.id,
        type: mediaType,
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

  // Sync liked state from localStorage once details load
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
        id: details.id,
        type: mediaType,
        title: details.title || details.name,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        vote_average: details.vote_average,
        release_date: details.release_date || details.first_air_date,
      };
      const exists = favs.some((f) => f.id === entry.id && f.type === mediaType);
      const updated = exists
        ? favs.filter((f) => !(f.id === entry.id && f.type === mediaType))
        : [entry, ...favs];
      localStorage.setItem(key, JSON.stringify(updated));
      setLiked(!exists);
    } catch {}
  };

  const handleWatch = () => router.push(`/player/${mediaType}/${id}`);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!details) return null;

  const title = details.title || details.name || "";
  const genres = details.genres?.map((g) => g.name).join(", ") || "";
  const rating = details.vote_average?.toFixed(1);
  const year = (details.release_date || details.first_air_date || "").slice(0, 4);
  const runtime = details.runtime
    ? `${details.runtime} min`
    : details.episode_run_time?.[0]
    ? `${details.episode_run_time[0]} min`
    : null;
  const overview = details.overview || "";
  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/original${details.poster_path}`
    : details.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : null;

  const shortOverview = overview.length > 120 ? overview.slice(0, 120) + "…" : overview;

  return (
    <div className={styles.page}>
      {/* Full-screen poster */}
      <div className={styles.posterWrap}>
        {posterUrl && (
          <Image
            src={posterUrl}
            alt={title}
            fill
            priority
            className={styles.poster}
            sizes="100vw"
          />
        )}
        <div className={styles.posterGradient} />

        {/* Back button */}
        <button className={styles.backBtn} onClick={() => router.back()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Action buttons top-right */}
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
        <div className={styles.hdBadge}>HD</div>
        <h1 className={styles.title}>{title}</h1>
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

        {overview && (
          <p className={styles.overview}>
            {expanded ? overview : shortOverview}
            {overview.length > 120 && (
              <button className={styles.moreBtn} onClick={() => setExpanded((e) => !e)}>
                {expanded ? " less" : " more"}
              </button>
            )}
          </p>
        )}

        <div className={styles.buttons}>
          <button className={styles.watchBtn} onClick={handleWatch}>Watch now</button>
          <button className={styles.trailerBtn} onClick={handleWatch}>Trailer</button>
        </div>
      </div>
    </div>
  );
}
