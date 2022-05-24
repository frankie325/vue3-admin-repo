import type { ConfigEnv, UserConfig } from 'vite';
import { resolve } from 'path';
import { loadEnv } from 'vite';

import { wrapperEnv } from './build/vite/utils';
import { createVitePlugins } from './build/vite/plugin';
import { generateModifyVars } from './build/generate/generateModifyVars';
import { createProxy } from './build/vite/proxy';
function pathResolve(relativePath: string) {
  return resolve(process.cwd(), relativePath);
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  // loadEnv能够获取对应环境时，.env文件中的环境变量
  const env = loadEnv(mode, root);

  // 获取项目环境变量
  const viteEnv = wrapperEnv(env);

  const { VITE_PORT, VITE_PROXY } = viteEnv;

  const isBuild = command === 'build'; //是否为生产环境

  return {
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
    plugins: createVitePlugins(viteEnv, isBuild),
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(), // 引入less全局变量
          javascriptEnabled: true, //在js文件能够直接引入less样式文件
        },
      },
    },
    server: {
      // https: true,
      host: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
    },
  };
};
