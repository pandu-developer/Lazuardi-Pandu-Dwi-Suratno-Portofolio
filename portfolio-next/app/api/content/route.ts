import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getContent, saveContent } from "@/lib/store";
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
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let data: SiteContent;
  try {
    data = (await req.json()) as SiteContent;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad JSON" }, { status: 400 });
  }
  if (!data || typeof data !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid content" }, { status: 400 });
  }
  await saveContent(data);
  return NextResponse.json({ ok: true });
}
