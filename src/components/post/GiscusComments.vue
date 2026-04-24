<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  term: {
    type: String,
    required: true,
  },
});

const containerEl = ref(null);

const giscusConfig = computed(() => ({
  repo: import.meta.env.VITE_GISCUS_REPO ?? "",
  repoId: import.meta.env.VITE_GISCUS_REPO_ID ?? "",
  category: import.meta.env.VITE_GISCUS_CATEGORY ?? "General",
  categoryId: import.meta.env.VITE_GISCUS_CATEGORY_ID ?? "",
  strict: import.meta.env.VITE_GISCUS_STRICT ?? "0",
  reactionsEnabled: import.meta.env.VITE_GISCUS_REACTIONS_ENABLED ?? "1",
  inputPosition: import.meta.env.VITE_GISCUS_INPUT_POSITION ?? "top",
  theme: import.meta.env.VITE_GISCUS_THEME ?? "dark_dimmed",
}));

const isConfigured = computed(
  () =>
    Boolean(giscusConfig.value.repo) &&
    Boolean(giscusConfig.value.repoId) &&
    Boolean(giscusConfig.value.categoryId),
);

function clearWidget() {
  if (!containerEl.value) return;
  containerEl.value.innerHTML = "";
}

function renderWidget() {
  if (!isConfigured.value || !containerEl.value) return;
  clearWidget();

  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";

  script.setAttribute("data-repo", giscusConfig.value.repo);
  script.setAttribute("data-repo-id", giscusConfig.value.repoId);
  script.setAttribute("data-category", giscusConfig.value.category);
  script.setAttribute("data-category-id", giscusConfig.value.categoryId);
  script.setAttribute("data-mapping", "specific");
  script.setAttribute("data-term", props.term);
  script.setAttribute("data-strict", giscusConfig.value.strict);
  script.setAttribute(
    "data-reactions-enabled",
    giscusConfig.value.reactionsEnabled,
  );
  script.setAttribute("data-emit-metadata", "0");
  script.setAttribute("data-input-position", giscusConfig.value.inputPosition);
  script.setAttribute("data-theme", giscusConfig.value.theme);
  script.setAttribute("data-lang", "ko");
  script.setAttribute("data-loading", "lazy");

  containerEl.value.appendChild(script);
}

onMounted(() => {
  renderWidget();
});

watch(
  () => props.term,
  () => {
    renderWidget();
  },
);

onBeforeUnmount(() => {
  clearWidget();
});
</script>

<template>
  <section class="post-comments" aria-label="댓글">
    <div v-if="isConfigured" ref="containerEl" class="post-comments__widget" />
    <p v-else class="post-comments__guide">
      댓글 기능을 사용하려면 GitHub Discussions와 giscus 설정값을 `.env`에 추가해 주세요.
    </p>
  </section>
</template>

<style scoped>
.post-comments {
  margin-top: clamp(1.6rem, 4vw, 2.4rem);
  padding-top: 1.1rem;
  border-top: 1px solid var(--border);
}

.post-comments__title {
  margin: 0 0 0.45rem;
  font-size: 1rem;
  letter-spacing: -0.01em;
}

.post-comments__widget {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.4rem;
  background: color-mix(in srgb, var(--surface-elevated) 26%, transparent);
}

.post-comments__widget :deep(.giscus),
.post-comments__widget :deep(.giscus-frame) {
  width: 100%;
}

.post-comments__guide {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}
</style>
