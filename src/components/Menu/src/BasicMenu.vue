<template>
  <a-menu
    :mode="mode"
    :theme="theme"
    :class="getMenuClass"
    :subMenuOpenDelay="0.2"
    :selectedKeys="selectedKeys"
    :defaultSelectedKeys="defaultSelectedKeys"
    :openKeys="getOpenKeys"
    @click="handleMenuClick"
    @open-change="handleOpenChange"
    v-bind="getInlineCollapseOptions"
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
  import { isFunction } from '@/utils/is';
  import { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum';

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

      // 是否为顶部菜单
      const getIsTopMenu = computed(() => {
        const { type, mode } = props;

        return (
          (type === MenuTypeEnum.TOP_MENU && mode === MenuModeEnum.HORIZONTAL) ||
          (props.isHorizontal && unref(getSplit))
        );
      });

      const getMenuClass = computed(() => {
        // 菜单对齐方式
        const align = props.isHorizontal && unref(getSplit) ? 'start' : unref(getTopMenuAlign);
        return [
          prefixCls,
          `justify-${align}`,
          {
            [`${prefixCls}__second`]: !props.isHorizontal && unref(getSplit),
            [`${prefixCls}__sidebar-hor`]: unref(getIsTopMenu),
          },
        ];
      });

      const getInlineCollapseOptions = computed(() => {
        const isInline = props.mode === MenuModeEnum.INLINE;

        const inlineCollapseOptions: { inlineCollapsed?: boolean } = {};
        if (isInline) {
          inlineCollapseOptions.inlineCollapsed = props.mixSider ? false : unref(getCollapsed);
        }
        return inlineCollapseOptions;
      });

      !props.mixSider &&
        watch(
          () => props.items,
          () => {
            handleMenuChange();
          },
        );

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
        // 点击菜单后的路由跳转触发该方法，则不用往下执行
        if (unref(isClickGo)) {
          isClickGo.value = false;
          return;
        }

        const path =
          (route || unref(currentRoute)).meta?.currentActiveMenu ||
          (route || unref(currentRoute)).path;
        if (unref(currentActiveMenu)) return;

        if (props.isHorizontal && unref(getSplit)) {
          // 分隔菜单时，获取顶层父级路径即可
          const parentPath = await getCurrentParentPath(path);
          menuState.selectedKeys = [parentPath];
        } else {
          // 否则就是获取路径数组
          const parentPaths = await getAllParentPath(props.items, path);
          menuState.selectedKeys = parentPaths;
        }
      }

      // 点击菜单
      async function handleMenuClick({ key }: { key: string; keyPath: string[] }) {
        const { beforeClickFn } = props;
        if (beforeClickFn && isFunction(beforeClickFn)) {
          const flag = await beforeClickFn(key);
          if (!flag) return;
        }
        emit('menuClick', key);

        isClickGo.value = true;
        // 设置选中菜单
        menuState.selectedKeys = [key];
      }

      return {
        getMenuClass,
        getOpenKeys,
        getInlineCollapseOptions,
        ...toRefs(menuState),
        handleMenuClick,
        handleOpenChange,
      };
    },
  });
</script>

<style lang="less">
  @import './index.less';
</style>
