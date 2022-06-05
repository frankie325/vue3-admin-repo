import type { Router } from 'vue-router';

import { unref } from 'vue';
import { Modal, notification } from 'ant-design-vue';
import nProgress from 'nprogress';

import { useAppStoreWithOut } from '@/store/modules/app';
import { useUserStoreWithOut } from '@/store/modules/user';
import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting';
import { createPermissionGuard } from './permissionGuard';
import { createParamMenuGuard } from './paramMenuGuard';
import { createStateGuard } from './stateGuard';
import { setRouteChange } from '@/logics/mitt/routeChange';
import projectSetting from '@/settings/projectSetting';
import { warn } from '@/utils/log';
import { AxiosCanceler } from '@/utils/http/axios/axiosCancel';

// 注册路由导航守卫
export function setupRouterGuard(router: Router) {
  createPageGuard(router);
  createPageLoadingGuard(router);
  createHttpGuard(router);
  createMessageGuard(router);
  createProgressGuard(router);
  createPermissionGuard(router);
  createParamMenuGuard(router); // 必须在 createPermissionGuard 后面 (菜单已经生成)
  createStateGuard(router);
}

/**
 * @description  Layout和PageContent中用到
 */
function createPageGuard(router: Router) {
  const loadedPageMap = new Map<string, boolean>();

  router.beforeEach(async (to) => {
    to.meta.loaded = !!loadedPageMap.get(to.path);
    setRouteChange(to);

    return true;
  });

  router.afterEach((to) => {
    // 将路由存储，说明已经加载过该路由
    loadedPageMap.set(to.path, true);
  });
}

/**
 * @description 路由切换时，设置loading动画
 */
function createPageLoadingGuard(router: Router) {
  const userStore = useUserStoreWithOut();
  const appStore = useAppStoreWithOut();
  const { getOpenPageLoading } = useTransitionSetting();
  router.beforeEach(async (to) => {
    if (!userStore.getToken) {
      return true;
    }
    // 已经加载过的路由则不用loading动画了
    if (to.meta.loaded) {
      return true;
    }

    if (unref(getOpenPageLoading)) {
      appStore.setPageLoadingAction(true);
      return true;
    }

    return true;
  });

  router.afterEach(async () => {
    if (unref(getOpenPageLoading)) {
      // TODO Looking for a better way
      // 防止页面闪烁
      setTimeout(() => {
        appStore.setPageLoading(false);
      }, 220);
    }
    return true;
  });
}

/**
 * @description: 路由切换时，取消前一个路由页面的请求
 */
function createHttpGuard(router: Router) {
  const { removeAllHttpPending } = projectSetting;
  let axiosCanceler: Nullable<AxiosCanceler>;
  if (removeAllHttpPending) {
    axiosCanceler = new AxiosCanceler();
  }
  router.beforeEach(async () => {
    axiosCanceler?.removeAllPending();
    return true;
  });
}

/**
 * @description: 路由切换时，删除未关闭的 messages 和 notify
 */
export function createMessageGuard(router: Router) {
  const { closeMessageOnSwitch } = projectSetting;

  router.beforeEach(async () => {
    try {
      if (closeMessageOnSwitch) {
        Modal.destroyAll();
        notification.destroy();
      }
    } catch (error) {
      warn('message guard error:' + error);
    }
    return true;
  });
}

/**
 * @description: 顶部进度条
 */
export function createProgressGuard(router: Router) {
  const { getOpenNProgress } = useTransitionSetting();

  router.beforeEach(async (to) => {
    // 已经加载过则不用进度条了
    if (to.meta.loaded) {
      return true;
    }
    unref(getOpenNProgress) && nProgress.start();
    return true;
  });

  router.afterEach(async () => {
    unref(getOpenNProgress) && nProgress.done();
    return true;
  });
}
