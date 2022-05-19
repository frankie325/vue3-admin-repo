import { generateAntColors, primaryColor } from '../config/themeConfig';
import { getThemeVariables } from 'ant-design-vue/dist/theme';
import { resolve } from 'path';

/**
 * @description: 生成less全局变量
 * @param dark 生成ant design的暗色主题less变量，为false则为默认主题的变量
 */
export function generateModifyVars(dark = false) {
  const palettes = generateAntColors(primaryColor); // 生成主色系列
  const primary = palettes[5];

  const primaryColorObj: Record<string, string> = {};

  for (let index = 0; index < 10; index++) {
    primaryColorObj[`primary-${index + 1}`] = palettes[index];
  }

  // 获取ant design的所有全局变量
  const modifyVars = getThemeVariables({ dark });

  return {
    ...modifyVars,
    ...primaryColorObj,
    // Used for global import to avoid the need to import each style file separately
    // reference:  Avoid repeated references
    hack: `${modifyVars.hack} @import (reference) "${resolve('src/design/config.less')}";`, // 加载自定义变量
    'primary-color': primary,
    'info-color': primary,
    'processing-color': primary,
    'success-color': '#55D187', // 成功色
    'error-color': '#ED6F6F', // 错误色
    'warning-color': '#EFBD47', // 警告色
    'font-size-base': '14px', // 主字号
    'border-radius-base': '2px', // 组件/浮层圆角
    'link-color': primary, // 链接色
    'app-content-background': '#fafafa', //   Link color
  };
}
