import type { MultiTabsSetting } from '#/config';
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';

export function useMultipleTabSetting() {
  const appStore = useAppStore();

  // 是否显示标签页
  const getShowMultipleTab = computed(() => appStore.getMultiTabsSetting.show);

  return {
    getShowMultipleTab,
  };
}
