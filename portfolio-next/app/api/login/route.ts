import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { adminPassword, authConfigError, createToken, COOKIE } from "@/lib/auth";

const sha256 = (s: string) => createHash("sha256").update(s).digest();

export async function POST(req: Request) {
  const configError = authConfigError();
  if (configError) {
    return NextResponse.json({ ok: false, error: `Admin belum dikonfigurasi: ${configError}` }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const password = (body?.password ?? "").toString();
  const expected = adminPassword() ?? "";
  // Constant-time compare; a short delay on failure slows down guessing.
  if (!password || !expected || !timingSafeEqual(sha256(password), sha256(expected))) {
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ ok: false, error: "Passcode salah." }, { status: 401 });
  }
  const token = await createToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
