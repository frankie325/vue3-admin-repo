import type { Menu } from '@/router/types';
import type { Ref } from 'vue';

import { watch, unref, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import { MenuSplitTyeEnum } from '@/enums/menuEnum';
import { usePermissionStore } from '@/store/modules/permission';
import { useAppInject } from '@/hooks/web/useAppInject';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { getChildrenMenus, getCurrentParentPath, getMenus, getShallowMenus } from '@/router/menus';

export function useSplitMenu(splitType: Ref<MenuSplitTyeEnum>) {
  const menusRef = ref<Menu[]>([]);
  // 当前路由地址
  const { currentRoute } = useRouter();
  const { getIsMobile } = useAppInject();
  const { setMenuSetting, getIsHorizontal, getSplit } = useMenuSetting();
  const permissionStore = usePermissionStore();

  // 分割菜单类型为TOP
  const getSpiltTop = computed(() => unref(splitType) === MenuSplitTyeEnum.TOP);

  // 没有分割菜单
  const normalType = computed(() => {
    return unref(splitType) === MenuSplitTyeEnum.NONE || !unref(getSplit);
  });

  // 菜单变化时更新
  watch(
    [() => permissionStore.getLastBuildMenuTime, () => permissionStore.getBackMenuList],
    () => {
      genMenus();
    },
    {
      immediate: true,
    },
  );
  /**
   * @description: 生成菜单
   */
  async function genMenus() {
    // 没有分割菜单或者移动端时，正常返回菜单
    if (unref(normalType) || unref(getIsMobile)) {
      menusRef.value = await getMenus();
    }

    // 分割菜单类型为TOP，只获取一级菜单
    if (unref(getSpiltTop)) {
      const shallowMenus = await getShallowMenus();

      menusRef.value = shallowMenus;
      return;
    }
  }
  return { menusRef };
}
