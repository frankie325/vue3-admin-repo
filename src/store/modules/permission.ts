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
import { flatMultiLevelRoutes, transformObjToRoute } from '@/router/helper/routeHelper';
import { transformRouteToMenu } from '@/router/helper/menuHelper';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { getMenuList } from '@/api/sys/menu';
import { getPermCode } from '@/api/sys/user';
import { useMessage } from '@/hooks/web/useMessage';

interface PermissionState {
  // 后台动态获取的权限列表，与roleList模式一致
  permCodeList: string[] | number[];
  // 是否动态添加路由
  isDynamicAddedRoute: boolean;
  // 菜单最新的更新时间
  lastBuildMenuTime: number;
  // 后台动态获取路由生成的菜单
  backMenuList: Menu[];
  // 前端写死路由生成的菜单
  frontMenuList: Menu[];
}
export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [],
    isDynamicAddedRoute: false,
    lastBuildMenuTime: 0,
    backMenuList: [],
    frontMenuList: [],
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList;
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList;
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },
    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list;
    },
    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    async changePermissionCode() {
      const codeList = await getPermCode();
      this.setPermCodeList(codeList);
    },
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

      /**
       * @description: 过滤忽略的路由
       */
      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { ignoreRoute } = meta || {};
        return !ignoreRoute;
      };

      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {};

      switch (permissionMode) {
        // 1.前端写死路由
        case PermissionModeEnum.ROLE:
          routes = filter(asyncRoutes, routeFilter); //对嵌套层级过滤
          routes = routes.filter(routeFilter);
          routes = flatMultiLevelRoutes(routes); //将多层级路由转成二级路由
          break;

        // 2.前端写死路由并生成菜单
        case PermissionModeEnum.ROUTE_MAPPING:
          routes = filter(asyncRoutes, routeFilter);
          routes = routes.filter(routeFilter);
          const menuList = transformRouteToMenu(routes, true); // 根据路由表做一些数据处理，生成菜单
          routes = filter(routes, routeRemoveIgnoreFilter);
          routes = routes.filter(routeRemoveIgnoreFilter);

          // 根据meta.orderNo对路由进行排序
          menuList.sort((a, b) => {
            return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
          });

          this.setFrontMenuList(menuList);
          routes = flatMultiLevelRoutes(routes); //将多层级路由转成二级路由
          break;

        // 3.后台动态获取路由
        case PermissionModeEnum.BACK:
          const { createMessage } = useMessage();

          createMessage.loading({
            content: t('sys.app.menuLoading'),
            duration: 1,
          });

          let routeList: AppRouteRecordRaw[] = [];
          try {
            // 模拟后台权限获取，根据权限筛选路由，可以根据项目情况而定，可以后台处理也可以前端处理
            this.changePermissionCode();
            routeList = (await getMenuList()) as AppRouteRecordRaw[];
          } catch (error) {
            console.error(error);
          }

          routeList = transformObjToRoute(routeList); // 根据后台返回的路由对象，生成路由表

          const backMenuList = transformRouteToMenu(routeList); //据路由表做一些数据处理，生成菜单
          this.setBackMenuList(backMenuList);

          routeList = filter(routeList, routeRemoveIgnoreFilter);
          routeList = routeList.filter(routeRemoveIgnoreFilter);

          routeList = flatMultiLevelRoutes(routeList); //将多层级路由转成二级路由
          routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
          break;
      }

      routes.push(ERROR_LOG_ROUTE);
      patchHomeAffix(routes);
      return routes;
    },
  },
});

export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
