import type { MenuSetting } from '#/config';
import { computed, unref, ref } from 'vue';

import { useAppStore } from '@/store/modules/app';
import { MenuTypeEnum, MenuModeEnum, TriggerEnum } from '@/enums/menuEnum';
import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '@/enums/appEnum';
import { useFullContent } from '../web/useFullContent';

const mixSideHasChildren = ref(false);

export function useMenuSetting() {
  // 是否全屏显示内容，不显示菜单
  const { getFullContent: fullContent } = useFullContent();

  const appStore = useAppStore();

  // 是否显示侧边菜单
  const getShowSidebar = computed(() => {
    return (
      unref(getSplit) ||
      (unref(getShowMenu) && unref(getMenuMode) !== MenuModeEnum.HORIZONTAL && !unref(fullContent))
    );
  });

  // 是否折叠菜单
  const getCollapsed = computed(() => appStore.getMenuSetting.collapsed);

  // 菜单模式
  const getMenuMode = computed(() => appStore.getMenuSetting.mode);

  // 左侧菜单是否使用fixed布局
  const getMenuFixed = computed(() => appStore.getMenuSetting.fixed);

  // 菜单的默认宽度
  const getMenuWidth = computed(() => appStore.getMenuSetting.menuWidth);

  // 菜单折叠按钮的位置
  const getTrigger = computed(() => appStore.getMenuSetting.trigger);

  // 是否显示菜单，不会创建DOM
  const getShowMenu = computed(() => appStore.getMenuSetting.show);

  // 是否隐藏菜单
  const getMenuHidden = computed(() => appStore.getMenuSetting.hidden);

  // 菜单类型
  const getMenuType = computed(() => appStore.getMenuSetting.type);

  // 菜单主题
  const getMenuTheme = computed(() => appStore.getMenuSetting.theme);

  // 是否分割菜单，只在顶部菜单模式有效
  const getSplit = computed(() => appStore.getMenuSetting.split);

  // 获取菜单背景色
  const getMenuBgColor = computed(() => appStore.getMenuSetting.bgColor);

  // 菜单类型是否为左侧菜单
  const getIsSidebarType = computed(() => unref(getMenuType) === MenuTypeEnum.SIDEBAR);

  // 是否固定展开菜单
  const getMixSideFixed = computed(() => appStore.getMenuSetting.mixSideFixed);

  // 菜单类型是否为顶部菜单
  const getIsTopMenu = computed(() => unref(getMenuType) === MenuTypeEnum.TOP_MENU);

  // 是否显示头部的折叠菜单按钮
  const getShowHeaderTrigger = computed(() => {
    if (
      unref(getMenuType) === MenuTypeEnum.TOP_MENU ||
      !unref(getShowMenu) ||
      unref(getMenuHidden)
    ) {
      // 1.顶部菜单模式
      // 2.不创建菜单
      // 3.隐藏菜单
      // 则都不会显示折叠按钮
      return false;
    }

    // 折叠按钮位置为头部才会显示头部的折叠菜单按钮
    return unref(getTrigger) === TriggerEnum.HEADER;
  });

  // 是否为水平菜单
  const getIsHorizontal = computed(() => {
    return unref(getMenuMode) === MenuModeEnum.HORIZONTAL;
  });

  // 是否为左侧菜单混合
  const getIsMixSidebar = computed(() => {
    return unref(getMenuType) === MenuTypeEnum.MIX_SIDEBAR;
  });

  // 是否为顶部菜单混合模式
  const getIsMixMode = computed(() => {
    return unref(getMenuMode) === MenuModeEnum.INLINE && unref(getMenuType) === MenuTypeEnum.MIX;
  });

  // 菜单占位div的宽度
  // 非左侧菜单混合模式时：只需判断是否折叠获取宽度
  // 左侧菜单混合模式时
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
    // 折叠菜单时如果显示标题和不显示标题的宽度
    return collapsedShowTitle ? SIDE_BAR_SHOW_TIT_MINI_WIDTH : SIDE_BAR_MINI_WIDTH;
  });

  // 根据左侧菜单的宽度动态计算头部的宽度
  const getCalcContentWidth = computed(() => {
    const width =
      unref(getIsTopMenu) || !unref(getShowMenu) || (unref(getSplit) && unref(getMenuHidden))
        ? 0
        : unref(getIsMixSidebar)
        ? (unref(getCollapsed) ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH) +
          (unref(getMixSideFixed) && unref(mixSideHasChildren) ? unref(getRealWidth) : 0)
        : unref(getRealWidth);

    return `calc(100% - ${unref(width)}px)`;

    // 1. 顶部菜单模式为 100%
    // 2. 左侧菜单混合模式
  });

  // 折叠菜单时是否显示标题
  const getCollapsedShowTitle = computed(() => appStore.getMenuSetting.collapsedShowTitle);

  // 设置projectConfig.menuSetting
  function setMenuSetting(menuSetting: Partial<MenuSetting>): void {
    appStore.setProjectConfig({ menuSetting });
  }

  // 设置projectConfig.menuSetting.collapsed
  function toggleCollapsed() {
    setMenuSetting({
      collapsed: !unref(getCollapsed),
    });
  }
  return {
    getCollapsed,
    getMenuMode,
    getMenuFixed,
    getShowMenu,
    getMenuHidden,
    getMenuWidth,
    getMenuType,
    getMenuTheme,
    getSplit,
    getMenuBgColor,
    getIsSidebarType,
    getIsTopMenu,
    getShowHeaderTrigger,
    getIsHorizontal,
    getIsMixSidebar,
    getIsMixMode,
    getShowSidebar,
    getRealWidth,
    getMiniWidthNumber,
    getCalcContentWidth,
    getCollapsedShowTitle,
    setMenuSetting,
    toggleCollapsed,
  };
}
