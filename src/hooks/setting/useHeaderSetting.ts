import type { HeaderSetting } from '#/config';

import { computed, unref } from 'vue';

import { useAppStore } from '@/store/modules/app';
import { useFullContent } from '@/hooks/web/useFullContent';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

export function useHeaderSetting() {
  const { getFullContent } = useFullContent();
  const appStore = useAppStore();

  const getShowFullHeaderRef = computed(() => {
    return (
      !unref(getFullContent) &&
      unref(getShowMixHeaderRef) &&
      unref(getShowHeader) &&
      !unref(getIsTopMenu) &&
      !unref(getIsMixSidebar)
    );
  });

  const {
    getMenuMode,
    getSplit,
    getShowHeaderTrigger,
    getIsSidebarType,
    getIsMixSidebar,
    getIsTopMenu,
  } = useMenuSetting();

  const getShowMixHeaderRef = computed(() => !unref(getIsSidebarType) && unref(getShowHeader));

  // 头部主题，跟随系统
  const getHeaderTheme = computed(() => appStore.getHeaderSetting.theme);
  // 是否显示头部
  const getShowHeader = computed(() => appStore.getHeaderSetting.show);

  return {
    getShowFullHeaderRef,
    getHeaderTheme,
    getShowHeader,
  };
}
