import type { Menu } from '@/router/types';
import type { Ref } from 'vue';

import { watch, unref, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import { MenuSplitTyeEnum } from '@/enums/menuEnum';
import { usePermissionStore } from '@/store/modules/permission';
import { useAppInject } from '@/hooks/web/useAppInject';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { getChildrenMenus, getCurrentParentPath, getMenus, getShallowMenus } from '@/router/menus';
import { useThrottleFn } from '@vueuse/core';

export function useSplitMenu(splitType: Ref<MenuSplitTyeEnum>) {
  const menusRef = ref<Menu[]>([]); // 分割的菜单列表
  // 当前路由地址
  const { currentRoute } = useRouter();
  const { getIsMobile } = useAppInject();
  const { setMenuSetting, getIsHorizontal, getSplit } = useMenuSetting();
  const permissionStore = usePermissionStore();

  const throttleHandleSplitLeftMenu = useThrottleFn(handleSplitLeftMenu, 50);

  // 菜单分隔类型不是LEFT且为不为顶部菜单模式
  const splitNotLeft = computed(
    () => unref(splitType) !== MenuSplitTyeEnum.LEFT && !unref(getIsHorizontal),
  );

  // 不分割菜单且菜单分隔类型不是LEFT
  const getSplitLeft = computed(
    () => !unref(getSplit) || unref(splitType) !== MenuSplitTyeEnum.LEFT,
  );

  // 分割菜单类型为TOP
  const getSpiltTop = computed(() => unref(splitType) === MenuSplitTyeEnum.TOP);

  // 没有分割菜单
  const normalType = computed(() => {
    return unref(splitType) === MenuSplitTyeEnum.NONE || !unref(getSplit);
  });

  // 监听当前路由的变化和分割菜单类型的变化
  watch(
    [() => unref(currentRoute).path, () => unref(splitType)],
    async ([path]: [string, MenuSplitTyeEnum]) => {
      if (unref(splitNotLeft) || unref(getIsMobile)) return;

      const { meta } = unref(currentRoute);
      const currentActiveMenu = meta.currentActiveMenu as string; //用户设置的当前路由的激活菜单
      let parentPath = await getCurrentParentPath(path);
      if (!parentPath) {
        parentPath = await getCurrentParentPath(currentActiveMenu); // 当前路由的顶层父级找不到，尝试用户设置的激活菜单
      }
      parentPath && throttleHandleSplitLeftMenu(parentPath);
    },
    {
      immediate: true,
    },
  );

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

  // 分割菜单类型变化
  watch(
    () => getSplit.value,
    () => {
      if (unref(splitNotLeft)) return;
      genMenus();
    },
  );

  async function handleSplitLeftMenu(parentPath: string) {
    if (unref(getSplitLeft) || unref(getIsMobile)) return;

    const children = await getChildrenMenus(parentPath); //获取子菜单

    if (!children || !children.length) {
      // 如果子菜单没有，则隐藏左侧菜单
      setMenuSetting({ hidden: true });
      menusRef.value = [];
      return;
    }

    // 左侧菜单展示子菜单数据
    setMenuSetting({ hidden: false });
    menusRef.value = children;
  }
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
