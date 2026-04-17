/**
 * 모바일 사이드 드로어의 열림/닫힘 상태를 앱 전체에서 공유하기 위한 싱글톤.
 * - 상태 자체는 단순히 `ref<boolean>`로만 두고, DOM 반응은 각 컴포넌트에서 처리합니다.
 * - `lockScroll`은 드로어가 열렸을 때 배경이 스크롤되지 않도록 `body`에 클래스를 토글합니다.
 */
import { ref, watch } from "vue";

// 공용 open 상태. 앱이 실행되는 동안 하나만 존재하면 되므로 모듈 스코프에 둡니다.
const isOpen = ref(false);

export function useDrawer() {
  // 여닫기용 헬퍼: 템플릿·이벤트 핸들러에서 바로 쓸 수 있게 함수로 제공합니다.
  function open() {
    isOpen.value = true;
  }
  function close() {
    isOpen.value = false;
  }
  function toggle() {
    isOpen.value = !isOpen.value;
  }

  return { isOpen, open, close, toggle };
}

// 드로어가 열려 있는 동안 body 스크롤을 잠급니다. (main.css의 .is-drawer-open 과 연결)
if (typeof document !== "undefined") {
  watch(isOpen, (open) => {
    document.body.classList.toggle("is-drawer-open", open);
  });
}
