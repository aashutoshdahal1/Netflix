"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import styles from "./Player.module.css";

export default function PlayerClient() {
  const { type, id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mediaType = type || "movie";

  const [details, setDetails] = useState(null);
  const [selectedSeason] = useState(Number(searchParams.get("season")) || 1);
  const [selectedEpisode] = useState(Number(searchParams.get("episode")) || 1);
  const [loading, setLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  const iframeRef = useRef();
  const hideTimer = useRef();

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


  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3500);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimer.current);
  }, [resetHideTimer]);

  // Save watched episode to localStorage when TV episode starts
  useEffect(() => {
    if (mediaType !== "tv") return;
    try {
      const key = `watchio_watched_${id}`;
      const all = JSON.parse(localStorage.getItem(key) || "{}");
      const eps = new Set(all[selectedSeason] ?? []);
      eps.add(selectedEpisode);
      all[selectedSeason] = Array.from(eps);
      localStorage.setItem(key, JSON.stringify(all));
    } catch {}
  }, [id, mediaType, selectedSeason, selectedEpisode]);

  // Block popup ads from the iframe
  useEffect(() => {
    const origOpen = window.open;
    window.open = function (url, ...args) {
      try {
        if (url) {
          const u = new URL(url, location.href);
          if (u.origin !== location.origin) return null;
        }
      } catch { return null; }
      return origOpen.apply(this, [url, ...args]);
    };
    return () => { window.open = origOpen; };
  }, []);

  const getVideoUrl = () => {
    const encoded = process.env.NEXT_PUBLIC_VIDEO_SOURCE;
    if (!encoded) return "about:blank";
    let baseUrl;
    try { baseUrl = atob(encoded); } catch { return "about:blank"; }
    return mediaType === "tv"
      ? `${baseUrl}/tv?tmdb=${id}&season=${selectedSeason}&episode=${selectedEpisode}`
      : `${baseUrl}/movie?tmdb=${id}`;
  };

  const handleFullscreen = () => {
    const el = iframeRef.current;
    if (!el) return;
    (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen)?.call(el);
  };

  const title = details?.title || details?.name || "";
  const year = (details?.release_date || details?.first_air_date || "").slice(0, 4);
  const rating = details?.vote_average?.toFixed(1);
  const runtime = details?.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;
  const genres = details?.genres?.slice(0, 3).map((g) => g.name) ?? [];
  const overview = details?.overview;
  const backdropUrl = details?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : null;

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className={styles.player} onMouseMove={resetHideTimer} onTouchStart={resetHideTimer}>

      {/* Mobile-only permanent back button */}
      <button className={styles.mobileBackBtn} onClick={() => router.back()} aria-label="Go back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
      </button>

      {/* Top bar */}
      <div className={`${styles.topBar} ${controlsVisible ? styles.visible : ""}`}>
        <button className={styles.backBtn} onClick={() => router.back()} title="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span>Back</span>
        </button>

        <div className={styles.topTitle}>
          {title}
        </div>

        <div className={styles.topActions}>
          <button
            className={styles.iconBtn}
            onClick={() => setInfoOpen((o) => !o)}
            title="More info"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
            </svg>
          </button>
          <button className={styles.iconBtn} onClick={handleFullscreen} title="Fullscreen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Video */}
      <iframe
        ref={iframeRef}
        key={`${mediaType}-${id}-${selectedSeason}-${selectedEpisode}`}
        src={getVideoUrl()}
        title={title || "player"}
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        referrerPolicy="no-referrer"
        className={styles.playerIframe}
        style={{ pointerEvents: infoOpen ? "none" : "auto" }}
      />
      {/* Cover the embed's title bar overlay */}
      <div className={styles.iframeTitleCover} />


      {/* Info panel */}
      {infoOpen && (
        <div className={styles.infoPanel}>
          {backdropUrl && (
            <Image
              src={backdropUrl}
              alt={title}
              fill
              className={styles.infoBg}
              sizes="400px"
            />
          )}
          <div className={styles.infoBgOverlay} />
          <button className={styles.infoPanelClose} onClick={() => setInfoOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <div className={styles.infoPanelContent}>
            <h2 className={styles.infoPanelTitle}>{title}</h2>
            <div className={styles.infoPanelMeta}>
              {year && <span className={styles.metaGreen}>{year}</span>}
              {rating && (
                <span className={styles.metaRating}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffd700">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                  {rating}
                </span>
              )}
              {runtime && <span>{runtime}</span>}
            </div>
            {genres.length > 0 && (
              <div className={styles.genreTags}>
                {genres.map((g) => <span key={g} className={styles.genreTag}>{g}</span>)}
              </div>
            )}
            {overview && <p className={styles.infoPanelOverview}>{overview}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
