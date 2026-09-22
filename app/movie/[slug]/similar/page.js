import { fetchTMDB, slugToIdAndType } from "../../../../lib/tmdb";
import SimilarContentPage from "../../../components/content/SimilarContentPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { id, contentType } = slugToIdAndType(slug);
  try {
    const content = await fetchTMDB(`/${contentType}/${id}?language=en-US`);
    const title = content.title || content.name;
    const year = (content.release_date || content.first_air_date)?.split("-")[0];
    return {
      title: `Similar to ${title} (${year}) - Recommendations`,
      description: `Movies similar to ${title} (${year}). Find recommendations based on genre, themes, and style.`,
      alternates: { canonical: `https://fmovies.in.net/movie/${slug}/similar` },
    };
  } catch {
    return { title: "Similar Movies | Watchio" };
  }
}

export default async function MovieSimilarPage({ params }) {
  const { slug } = await params;
  const { id, contentType } = slugToIdAndType(slug);
  const [content, similar] = await Promise.allSettled([
    fetchTMDB(`/${contentType}/${id}?language=en-US`),
    fetchTMDB(`/${contentType}/${id}/similar?language=en-US&page=1`),
  ]);
  return (
    <SimilarContentPage
      slug={slug}
      contentType={contentType}
      content={content.status === "fulfilled" ? content.value : null}
      similar={similar.status === "fulfilled" ? similar.value?.results : []}
    />
  );
}
