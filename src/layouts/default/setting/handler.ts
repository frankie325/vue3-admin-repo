import { useAppStore } from '@/store/modules/app';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { updateGrayMode } from '@/logics/theme/updateGrayMode';
import { updateColorWeak } from '@/logics/theme/updateColorWeak';

import { ProjectConfig } from '#/config';
import { HandlerEnum } from './enum';

import { changeTheme } from '@/logics/theme';
import { updateHeaderBgColor, updateSidebarBgColor } from '@/logics/theme/updateBackground';

export function baseHandler(event: HandlerEnum, value: any) {
  const appStore = useAppStore();
  const config = handler(event, value);
  appStore.setProjectConfig(config);

  // 黑暗模式切换时，也更新头部和菜单的背景颜色
  // if (event === HandlerEnum.CHANGE_THEME) {
  //   updateHeaderBgColor();
  // }
}

/**
 * @description: 修改项目配置
 */
export function handler(event: HandlerEnum, value: any): DeepPartial<ProjectConfig> {
  const appStore = useAppStore();

  const { getThemeColor } = useRootSetting();

  switch (event) {
    case HandlerEnum.CHANGE_LAYOUT:
      const { mode, type, split } = value;
      const splitOpt = split === undefined ? { split } : {};

      return {
        menuSetting: {
          mode,
          type,
          collapsed: false,
          show: true,
          hidden: false,
          ...splitOpt,
        },
      };
    case HandlerEnum.CHANGE_THEME_COLOR:
      if (getThemeColor.value === value) {
        return {};
      }
      changeTheme(value);
      return { themeColor: value };
    case HandlerEnum.CONTENT_MODE:
      return { contentMode: value };
    case HandlerEnum.LOCK_TIME:
      return { lockTime: value };
    case HandlerEnum.SHOW_BREADCRUMB:
      return { showBreadCrumb: value };
    case HandlerEnum.SHOW_BREADCRUMB_ICON:
      return { showBreadCrumbIcon: value };
    case HandlerEnum.SHOW_LOGO:
      return { showLogo: value };
    case HandlerEnum.SHOW_FOOTER:
      return { showFooter: value };
    case HandlerEnum.FULL_CONTENT:
      return { fullContent: value };
    case HandlerEnum.GRAY_MODE:
      updateGrayMode(value);
      return { grayMode: value };
    case HandlerEnum.COLOR_WEAK:
      updateColorWeak(value);
      return { colorWeak: value };

    // ============transition==================
    case HandlerEnum.OPEN_PAGE_LOADING:
      appStore.setPageLoading(false);
      return { transitionSetting: { openPageLoading: value } };

    case HandlerEnum.ROUTER_TRANSITION:
      return { transitionSetting: { basicTransition: value } };

    case HandlerEnum.OPEN_ROUTE_TRANSITION:
      return { transitionSetting: { enable: value } };

    case HandlerEnum.OPEN_PROGRESS:
      return { transitionSetting: { openNProgress: value } };
    // #######标签页#######
    case HandlerEnum.TABS_SHOW_QUICK:
      return { multiTabsSetting: { showQuick: value } };
    case HandlerEnum.TABS_SHOW:
      return { multiTabsSetting: { show: value } };
    case HandlerEnum.TABS_SHOW_REDO:
      return { multiTabsSetting: { showRedo: value } };
    case HandlerEnum.TABS_SHOW_FOLD:
      return { multiTabsSetting: { showFold: value } };

    // #######菜单#######
    case HandlerEnum.MENU_THEME:
      updateSidebarBgColor(value);
      return { menuSetting: { bgColor: value } };
    case HandlerEnum.MENU_SPLIT:
      return { menuSetting: { split: value } };
    case HandlerEnum.MENU_FIXED_MIX_SIDEBAR:
      return { menuSetting: { mixSideFixed: value } };
    case HandlerEnum.MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE:
      return { menuSetting: { closeMixSidebarOnChange: value } };
    case HandlerEnum.MENU_COLLAPSED:
      return { menuSetting: { collapsed: value } };
    case HandlerEnum.MENU_HAS_DRAG:
      return { menuSetting: { canDrag: value } };
    case HandlerEnum.MENU_ACCORDION:
      return { menuSetting: { accordion: value } };
    case HandlerEnum.MENU_COLLAPSED_SHOW_TITLE:
      return { menuSetting: { collapsedShowTitle: value } };
    case HandlerEnum.MENU_FIXED:
      return { menuSetting: { fixed: value } };
    case HandlerEnum.MENU_TRIGGER_MIX_SIDEBAR:
      return { menuSetting: { mixSideTrigger: value } };
    case HandlerEnum.MENU_TOP_ALIGN:
      return { menuSetting: { topMenuAlign: value } };
    case HandlerEnum.MENU_TRIGGER:
      return { menuSetting: { trigger: value } };
    case HandlerEnum.MENU_WIDTH:
      return { menuSetting: { menuWidth: value } };
    case HandlerEnum.MENU_SHOW_SIDEBAR:
      return { menuSetting: { show: value } };

    // #######头部#######
    case HandlerEnum.HEADER_THEME:
      updateHeaderBgColor(value);
      return { headerSetting: { bgColor: value } };
    case HandlerEnum.HEADER_SEARCH:
      return { headerSetting: { showSearch: value } };
    case HandlerEnum.HEADER_FIXED:
      return { headerSetting: { fixed: value } };
    case HandlerEnum.HEADER_SHOW:
      return { headerSetting: { show: value } };
    default:
      return {};
  }
}
