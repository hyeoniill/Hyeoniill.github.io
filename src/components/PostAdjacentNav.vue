<script setup>
import { computed } from "vue";
import { getAdjacentPosts, getPostBySlug, toPlainPreview } from "@/lib/posts";

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
});

const currentPost = computed(() => getPostBySlug(props.slug));
const adjacent = computed(() => getAdjacentPosts(props.slug));
const previousPost = computed(() => adjacent.value.previous);
const nextPost = computed(() => adjacent.value.next);

const hasAnyAdjacent = computed(
  () => Boolean(previousPost.value) || Boolean(nextPost.value),
);

function excerpt(post) {
  if (!post) return "";
  return toPlainPreview(post.content, 120);
}

function labelFor(direction) {
  return direction === "previous" ? "이전" : "다음";
}
</script>

<template>
  <section
    v-if="hasAnyAdjacent && currentPost"
    class="post-adjacent"
    aria-label="이전 다음 포스트"
  >
    <div class="post-adjacent__grid">
      <router-link
        v-if="previousPost"
        class="post-adjacent__card"
        :to="{ name: 'post', params: { slug: previousPost.slug } }"
      >
        <p class="post-adjacent__label">{{ labelFor("previous") }}</p>
        <h3 class="post-adjacent__name">{{ previousPost.title }}</h3>
        <p class="post-adjacent__excerpt">{{ excerpt(previousPost) }}</p>
      </router-link>
      <div v-else class="post-adjacent__card is-empty" aria-hidden="true" />

      <router-link
        v-if="nextPost"
        class="post-adjacent__card"
        :to="{ name: 'post', params: { slug: nextPost.slug } }"
      >
        <p class="post-adjacent__label">{{ labelFor("next") }}</p>
        <h3 class="post-adjacent__name">{{ nextPost.title }}</h3>
        <p class="post-adjacent__excerpt">{{ excerpt(nextPost) }}</p>
      </router-link>
      <div v-else class="post-adjacent__card is-empty" aria-hidden="true" />
    </div>
  </section>
</template>

<style scoped>
.post-adjacent {
  margin-top: clamp(1.5rem, 4vw, 2.3rem);
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.post-adjacent__title {
  margin: 0 0 0.8rem;
  font-size: 1rem;
}

.post-adjacent__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.7rem;
}

@media (min-width: 768px) {
  .post-adjacent__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.post-adjacent__card {
  display: block;
  min-height: 7.4rem;
  padding: 0.9rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--surface-elevated) 28%, transparent);
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    transform 0.15s ease;
}

.post-adjacent__card:hover {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
  background: color-mix(in srgb, var(--accent) 8%, var(--surface-elevated));
  transform: translateY(-1px);
}

.post-adjacent__card.is-empty {
  visibility: hidden;
  pointer-events: none;
}

.post-adjacent__label {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.post-adjacent__name {
  margin: 0.35rem 0 0.4rem;
  font-size: 0.95rem;
  line-height: 1.35;
}

.post-adjacent__excerpt {
  margin: 0;
  font-size: 0.82rem;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
