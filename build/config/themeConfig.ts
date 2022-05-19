import { generate } from '@ant-design/colors';

// 系统默认主题的主色
export const primaryColor = '#1890ff';

export const darkMode = 'light';

type GenerateTheme = 'default' | 'dark';

// https://ant.design/docs/spec/colors-cn#%E4%BC%81%E4%B8%9A%E7%BA%A7%E4%BA%A7%E5%93%81%E8%AE%BE%E8%AE%A1%E4%B8%AD%E7%9A%84%E8%89%B2%E5%BD%A9%E5%BA%94%E7%94%A8
/**
 * @description: ant-design颜色生成方法，由1个颜色衍生成10个不同的色彩
 * @param theme 不同主题生成的颜色不一样
 */
export function generateAntColors(color: string, theme: GenerateTheme = 'default') {
  return generate(color, {
    theme,
  });
}

// 一个解决临时检查的方法类型
type Fn = (...arg: any) => any;

export interface GenerateColorsParams {
  mixLighten: Fn;
  mixDarken: Fn;
  tinycolor: any;
  color?: string;
}

/**
 * @description: 生成系统主题的主色，共20个
 * @param color 不同系统主题的主色
 */
export function getThemeColors(color?: string) {
  const tc = color || primaryColor;
  const lightColors = generateAntColors(tc); //生成默认模式的主色
  const primary = lightColors[5];
  const modeColors = generateAntColors(primary, 'dark'); //生成暗黑模式的主色

  return [...lightColors, ...modeColors];
}

export function generateColors({
  color = primaryColor,
  mixLighten,
  mixDarken,
  tinycolor,
}: GenerateColorsParams) {
  const arr = new Array(19).fill(0);
  const lightens = arr.map((_t, i) => {
    return mixLighten(color, i / 5);
  });

  const darkens = arr.map((_t, i) => {
    return mixDarken(color, i / 5);
  });

  const alphaColors = arr.map((_t, i) => {
    return tinycolor(color)
      .setAlpha(i / 20)
      .toRgbString();
  });

  const shortAlphaColors = alphaColors.map((item) => item.replace(/\s/g, '').replace(/0\./g, '.'));

  const tinycolorLightens = arr
    .map((_t, i) => {
      return tinycolor(color)
        .lighten(i * 5)
        .toHexString();
    })
    .filter((item) => item !== '#ffffff');

  const tinycolorDarkens = arr
    .map((_t, i) => {
      return tinycolor(color)
        .darken(i * 5)
        .toHexString();
    })
    .filter((item) => item !== '#000000');
  return [
    ...lightens,
    ...darkens,
    ...alphaColors,
    ...shortAlphaColors,
    ...tinycolorDarkens,
    ...tinycolorLightens,
  ].filter((item) => !item.includes('-'));
}
