import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';

import { configThemePlugin } from './theme';
import { configMockPlugin } from './mock';
import purgeIcons from 'vite-plugin-purge-icons';
import { configSvgIconsPlugin } from './svgSprite';
import { configHtmlPlugin } from './html';
import { configCompressPlugin } from './compress';
import { configPwaConfig } from './pwa';
import { configVisualizerConfig } from './visualizer';
import { configImageminPlugin } from './imagemin';

/**
 * @description: 使用vite插件
 */
export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const {
    VITE_USE_MOCK,
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
    VITE_USE_IMAGEMIN,
  } = viteEnv;

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

  // 打包分析插件
  vitePlugins.push(configVisualizerConfig());

  if (isBuild) {
    // 图片压缩插件
    VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin());

    // 文件压缩插件
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE),
    );

    // pwa插件
    vitePlugins.push(configPwaConfig(viteEnv));
  }

  return vitePlugins;
}
