import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getContent, saveContent, usingDatabase } from "@/lib/store";
import { verifyToken, COOKIE } from "@/lib/auth";
import type { SiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function POST(req: Request) {
  const token = cookies().get(COOKIE)?.value;
  if (!(await verifyToken(token))) {
    return NextResponse.json({ ok: false, error: "Sesi habis, silakan login ulang." }, { status: 401 });
  }
  let data: SiteContent;
  try {
    data = (await req.json()) as SiteContent;
  } catch {
    return NextResponse.json({ ok: false, error: "Data tidak valid." }, { status: 400 });
  }
  if (!data || typeof data !== "object") {
    return NextResponse.json({ ok: false, error: "Data tidak valid." }, { status: 400 });
  }
  try {
    await saveContent(data);
  } catch (e) {
    console.error("[api/content] save failed:", e);
    const error = usingDatabase()
      ? "Gagal menyimpan ke database. Cek DATABASE_URL di Vercel."
      : "Database belum terhubung. Hubungkan database di Vercel (tab Storage), lalu Redeploy.";
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
