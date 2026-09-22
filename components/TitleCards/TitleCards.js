"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./TitleCards.module.css";

export default function TitleCards({ title, category = "now_playing" }) {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardsRef = useRef();

  useEffect(() => {
    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    };
    fetch(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`,
      { headers }
    )
      .then((r) => r.json())
      .then((data) => { setApiData(data.results ?? []); setLoading(false); })
      .catch(() => setLoading(false));

    const el = cardsRef.current;
    const handleWheel = (e) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [category]);

  return (
    <div className={styles.titlecards}>
      <h2>
        {title || "Popular on Watchio"}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </h2>
      <div className={styles.cardList} ref={cardsRef}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard} />
            ))
          : apiData.map((card) => (
              <Link href={`/detail/movie/${card.id}`} className={styles.card} key={card.id}>
                {(card.poster_path || card.backdrop_path) && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${card.poster_path || card.backdrop_path}`}
                    alt={card.original_title || "movie"}
                    width={240}
                    height={135}
                    className={styles.cardImg}
                  />
                )}
                <p style={{ color: "#fff" }}>{card.original_title}</p>
              </Link>
            ))}
      </div>
    </div>
  );
}
