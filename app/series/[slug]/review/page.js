import { fetchTMDB, slugToIdAndType, TMDB_IMG } from "../../../../lib/tmdb";
import ReviewPage from "../../../components/content/ReviewPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { id } = slugToIdAndType(slug);
  const contentType = "tv";
  try {
    const content = await fetchTMDB(`/${contentType}/${id}?language=en-US`);
    const title = content.name;
    const year = content.first_air_date?.split("-")[0];
    return {
      title: `${title} (${year}) Review - Cast, Plot & Analysis`,
      description: `Read our comprehensive review of ${title} (${year}). Discover the plot, cast performances, and whether it's worth your time.`,
      openGraph: {
        type: "article",
        images: content.backdrop_path ? [`${TMDB_IMG}/original${content.backdrop_path}`] : [],
      },
      alternates: { canonical: `https://fmovies.in.net/series/${slug}/review` },
    };
  } catch {
    return { title: "Series Review | Watchio" };
  }
}

export default async function SeriesReviewPage({ params }) {
  const { slug } = await params;
  const { id } = slugToIdAndType(slug);
  const contentType = "tv";

  const [content, credits, similar] = await Promise.allSettled([
    fetchTMDB(`/${contentType}/${id}?language=en-US`),
    fetchTMDB(`/${contentType}/${id}/credits?language=en-US`),
    fetchTMDB(`/${contentType}/${id}/similar?language=en-US&page=1`),
  ]);

  return (
    <ReviewPage
      slug={slug}
      contentType={contentType}
      urlPrefix="series"
      content={content.status === "fulfilled" ? content.value : null}
      credits={credits.status === "fulfilled" ? credits.value : null}
      similar={similar.status === "fulfilled" ? similar.value?.results?.slice(0, 6) : []}
    />
  );
}
