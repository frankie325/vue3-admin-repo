import type { HeaderSetting } from '#/config';

import { computed, unref } from 'vue';

import { useAppStore } from '@/store/modules/app';
import { useFullContent } from '@/hooks/web/useFullContent';

export function useHeaderSetting() {
  const { getFullContent } = useFullContent();
  const appStore = useAppStore();

  // const getShowFullHeaderRef = computed(() => {
  //   return (
  //     !unref(getFullContent) &&
  //     unref(getShowMixHeaderRef) &&
  //     unref(getShowHeader) &&
  //     !unref(getIsTopMenu) &&
  //     !unref(getIsMixSidebar)
  //   );
  // });

  // 是否显示头部
  const getShowHeader = computed(() => appStore.getHeaderSetting.show);
}
