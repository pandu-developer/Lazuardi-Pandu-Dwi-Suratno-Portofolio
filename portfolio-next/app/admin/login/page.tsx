"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (r.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }
      const j = await r.json().catch(() => null);
      setErr(j?.error || "Passcode salah.");
    } catch {
      setErr("Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-box" onSubmit={submit}>
        <h1>Admin Panel</h1>
        <p>Masukkan passcode untuk mengedit konten portofolio.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Passcode"
          autoFocus
          autoComplete="current-password"
        />
        <p className="login-err">{err}</p>
        <button className="abtn primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
          {loading ? "…" : "Masuk"}
        </button>
      </form>
    </div>
  );
}
