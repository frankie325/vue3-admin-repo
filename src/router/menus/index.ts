import type { Menu, MenuModule } from '@/router/types';
import type { RouteRecordNormalized } from 'vue-router';

import { useAppStoreWithOut } from '@/store/modules/app';
import { usePermissionStore } from '@/store/modules/permission';
import { transformMenuModule, getAllParentPath } from '@/router/helper/menuHelper';
import { filter } from '@/utils/helper/treeHelper';
import { isUrl } from '@/utils/is';
import { router } from '@/router';
import { PermissionModeEnum } from '@/enums/appEnum';
import { pathToRegexp } from 'path-to-regexp';

// 导入静态的菜单 menus/modules/下的文件，暂时没有
const modules = import.meta.globEager('./modules/**/*.ts');

const menuModules: MenuModule[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  menuModules.push(...modList);
});

const staticMenus: Menu[] = [];
(() => {
  menuModules.sort((a, b) => {
    return (a.orderNo || 0) - (b.orderNo || 0);
  });

  for (const menu of menuModules) {
    staticMenus.push(transformMenuModule(menu));
  }
})();

// ===========================
// ==========Helper===========
// ===========================

const getPermissionMode = () => {
  const appStore = useAppStoreWithOut();
  return appStore.getProjectConfig.permissionMode;
};
const isBackMode = () => {
  return getPermissionMode() === PermissionModeEnum.BACK;
};

const isRouteMappingMode = () => {
  return getPermissionMode() === PermissionModeEnum.ROUTE_MAPPING;
};

const isRoleMode = () => {
  return getPermissionMode() === PermissionModeEnum.ROLE;
};

/**
 * @description: 根据权限模式获取菜单
 */
async function getAsyncMenus() {
  const permissionStore = usePermissionStore();
  // BACK模式
  if (isBackMode()) {
    return permissionStore.getBackMenuList.filter((item) => !item.meta?.hideMenu && !item.hideMenu); // 过滤隐藏的菜单
  }
  // ROUTE_MAPPING模式
  if (isRouteMappingMode()) {
    return permissionStore.getFrontMenuList.filter((item) => !item.hideMenu);
  }
  // ROLE模式则返回静态菜单
  return staticMenus;
}

/**
 * @description: 获取菜单
 */
export const getMenus = async (): Promise<Menu[]> => {
  const menus = await getAsyncMenus();

  // ROLE模式对菜单进行筛选
  if (isRoleMode()) {
    const routes = router.getRoutes();
    return filter(menus, basicFilter(routes));
  }
  return menus;
};

/**
 * @description: 获取顶层父级路径
 */
export async function getCurrentParentPath(currentPath: string) {
  const menus = await getAsyncMenus();
  const allParentPath = await getAllParentPath(menus, currentPath);
  return allParentPath?.[0];
}

/**
 * @description: 只获取一级菜单
 */
export async function getShallowMenus(): Promise<Menu[]> {
  const menus = await getAsyncMenus();
  const shallowMenuList = menus.map((item) => ({ ...item, children: undefined }));
  if (isRoleMode()) {
    const routes = router.getRoutes();
    return shallowMenuList.filter(basicFilter(routes));
  }
  return shallowMenuList;
}

/**
 * @description: 获取子菜单
 */
export async function getChildrenMenus(parentPath: string) {
  const menus = await getMenus();
  const parent = menus.find((item) => item.path === parentPath);
  if (!parent || !parent.children || !!parent?.meta?.hideChildrenInMenu) {
    return [] as Menu[];
  }
  if (isRoleMode()) {
    const routes = router.getRoutes();
    return filter(parent.children, basicFilter(routes));
  }
  return parent.children;
}

/**
 * @description: 如果是ROLE模式，则需要将生成的静态菜单与路由表对比，不满足条件的菜单不会生成
 */
function basicFilter(routes: RouteRecordNormalized[]) {
  return (menu: Menu) => {
    // 从路由表找到菜单对应的路由
    const matchRoute = routes.find((route) => {
      if (isUrl(menu.path)) return true; //菜单是url，则筛选出来

      if (route.meta?.carryParam) {
        return pathToRegexp(route.path).test(menu.path); //携带参数的path相等，则筛选出来
      }
      const isSame = route.path === menu.path; //path相等，则筛选出来
      if (!isSame) return false;

      if (route.meta?.ignoreAuth) return true;

      return isSame || pathToRegexp(route.path).test(menu.path);
    });

    if (!matchRoute) return false; // 没找到，就过滤该菜单
    menu.icon = (menu.icon || matchRoute.meta.icon) as string;
    menu.meta = matchRoute.meta;
    return true;
  };
}
