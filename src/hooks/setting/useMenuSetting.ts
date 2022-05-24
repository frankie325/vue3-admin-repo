import type { MenuSetting } from '#/config';
import { computed, unref } from 'vue';

import { useAppStore } from '@/store/modules/app';
import { MenuTypeEnum, MenuModeEnum, TriggerEnum } from '@/enums/menuEnum';
import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '@/enums/appEnum';
import { useFullContent } from '../web/useFullContent';

export function useMenuSetting() {
  // 是否全屏显示内容，不显示菜单
  const { getFullContent: fullContent } = useFullContent();

  const appStore = useAppStore();

  // 是否显示侧边菜单，不分割菜单
  const getShowSidebar = computed(() => {
    return (
      unref(getSplit) ||
      (unref(getShowMenu) && unref(getMenuMode) !== MenuModeEnum.HORIZONTAL && !unref(fullContent))
    );
  });

  // 是否折叠菜单
  const getCollapsed = computed(() => appStore.getMenuSetting.collapsed);

  const getMenuMode = computed(() => appStore.getMenuSetting.mode);

  // 是否固定左侧菜单
  const getMenuFixed = computed(() => appStore.getMenuSetting.fixed);

  // 菜单宽度
  const getMenuWidth = computed(() => appStore.getMenuSetting.menuWidth);

  // 菜单折叠按钮的位置
  const getTrigger = computed(() => appStore.getMenuSetting.trigger);

  // 是否显示菜单，不会创建DOM
  const getShowMenu = computed(() => appStore.getMenuSetting.show);

  // 是否隐藏菜单
  const getMenuHidden = computed(() => appStore.getMenuSetting.hidden);

  // 菜单类型
  const getMenuType = computed(() => appStore.getMenuSetting.type);

  // 是否分割菜单
  const getSplit = computed(() => appStore.getMenuSetting.split);

  // 菜单类型是否为左侧菜单
  const getIsSidebarType = computed(() => unref(getMenuType) === MenuTypeEnum.SIDEBAR);

  // 是否固定展开菜单
  const getMixSideFixed = computed(() => appStore.getMenuSetting.mixSideFixed);

  // 菜单类型是否为顶部菜单
  const getIsTopMenu = computed(() => unref(getMenuType) === MenuTypeEnum.TOP_MENU);

  const getShowHeaderTrigger = computed(() => {
    if (
      unref(getMenuType) === MenuTypeEnum.TOP_MENU ||
      !unref(getShowMenu) ||
      unref(getMenuHidden)
    ) {
      return false;
    }

    return unref(getTrigger) === TriggerEnum.HEADER;
  });

  // 是否为左侧菜单混合模式
  const getIsMixSidebar = computed(() => {
    return unref(getMenuType) === MenuTypeEnum.MIX_SIDEBAR;
  });

  // 菜单宽度
  const getRealWidth = computed(() => {
    if (unref(getIsMixSidebar)) {
      return unref(getCollapsed) && !unref(getMixSideFixed)
        ? unref(getMiniWidthNumber)
        : unref(getMenuWidth);
    }
    return unref(getCollapsed) ? unref(getMiniWidthNumber) : unref(getMenuWidth);
  });

  const getMiniWidthNumber = computed(() => {
    const { collapsedShowTitle } = appStore.getMenuSetting;
    // 折叠时如果显示标题和不显示标题的宽度
    return collapsedShowTitle ? SIDE_BAR_SHOW_TIT_MINI_WIDTH : SIDE_BAR_MINI_WIDTH;
  });

  // 设置projectConfig.menuSetting
  function setMenuSetting(menuSetting: Partial<MenuSetting>): void {
    appStore.setProjectConfig({ menuSetting });
  }
  return {
    getCollapsed,
    getMenuMode,
    getMenuFixed,
    getShowMenu,
    getMenuWidth,
    getMenuType,
    getSplit,
    getIsSidebarType,
    getIsTopMenu,
    getShowHeaderTrigger,
    getIsMixSidebar,
    getShowSidebar,
    getRealWidth,
    getMiniWidthNumber,
    setMenuSetting,
  };
}
