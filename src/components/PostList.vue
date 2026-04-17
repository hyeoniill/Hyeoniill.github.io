<script setup>
// 포스트 카드 "그리드"만 담당하는 리스트 컴포넌트.
// - 카드 한 장의 내부 구조/스타일은 Preview.vue 가 소유합니다.
import { computed } from "vue";
import { getAllPosts } from "@/lib/posts";
import Preview from "@/components/Preview.vue";

const posts = computed(() => getAllPosts());
</script>

<template>
  <section class="post-list" aria-label="게시글 목록">
    <ul class="post-cards">
      <li v-for="p in posts" :key="p.slug">
        <Preview :post="p" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
/* 포스트 카드 그리드
 * - auto-fill + minmax 로 컨테이너 폭에 따라 1~N 열이 자동 결정.
 * - 카드 내부 레이아웃은 Preview.vue 에서 정의합니다.
 * - 같은 행의 카드 높이를 맞추기 위해 `<li>`를 100% 높이로 늘리고,
 *   Preview 루트가 그 높이를 이어받습니다. */
.post-cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: 0.85rem;
}

.post-cards > li {
  height: 100%;
}
</style>
