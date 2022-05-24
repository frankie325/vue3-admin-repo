import type { AppRouteModule, AppRouteRecordRaw } from '@/router/types';
import type { Router, RouteRecordNormalized } from 'vue-router';

import { cloneDeep, omit } from 'lodash-es';

import { createRouter, createWebHashHistory } from 'vue-router';
import { getParentLayout, LAYOUT, EXCEPTION_COMPONENT } from '@/router/constant';
import { warn } from '@/utils/log';

export type LayoutMapKey = 'LAYOUT';
const IFRAME = () => import('@/views/sys/iframe/FrameBlank.vue');

const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

LayoutMap.set('LAYOUT', LAYOUT);
LayoutMap.set('IFRAME', IFRAME);

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

let dynamicViewsModules: Record<string, () => Promise<Recordable>>;

/**
 * @description: 转为动态导入vue组件
 */
function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<Recordable>>,
  component: string,
) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace('../../views', '');
    const startFlag = component.startsWith('/');
    const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
    const startIndex = startFlag ? 0 : 1;
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
    return k.substring(startIndex, lastIndex) === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  } else if (matchKeys?.length > 1) {
    warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure',
    );
    return;
  } else {
    warn('在src/views/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!');
    return EXCEPTION_COMPONENT;
  }
}

/**
 * @description: 为动态导入
 */
function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}');
  if (!routes) return;
  routes.forEach((item) => {
    // 如果存在meta.frameSrc，则转为内嵌页面
    if (!item.component && item.meta?.frameSrc) {
      item.component = 'IFRAME';
    }
    const { component, name } = item;
    const { children } = item;
    if (component) {
      const layoutFound = LayoutMap.get(component.toUpperCase());
      if (layoutFound) {
        item.component = layoutFound;
      } else {
        // 动态导入vue组件
        item.component = dynamicImport(dynamicViewsModules, component as string);
      }
    } else if (name) {
      item.component = getParentLayout();
    }
    children && asyncImportRoute(children);
  });
}

/**
 * @description: 根据后台返回的路由对象，生成路由表，怎么转化可以根据项目进行修改
 */
export function transformObjToRoute<T = AppRouteModule>(routeList: AppRouteModule[]): T[] {
  routeList.forEach((route) => {
    const component = route.component as string;
    if (component) {
      // 将component字段，转为异步导入形式
      if (component.toUpperCase() === 'LAYOUT') {
        route.component = LayoutMap.get(component.toUpperCase());
      } else {
        // 如果component不在框架内，则强制转为框架内
        route.children = [cloneDeep(route)]; //该route作为子route
        route.component = LAYOUT;
        route.name = `${route.name}Parent`;
        route.path = '';
        const meta = route.meta || {};
        meta.single = true; //标记为单级菜单
        meta.affix = false;
        route.meta = meta;
      }
    } else {
      warn('请正确配置路由：' + route?.name + '的component属性');
    }
    // 递归处理子节点，转为异步导入
    route.children && asyncImportRoute(route.children);
  });
  return routeList as unknown as T[];
}
