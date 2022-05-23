import type { Router } from 'vue-router';

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

  router.beforeEach((to, from, next) => {
    console.log(from, to);
    console.log(userStore);

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
      if (to.path === LOGIN_PATH && token) {
      }
      next();
      return;
    }

    if (!token) {
      // 如果token不存在，跳到登录页
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

    if (
      from.path === LOGIN_PATH &&
      to.name === PAGE_NOT_FOUND_ROUTE.name &&
      to.fullPath !== (userStore.getUserInfo.homePath || PageEnum.BASE_HOME)
    ) {
    }

    // 动态添加路由后的跳转，直接通过
    if (permissionStore.getIsDynamicAddedRoute) {
      next();
      return;
    }
  });
}
