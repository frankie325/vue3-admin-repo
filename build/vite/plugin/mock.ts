/**
 * https://github.com/anncwb/vite-plugin-mock
 */

import { viteMockServe } from 'vite-plugin-mock';

export function configMockPlugin(isBuild: boolean) {
  return viteMockServe({
    mockPath: 'mock', // 存放模拟数据的文件夹
    ignore: /^\_/, // 忽略以_（下划线）开头的文件
    localEnabled: !isBuild, //设置为false将禁用mock功能，不要在生产环境中打开它
    prodEnabled: isBuild, // 是否在生产环境下使用mock功能
    // 如果在生产环境使用了mock功能，则会在mani.js底部添加该代码
    injectCode: `
      import { setupProdMockServer } from '../mock/_createProductionServer';

      setupProdMockServer();
      `,
  });
}
