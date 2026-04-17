<script setup>
import { computed } from "vue";
import { marked } from "marked";
import { getPostBySlug } from "@/lib/posts";

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
});

const post = computed(() => getPostBySlug(props.slug));

const html = computed(() => {
  if (!post.value) return "";
  return marked.parse(post.value.content, { async: false });
});

const metaLine = computed(() => {
  const p = post.value;
  if (!p) return "";
  const d = p.data.date ?? p.data.last_modified_at;
  const dateStr = d
    ? new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "medium",
      }).format(new Date(d))
    : "";
  const cats = Array.isArray(p.data.categories)
    ? p.data.categories.join(" · ")
    : "";
  return [dateStr, cats].filter(Boolean).join(" · ");
});
</script>

<template>
  <article v-if="post" class="post-article prose">
    <header class="post-header">
      <h1 class="post-title">{{ post.title }}</h1>
      <p v-if="metaLine" class="post-meta">{{ metaLine }}</p>
    </header>
    <div class="post-body" v-html="html" />
    <footer class="post-footer">
      <ul v-if="Array.isArray(post.data.tags) && post.data.tags.length" class="post-tags">
        <li v-for="tag in post.data.tags" :key="tag">{{ tag }}</li>
      </ul>
    </footer>
  </article>
  <p v-else class="post-missing">이 글을 찾을 수 없습니다.</p>
</template>

<style scoped>
.post-header {
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border);
}

.post-title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.25;
  color: var(--text);
}

.post-meta {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.5rem;
  margin: 0.85rem 0 0;
  padding: 0;
  list-style: none;
}

.post-tags li {
  font-size: 0.78rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: color-mix(in srgb, var(--text) 88%, var(--accent));
  border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
}

.post-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius);
}

.post-body :deep(table) {
  display: block;
  max-width: 100%;
  overflow-x: auto;
}

.post-missing {
  margin: 0;
  color: var(--text-muted);
}
</style>
