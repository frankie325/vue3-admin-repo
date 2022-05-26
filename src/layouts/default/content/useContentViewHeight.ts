import { ref, computed, unref } from 'vue';

const headerHeightRef = ref(0);
const footerHeightRef = ref(0);

export function useLayoutHeight() {
  function setHeaderHeight(val: number) {
    headerHeightRef.value = val;
  }
  function setFooterHeight(val: number) {
    footerHeightRef.value = val;
  }
  return { headerHeightRef, footerHeightRef, setHeaderHeight, setFooterHeight };
}
