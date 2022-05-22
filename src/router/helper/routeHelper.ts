import type { AppRouteModule, AppRouteRecordRaw } from '@/router/types';
import type { Router, RouteRecordNormalized } from 'vue-router';

import { cloneDeep, omit } from 'lodash-es';

import { createRouter, createWebHashHistory } from 'vue-router';

/**
 * @description: 将多层级路由转成二级路由
 */
export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
  const modules: AppRouteModule[] = cloneDeep(routeModules);
  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index];
    if (!isMultipleRoute(routeModule)) {
      continue;
    }
    // 当嵌套层级大于等于3时
    promoteRouteLevel(routeModule);
  }
  return modules;
}

/**
 * @description: 将多层级路由转成二级路由
 */
function promoteRouteLevel(routeModule: AppRouteModule) {
  // 创建router实例，可以调用getRoutes方法可以获得扁平化的路由表
  let router: Router | null = createRouter({
    routes: [routeModule as unknown as RouteRecordNormalized],
    history: createWebHashHistory(),
  });

  // 获取所有扁平化的路由表
  const routes = router.getRoutes();
  addToChildren(routes, routeModule.children || [], routeModule);
  router = null;

  // 删除第二级路由的children
  routeModule.children = routeModule.children?.map((item) => omit(item, 'children'));
}

/**
 * @description: 将第三层级后的路由转到二级路由上
 */
function addToChildren(
  routes: RouteRecordNormalized[],
  children: AppRouteRecordRaw[],
  routeModule: AppRouteModule,
) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find((item) => item.name === child.name);
    if (!route) {
      continue;
    }
    // routeModule.children一直为第二级的路由
    routeModule.children = routeModule.children || [];

    if (!routeModule.children.find((item) => item.name === route.name)) {
      // 添加到第二级路由
      routeModule.children?.push(route as unknown as AppRouteModule);
    }
    if (child.children?.length) {
      // 继续递归
      addToChildren(routes, child.children, routeModule);
    }
  }
}

/**
 * @description: 是否为嵌套路由，层级大于等于3时成立
 */
function isMultipleRoute(routeModule: AppRouteModule) {
  // children长度为0，则不是
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }

  const children = routeModule.children;

  // children里面又有children则返回true
  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}
