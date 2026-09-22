import { fetchTMDB, slugToIdAndType } from "../../../../lib/tmdb";
import EndingExplainedContent from "../../../components/content/EndingExplainedContent";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { id, contentType } = slugToIdAndType(slug);
  try {
    const content = await fetchTMDB(`/${contentType}/${id}?language=en-US`);
    const title = content.title || content.name;
    const year = (content.release_date || content.first_air_date)?.split("-")[0];
    return {
      title: `${title} (${year}) Ending Explained - Analysis & Theories`,
      description: `Detailed breakdown of ${title} (${year}) ending. Understanding the conclusion, themes, and what it all means. Contains spoilers.`,
      alternates: { canonical: `https://fmovies.in.net/movie/${slug}/ending-explained` },
    };
  } catch {
    return { title: "Ending Explained | Watchio" };
  }
}

export default async function MovieEndingPage({ params }) {
  const { slug } = await params;
  const { id, contentType } = slugToIdAndType(slug);
  const result = await fetchTMDB(`/${contentType}/${id}?language=en-US`).catch(() => null);
  return <EndingExplainedContent slug={slug} contentType={contentType} content={result} />;
}
