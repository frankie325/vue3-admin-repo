import type { MenuSetting } from '#/config';
import { computed, unref } from 'vue';

import { useAppStore } from '@/store/modules/app';
import { MenuTypeEnum, MenuModeEnum } from '@/enums/menuEnum';
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

  // 菜单宽度
  const getMenuWidth = computed(() => appStore.getMenuSetting.menuWidth);

  // 是否显示菜单，不会创建DOM
  const getShowMenu = computed(() => appStore.getMenuSetting.show);

  // 菜单类型
  const getMenuType = computed(() => appStore.getMenuSetting.type);

  const getSplit = computed(() => appStore.getMenuSetting.split);

  // 是否为左侧菜单混合模式
  const getIsMixSidebar = computed(() => {
    return unref(getMenuType) === MenuTypeEnum.MIX_SIDEBAR;
  });

  // 设置projectConfig.menuSetting
  function setMenuSetting(menuSetting: Partial<MenuSetting>): void {
    appStore.setProjectConfig({ menuSetting });
  }
  return {
    getCollapsed,
    getShowMenu,
    getMenuWidth,
    getMenuType,
    getIsMixSidebar,
    getShowSidebar,
    setMenuSetting,
  };
}
