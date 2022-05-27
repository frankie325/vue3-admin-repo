import type { ProjectConfig } from '#/config';

import { useLocaleStore } from '@/store/modules/locale';
import { useAppStore } from '@/store/modules/app';
import { Persistent } from '@/utils/cache/persistent';
import { PROJ_CFG_KEY } from '@/enums/cacheEnum';
import { deepMerge } from '@/utils';
import projectSetting from '@/settings/projectSetting';
import { ThemeEnum } from '@/enums/appEnum';
import { updateDarkTheme } from './theme/dark';
import { primaryColor } from '../../build/config/themeConfig';
import { changeTheme } from '@/logics/theme';
import { updateHeaderBgColor, updateSidebarBgColor } from './theme/updateBackground';
/**
 * @description:  初始化pinia仓库状态
 */
export function initAppConfigStore() {
  const appStore = useAppStore();
  const localeStore = useLocaleStore();

  let projCfg: ProjectConfig = Persistent.getLocal(PROJ_CFG_KEY) as ProjectConfig;

  // 将默认的配置和本地存储的配置合并
  projCfg = deepMerge(projectSetting, projCfg || {});

  const {
    themeColor,
    headerSetting: { bgColor: headerBgColor } = {},
    menuSetting: { bgColor },
  } = projCfg;

  try {
    if (themeColor && themeColor !== primaryColor) {
      // 初始化系统主题
      changeTheme(themeColor);
    }
  } catch (error) {
    console.error(error);
  }
  // 将项目配置存储到app仓库中
  appStore.setProjectConfig(projCfg);

  // 初始化黑暗模式
  const darkMode = appStore.getDarkMode;
  updateDarkTheme(darkMode);

  // 初始化头部背景颜色和菜单背景颜色
  if (darkMode === ThemeEnum.DARK) {
    updateHeaderBgColor();
    updateSidebarBgColor();
  } else {
    headerBgColor && updateHeaderBgColor(headerBgColor);
    bgColor && updateSidebarBgColor(bgColor);
  }

  // 初始化国际化语言仓库状态
  localeStore.initLocale();
}
