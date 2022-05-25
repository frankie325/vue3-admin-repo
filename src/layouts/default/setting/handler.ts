import { useAppStore } from '@/store/modules/app';
import { useRootSetting } from '@/hooks/setting/useRootSetting';

import { ProjectConfig } from '#/config';
import { HandlerEnum } from './enum';

import { updateDarkTheme } from '@/logics/theme/dark';
import { changeTheme } from '@/logics/theme';
import { updateHeaderBgColor } from '@/logics/theme/updateBackground';

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

  const { getThemeColor, getDarkMode } = useRootSetting();

  switch (event) {
    case HandlerEnum.CHANGE_LAYOUT:
      return {};
    // case HandlerEnum.CHANGE_THEME:
    //   return {};
    case HandlerEnum.CHANGE_THEME_COLOR:
      if (getThemeColor.value === value) {
        return {};
      }
      changeTheme(value);
      return { themeColor: value };

    case HandlerEnum.HEADER_THEME:
      updateHeaderBgColor(value);
      return { headerSetting: { bgColor: value } };
    default:
      return {};
  }
}
