import type { AppRouteRecordRaw } from '@/router/types';

import { LAYOUT } from '@/router/constant';

// 错误收集页面路由
export const ERROR_LOG_ROUTE: AppRouteRecordRaw = {
  path: '/error-log',
  name: 'ErrorLog',
  component: LAYOUT,
  redirect: '/error-log/list',
  meta: {
    title: 'ErrorLog',
    hideBreadcrumb: true,
    hideChildrenInMenu: true,
  },
  children: [
    // {
    //   path: 'list',
    //   name: 'ErrorLogList',
    //   component: () => import('@/views/sys/error-log/index.vue'),
    //   meta: {
    //     title: t('routes.basic.errorLogList'),
    //     hideBreadcrumb: true,
    //     currentActiveMenu: '/error-log',
    //   },
    // },
  ],
};
