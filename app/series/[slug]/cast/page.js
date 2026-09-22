import { fetchTMDB, slugToIdAndType } from "../../../../lib/tmdb";
import CastPageContent from "../../../components/content/CastPageContent";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { id } = slugToIdAndType(slug);
  try {
    const content = await fetchTMDB(`/tv/${id}?language=en-US`);
    const year = content.first_air_date?.split("-")[0];
    return {
      title: `${content.name} (${year}) Cast & Crew - Full List`,
      description: `Complete cast and crew for ${content.name} (${year}).`,
      alternates: { canonical: `https://fmovies.in.net/series/${slug}/cast` },
    };
  } catch {
    return { title: "Cast & Crew | Watchio" };
  }
}

export default async function SeriesCastPage({ params }) {
  const { slug } = await params;
  const { id } = slugToIdAndType(slug);
  const [content, credits] = await Promise.allSettled([
    fetchTMDB(`/tv/${id}?language=en-US`),
    fetchTMDB(`/tv/${id}/credits?language=en-US`),
  ]);
  return (
    <CastPageContent
      slug={slug}
      contentType="tv"
      urlPrefix="series"
      content={content.status === "fulfilled" ? content.value : null}
      credits={credits.status === "fulfilled" ? credits.value : null}
    />
  );
}
