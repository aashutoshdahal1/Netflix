import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { buildSlug, TMDB_IMG } from "../../../lib/tmdb";
import styles from "./ContentPages.module.css";
import reviewStyles from "./ReviewPage.module.css";

export default function ReviewPage({ slug, contentType, urlPrefix, content, credits, similar }) {
  const prefix = urlPrefix || contentType;

  if (!content) {
    return <div className={styles.error}>Content not found</div>;
  }

  const title = content.title || content.name;
  const releaseYear = (content.release_date || content.first_air_date)?.split("-")[0];
  const posterUrl = content.poster_path ? `${TMDB_IMG}/w500${content.poster_path}` : null;
  const backdropUrl = content.backdrop_path ? `${TMDB_IMG}/original${content.backdrop_path}` : posterUrl;

  return (
    <div className={reviewStyles.movieReviewPage}>
      <Navbar />

      <div
        className={reviewStyles.reviewHero}
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className={reviewStyles.heroOverlay}>
          <div className={reviewStyles.heroContent}>
            <h1>{title} ({releaseYear}) - Review &amp; Analysis</h1>
            <div className={reviewStyles.metaInfo}>
              <span className={reviewStyles.rating}>⭐ {content.vote_average?.toFixed(1)}/10</span>
              <span className={reviewStyles.votes}>({content.vote_count?.toLocaleString()} votes)</span>
              {content.genres && (
                <span className={reviewStyles.genres}>
                  {content.genres.map((g) => g.name).join(", ")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={reviewStyles.reviewContainer}>
        <div className={reviewStyles.reviewContent}>
          <section className={reviewStyles.reviewSection}>
            <h2>Overview</h2>
            <p className={reviewStyles.overview}>{content.overview}</p>
            {posterUrl && (
              <Image
                src={posterUrl}
                alt={`${title} poster`}
                width={300}
                height={450}
                className={reviewStyles.contentPoster}
              />
            )}
          </section>

          <section className={reviewStyles.reviewSection}>
            <h2>Plot &amp; Story</h2>
            <p>
              {title} delivers a compelling narrative that explores various themes and character developments.
              The {contentType === "movie" ? "film" : "series"} takes viewers on a journey through{" "}
              {content.genres?.map((g) => g.name.toLowerCase()).join(" and ")} elements, creating an experience
              that resonates with audiences.
            </p>
            <p>
              The storytelling approach in {title} balances entertainment with meaningful character arcs.
              {contentType === "tv" && content.number_of_seasons && (
                ` Spanning ${content.number_of_seasons} season${content.number_of_seasons > 1 ? "s" : ""} with ${content.number_of_episodes} episodes, the series develops its narrative over time.`
              )}
            </p>
          </section>

          {credits?.cast && credits.cast.length > 0 && (
            <section className={reviewStyles.reviewSection}>
              <h2>Cast &amp; Performances</h2>
              <p>
                The ensemble cast brings depth and authenticity to their roles. Leading the cast,{" "}
                {credits.cast.slice(0, 3).map((actor, idx) => (
                  <span key={actor.id}>
                    {idx > 0 && (idx === 2 ? " and " : ", ")}
                    <strong>{actor.name}</strong> as {actor.character}
                  </span>
                ))}{" "}
                deliver compelling performances.
              </p>
              <div className={reviewStyles.castGrid}>
                {credits.cast.slice(0, 6).map((actor) => (
                  <div key={actor.id} className={reviewStyles.castMember}>
                    {actor.profile_path && (
                      <Image
                        src={`${TMDB_IMG}/w185${actor.profile_path}`}
                        alt={actor.name}
                        width={185}
                        height={278}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                    )}
                    <h3>{actor.name}</h3>
                    <p>{actor.character}</p>
                  </div>
                ))}
              </div>
              <Link href={`/${prefix}/${slug}/cast`} className={reviewStyles.linkBtn}>
                View Full Cast →
              </Link>
            </section>
          )}

          {credits?.crew && (
            <section className={reviewStyles.reviewSection}>
              <h2>Direction &amp; Production</h2>
              <p>
                {credits.crew.find((c) => c.job === "Director") && (
                  <>
                    Under the direction of{" "}
                    <strong>{credits.crew.find((c) => c.job === "Director").name}</strong>,{" "}
                  </>
                )}
                {title} showcases technical excellence and creative vision.
              </p>
            </section>
          )}

          <section className={`${reviewStyles.reviewSection} ${reviewStyles.verdict}`}>
            <h2>Final Verdict</h2>
            <p>
              <strong>{title}</strong>{" "}
              {content.vote_average >= 7 ? "stands out as" : "presents"}{" "}
              {content.vote_average >= 8 ? "an exceptional" : content.vote_average >= 7 ? "a solid" : "an interesting"}{" "}
              entry with a rating of <strong>{content.vote_average?.toFixed(1)}/10</strong> from{" "}
              {content.vote_count?.toLocaleString()} viewers.
            </p>
            <div className={reviewStyles.ratingBadge}>
              <span className={reviewStyles.score}>{content.vote_average?.toFixed(1)}</span>
              <span className={reviewStyles.max}>/10</span>
            </div>
          </section>

          {similar && similar.length > 0 && (
            <section className={reviewStyles.reviewSection}>
              <h2>Similar {contentType === "movie" ? "Movies" : "Series"} You Might Like</h2>
              <div className={reviewStyles.similarGrid}>
                {similar.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${prefix}/${buildSlug(item.title || item.name, item.id)}/review`}
                    className={reviewStyles.similarItem}
                  >
                    {item.poster_path && (
                      <Image
                        src={`${TMDB_IMG}/w300${item.poster_path}`}
                        alt={item.title || item.name}
                        width={300}
                        height={450}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                    )}
                    <h3>{item.title || item.name}</h3>
                    <span className={reviewStyles.ratingSmall}>⭐ {item.vote_average?.toFixed(1)}</span>
                  </Link>
                ))}
              </div>
              <Link href={`/${prefix}/${slug}/similar`} className={reviewStyles.linkBtn}>
                View All Similar {contentType === "movie" ? "Movies" : "Series"} →
              </Link>
            </section>
          )}

          <section className={`${reviewStyles.reviewSection} ${reviewStyles.internalLinks}`}>
            <h2>More About {title}</h2>
            <div className={reviewStyles.linksGrid}>
              <Link href={`/${prefix}/${slug}/cast`} className={reviewStyles.internalLink}>
                <span>👥</span>
                <span>Full Cast &amp; Crew</span>
              </Link>
              <Link href={`/${prefix}/${slug}/ending-explained`} className={reviewStyles.internalLink}>
                <span>💡</span>
                <span>Ending Explained</span>
              </Link>
              <Link href={`/${prefix}/${slug}/similar`} className={reviewStyles.internalLink}>
                <span>🎬</span>
                <span>Similar Content</span>
              </Link>
              <Link href="/browse/movies" className={reviewStyles.internalLink}>
                <span>🔍</span>
                <span>Browse More Movies</span>
              </Link>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
