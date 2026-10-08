import { getContent } from "@/lib/store";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await getContent().catch((e) => {
    console.error("[admin] content load failed:", e);
    return null;
  });
  if (!content) {
    return (
      <div className="login-wrap">
        <div className="login-box">
          <h1>Database error</h1>
          <p>
            Gagal terhubung ke database. Cek <code>DATABASE_URL</code> di Vercel (Settings → Environment Variables),
            lalu Redeploy.
          </p>
        </div>
      </div>
    );
  }
  return <AdminDashboard initial={content} />;
}
