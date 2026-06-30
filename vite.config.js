import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { readdirSync, statSync } from "node:fs";

/**
 * GitHub Pages 프로젝트 사이트: `https://<user>.github.io/<repo>/`
 * 사용자 사이트(repo 이름이 `*.github.io`): 루트 `/`
 * 로컬 개발: `VITE_BASE_PATH` 미설정 시 `/`
 */
function appBase() {
  const raw = process.env.VITE_BASE_PATH;
  if (raw == null || raw === "" || raw === "/") return "/";
  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

function collectPostSlugs(dir) {
  const slugs = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) {
        slugs.push(...collectPostSlugs(full));
      } else if (entry.endsWith(".md")) {
        slugs.push(entry.replace(/\.md$/i, ""));
      }
    }
  } catch {
    // 디렉토리가 없으면 그냥 넘김
  }
  return slugs;
}

// https://vite.dev/config/
export default defineConfig({
  base: appBase(),
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssgOptions: {
    includedRoutes(paths) {
      const postsDir = path.resolve(__dirname, "src/assets/posts");
      const slugs = collectPostSlugs(postsDir);
      return paths.flatMap((p) => {
        if (p === "/posts/:slug") {
          return slugs.map((slug) => `/posts/${encodeURIComponent(slug)}`);
        }
        return [p];
      });
    },
  },
});
