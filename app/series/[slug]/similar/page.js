import { fetchTMDB, slugToIdAndType } from "../../../../lib/tmdb";
import SimilarContentPage from "../../../components/content/SimilarContentPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { id } = slugToIdAndType(slug);
  try {
    const content = await fetchTMDB(`/tv/${id}?language=en-US`);
    const year = content.first_air_date?.split("-")[0];
    return {
      title: `Similar to ${content.name} (${year}) - Recommendations`,
      description: `TV shows similar to ${content.name} (${year}).`,
      alternates: { canonical: `https://fmovies.in.net/series/${slug}/similar` },
    };
  } catch {
    return { title: "Similar Series | Watchio" };
  }
}

export default async function SeriesSimilarPage({ params }) {
  const { slug } = await params;
  const { id } = slugToIdAndType(slug);
  const [content, similar] = await Promise.allSettled([
    fetchTMDB(`/tv/${id}?language=en-US`),
    fetchTMDB(`/tv/${id}/similar?language=en-US&page=1`),
  ]);
  return (
    <SimilarContentPage
      slug={slug}
      contentType="tv"
      urlPrefix="series"
      content={content.status === "fulfilled" ? content.value : null}
      similar={similar.status === "fulfilled" ? similar.value?.results : []}
    />
  );
}
