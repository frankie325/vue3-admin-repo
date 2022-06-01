import type { MultiTabsSetting } from '#/config';
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';

export function useMultipleTabSetting() {
  const appStore = useAppStore();

  // 是否显示标签页
  const getShowMultipleTab = computed(() => appStore.getMultiTabsSetting.show);

  const getShowQuick = computed(() => appStore.getMultiTabsSetting.showQuick);

  const getShowRedo = computed(() => appStore.getMultiTabsSetting.showRedo);

  const getShowFold = computed(() => appStore.getMultiTabsSetting.showFold);

  function setMultipleTabSetting(multiTabsSetting: Partial<MultiTabsSetting>) {
    appStore.setProjectConfig({ multiTabsSetting });
  }
  return {
    getShowMultipleTab,
    getShowQuick,
    getShowRedo,
    getShowFold,
    setMultipleTabSetting,
  };
}
