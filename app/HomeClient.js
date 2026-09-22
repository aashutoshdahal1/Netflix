"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import TitleCards from "../components/TitleCards/TitleCards";
import styles from "./Home.module.css";
import play_icon from "../public/assets/play_icon.png";
import info_icon from "../public/assets/info_icon.png";

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
    router.push(`/player/${heroMovie.media_type || "movie"}/${heroMovie.id}`);
  };

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
            <div className={styles.heroCaption}>
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
              <p>{heroMovie.overview || "No description available."}</p>
              <div className={styles.heroBtns}>
                <button className={styles.btn} onClick={handlePlay}>
                  <Image src={play_icon} alt="play" width={25} height={25} />
                  Play
                </button>
                <button className={`${styles.btn} ${styles.darkBtn}`} onClick={handlePlay}>
                  <Image src={info_icon} alt="info" width={25} height={25} />
                  More Info
                </button>
              </div>
              <TitleCards />
            </div>
          </>
        ) : (
          <div className={styles.heroLoading}>
            <p>Loading...</p>
          </div>
        )}
      </div>
      <div className={styles.moreCards}>
        <TitleCards title="Blockbuster Movies" category="top_rated" />
        <TitleCards title="Only on Watchio" category="popular" />
        <TitleCards title="Upcoming" category="upcoming" />
        <TitleCards title="Top Picks for You" category="now_playing" />
      </div>
      <Footer />
    </div>
  );
}
