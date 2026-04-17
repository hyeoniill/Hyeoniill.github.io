<script setup>
// 포스트 카드 한 장을 그리는 "프리뷰" 컴포넌트.
// - PostList 는 그리드 배치만 담당하고, 카드 내부(제목/요약/태그) 레이아웃은 이 컴포넌트가 소유합니다.
// - 외부에는 `post` 객체 하나만 받도록 단순화합니다.
import { computed } from "vue";
import { toPlainPreview } from "@/lib/posts";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

// 마크다운/HTML이 섞인 본문을 카드용 평문으로 정규화합니다.
// (코드블록·이미지·링크·HTML 태그 등은 제거되고, 링크 텍스트만 남습니다)
const excerptText = computed(() => toPlainPreview(props.post?.content ?? "", 200));

const tags = computed(() => {
  const t = props.post?.data?.tags;
  return Array.isArray(t) ? t.filter((s) => typeof s === "string" && s.trim()) : [];
});
</script>

<template>
  <!-- 카드 전체가 하나의 링크. 접근성상 카드 어디를 눌러도 포스트로 이동. -->
  <router-link
    :to="{ name: 'post', params: { slug: post.slug } }"
    class="preview"
  >
    <!-- 제목 영역: 2줄까지 노출, 넘치면 말줄임 -->
    <h3 class="preview-title">{{ post.title }}</h3>

    <!-- 내용(요약) 영역: 남은 공간을 흡수하고 클램프로 자릅니다. -->
    <p class="preview-excerpt">{{ excerptText }}</p>

    <!-- 태그 영역: 한 줄 가로 스크롤. 없으면 렌더하지 않음 -->
    <ul v-if="tags.length" class="preview-tags" aria-label="태그">
      <li v-for="tag in tags" :key="tag">{{ tag }}</li>
    </ul>
  </router-link>
</template>

<style scoped>
/* =========================================================
 * 카드 컨테이너
 * - 고정 비율(`aspect-ratio`) 대신 `min-height`를 사용합니다.
 *   카드가 좁아져도 내부 텍스트가 잘리지 않고 자연스럽게 늘어나며,
 *   같은 행에 놓인 카드들은 Grid 의 `align-items: stretch` 덕분에
 *   자동으로 같은 높이로 정렬됩니다.
 * - `height: 100%`는 한 행 안에서 다른 카드 높이에 맞춰 늘어나게 해 줍니다.
 * ========================================================= */
.preview {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem 1.1rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--surface-elevated) 40%, transparent);
  color: inherit;
  text-decoration: none;
  height: 100%;
  min-height: 9rem; /* 모바일 기준 최소 높이 */
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    transform 0.15s ease;
}

.preview:hover {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
  background: color-mix(in srgb, var(--accent) 8%, var(--surface-elevated));
  transform: translateY(-2px);
}

@media (min-width: 768px) {
  .preview {
    min-height: 11rem;
  }
}

@media (min-width: 1024px) {
  .preview {
    min-height: 15rem;
  }
}

/* =========================================================
 * 제목
 * ========================================================= */
.preview-title {
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: var(--text);
}

/* =========================================================
 * 요약 본문
 * - 남은 공간을 흡수하며, 하단에 padding 을 둬서 태그 바와의 간격을 항상 보장.
 * - 브레이크포인트별로 보여 줄 줄 수를 다르게 설정.
 * ========================================================= */
.preview-excerpt {
  margin: 0;
  flex: 1;
  min-height: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  padding-bottom: 0.4rem;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--text-muted);
}

@media (min-width: 768px) {
  .preview-excerpt {
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
}

@media (min-width: 1024px) {
  .preview-excerpt {
    -webkit-line-clamp: 5;
    line-clamp: 5;
  }
}

/* =========================================================
 * 태그 바
 * - 한 줄만 노출하고, 넘치는 칩은 가로 스크롤로 확인 가능.
 * - 스크롤바는 숨겨 카드 외관을 깔끔하게 유지.
 * ========================================================= */
.preview-tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: nowrap;
  gap: 0.3rem;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.preview-tags::-webkit-scrollbar {
  display: none;
}

.preview-tags li {
  flex: 0 0 auto;
  font-size: 0.72rem;
  line-height: 1;
  padding: 0.22rem 0.5rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: color-mix(in srgb, var(--text) 88%, var(--accent));
  border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
  white-space: nowrap;
}
</style>
