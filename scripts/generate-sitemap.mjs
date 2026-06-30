/**
 * `dist/sitemap.xml` 생성. `vite build` 직후 `postbuild`에서 실행합니다.
 * 환경변수: `VITE_SITE_ORIGIN`, `VITE_BASE_PATH` (GitHub Actions와 동일)
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const postsDir = join(root, "src/assets/posts");
const distDir = join(root, "dist");

const SITE = (process.env.VITE_SITE_ORIGIN || "https://hyeoniill.github.io").replace(
  /\/$/,
  "",
);
let base = process.env.VITE_BASE_PATH || "/";
if (!base.startsWith("/")) base = `/${base}`;
const baseNorm = base === "/" ? "" : base.replace(/\/$/, "");

function siteUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!baseNorm) return `${SITE}${p}`;
  return `${SITE}${baseNorm}${p}`;
}

function extractFrontmatterDate(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    const match = content.match(/^---[\s\S]*?^---/m);
    if (!match) return null;
    const fm = match[0];
    const dateMatch = fm.match(/^last_modified_at:\s*(.+)$/m) || fm.match(/^date:\s*(.+)$/m);
    if (!dateMatch) return null;
    const raw = dateMatch[1].trim().replace(/^['"]|['"]$/g, "");
    const normalized = raw.replace(/^(\d{4}-\d{2}-\d{2})\s+/, "$1T").replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

function walkMdFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkMdFiles(p, acc);
    else if (name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

if (!existsSync(distDir)) {
  console.error("generate-sitemap: dist/ 가 없습니다. 먼저 vite build 를 실행하세요.");
  process.exit(1);
}

const files = walkMdFiles(postsDir);
const urls = [{ loc: siteUrl("/"), changefreq: "weekly", priority: "1.0" }];

for (const file of files) {
  const slug = file.split("/").pop().replace(/\.md$/i, "");
  const lastmod = extractFrontmatterDate(file);
  urls.push({
    loc: siteUrl(`/posts/${slug}`),
    lastmod,
    changefreq: "monthly",
    priority: "0.8",
  });
}

const body = urls
  .map((u) => {
    const lastmodLine = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : "";
    return `  <url>\n    <loc>${escapeXml(u.loc)}</loc>${lastmodLine}\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(join(distDir, "sitemap.xml"), xml);
console.log(`generate-sitemap: dist/sitemap.xml (${urls.length} URLs)`);
