import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';

import { configThemePlugin } from './theme';
import { configMockPlugin } from './mock';
import purgeIcons from 'vite-plugin-purge-icons';
import { configSvgIconsPlugin } from './svgSprite';
import { configHtmlPlugin } from './html';

/**
 * @description: 使用vite插件
 */
export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_USE_MOCK, VITE_LEGACY } = viteEnv;

  const vitePlugins: (PluginOption | PluginOption[])[] = [vue(), vueJsx()];

  // 兼容低版本浏览器插件
  VITE_LEGACY && isBuild && vitePlugins.push(legacy());

  // html插件
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // 更换主题功能插件
  vitePlugins.push(configThemePlugin(isBuild));

  // svg雪碧图插件
  vitePlugins.push(configSvgIconsPlugin(isBuild));

  // mock模拟数据请求插件
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild));

  // iconify插件
  vitePlugins.push(purgeIcons());

  return vitePlugins;
}
