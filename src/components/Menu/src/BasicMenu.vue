<template>
  <a-menu
    :mode="mode"
    :theme="theme"
    :selectedKeys="selectedKeys"
    :defaultSelectedKeys="defaultSelectedKeys"
  >
    <template v-for="item in items" :key="item.path">
      <BasicSubMenuItem :item="item" :theme="theme" :isHorizontal="isHorizontal" />
    </template>
  </a-menu>
</template>
<script lang="ts">
  import type { MenuState } from './types';
  import { computed, defineComponent, unref, reactive, watch, toRefs, ref } from 'vue';
  import { RouteLocationNormalizedLoaded, useRouter } from 'vue-router';

  import BasicSubMenuItem from './components/BasicSubMenuItem.vue';

  import { basicProps } from './props';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

  import { REDIRECT_NAME } from '@/router/constant';
  import { listenerRouteChange } from '@/logics/mitt/routeChange';
  import { useOpenKeys } from './useOpenKeys';
  import { getCurrentParentPath } from '@/router/menus';
  import { getAllParentPath } from '@/router/helper/menuHelper';

  export default defineComponent({
    name: 'BasicMenu',
    components: {
      BasicSubMenuItem,
    },
    props: basicProps,
    emits: ['menuClick'],
    setup(props, { emit }) {
      const { prefixCls } = useDesign('basic-menu');
      const isClickGo = ref(false);
      const currentActiveMenu = ref('');
      const { currentRoute } = useRouter();
      const { getCollapsed, getTopMenuAlign, getSplit } = useMenuSetting();

      const { items, mode, accordion } = toRefs(props);

      const menuState = reactive<MenuState>({
        defaultSelectedKeys: [],
        openKeys: [],
        selectedKeys: [],
        collapsedOpenKeys: [],
      });

      const { handleOpenChange, setOpenKeys, getOpenKeys } = useOpenKeys(
        menuState,
        items,
        mode as any,
        accordion,
      );

      // 首次加载和路由变化时触发
      listenerRouteChange((route) => {
        if (route.name === REDIRECT_NAME) return;
        handleMenuChange(route);
        // 如果用户设置了激活菜单
        currentActiveMenu.value = route.meta?.currentActiveMenu as string;

        if (unref(currentActiveMenu)) {
          menuState.selectedKeys = [unref(currentActiveMenu)];
          setOpenKeys(unref(currentActiveMenu));
        }
      });

      async function handleMenuChange(route?: RouteLocationNormalizedLoaded) {
        if (unref(isClickGo)) {
          isClickGo.value = false;
          return;
        }

        const path =
          (route || unref(currentRoute)).meta?.currentActiveMenu ||
          (route || unref(currentRoute)).path;
        if (unref(currentActiveMenu)) return;

        if (props.isHorizontal && unref(getSplit)) {
          const parentPath = await getCurrentParentPath(path);
          menuState.selectedKeys = [parentPath];
        } else {
          const parentPaths = await getAllParentPath(props.items, path);
          menuState.selectedKeys = parentPaths;
        }
      }

      return {
        ...toRefs(menuState),
      };
    },
  });
</script>
