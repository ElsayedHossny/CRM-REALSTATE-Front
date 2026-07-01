// lib/getToken.ts
import { cookies } from "next/headers";

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value;
}