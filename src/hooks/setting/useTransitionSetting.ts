import type { TransitionSetting } from '#/config';

import { computed } from 'vue';

import { useAppStore } from '@/store/modules/app';

export function useTransitionSetting() {
  const appStore = useAppStore();
  // 是否启用框架内页面切换时动画效果
  const getEnableTransition = computed(() => appStore.getTransitionSetting?.enable);

  const getOpenNProgress = computed(() => appStore.getTransitionSetting?.openNProgress);

  // 框架内容是否启用加载动画
  const getOpenPageLoading = computed((): boolean => {
    return !!appStore.getTransitionSetting?.openPageLoading;
  });

  // 框架内页面切换时动画效果
  const getBasicTransition = computed(() => appStore.getTransitionSetting?.basicTransition);

  function setTransitionSetting(transitionSetting: Partial<TransitionSetting>) {
    appStore.setProjectConfig({ transitionSetting });
  }
  return {
    setTransitionSetting,

    getEnableTransition,
    getOpenNProgress,
    getOpenPageLoading,
    getBasicTransition,
  };
}
