import type { ProjectConfig } from '#/config';

import { useLocaleStore } from '@/store/modules/locale';
import { useAppStore } from '@/store/modules/app';
import { Persistent } from '@/utils/cache/persistent';
import { PROJ_CFG_KEY } from '@/enums/cacheEnum';
import { deepMerge } from '@/utils';
import projectSetting from '@/settings/projectSetting';
import { ThemeEnum } from '@/enums/appEnum';
import { updateDarkTheme } from './theme/drak';
/**
 * @description:  初始化pinia仓库状态
 */
export function initAppConfigStore() {
  const appStore = useAppStore();
  const localeStore = useLocaleStore();
  localeStore.initLocale();

  let projCfg: ProjectConfig = Persistent.getLocal(PROJ_CFG_KEY) as ProjectConfig;

  // 将默认的配置和本地存储的配置合并
  projCfg = deepMerge(projectSetting, projCfg || {});
  appStore.setProjectConfig(projCfg);

  // 初始化主题
  const darkMode = appStore.getDarkMode;
  updateDarkTheme(darkMode);

  if (darkMode === ThemeEnum.DARK) {
  } else {
  }
}
