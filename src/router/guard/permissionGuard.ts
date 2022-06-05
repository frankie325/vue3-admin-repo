import type { Router, RouteRecordRaw } from 'vue-router';

import { useUserStoreWithOut } from '@/store/modules/user';
import { PageEnum } from '@/enums/pageEnum';
import { RootRoute } from '@/router/routes';
import { usePermissionStoreWithOut } from '@/store/modules/permission';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';

// 根路由路径"/"
const ROOT_PATH = RootRoute.path;

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const whitePathList: PageEnum[] = [LOGIN_PATH];

/**
 * @description: 页面路由跳转拦截
 */
export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut();
  const permissionStore = usePermissionStoreWithOut();

  router.beforeEach(async (to, from, next) => {
    // console.log(from, to);

    // 当从根路由跳转到默认首页路由时，且当前登录用户信息的首页路由和默认首页路由不一致时，则跳转到用户信息的首页
    if (
      from.path === ROOT_PATH &&
      to.path === PageEnum.BASE_HOME &&
      userStore.getUserInfo.homePath &&
      userStore.getUserInfo.homePath !== PageEnum.BASE_HOME
    ) {
      next(userStore.getUserInfo.homePath);
      return;
    }

    const token = userStore.getToken;

    if (whitePathList.includes(to.path as PageEnum)) {
      // 如果跳到登录页，且token存在
      if (to.path === LOGIN_PATH && token) {
        const isSessionTimeout = userStore.getSessionTimeout;
        try {
          await userStore.afterLoginAction();
          if (!isSessionTimeout) {
            next((to.query?.redirect as string) || '/');
            return;
          }
        } catch {}
      }
      next();
      return;
    }

    // 如果token不存在，跳到登录页
    if (!token) {
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      };

      if (to.path) {
        // 将原来本要跳转的地址保存在query参数中
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }

      next(redirectData);
      return;
    }
    // 下面都是token存在的情况

    // 登录之后如果跳转的是404页面，则跳转值首页
    if (
      from.path === LOGIN_PATH &&
      to.name === PAGE_NOT_FOUND_ROUTE.name &&
      to.fullPath !== (userStore.getUserInfo.homePath || PageEnum.BASE_HOME)
    ) {
      next(userStore.getUserInfo.homePath || PageEnum.BASE_HOME);
      return;
    }

    // 打开新页面时 lastUpdateTime为0
    if (userStore.getLastUpdateTime === 0) {
      try {
        await userStore.getUserInfoAction();
      } catch (err) {
        next();
        return;
      }
    }

    // 动态添加路由后的跳转，直接通过
    if (permissionStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    // 走到这里说明是新窗口页面，还没有动态添加路由
    const routes = await permissionStore.buildRoutesAction();

    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });

    router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);

    permissionStore.setDynamicAddedRoute(true);

    if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
      // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      next({ path: to.fullPath, replace: true, query: to.query });
    } else {
      const redirectPath = (from.query.redirect || to.path) as string;
      const redirect = decodeURIComponent(redirectPath);
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
      next(nextData);
    }
  });
}
