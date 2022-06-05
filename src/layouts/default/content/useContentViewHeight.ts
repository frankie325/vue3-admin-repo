import { ref, computed, unref } from 'vue';
import { useWindowSizeFn } from '@/hooks/event/useWindowSizeFn';
import { createPageContext } from '@/hooks/component/usePageContext';

const headerHeightRef = ref(0);
const footerHeightRef = ref(0);

/**
 * @description: 头部和脚部的高度
 */
export function useLayoutHeight() {
  // 头部如果时fixed布局，则为0
  function setHeaderHeight(val: number) {
    headerHeightRef.value = val;
  }
  function setFooterHeight(val: number) {
    footerHeightRef.value = val;
  }
  return { headerHeightRef, footerHeightRef, setHeaderHeight, setFooterHeight };
}

export function useContentViewHeight() {
  const contentHeight = ref(window.innerHeight);
  const pageHeight = ref(window.innerHeight);

  // 框架内容高度
  const getViewHeight = computed(() => {
    return unref(contentHeight) - unref(headerHeightRef) - unref(footerHeightRef) || 0;
  });

  // 监听窗口变化，更新高度
  useWindowSizeFn(
    // @ts-ignore
    () => {
      contentHeight.value = window.innerHeight;
    },
    100,
    { immediate: true },
  );

  async function setPageHeight(height: number) {
    pageHeight.value = height;
  }

  // 注入数据到LayoutContent组件
  createPageContext({
    contentHeight: getViewHeight,
    setPageHeight,
    pageHeight,
  });
}
