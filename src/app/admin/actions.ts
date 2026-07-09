"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "@/lib/adminAuth";

// Simple password gate. Per the brief this is privacy, not security:
// the route just isn't linked anywhere and casual visitors bounce off.
export async function login(formData: FormData) {
  const password = formData.get("password");
  if (typeof password !== "string" || password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin?error=1");
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  redirect("/admin");
}
