"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import BottomNav from "../../../components/BottomNav/BottomNav";
import styles from "./Browse.module.css";

export default function BrowseClient({ type, category, initialContent, initialPage, title }) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  const changePage = async (newPage) => {
    setLoading(true);
    const mediaType = type === "tv" ? "tv" : "movie";
    const res = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${category}?language=en-US&page=${newPage}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        },
      }
    );
    const data = await res.json();
    setContent(data.results || []);
    setPage(newPage);
    setLoading(false);
    router.replace(`/browse/${type}?category=${category}&page=${newPage}`, { scroll: true });
  };

  return (
    <div className={styles.browsePage}>
      <Navbar />
      <div className={styles.browseContainer}>
        <h1 className={styles.browseTitle}>{title}</h1>

        {loading && <p className={styles.loading}>Loading...</p>}

        <div className={styles.browseGrid}>
          {content.map((item) => (
            <Link
              href={`/detail/${type === "tv" ? "tv" : "movie"}/${item.id}`}
              className={styles.browseCard}
              key={item.id}
            >
              {(item.poster_path || item.backdrop_path) ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.backdrop_path}`}
                  alt={item.title || item.name}
                  width={500}
                  height={750}
                  className={styles.browseCardImg}
                />
              ) : (
                <div className={styles.noImage}>No Image</div>
              )}
              <div className={styles.browseCardInfo}>
                <h3>{item.title || item.name}</h3>
                <div className={styles.browseCardMeta}>
                  <span className={styles.rating}>⭐ {item.vote_average?.toFixed(1)}</span>
                  <span className={styles.year}>
                    {(item.release_date || item.first_air_date)?.slice(0, 4)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!loading && content.length === 0 && (
          <p className={styles.noResults}>No content found.</p>
        )}

        <div className={styles.pagination}>
          <button
            onClick={() => changePage(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
            className={styles.pageBtn}
          >
            Previous
          </button>
          <span className={styles.pageNumber}>Page {page}</span>
          <button
            onClick={() => changePage(page + 1)}
            disabled={loading}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}
