import type { MenuModule, Menu, AppRouteRecordRaw } from '@/router/types';
import { AppRouteModule } from '@/router/types';

import { cloneDeep } from 'lodash-es';
import { findPath, treeMap } from '@/utils/helper/treeHelper';
import { isUrl } from '@/utils/is';

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
