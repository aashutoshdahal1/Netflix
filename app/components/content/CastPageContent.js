import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { TMDB_IMG } from "../../../lib/tmdb";
import styles from "./ContentPages.module.css";

const CREW_DEPTS = ["Directing", "Writing", "Production", "Camera", "Editing", "Sound", "Art", "Costume & Make-Up", "Visual Effects"];

export default function CastPageContent({ slug, contentType, urlPrefix, content, credits }) {
  const prefix = urlPrefix || contentType;

  if (!content) return <div className={styles.error}>Content not found</div>;

  const title = content.title || content.name;
  const releaseYear = (content.release_date || content.first_air_date)?.split("-")[0];

  return (
    <div className={styles.contentPage}>
      <Navbar />
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1>{title} ({releaseYear}) - Complete Cast &amp; Crew</h1>
          <Link href={`/${prefix}/${slug}/review`} className={styles.backLink}>← Back to Review</Link>
        </div>

        <div className={styles.pageContent}>
          {credits?.cast && credits.cast.length > 0 && (
            <section className={styles.contentSection}>
              <h2>Main Cast ({credits.cast.length} actors)</h2>
              <p className={styles.sectionIntro}>
                {title} features a talented ensemble cast bringing the characters to life in this{" "}
                {contentType === "movie" ? "film" : "series"}.
              </p>
              <div className={styles.castFullGrid}>
                {credits.cast.map((actor) => (
                  <div key={actor.id} className={styles.castCard}>
                    {actor.profile_path ? (
                      <Image
                        src={`${TMDB_IMG}/w185${actor.profile_path}`}
                        alt={actor.name}
                        width={185}
                        height={278}
                        style={{ objectFit: "cover", width: "100%", height: "auto" }}
                      />
                    ) : (
                      <div className={styles.noImage}>👤</div>
                    )}
                    <div className={styles.castInfo}>
                      <h3>{actor.name}</h3>
                      <p className={styles.character}>as {actor.character || "Unknown"}</p>
                      {actor.known_for_department && (
                        <span className={styles.department}>{actor.known_for_department}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {credits?.crew && credits.crew.length > 0 && (
            <section className={styles.contentSection}>
              <h2>Production Crew ({credits.crew.length} members)</h2>
              {CREW_DEPTS.map((dept) => {
                const members = credits.crew.filter((c) => c.department === dept);
                if (!members.length) return null;
                return (
                  <div key={dept} className={styles.crewDepartment}>
                    <h3>{dept}</h3>
                    <div className={styles.crewList}>
                      {members.map((person, idx) => (
                        <div key={`${person.id}-${idx}`} className={styles.crewMember}>
                          <strong>{person.name}</strong>
                          <span>{person.job}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          <section className={styles.contentSection}>
            <h2>More About {title}</h2>
            <div className={styles.relatedLinks}>
              <Link href={`/${prefix}/${slug}/review`} className={styles.relatedCard}>
                <span className={styles.icon}>⭐</span>
                <h3>Review &amp; Analysis</h3>
                <p>Read our detailed review</p>
              </Link>
              <Link href={`/${prefix}/${slug}/ending-explained`} className={styles.relatedCard}>
                <span className={styles.icon}>💡</span>
                <h3>Ending Explained</h3>
                <p>Understand the conclusion</p>
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
