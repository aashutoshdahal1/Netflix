import Link from "next/link";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { TMDB_IMG } from "../../../lib/tmdb";
import styles from "./ContentPages.module.css";

export default function EndingExplainedContent({ slug, contentType, urlPrefix, content }) {
  const prefix = urlPrefix || contentType;
  if (!content) return <div className={styles.error}>Content not found</div>;

  const title = content.title || content.name;
  const releaseYear = (content.release_date || content.first_air_date)?.split("-")[0];
  const backdropUrl = content.backdrop_path ? `${TMDB_IMG}/original${content.backdrop_path}` : null;

  return (
    <div className={styles.contentPage}>
      <Navbar />
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1>{title} ({releaseYear}) - Ending Explained</h1>
          <Link href={`/${prefix}/${slug}/review`} className={styles.backLink}>← Back to Review</Link>
        </div>

        <div className={styles.spoilerWarning}>
          ⚠️ SPOILER WARNING: This article contains major spoilers for {title}
        </div>

        <div>
          <section className={styles.contentSection}>
            <h2>Overview</h2>
            <p>{content.overview}</p>
            <p>
              {title} has captivated audiences with its{" "}
              {content.genres?.map((g) => g.name.toLowerCase()).join(" and ")} storytelling.
              The ending has sparked numerous discussions among viewers. We break down the conclusion
              and explore what it all means.
            </p>
          </section>

          <section className={styles.contentSection}>
            <h2>The Final Act</h2>
            <p>
              The conclusion of {title} brings together various narrative threads established throughout the{" "}
              {contentType === "movie" ? "film" : "series"}. The final sequences serve to resolve character arcs
              and thematic elements.
            </p>
            <p>
              The choices made by the characters reflect the central themes of{" "}
              {content.genres?.map((g) => g.name.toLowerCase()).join(", ")}, providing resolution
              while leaving room for interpretation.
            </p>
          </section>

          <section className={styles.contentSection}>
            <h2>Fan Theories &amp; Interpretations</h2>
            <p>
              Since its release{releaseYear ? ` in ${releaseYear}` : ""}, {title} has generated various
              interpretations about what the ending truly means.
            </p>
            <div className={styles.theoryCard}>
              <h3>Theory 1: Literal Interpretation</h3>
              <p>
                The most straightforward reading takes events at face value — what we see is exactly what
                happened, with no hidden meanings.
              </p>
            </div>
            <div className={styles.theoryCard}>
              <h3>Theory 2: Symbolic Reading</h3>
              <p>
                A more metaphorical approach suggests that the ending represents larger themes rather than
                literal events, emphasising emotional truth over plot specifics.
              </p>
            </div>
            <div className={styles.theoryCard}>
              <h3>Theory 3: Open-Ended Conclusion</h3>
              <p>
                Some viewers appreciate that the ending leaves certain questions unanswered, allowing for
                personal interpretation.
              </p>
            </div>
          </section>

          <section className={styles.contentSection}>
            <h2>What It All Means</h2>
            <p>
              With a rating of <strong>{content.vote_average?.toFixed(1)}/10</strong> from{" "}
              {content.vote_count?.toLocaleString()} viewers, {title} has clearly resonated with audiences,
              and its ending plays a significant role in that reception.
            </p>
          </section>

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
              <Link href={`/${prefix}/${slug}/similar`} className={styles.relatedCard}>
                <span className={styles.icon}>🎬</span>
                <h3>Similar Content</h3>
                <p>Find related {contentType === "movie" ? "movies" : "shows"}</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
