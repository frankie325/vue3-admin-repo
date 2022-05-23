import type { MenuModule, Menu, AppRouteRecordRaw } from '@/router/types';
import { AppRouteModule } from '@/router/types';

import { cloneDeep } from 'lodash-es';

import { findPath, treeMap } from '@/utils/helper/treeHelper';
import { isUrl } from '@/utils/is';
import { getParentLayout, LAYOUT, EXCEPTION_COMPONENT } from '@/router/constant';
import { warn } from '@/utils/log';

export type LayoutMapKey = 'LAYOUT';
const IFRAME = () => import('@/views/sys/iframe/FrameBlank.vue');

const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

LayoutMap.set('LAYOUT', LAYOUT);
LayoutMap.set('IFRAME', IFRAME);

/**
 * @description: 处理菜单的path，和父级路径进行拼接
 */
function joinParentPath(menus: Menu[], parentPath = '') {
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index];
    if (!(menu.path.startsWith('/') || isUrl(menu.path))) {
      // 当子路由为相对路径 或者 不是url链接，则会拼接上父级的path，也就是完整路径
      menu.path = `${parentPath}/${menu.path}`;
    }
    if (menu?.children?.length) {
      // 递归处理子路由，hidePathForChildren表示拼接path时是否跳过该路由
      joinParentPath(menu.children, menu.meta?.hidePathForChildren ? parentPath : menu.path);
    }
  }
}

/**
 * @description: 根据路由表做一些数据处理，生成菜单
 */
export function transformRouteToMenu(routeModList: AppRouteModule[], routerMapping = false) {
  const cloneRouteModList = cloneDeep(routeModList);
  const routeList: AppRouteRecordRaw[] = [];

  cloneRouteModList.forEach((item) => {
    if (routerMapping && item.meta.hideChildrenInMenu && typeof item.redirect === 'string') {
      // hideChildrenInMenu为true，隐藏所有子菜单，将path设置为redirect的值
      item.path = item.redirect;
    }
    if (item.meta?.single) {
      // meta.single为true，将首个子路由进行添加
      const realItem = item?.children?.[0];
      realItem && routeList.push(realItem);
    } else {
      routeList.push(item);
    }
  });

  const list = treeMap(routeList, {
    // 生成菜单
    conversion: (node: AppRouteRecordRaw) => {
      const { meta: { title, hideMenu = false } = {} } = node;

      return {
        ...(node.meta || {}),
        meta: node.meta,
        name: title,
        hideMenu,
        path: node.path,
        ...(node.redirect ? { redirect: node.redirect } : {}),
      };
    },
  });

  // 处理菜单的path
  joinParentPath(list);
  return cloneDeep(list);
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
