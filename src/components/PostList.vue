<script setup>
import { computed } from "vue";
import { getAllPosts } from "@/lib/posts";

const posts = computed(() => getAllPosts());

function excerpt(content, max = 160) {
  const t = content.replace(/^---[\s\S]*?---\s*/, "").trim();
  const plain = t.replace(/[#>*`_~\[\]()]/g, " ").replace(/\s+/g, " ");
  return plain.length <= max ? plain : `${plain.slice(0, max)}…`;
}
</script>

<template>
  <section class="post-list" aria-label="게시글 목록">
    <ul class="post-cards">
      <li v-for="p in posts" :key="p.slug">
        <router-link :to="{ name: 'post', params: { slug: p.slug } }" class="card-link">
          <span class="card-title">{{ p.title }}</span>
          <span class="card-excerpt">{{ excerpt(p.content) }}</span>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.post-cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.card-link {
  display: block;
  padding: 1rem 1.15rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--surface-elevated) 40%, transparent);
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.card-link:hover {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
  background: color-mix(in srgb, var(--accent) 8%, var(--surface-elevated));
}

.card-title {
  display: block;
  font-weight: 600;
  font-size: 1.02rem;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 0.35rem;
}

.card-excerpt {
  display: block;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--text-muted);
}
</style>
