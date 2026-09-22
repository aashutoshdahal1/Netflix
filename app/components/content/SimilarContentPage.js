import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { buildSlug, TMDB_IMG } from "../../../lib/tmdb";
import styles from "./ContentPages.module.css";

export default function SimilarContentPage({ slug, contentType, urlPrefix, content, similar }) {
  const prefix = urlPrefix || contentType;
  if (!content) return <div className={styles.error}>Content not found</div>;

  const title = content.title || content.name;
  const releaseYear = (content.release_date || content.first_air_date)?.split("-")[0];

  return (
    <div className={styles.contentPage}>
      <Navbar />
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1>{contentType === "movie" ? "Movies" : "TV Shows"} Similar to {title} ({releaseYear})</h1>
          <Link href={`/${prefix}/${slug}/review`} className={styles.backLink}>← Back to Review</Link>
        </div>

        <div>
          <section className={styles.contentSection}>
            <h2>If You Liked {title}...</h2>
            <p className={styles.sectionIntro}>
              Based on {content.genres?.map((g) => g.name.toLowerCase()).join(", ")} themes and style of{" "}
              {title}, here are {similar?.length || 0}{" "}
              {contentType === "movie" ? "movies" : "TV shows"} you might enjoy.
            </p>
          </section>

          {similar && similar.length > 0 ? (
            <section className={styles.contentSection}>
              <h2>Recommended for You</h2>
              <div className={styles.similarContentGrid}>
                {similar.map((item) => {
                  const itemTitle = item.title || item.name;
                  const itemSlug = buildSlug(itemTitle, item.id);
                  return (
                    <Link
                      key={item.id}
                      href={`/${prefix}/${itemSlug}/review`}
                      className={styles.similarContentItem}
                    >
                      {item.poster_path && (
                        <Image
                          src={`${TMDB_IMG}/w300${item.poster_path}`}
                          alt={itemTitle}
                          width={300}
                          height={450}
                          style={{ objectFit: "cover", borderRadius: 8, width: "100%", height: "auto" }}
                        />
                      )}
                      <h3>{itemTitle}</h3>
                      <span className={styles.ratingSmall}>⭐ {item.vote_average?.toFixed(1)}</span>
                      <p className={styles.releaseYear}>
                        {(item.release_date || item.first_air_date)?.split("-")[0]}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className={styles.contentSection}>
              <p>No similar content found at this time.</p>
            </section>
          )}

          <section className={styles.contentSection}>
            <h2>More About {title}</h2>
            <div className={styles.relatedLinks}>
              <Link href={`/${prefix}/${slug}/review`} className={styles.relatedCard}>
                <span className={styles.icon}>⭐</span>
                <h3>Full Review</h3>
                <p>Read our complete analysis</p>
              </Link>
              <Link href={`/${prefix}/${slug}/cast`} className={styles.relatedCard}>
                <span className={styles.icon}>👥</span>
                <h3>Cast &amp; Crew</h3>
                <p>Meet the talent behind it</p>
              </Link>
              <Link href={`/${prefix}/${slug}/ending-explained`} className={styles.relatedCard}>
                <span className={styles.icon}>💡</span>
                <h3>Ending Explained</h3>
                <p>Understand the conclusion</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
