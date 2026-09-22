import { fetchTMDB, slugToIdAndType } from "../../../../lib/tmdb";
import EndingExplainedContent from "../../../components/content/EndingExplainedContent";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { id } = slugToIdAndType(slug);
  try {
    const content = await fetchTMDB(`/tv/${id}?language=en-US`);
    const year = content.first_air_date?.split("-")[0];
    return {
      title: `${content.name} (${year}) Ending Explained - Analysis & Theories`,
      description: `Detailed breakdown of ${content.name} (${year}) ending. Contains spoilers.`,
      alternates: { canonical: `https://fmovies.in.net/series/${slug}/ending-explained` },
    };
  } catch {
    return { title: "Ending Explained | Watchio" };
  }
}

export default async function SeriesEndingPage({ params }) {
  const { slug } = await params;
  const { id } = slugToIdAndType(slug);
  const result = await fetchTMDB(`/tv/${id}?language=en-US`).catch(() => null);
  return (
    <EndingExplainedContent
      slug={slug}
      contentType="tv"
      urlPrefix="series"
      content={result}
    />
  );
}
