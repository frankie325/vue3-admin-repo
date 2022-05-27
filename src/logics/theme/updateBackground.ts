import { useAppStore } from '@/store/modules/app';
import { ThemeEnum } from '@/enums/appEnum';
import { setCssVar } from './utils';
import { colorIsDark, lighten, darken } from '@/utils/color';

const HEADER_BG_COLOR_VAR = '--header-bg-color';
const HEADER_BG_HOVER_COLOR_VAR = '--header-bg-hover-color';
const HEADER_MENU_ACTIVE_BG_COLOR_VAR = '--header-active-menu-bg-color';

const SIDER_DARK_BG_COLOR = '--sider-dark-bg-color';
const SIDER_DARK_DARKEN_BG_COLOR = '--sider-dark-darken-bg-color';
const SIDER_LIGHTEN_BG_COLOR = '--sider-dark-lighten-bg-color';

/**
 * @description: 修改头部背景颜色
 */
export function updateHeaderBgColor(color?: string) {
  const appStore = useAppStore();
  const darkMode = appStore.getDarkMode === ThemeEnum.DARK;

  if (!color) {
    if (darkMode) {
      // color不存在时且为黑暗模式，则颜色固定不变
      color = '#151515';
    } else {
      color = appStore.getHeaderSetting.bgColor;
    }
  }

  // 修改头部背景颜色css变量
  setCssVar(HEADER_BG_COLOR_VAR, color);

  // 修改头部操作按钮悬浮时的背景色
  const hoverColor = lighten(color!, 6);
  setCssVar(HEADER_BG_HOVER_COLOR_VAR, hoverColor);
  setCssVar(HEADER_MENU_ACTIVE_BG_COLOR_VAR, hoverColor);

  // 根据颜色值的深度并自动切换头部的主题
  const isDark = colorIsDark(color!);
  appStore.setProjectConfig({
    headerSetting: {
      theme: isDark || darkMode ? ThemeEnum.DARK : ThemeEnum.LIGHT,
    },
  });
}

/**
 * @description: 修改菜单背景颜色
 */
export function updateSidebarBgColor(color?: string) {
  const appStore = useAppStore();

  const darkMode = appStore.getDarkMode === ThemeEnum.DARK;
  if (!color) {
    if (darkMode) {
      color = '#212121';
    } else {
      color = appStore.getMenuSetting.bgColor;
    }
  }

  setCssVar(SIDER_DARK_BG_COLOR, color);
  setCssVar(SIDER_DARK_DARKEN_BG_COLOR, darken(color!, 6));
  setCssVar(SIDER_LIGHTEN_BG_COLOR, lighten(color!, 5));

  // 只有颜色为#fff，菜单主题模式为light
  const isLight = ['#fff', '#ffffff'].includes(color!.toLowerCase());

  appStore.setProjectConfig({
    menuSetting: {
      theme: isLight && !darkMode ? ThemeEnum.LIGHT : ThemeEnum.DARK,
    },
  });
}
