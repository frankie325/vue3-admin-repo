import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

import { createRouter, createWebHashHistory } from 'vue-router';

import { basicRoutes } from './routes';

// 创建路由
export const router = createRouter({
  history: createWebHashHistory(),
  routes: basicRoutes as unknown as RouteRecordRaw[],
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0, left: 0 };
  },
});

// 安装路由
export function setupRouter(app: App<Element>) {
  app.use(router);
}
