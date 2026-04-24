<script setup>
// 모바일 전용 "상단 드롭다운" 메뉴.
// - 헤더 바로 아래에 붙어 위에서 아래로 슬라이드 내려옵니다.
// - 여닫기 상태는 Header의 햄버거 버튼과 공유하기 위해 `useDrawer()`를 사용합니다.
// - 패널 밖 영역(backdrop)을 누르거나, 라우트가 바뀌거나, Esc를 누르면 닫힙니다.
import { onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import NavMenu from "./NavMenu.vue";
import SocialNav from "./SocialNav.vue";
import { useDrawer } from "@/lib/drawer";

// 공용 여닫기 상태. `isOpen`을 DOM 클래스에 반영하고, 닫기 핸들러도 공용 함수를 사용합니다.
const { isOpen, close } = useDrawer();

// 라우트가 바뀌면 자동으로 닫아 주어야, 카테고리를 눌렀을 때 패널이 덮인 채 남지 않습니다.
const route = useRoute();
watch(
  () => route.fullPath,
  () => close(),
);

// 접근성: Esc 키로 닫기. 컴포넌트 언마운트 시 반드시 해제합니다.
function onKeydown(event) {
  if (event.key === "Escape" && isOpen.value) {
    close();
  }
}
onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <!-- 드롭다운 전용 컨테이너. 패널과 backdrop을 묶어 하나의 "모바일 네비 영역"으로 관리 -->
  <div class="mobile-nav" :class="{ 'is-open': isOpen }">
    <!-- 외부 클릭 감지용 레이어. 패널 뒤(헤더 아래 전 영역)에서 투명하게 대기합니다. -->
    <div
      class="mobile-nav-backdrop"
      aria-hidden="true"
      @click="close"
    />

    <!-- 실제 드롭다운 패널: 헤더 아래에서 슬라이드 내려옴 -->
    <div
      id="mobile-nav-panel"
      class="mobile-nav-panel"
      role="menu"
      aria-label="모바일 네비게이션"
    >
      <NavMenu />
      <div class="mobile-nav-social">
        <SocialNav />
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-nav-social {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
}
</style>
