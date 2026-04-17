import yaml from "js-yaml";

/** Rolldown/Vite 8에서는 `as: "raw"` 대신 `?raw`가 안전합니다. */
const rawModules = import.meta.glob("../assets/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

/**
 * 포스트용 이미지는 `src/assets/img/post_image/**`에 두고,
 * 마크다운에서는 Jekyll 방식의 절대 경로(`/assets/img/post_image/...`)로 참조합니다.
 * 번들러가 해시가 포함된 URL로 바꿀 수 있도록 매핑을 만들어 둡니다.
 */
const imageModules = import.meta.glob(
  "../assets/img/post_image/**/*.{png,jpg,jpeg,gif,webp,svg,avif}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

const imageUrlMap = new Map();
for (const [filePath, url] of Object.entries(imageModules)) {
  // '../assets/img/post_image/2025-03-11/foo.png' -> '/assets/img/post_image/2025-03-11/foo.png'
  const key = filePath.replace(/^\.\.\/assets/, "/assets");
  imageUrlMap.set(key, url);
}

/**
 * 본문에서 `![alt](/assets/...)` 형태의 절대 경로를 Vite가 만든
 * 실제 에셋 URL로 바꾸고, kramdown 전용 속성 블록(`{: ... }`)은 제거합니다.
 */
function rewritePostContent(content) {
  const withResolvedImages = content.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g,
    (match, alt, href, title) => {
      const resolved = imageUrlMap.get(href);
      if (!resolved) return match;
      return `![${alt}](${resolved}${title ?? ""})`;
    },
  );
  return withResolvedImages.replace(/\s*\{:[^}]*\}/g, "");
}

function moduleString(mod) {
  if (typeof mod === "string") return mod;
  return mod?.default ?? "";
}

/**
 * Jekyll 스타일 YAML 프론트매터만 파싱합니다. (gray-matter 대체)
 */
function splitFrontmatter(raw) {
  const trimmed = raw.replace(/^\uFEFF/, "");
  if (!trimmed.startsWith("---")) {
    return { data: {}, content: trimmed };
  }
  const afterOpen = trimmed.slice(3).replace(/^\r?\n/, "");
  const close = afterOpen.search(/\r?\n---(\r?\n|$)/);
  if (close === -1) {
    return { data: {}, content: trimmed };
  }
  const fmBlock = afterOpen.slice(0, close);
  const body = afterOpen.slice(close).replace(/^\r?\n---\r?\n?/, "");
  let data = {};
  try {
    data = yaml.load(fmBlock, { schema: yaml.DEFAULT_SCHEMA }) || {};
  } catch {
    data = {};
  }
  return { data, content: body };
}

function pathToSlug(filePath) {
  const name = filePath.split("/").pop() || "";
  return name.replace(/\.md$/i, "");
}

function parseSortDate(data, slug) {
  const raw = data.date ?? data.last_modified_at ?? "";
  const fromMeta = new Date(raw).getTime();
  if (!Number.isNaN(fromMeta)) return fromMeta;
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(slug);
  if (m) return new Date(m[1]).getTime();
  return 0;
}

function normalizePost(filePath, raw) {
  const slug = pathToSlug(filePath);
  const { data, content } = splitFrontmatter(raw);
  const title =
    typeof data.title === "string" && data.title.trim()
      ? data.title.trim()
      : slug;
  return {
    slug,
    title,
    data,
    content: rewritePostContent(content),
    sortTime: parseSortDate(data, slug),
  };
}

const allPosts = Object.entries(rawModules).map(([path, mod]) =>
  normalizePost(path, moduleString(mod)),
);

allPosts.sort((a, b) => b.sortTime - a.sortTime);

const bySlug = new Map(allPosts.map((p) => [p.slug, p]));

export function getAllPosts() {
  return allPosts;
}

export function getPostBySlug(slug) {
  if (!slug) return null;
  return bySlug.get(slug) ?? null;
}
