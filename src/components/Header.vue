<script setup>
// 헤더는 스티키로 상단에 붙어 있고, 모바일에서는 좌측 햄버거 버튼으로 드로어를 여닫습니다.
import { useDrawer } from "@/lib/drawer";

// 드로어 공용 상태(useDrawer)에서 toggle과 isOpen을 받아 버튼에 연결합니다.
const { isOpen, toggle } = useDrawer();
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <!-- 모바일 전용 햄버거 버튼. 태블릿 이상에서는 CSS(@media)에서 display:none -->
      <button
        type="button"
        class="menu-toggle"
        :aria-expanded="isOpen ? 'true' : 'false'"
        aria-controls="site-sidebar"
        aria-label="메뉴 열기"
        @click="toggle"
      >
        <!-- 상태에 따라 아이콘 전환 (열림: X, 닫힘: ≡) -->
        <svg v-if="!isOpen" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M3 6h14M3 10h14M3 14h14"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
        <svg v-else viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M5 5l10 10M15 5L5 15"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <h1 class="site-title">
        <router-link to="/" class="site-title-link">@Hyeon<span>iill</span></router-link>
      </h1>

      <span class="header-tag">dev log</span>
    </div>
  </header>
</template>
