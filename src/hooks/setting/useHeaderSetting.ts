import type { HeaderSetting } from '#/config';

import { computed, unref } from 'vue';

import { useAppStore } from '@/store/modules/app';
import { useFullContent } from '@/hooks/web/useFullContent';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useRootSetting } from '@/hooks/setting/useRootSetting';

import { MenuModeEnum } from '@/enums/menuEnum';

export function useHeaderSetting() {
  const { getFullContent } = useFullContent();
  const appStore = useAppStore();

  // 顶部菜单混合模式时，展示完整的头部
  const getShowFullHeaderRef = computed(() => {
    return (
      !unref(getFullContent) &&
      unref(getShowMixHeaderRef) &&
      unref(getShowHeader) &&
      !unref(getIsTopMenu) &&
      !unref(getIsMixSidebar)
    );
  });

  // 显示layout内的头部菜单
  const getShowInsetHeaderRef = computed(() => {
    const need = !unref(getFullContent) && unref(getShowHeader); //非全屏内容
    return (
      (need && !unref(getShowMixHeaderRef)) || // 左侧菜单模式
      (need && unref(getIsTopMenu)) || // 为顶部菜单模式
      (need && unref(getIsMixSidebar)) // 为左侧菜单混合模式
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

  const { getShowBreadCrumb, getShowLogo } = useRootSetting();

  // 非左侧菜单模式且显示头部为true
  const getShowMixHeaderRef = computed(() => !unref(getIsSidebarType) && unref(getShowHeader));

  // 头部主题
  const getHeaderTheme = computed(() => appStore.getHeaderSetting.theme);
  // 是否显示头部
  const getShowHeader = computed(() => appStore.getHeaderSetting.show);
  // 头部使用fixed布局
  const getFixed = computed(() => appStore.getHeaderSetting.fixed);

  // 获取头部背景颜色
  const getHeaderBgColor = computed(() => appStore.getHeaderSetting.bgColor);

  // 是否展示菜单搜索
  const getShowSearch = computed(() => appStore.getHeaderSetting.showSearch);

  // 非左侧菜单模式和非左侧混合菜单模式则显示头部的Logo
  const getShowHeaderLogo = computed(() => {
    return unref(getShowLogo) && !unref(getIsSidebarType) && !unref(getIsMixSidebar);
  });

  // 非顶部菜单混合模式且非分割菜单模式则显示面包屑
  const getShowBread = computed(() => {
    return (
      unref(getMenuMode) !== MenuModeEnum.HORIZONTAL && unref(getShowBreadCrumb) && !unref(getSplit)
    );
  });

  // 头部面包屑或者显示头部折叠按钮为true则getShowContent为true
  const getShowContent = computed(() => {
    return unref(getShowBread) || unref(getShowHeaderTrigger);
  });

  function setHeaderSetting(headerSetting: Partial<HeaderSetting>) {
    appStore.setProjectConfig({ headerSetting });
  }

  return {
    getShowInsetHeaderRef,
    getShowFullHeaderRef,
    getHeaderTheme,
    getShowHeader,
    getFixed,
    getHeaderBgColor,
    getShowHeaderLogo,
    getShowContent,
    getShowSearch,
    getShowBread,
    setHeaderSetting,
  };
}
