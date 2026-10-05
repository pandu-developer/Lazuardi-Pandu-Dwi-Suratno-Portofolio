// =====================================================================
//  Content store. Uses Postgres when DATABASE_URL is set (production),
//  otherwise a local JSON file (development) so it works out of the box.
// =====================================================================
import { promises as fs } from "fs";
import path from "path";
import { DEFAULT_CONTENT, SiteContent } from "./content";

const FILE = path.join(process.cwd(), "data", "content.json");

// Accept whichever name the host/integration provides (Vercel Postgres, Neon,
// and Supabase differ): DATABASE_URL, POSTGRES_URL, or the Prisma/non-pooling
// variants. Whatever you paste manually, put it in DATABASE_URL.
const CONN =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  "";
const usePg = !!CONN;

/** Deep-merge stored content over defaults so new fields never break. */
function merge(base: any, over: any): any {
  if (over === null || over === undefined) return base;
  if (Array.isArray(base)) return Array.isArray(over) ? over : base;
  if (typeof base === "object") {
    const out: any = { ...base };
    for (const k of Object.keys(over)) out[k] = k in base ? merge(base[k], over[k]) : over[k];
    return out;
  }
  return over;
}

/* ---------------- Postgres adapter (production) ---------------- */
let _pool: any = null;
async function pool() {
  if (!_pool) {
    const { Pool } = await import("pg");
    _pool = new Pool({
      connectionString: CONN,
      ssl: process.env.PGSSL === "disable" ? false : { rejectUnauthorized: false },
    });
    await _pool.query("CREATE TABLE IF NOT EXISTS site_content (id int PRIMARY KEY, data jsonb NOT NULL)");
  }
  return _pool;
}
async function pgGet(): Promise<SiteContent> {
  const p = await pool();
  const r = await p.query("SELECT data FROM site_content WHERE id = 1");
  if (r.rows.length === 0) {
    await p.query("INSERT INTO site_content (id, data) VALUES (1, $1::jsonb) ON CONFLICT (id) DO NOTHING", [JSON.stringify(DEFAULT_CONTENT)]);
    return DEFAULT_CONTENT;
  }
  return merge(DEFAULT_CONTENT, r.rows[0].data) as SiteContent;
}
async function pgSave(data: SiteContent) {
  const p = await pool();
  await p.query("INSERT INTO site_content (id, data) VALUES (1, $1::jsonb) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data", [JSON.stringify(data)]);
}

/* ---------------- File adapter (development) ---------------- */
async function fileGet(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return merge(DEFAULT_CONTENT, JSON.parse(raw)) as SiteContent;
  } catch {
    return DEFAULT_CONTENT;
  }
}
async function fileSave(data: SiteContent) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function getContent(): Promise<SiteContent> {
  return usePg ? pgGet() : fileGet();
}
export async function saveContent(data: SiteContent): Promise<void> {
  return usePg ? pgSave(data) : fileSave(data);
}
