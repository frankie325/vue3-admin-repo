import type { Ref } from 'vue';

import { computed, unref, onMounted, nextTick, ref } from 'vue';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

export function useSiderEvent() {
  const brokenRef = ref(false);
  const { getMiniWidthNumber } = useMenuSetting();

  // 折叠时菜单宽度
  const getCollapsedWidth = computed(() => {
    return unref(brokenRef) ? 0 : unref(getMiniWidthNumber);
  });

  // 当屏幕断点在lg之间变化时，触发回调，小于lg返回true，则左侧fixed布局固定的菜单设为0
  function onBreakpointChange(broken: boolean) {
    brokenRef.value = broken;
  }

  return { getCollapsedWidth, onBreakpointChange };
}
