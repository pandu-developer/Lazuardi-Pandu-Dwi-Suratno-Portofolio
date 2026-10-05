import { NextResponse } from "next/server";
import { adminPassword, createToken, COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = (body?.password ?? "").toString();
  if (!password || password !== adminPassword()) {
    return NextResponse.json({ ok: false, error: "Wrong passcode." }, { status: 401 });
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
