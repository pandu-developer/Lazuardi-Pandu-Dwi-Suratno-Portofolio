import { getContent } from "@/lib/store";
import { DEFAULT_CONTENT } from "@/lib/content";
import Portfolio from "@/components/Portfolio";

// Always render fresh content so admin edits appear immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  // If the database is unreachable, keep the site up with the default content.
  const content = await getContent().catch((e) => {
    console.error("[home] content load failed, showing defaults:", e);
    return DEFAULT_CONTENT;
  });
  return <Portfolio content={content} />;
}
