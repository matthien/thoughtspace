import Canvas from "@/components/Canvas";
import { getRecentEntries } from "@/lib/supabase/queries";

export default async function Home() {
  const entries = await getRecentEntries();
  return <Canvas entries={entries} />;
}
