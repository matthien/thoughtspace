import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { fetchLetterboxdEntries, fetchDirector } from "@/lib/letterboxd";

// Manual sync only, triggered from the admin canvas. Upserts keyed on
// (source, source_id): existing rows get their review data refreshed
// (edited reviews propagate) but keep their hand-placed x/y; new rows
// land at a jittered position so nothing ever sits unplaced.
export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let parsed;
  try {
    parsed = await fetchLetterboxdEntries();
  } catch (e) {
    return NextResponse.json(
      { error: `feed fetch failed: ${e instanceof Error ? e.message : e}` },
      { status: 502 }
    );
  }

  const { data: existingRows, error: selectError } = await supabaseAdmin
    .from("media_entries")
    .select("source_id")
    .eq("source", "letterboxd");
  if (selectError) {
    return NextResponse.json({ error: selectError.message }, { status: 500 });
  }
  const existing = new Set((existingRows ?? []).map((r) => r.source_id));

  let inserted = 0;
  let updated = 0;

  for (const entry of parsed) {
    const common = {
      title: entry.title,
      year: entry.year,
      cover_url: entry.cover_url,
      rating: entry.rating,
      review_text: entry.review_text,
      logged_at: entry.logged_at,
      external_url: entry.external_url,
    };

    if (existing.has(entry.source_id)) {
      const { error } = await supabaseAdmin
        .from("media_entries")
        .update(common)
        .eq("source", "letterboxd")
        .eq("source_id", entry.source_id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      updated++;
    } else {
      const { error } = await supabaseAdmin.from("media_entries").insert({
        ...common,
        source: "letterboxd",
        source_id: entry.source_id,
        media_type: "movie",
        x: 200 + Math.random() * 1000,
        y: 150 + Math.random() * 550,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      inserted++;
    }
  }

  // Director backfill: the RSS has no director, so any row still missing
  // one gets it scraped from its Letterboxd film page (JSON-LD). Runs for
  // all missing rows each sync, so it self-heals; after the first big run
  // only newly-synced films need a fetch.
  const { data: missingDirector } = await supabaseAdmin
    .from("media_entries")
    .select("id, external_url")
    .eq("source", "letterboxd")
    .is("director", null)
    .not("external_url", "is", null);

  let directors = 0;
  const queue = [...(missingDirector ?? [])];
  await Promise.all(
    Array.from({ length: 5 }, async () => {
      for (let row = queue.shift(); row; row = queue.shift()) {
        const director = await fetchDirector(row.external_url as string).catch(() => null);
        if (director) {
          const { error } = await supabaseAdmin
            .from("media_entries")
            .update({ director })
            .eq("id", row.id);
          if (!error) directors++;
        }
      }
    })
  );

  return NextResponse.json({ ok: true, inserted, updated, directors });
}
