import { fetchTMDB, slugToIdAndType, TMDB_IMG } from "../../../../lib/tmdb";
import CastPageContent from "../../../components/content/CastPageContent";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { id, contentType } = slugToIdAndType(slug);
  try {
    const content = await fetchTMDB(`/${contentType}/${id}?language=en-US`);
    const title = content.title || content.name;
    const year = (content.release_date || content.first_air_date)?.split("-")[0];
    return {
      title: `${title} (${year}) Cast & Crew - Full List`,
      description: `Complete cast and crew for ${title} (${year}). All actors, directors, producers, and behind-the-scenes talent.`,
      alternates: { canonical: `https://fmovies.in.net/movie/${slug}/cast` },
    };
  } catch {
    return { title: "Cast & Crew | Watchio" };
  }
}

export default async function MovieCastPage({ params }) {
  const { slug } = await params;
  const { id, contentType } = slugToIdAndType(slug);
  const [content, credits] = await Promise.allSettled([
    fetchTMDB(`/${contentType}/${id}?language=en-US`),
    fetchTMDB(`/${contentType}/${id}/credits?language=en-US`),
  ]);
  return (
    <CastPageContent
      slug={slug}
      contentType={contentType}
      content={content.status === "fulfilled" ? content.value : null}
      credits={credits.status === "fulfilled" ? credits.value : null}
    />
  );
}
