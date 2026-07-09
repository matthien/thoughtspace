"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminToken } from "@/lib/adminAuth";

// Simple password gate. Per the brief this is privacy, not security —
// but the session cookie is still an unforgeable HMAC (see adminAuth.ts)
// since the source is public.
export async function login(formData: FormData) {
  const password = formData.get("password");
  if (typeof password !== "string" || password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin?error=1");
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  redirect("/admin");
}
