// =====================================================================
//  Minimal single-admin auth: password from env, signed JWT cookie.
// =====================================================================
import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "admin_session";

function secret() {
  return new TextEncoder().encode(process.env.SESSION_SECRET || "dev-insecure-secret-change-me");
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export async function createToken(): Promise<string> {
  return await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifyToken(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.admin === true;
  } catch {
    return false;
  }
}
