import { fetchTMDB, slugToIdAndType, TMDB_IMG } from "../../../../lib/tmdb";
import ReviewPage from "../../../components/content/ReviewPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { id, contentType } = slugToIdAndType(slug);
  try {
    const content = await fetchTMDB(`/${contentType}/${id}?language=en-US`);
    const title = content.title || content.name;
    const year = (content.release_date || content.first_air_date)?.split("-")[0];
    return {
      title: `${title} (${year}) Review - Cast, Plot & Analysis`,
      description: `Read our comprehensive review of ${title} (${year}). Discover the plot, cast performances, direction, and whether it's worth your time. ${content.overview?.substring(0, 100)}...`,
      keywords: [`${title} review`, `${title} ${year}`, `${title} analysis`, `${title} rating`, "movie review"],
      openGraph: {
        type: "article",
        images: content.backdrop_path ? [`${TMDB_IMG}/original${content.backdrop_path}`] : [],
      },
      alternates: { canonical: `https://fmovies.in.net/movie/${slug}/review` },
    };
  } catch {
    return { title: "Movie Review | Watchio" };
  }
}

export default async function MovieReviewPage({ params }) {
  const { slug } = await params;
  const { id, contentType } = slugToIdAndType(slug);

  const [content, credits, similar] = await Promise.allSettled([
    fetchTMDB(`/${contentType}/${id}?language=en-US`),
    fetchTMDB(`/${contentType}/${id}/credits?language=en-US`),
    fetchTMDB(`/${contentType}/${id}/similar?language=en-US&page=1`),
  ]);

  return (
    <ReviewPage
      slug={slug}
      contentType={contentType}
      content={content.status === "fulfilled" ? content.value : null}
      credits={credits.status === "fulfilled" ? credits.value : null}
      similar={similar.status === "fulfilled" ? similar.value?.results?.slice(0, 6) : []}
    />
  );
}
