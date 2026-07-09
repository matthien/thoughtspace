import { createClient } from "@supabase/supabase-js";

// Browser-safe client: uses the public anon key, subject to RLS policies.
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
