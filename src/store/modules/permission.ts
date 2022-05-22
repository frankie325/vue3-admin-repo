import type { AppRouteRecordRaw, Menu } from '@/router/types';

import { toRaw } from 'vue';
import { defineStore } from 'pinia';

import { store } from '@/store';
import { useI18n } from '@/hooks/web/useI18n';
import { useUserStore } from './user';
import { useAppStoreWithOut } from './app';

import projectSetting from '@/settings/projectSetting';
import { PermissionModeEnum } from '@/enums/appEnum';
import { asyncRoutes } from '@/router/routes';
import { filter } from '@/utils/helper/treeHelper';
import { flatMultiLevelRoutes } from '@/router/helper/routeHelper';
import { ERROR_LOG_ROUTE } from '@/router/routes/basic';
import { transformRouteToMenu } from '@/router/helper/menuHelper';

interface PermissionState {
  // Permission code list
  permCodeList: string[] | number[];
  // 是否动态添加路由
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  lastBuildMenuTime: number;
  // Backstage menu list
  backMenuList: Menu[];
  frontMenuList: Menu[];
}
export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [],
    isDynamicAddedRoute: false,
    // To trigger a menu update
    lastBuildMenuTime: 0,
    // Backstage menu list
    backMenuList: [],
    // menu List
    frontMenuList: [],
  }),
  actions: {
    async buildRoutesAction() {
      const { t } = useI18n();
      const userStore = useUserStore();
      const appStore = useAppStoreWithOut();

      let routes: AppRouteRecordRaw[] = [];
      const roleList = toRaw(userStore.getRoleList) || [];

      const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig;

      /**
       * @description: 根据当前用户角色信息过滤路由
       */
      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { roles } = meta || {}; // 路由的角色信息，也就是该路由拥有的权限
        if (!roles) return true; //如果没有权限字段，则不需要权限
        // 该路由的权限只要有一个存在于当前用户的角色信息里，则该路由满足权限
        return roleList.some((role) => (roles as string[]).includes(role));
      };

      switch (permissionMode) {
        case PermissionModeEnum.ROLE:
          routes = filter(asyncRoutes, routeFilter); //对嵌套层级过滤
          routes = routes.filter(routeFilter);
          routes = flatMultiLevelRoutes(routes); //将多层级路由转成二级路由
          break;

        case PermissionModeEnum.ROUTE_MAPPING:
          debugger;
          routes = filter(asyncRoutes, routeFilter);
          routes = routes.filter(routeFilter);
          const menuList = transformRouteToMenu(routes, true);
          break;

        case PermissionModeEnum.BACK:
          break;
      }

      routes.push(ERROR_LOG_ROUTE);
    },
  },
});

export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
