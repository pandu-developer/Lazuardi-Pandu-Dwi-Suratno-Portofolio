// =====================================================================
//  Minimal single-admin auth: password from env, signed JWT cookie.
//  Production fails closed: admin stays locked until ADMIN_PASSWORD and
//  SESSION_SECRET are set to real values. Dev keeps local fallbacks.
// =====================================================================
import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "admin_session";

const DEV_PASSWORD = "admin123";
const DEV_SECRET = "dev-insecure-secret-change-me";
// Public example values (repo, .env.example) — never accepted in production.
const PLACEHOLDERS = [
  DEV_PASSWORD,
  DEV_SECRET,
  "change-me",
  "use-a-long-random-string-here",
  "dev-secret-change-this-to-a-long-random-string",
];

/** Why admin login is disabled, or null when the env is configured. */
export function authConfigError(): string | null {
  if (process.env.NODE_ENV !== "production") return null;
  const pw = process.env.ADMIN_PASSWORD || "";
  const sec = process.env.SESSION_SECRET || "";
  if (pw.length < 8 || PLACEHOLDERS.includes(pw))
    return "ADMIN_PASSWORD belum diatur (min. 8 karakter, bukan contoh default).";
  if (sec.length < 32 || PLACEHOLDERS.includes(sec))
    return "SESSION_SECRET belum diatur (min. 32 karakter acak).";
  return null;
}

function secret(): Uint8Array | null {
  if (authConfigError()) return null;
  return new TextEncoder().encode(process.env.SESSION_SECRET || DEV_SECRET);
}

export function adminPassword(): string | null {
  if (authConfigError()) return null;
  return process.env.ADMIN_PASSWORD || DEV_PASSWORD;
}

export async function createToken(): Promise<string> {
  const key = secret();
  if (!key) throw new Error("Admin auth is not configured");
  return await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyToken(token?: string): Promise<boolean> {
  const key = secret();
  if (!token || !key) return false;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload.admin === true;
  } catch {
    return false;
  }
}
