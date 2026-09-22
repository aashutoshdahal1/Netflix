"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./TitleCards.module.css";

export default function TitleCards({ title, category = "now_playing" }) {
  const [apiData, setApiData] = useState([]);
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
      .then((data) => setApiData(data.results ?? []))
      .catch(console.error);

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
      <h2>{title || "Popular on Watchio"}</h2>
      <div className={styles.cardList} ref={cardsRef}>
        {apiData.map((card) => (
          <Link href={`/player/movie/${card.id}`} className={styles.card} key={card.id}>
            {card.backdrop_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
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
