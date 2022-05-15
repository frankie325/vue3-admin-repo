import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { resolve } from 'path';

function pathResolve(relativePath: string) {
  return resolve(process.cwd(), relativePath);
}

// https://vitejs.dev/config/
export default defineConfig({
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
});
