import Canvas from "@/components/Canvas";
import { getRecentEntries } from "@/lib/supabase/queries";

// Same page as the canvas root: the Canvas component reads the /film/<slug>
// path on mount and opens that entry's detail view directly. This route just
// needs to exist so a hard load (or refresh) of a detail link doesn't 404.
export default async function FilmPage() {
  const entries = await getRecentEntries();
  return <Canvas entries={entries} />;
}
