import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase/server";

// Persists a card's new mat position after an admin drag. Writes go
// through the service-role client because RLS keeps the anon key
// read-only.
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const { id, x, y } = body ?? {};
  if (typeof id !== "string" || !Number.isFinite(x) || !Number.isFinite(y)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("media_entries")
    .update({ x, y })
    .eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
