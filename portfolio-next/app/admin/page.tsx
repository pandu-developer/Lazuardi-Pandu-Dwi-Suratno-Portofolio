import { getContent } from "@/lib/store";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await getContent();
  return <AdminDashboard initial={content} />;
}
