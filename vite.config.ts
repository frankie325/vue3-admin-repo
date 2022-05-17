import type { ConfigEnv, UserConfig } from 'vite';
import { resolve } from 'path';
import { loadEnv } from 'vite';

import vue from '@vitejs/plugin-vue';
import { wrapperEnv } from './build/vite/utils';
import { createVitePlugins } from './build/vite/plugin';

function pathResolve(relativePath: string) {
  return resolve(process.cwd(), relativePath);
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  // loadEnv能够获取对应环境时，.env文件中的环境变量
  const env = loadEnv(mode, root);
  // console.log(mode);
  // console.log(env);
  // 获取项目环境变量
  const viteEnv = wrapperEnv(env);

  const isBuild = command === 'build'; //是否为生产环境

  createVitePlugins(viteEnv, isBuild);

  return {
    plugins: [vue()],
    resolve: {
      alias: [
        // 关闭使用vue-i18n.esm-bundle.js的警告
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/index',
        },
        {
          find: '@',
          replacement: pathResolve('src'),
        },
        {
          find: '#',
          replacement: pathResolve('types'),
        },
      ],
    },
  };
};
