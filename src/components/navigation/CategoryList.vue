<script setup>
// 사용처마다 `title`·`items`만 바꿔 주면 다른 목록을 그립니다.
// 예: <CategoryList title="Topics" :items="['A','B']" />
// 항목별로 라벨·쿼리를 다르게 쓰려면 `items`에 객체 배열을 넘깁니다.
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  title: {
    type: String,
    default: "Category",
  },
  /** 문자열이면 `/?category=<문자열>`, 객체면 `{ label, query }` 사용 */
  items: {
    type: Array,
    default: () => [],
  },
});

const route = useRoute();

const currentCategory = computed(() => {
  const q = route.query.category;
  const raw = Array.isArray(q) ? q[0] : q;
  if (!raw) return "";
  return decodeURIComponent(String(raw));
});

function normalizeItem(raw) {
  if (typeof raw === "string") {
    return { label: raw, query: raw, children: [] };
  }
  if (raw && typeof raw === "object") {
    const label = raw.label ?? raw.name ?? "";
    const query = raw.query ?? raw.category ?? label;
    const children = Array.isArray(raw.children)
      ? raw.children.map((child) => normalizeItem(child)).filter((child) => child.query)
      : [];
    return { label, query, children };
  }
  return { label: "", query: "", children: [] };
}

const normalizedItems = computed(() =>
  props.items.map((raw) => normalizeItem(raw)).filter((item) => item.query),
);

function isActive(query) {
  return currentCategory.value === String(query);
}

function isParentActive(item) {
  if (!item.children.length) return false;
  return item.children.some((child) => isActive(child.query));
}
</script>

<template>
  <section class="category-list" aria-label="카테고리 목록">
    <h2 class="category-list__title">{{ title }}</h2>
    <nav class="nav-block">
      <template v-for="item in normalizedItems" :key="item.query">
        <router-link
          :to="{ path: '/', query: { category: item.query } }"
          :class="{ 'is-active': isActive(item.query), 'is-parent-active': isParentActive(item) }"
        >
          {{ item.label }}
        </router-link>
        <div v-if="item.children.length" class="category-sub-list">
          <router-link
            v-for="child in item.children"
            :key="child.query"
            :to="{ path: '/', query: { category: child.query } }"
            :class="{ 'is-active': isActive(child.query) }"
          >
            {{ child.label }}
          </router-link>
        </div>
      </template>
    </nav>
  </section>
</template>

<style scoped>
.category-list {
  align-self: stretch;
}

.category-list__title {
  margin: 0 0 0.5rem;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--text) 55%, var(--primary));
  text-align: left;
}

.category-sub-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-left: 0.85rem;
  margin-top: 0.15rem;
}

.category-sub-list a {
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--text) 86%, var(--primary));
}

.nav-block :deep(a.is-parent-active:not(.is-active)) {
  background: color-mix(in srgb, var(--accent) 11%, transparent);
  color: color-mix(in srgb, var(--text) 94%, var(--accent));
}
</style>
