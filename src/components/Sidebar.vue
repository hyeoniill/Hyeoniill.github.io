<script setup>
// 데스크톱(≥768px) 전용 사이드바 레일.
// - 모바일 드로어/오버레이 로직은 모두 MobileNav.vue로 이전했습니다.
// - 브랜드 라벨 + 프로필 + 공용 NavMenu만 배치하는 "순수한 레일"입니다.
import NavMenu from "@/components/NavMenu.vue";
</script>

<template>
  <aside id="site-sidebar" class="sidebar" aria-label="프로필 및 내비게이션">
    <div class="sidebar-brand">Blog</div>
    <div class="profile">
      <img src="@/assets/img/profile.jpeg" alt="프로필" />
    </div>
    <NavMenu />
  </aside>
</template>

<style scoped>
/* 프로필 사진: 포인트 컬러로 얇은 링을 둘러 강조. */
.profile {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--accent) 55%, transparent),
    var(--shadow);
}

.profile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
