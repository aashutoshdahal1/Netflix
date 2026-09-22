"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import TitleCards from "../components/TitleCards/TitleCards";
import BottomNav from "../components/BottomNav/BottomNav";
import styles from "./Home.module.css";

export default function HomeClient({ trending }) {
  const router = useRouter();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (trending.length) {
      setHeroIndex(Math.floor(Math.random() * Math.min(10, trending.length)));
    }
  }, [trending]);

  const heroMovie = useMemo(() => {
    if (!trending.length) return null;
    return trending[heroIndex];
  }, [trending, heroIndex]);

  const handlePlay = () => {
    if (!heroMovie) return;
    router.push(`/detail/${heroMovie.media_type || "movie"}/${heroMovie.id}`);
  };

  const year = (heroMovie?.release_date || heroMovie?.first_air_date || "").slice(0, 4);
  const genres = heroMovie?.genre_ids?.slice(0, 2) ?? [];
  const rating = heroMovie?.vote_average?.toFixed(1);

  return (
    <div className={styles.home}>
      <Navbar />

      <div className={styles.hero}>
        {heroMovie ? (
          <>
            {heroMovie.backdrop_path && (
              <Image
                src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
                alt={heroMovie.title || heroMovie.name || "hero"}
                fill
                priority
                className={styles.bannerImg}
                sizes="100vw"
              />
            )}
            <div className={styles.heroGradient} />

            <div className={styles.heroCaption}>
              {/* Desktop: show logo/poster image */}
              <Image
                src={
                  heroMovie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${heroMovie.poster_path}`
                    : `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`
                }
                alt={heroMovie.title || heroMovie.name || "poster"}
                width={420}
                height={150}
                className={styles.captionImg}
                unoptimized
              />

              {/* Mobile: show title text */}
              <h2 className={styles.heroTitle}>{heroMovie.title || heroMovie.name}</h2>

              {/* Meta row: rating · genre · year */}
              <div className={styles.heroMeta}>
                {rating && (
                  <span className={styles.metaRating}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffd700">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                    {rating}
                  </span>
                )}
                {heroMovie.media_type === "tv" ? (
                  <span className={styles.metaChip}>TV Series</span>
                ) : (
                  <span className={styles.metaChip}>Movie</span>
                )}
                {year && <span className={styles.metaYear}>{year}</span>}
              </div>

              <p className={styles.heroDesc}>{heroMovie.overview || "No description available."}</p>

              <div className={styles.heroBtns}>
                <button className={styles.btnPlay} onClick={handlePlay}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                  Watch now
                </button>
                <button className={styles.btnAdd} onClick={handlePlay} title="More info">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.heroSkeleton}>
            <div className={styles.skeletonPulse} />
            <div className={styles.heroSkeletonCaption}>
              <div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
              <div className={`${styles.skeletonBlock} ${styles.skeletonMeta}`} />
              <div className={`${styles.skeletonBlock} ${styles.skeletonDesc}`} />
              <div className={styles.skeletonBtns}>
                <div className={`${styles.skeletonBlock} ${styles.skeletonBtn}`} />
                <div className={`${styles.skeletonBlock} ${styles.skeletonBtnSm}`} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.moreCards}>
        <TitleCards title="Popular on Watchio" category="now_playing" />
        <TitleCards title="Blockbuster Movies" category="top_rated" />
        <TitleCards title="Only on Watchio" category="popular" />
        <TitleCards title="Upcoming" category="upcoming" />
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}
