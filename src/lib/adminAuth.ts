import { createHmac } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "thoughtscape_admin";

// The cookie stores an HMAC of the admin password rather than a fixed
// marker: the source code is public, so a constant cookie value would be
// forgeable by anyone reading it. Deriving it from the (secret) password
// keeps the whole gate env-only. Changing ADMIN_PASSWORD invalidates all
// existing sessions, which is what you'd want anyway.
export function adminToken(): string {
  return createHmac("sha256", "thoughtscape-admin-cookie-v1")
    .update(process.env.ADMIN_PASSWORD ?? "")
    .digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!value && value === adminToken();
}
