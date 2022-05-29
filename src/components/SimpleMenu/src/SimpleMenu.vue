<template>
  <Menu
    v-bind="getBindValues"
    :activeName="activeName"
    :openNames="getOpenKeys"
    :class="prefixCls"
    :activeSubMenuNames="activeSubMenuNames"
    @select="handleSelect"
  >
    <template v-for="item in items" :key="item.path">
      <SimpleSubMenu
        :item="item"
        :parent="true"
        :collapsedShowTitle="collapsedShowTitle"
        :collapse="collapse"
      />
    </template>
  </Menu>
</template>

<script lang="ts">
  import type { PropType } from 'vue';
  import type { Menu as MenuType } from '@/router/types';
  import type { MenuState } from './types';
  import type { RouteLocationNormalizedLoaded } from 'vue-router';

  import { defineComponent, computed, ref, unref, reactive, toRefs, watch } from 'vue';
  import { propTypes } from '@/utils/propTypes';

  import Menu from './components/Menu.vue';
  import SimpleSubMenu from './SimpleSubMenu.vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { isFunction, isUrl } from '@/utils/is';
  import { openWindow } from '@/utils';
  import { useOpenKeys } from './useOpenKeys';
  import { useRouter } from 'vue-router';
  import { listenerRouteChange } from '@/logics/mitt/routeChange';
  import { REDIRECT_NAME } from '@/router/constant';

  export default defineComponent({
    name: 'SimpleMenu',
    components: {
      Menu,
      SimpleSubMenu,
    },
    props: {
      items: {
        type: Array as PropType<MenuType[]>,
        default: () => [],
      },
      collapse: propTypes.bool,
      mixSider: propTypes.bool,
      theme: propTypes.string,
      accordion: propTypes.bool.def(true),
      collapsedShowTitle: propTypes.bool,
      beforeClickFn: {
        type: Function as PropType<(key: string) => Promise<boolean>>,
      },
      isSplitMenu: propTypes.bool,
    },
    emits: ['menuClick'],
    setup(props, { attrs, emit }) {
      const { prefixCls } = useDesign('simple-menu');

      const currentActiveMenu = ref('');
      const isClickGo = ref(false);

      const menuState = reactive<MenuState>({
        activeName: '', //当前激活的菜单path
        openNames: [], // 展开的菜单path
        activeSubMenuNames: [],
      });

      const { currentRoute } = useRouter();

      // 类似$attrs
      const getBindValues = computed(() => ({ ...attrs, ...props }));
      const { items, accordion, mixSider, collapse } = toRefs(props);

      const { setOpenKeys, getOpenKeys } = useOpenKeys(
        menuState,
        items,
        accordion,
        mixSider,
        collapse,
      );

      // 监听菜单折叠
      watch(
        () => props.collapse,
        (collapse) => {
          if (collapse) {
            // 折叠时，展开菜单为空
            menuState.openNames = [];
          } else {
            setOpenKeys(currentRoute.value.path);
          }
        },
        { immediate: true }, // 初始化时设置currentRoute
      );

      // 监听所有菜单变化
      watch(
        () => props.items,
        () => {
          if (!props.isSplitMenu) {
            return;
          }
          setOpenKeys(currentRoute.value.path);
        },
        { flush: 'post' },
      );

      /**
       * @description: 监听路由的跳转，设置激活时的菜单，（第一次加载也会触发该回调）
       * @param route 为目标路由
       */
      listenerRouteChange((route) => {
        if (route.name === REDIRECT_NAME) return;

        //meta.currentActiveMenu可以设置激活的菜单
        currentActiveMenu.value = route.meta?.currentActiveMenu as string;
        handleMenuChange(route);

        //如果meta.currentActiveMenu有值，则使用用户定义的激活菜单
        if (unref(currentActiveMenu)) {
          menuState.activeName = unref(currentActiveMenu);
          setOpenKeys(unref(currentActiveMenu));
        }
      });

      /**
       * @description: 设置激活菜单
       */
      async function handleMenuChange(route?: RouteLocationNormalizedLoaded) {
        // 如果时点击菜单的跳转则不用重复设置，handleSelect中已经设置过了
        if (unref(isClickGo)) {
          isClickGo.value = false;
          return;
        }

        // 直接在浏览器输入引起的路由变化时
        const path = (route || unref(currentRoute)).path;

        menuState.activeName = path;

        setOpenKeys(path);
      }

      // 选中子菜单触发
      async function handleSelect(key: string) {
        if (isUrl(key)) {
          openWindow(key);
          return;
        }
        const { beforeClickFn } = props;
        if (beforeClickFn && isFunction(beforeClickFn)) {
          const flag = await beforeClickFn(key);
          if (!flag) return;
        }

        emit('menuClick', key); //路由跳转

        isClickGo.value = true;
        setOpenKeys(key);
        menuState.activeName = key;
      }

      return {
        prefixCls,
        getBindValues,
        getOpenKeys,
        ...toRefs(menuState),
        handleSelect,
      };
    },
  });
</script>

<style lang="less">
  @import './index.less';
</style>
