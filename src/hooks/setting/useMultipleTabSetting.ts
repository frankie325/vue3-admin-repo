import type { MultiTabsSetting } from '#/config';
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';

export function useMultipleTabSetting() {
  const appStore = useAppStore();

  // 是否显示标签页
  const getShowMultipleTab = computed(() => appStore.getMultiTabsSetting.show);

  // 是否打开标签页快捷操作
  const getShowQuick = computed(() => appStore.getMultiTabsSetting.showQuick);

  // 是否显示标签页刷新按钮
  const getShowRedo = computed(() => appStore.getMultiTabsSetting.showRedo);

  // 是否显示标签页折叠（内容全屏）按钮
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
