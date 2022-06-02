import { getThemeColors, generateColors } from '../../../build/config/themeConfig';
import { mixLighten, mixDarken, tinycolor } from 'vite-plugin-theme/es/colorUtils';
import { replaceStyleVariables } from 'vite-plugin-theme/es/client';

/**
 * @description: 切换系统主题
 */
export async function changeTheme(color: string) {
  const colors = generateColors({
    mixDarken,
    mixLighten,
    tinycolor,
    color,
  });

  return await replaceStyleVariables({
    colorVariables: [...getThemeColors(color), ...colors],
    // colorVariables: [...getThemeColors(color)],
  });
}
