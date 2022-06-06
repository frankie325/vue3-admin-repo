import type { RouteRecordRaw } from 'vue-router';

import { intersection } from 'lodash-es';

import { useAppStore } from '@/store/modules/app';
import { usePermissionStore } from '@/store/modules/permission';
import { useUserStore } from '@/store/modules/user';
import { useTabs } from './useTabs';
import projectSetting from '@/settings/projectSetting';
import { router, resetRouter } from '@/router';
import { PermissionModeEnum } from '@/enums/appEnum';
import { RoleEnum } from '@/enums/roleEnum';
import { isArray } from '@/utils/is';
import { useMultipleTabStore } from '@/store/modules/multipleTab';

export function usePermission() {
  const userStore = useUserStore();
  const appStore = useAppStore();
  const permissionStore = usePermissionStore();
  const { closeAll } = useTabs(router);

  /**
   * @description: 权限变更后，重置路由
   */
  async function resume() {
    const tabStore = useMultipleTabStore();
    tabStore.clearCacheTabs();
    resetRouter(); // 重置路由
    const routes = await permissionStore.buildRoutesAction(); // 重新根据用户角色权限获取菜单
    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });
    permissionStore.setLastBuildMenuTime();
    closeAll(); // 重置tabList
  }

  /**
   * @description: ROUTE_MAPPING模式下修改用户角色权限
   */
  async function changeRole(roles: RoleEnum | RoleEnum[]): Promise<void> {
    if (projectSetting.permissionMode !== PermissionModeEnum.ROUTE_MAPPING) {
      throw new Error(
        'Please switch PermissionModeEnum to ROUTE_MAPPING mode in the configuration to operate!',
      );
    }

    if (!isArray(roles)) {
      roles = [roles];
    }

    // 重新设置权限列表
    userStore.setRoleList(roles);
    await resume();
  }

  /**
   * @description: 判断是否拥有权限
   */
  function hasPermission(value?: RoleEnum | RoleEnum[] | string | string[], def = true): boolean {
    if (!value) {
      return def;
    }

    const permMode = projectSetting.permissionMode;

    if ([PermissionModeEnum.ROUTE_MAPPING, PermissionModeEnum.ROLE].includes(permMode)) {
      if (!isArray(value)) {
        return userStore.getRoleList?.includes(value as RoleEnum);
      }
      return (intersection(value, userStore.getRoleList) as RoleEnum[]).length > 0;
    }

    // 后端模式
    if (PermissionModeEnum.BACK === permMode) {
      const allCodeList = permissionStore.getPermCodeList as string[];
      if (!isArray(value)) {
        return allCodeList.includes(value);
      }
      return (intersection(value, allCodeList) as string[]).length > 0;
    }
    return true;
  }

  async function refreshMenu() {
    resume();
  }

  return {
    changeRole,
    hasPermission,
    refreshMenu,
  };
}
