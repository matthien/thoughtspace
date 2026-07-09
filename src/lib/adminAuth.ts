import { cookies } from "next/headers";

export const ADMIN_COOKIE = "thoughtscape_admin";

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "1";
}
