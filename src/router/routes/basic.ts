import type { AppRouteRecordRaw } from '@/router/types';
import { t } from '@/hooks/web/useI18n';

import { REDIRECT_NAME, LAYOUT, EXCEPTION_COMPONENT, PAGE_NOT_FOUND_NAME } from '@/router/constant';

// 404页面路由
export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: PAGE_NOT_FOUND_NAME,
  component: LAYOUT,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: PAGE_NOT_FOUND_NAME,
      component: EXCEPTION_COMPONENT,
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
  ],
};

// 重定向页面路由
export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: '/redirect',
  component: LAYOUT,
  name: 'RedirectTo',
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: REDIRECT_NAME,
      component: () => import('@/views/sys/redirect/index.vue'),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
      },
    },
  ],
};

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
    {
      path: 'list',
      name: 'ErrorLogList',
      component: () => import('@/views/sys/error-log/index.vue'),
      meta: {
        title: t('routes.basic.errorLogList'),
        hideBreadcrumb: true,
        currentActiveMenu: '/error-log',
      },
    },
  ],
};
