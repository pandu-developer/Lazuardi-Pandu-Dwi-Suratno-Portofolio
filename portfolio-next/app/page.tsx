import { getContent } from "@/lib/store";
import Portfolio from "@/components/Portfolio";

// Always render fresh content so admin edits appear immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();
  return <Portfolio content={content} />;
}
