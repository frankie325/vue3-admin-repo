import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { configThemePlugin } from './theme';
import { configMockPlugin } from './mock';

/**
 * @description: 使用vite插件
 */
export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_USE_MOCK } = viteEnv;

  const vitePlugins: (PluginOption | PluginOption[])[] = [vue(), vueJsx()];

  // 更换主题功能插件
  vitePlugins.push(configThemePlugin(isBuild));
  // mock模拟数据请求插件
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild));

  return vitePlugins;
}
