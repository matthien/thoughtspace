import Canvas from "@/components/Canvas";
import { getRecentEntries } from "@/lib/supabase/queries";

// Without this the homepage prerenders as static at build time and never
// reflects new syncs or re-arranged cards until the next deploy.
export const dynamic = "force-dynamic";

export default async function Home() {
  const entries = await getRecentEntries();
  return <Canvas entries={entries} />;
}
