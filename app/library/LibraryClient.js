"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav/BottomNav";
import styles from "./Library.module.css";

const TABS = ["Recently watched", "Favorites", "Downloaded"];

export default function LibraryClient() {
  const [watched, setWatched] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  useEffect(() => {
    try {
      setWatched(JSON.parse(localStorage.getItem("watchio_library") || "[]"));
      setFavorites(JSON.parse(localStorage.getItem("watchio_favorites") || "[]"));
    } catch {}
  }, []);

  const items = activeTab === 0 ? watched : activeTab === 1 ? favorites : [];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.heading}>Library</h1>
        <button className={styles.addBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === i ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {i === 0 && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill={activeTab === 0 ? "#000" : "none"} stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
              </svg>
            )}
            {i === 1 && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            )}
            {i === 2 && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            {tab}
          </button>
        ))}
      </div>

      {/* Section title */}
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>{TABS[activeTab]}</h2>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="3" /><path d="M7 12h10M12 7v10" />
            </svg>
            <p>{activeTab === 0 ? "Movies you watch will appear here" : "Nothing here yet"}</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((item) => (
              <Link
                href={`/detail/${item.type}/${item.id}`}
                key={`${item.type}-${item.id}`}
                className={styles.card}
              >
                <div className={styles.cardImgWrap}>
                  {item.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      alt={item.title}
                      width={300}
                      height={450}
                      className={styles.cardImg}
                    />
                  ) : (
                    <div className={styles.cardFallback}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className={styles.cardTitle}>{item.title}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
