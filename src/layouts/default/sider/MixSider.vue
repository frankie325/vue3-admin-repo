<template>
  <div :class="`${prefixCls}-dom`" :style="getDomStyle"></div>
  <div
    :style="getWrapStyle"
    :class="[
      prefixCls,
      getMenuTheme,
      {
        open: openMenu,
        mini: getCollapsed,
      },
    ]"
    v-click-outside="handleClickOutside"
    v-bind="getMenuEvents"
  >
    <AppLogo :showTitle="false" :class="`${prefixCls}-logo`" />

    <LayoutTrigger :class="`${prefixCls}-trigger`" />

    <ScrollContainer>
      <ul :class="`${prefixCls}-module`">
        <li
          :class="[
            `${prefixCls}-module__item `,
            {
              [`${prefixCls}-module__item--active`]: item.path === activePath,
            },
          ]"
          v-for="item in menuModules"
          :key="item.path"
          v-bind="getItemEvents(item)"
        >
          <SimpleMenuTag :item="item" collapseParent dot />
          <Icon
            :class="`${prefixCls}-module__icon`"
            :size="getCollapsed ? 16 : 20"
            :icon="item.icon || (item.meta && item.meta.icon)"
          />
          <p :class="`${prefixCls}-module__name`">
            {{ t(item.name) }}
          </p>
        </li>
      </ul>
    </ScrollContainer>

    <div :class="`${prefixCls}-menu-list`" ref="sideRef" :style="getMenuStyle">
      <div
        v-show="openMenu"
        :class="[
          `${prefixCls}-menu-list__title`,
          {
            show: openMenu,
          },
        ]"
      >
        <span class="text"> {{ title }}</span>
        <Icon
          :size="16"
          :icon="getMixSideFixed ? 'ri:pushpin-2-fill' : 'ri:pushpin-2-line'"
          class="pushpin"
          @click="handleFixedMenu"
        />
      </div>
      <ScrollContainer :class="`${prefixCls}-menu-list__content`">
        <SimpleMenu
          :items="childrenMenus"
          :theme="getMenuTheme"
          mixSider
          @menu-click="handleMenuClick"
        />
      </ScrollContainer>
      <div
        v-show="getShowDragBar && openMenu"
        :class="`${prefixCls}-drag-bar`"
        ref="dragBarRef"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
  import type { Menu } from '@/router/types';
  import type { RouteLocationNormalized } from 'vue-router';

  import { computed, defineComponent, ref, unref, CSSProperties, watch, onMounted } from 'vue';
  import { ScrollContainer } from '@/components/Container';
  import { AppLogo } from '@/components/Application';
  import LayoutTrigger from '../trigger/index.vue';
  import { SimpleMenu, SimpleMenuTag } from '@/components/SimpleMenu';
  import { Icon } from '@/components/Icon';

  import { useI18n } from '@/hooks/web/useI18n';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { useGlobSetting } from '@/hooks/setting';
  import { usePermissionStore } from '@/store/modules/permission';
  import { useGo } from '@/hooks/web/usePage';
  import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '@/enums/appEnum';
  import { getChildrenMenus, getCurrentParentPath, getShallowMenus } from '@/router/menus';
  import { listenerRouteChange } from '@/logics/mitt/routeChange';
  import clickOutside from '@/directives/clickOutside';
  import { useDragLine } from './useLayoutSider';

  export default defineComponent({
    name: 'LayoutMixSider',
    components: {
      ScrollContainer,
      AppLogo,
      LayoutTrigger,
      SimpleMenu,
      SimpleMenuTag,
      Icon,
    },
    directives: {
      clickOutside,
    },
    setup() {
      let menuModules = ref<Menu[]>([]);
      const childrenMenus = ref<Menu[]>([]); // 子菜单
      const openMenu = ref(false); // 控制混合菜单的显示
      const activePath = ref(''); // 激活的菜单
      const currentRoute = ref<Nullable<RouteLocationNormalized>>(null);
      const dragBarRef = ref<ElRef>(null);
      const sideRef = ref<ElRef>(null);
      const { prefixCls } = useDesign('layout-mix-sider');
      const { title } = useGlobSetting();
      const permissionStore = usePermissionStore();

      const {
        getMenuWidth,
        mixSideHasChildren,
        getMixSideFixed,
        getRealWidth,
        getCollapsed,
        getMenuTheme,
        getCloseMixSidebarOnChange,
        getMixSideTrigger,
        getIsMixSidebar,
        getCanDrag,
        setMenuSetting,
      } = useMenuSetting();
      const { t } = useI18n();
      const go = useGo();

      // 拖拽以修改菜单容器宽度
      useDragLine(sideRef, dragBarRef, true);

      // 混合菜单是否固定
      const getIsFixed = computed(() => {
        /* eslint-disable-next-line */
        mixSideHasChildren.value = unref(childrenMenus).length > 0; //子菜单长度大于0才需要
        const isFixed = unref(getMixSideFixed) && unref(mixSideHasChildren);
        if (isFixed) {
          /* eslint-disable-next-line */
          openMenu.value = true;
        }
        return isFixed;
      });

      // 混合菜单折叠时和不折叠时的宽度，
      const getMixSideWidth = computed(() => {
        return unref(getCollapsed) ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH;
      });

      function getWrapCommonStyle(width: string): CSSProperties {
        return {
          width,
          maxWidth: width,
          minWidth: width,
          flex: `0 0 ${width}`,
        };
      }

      // 占位div的样式
      const getDomStyle = computed((): CSSProperties => {
        // 如果混合菜单固定，则需要加上菜单的宽度
        const fixedWidth = unref(getIsFixed) ? unref(getRealWidth) : 0;
        const width = `${unref(getMixSideWidth) + fixedWidth}px`;
        return getWrapCommonStyle(width);
      });

      const getWrapStyle = computed((): CSSProperties => {
        const width = `${unref(getMixSideWidth)}px`;
        return getWrapCommonStyle(width);
      });

      const getMenuStyle = computed((): CSSProperties => {
        return {
          width: unref(openMenu) ? `${unref(getMenuWidth)}px` : 0,
          left: `${unref(getMixSideWidth)}px`,
        };
      });

      // 鼠标移出时，关闭混合菜单
      const getMenuEvents = computed(() => {
        return !unref(getMixSideFixed)
          ? {
              onMouseleave: () => {
                setActive(true);
                closeMenu();
              },
            }
          : {};
      });

      // 菜单变化时更新
      watch(
        [() => permissionStore.getLastBuildMenuTime, () => permissionStore.getBackMenuList],
        async () => {
          menuModules.value = await getShallowMenus();
        },
        {
          immediate: true,
        },
      );

      // 菜单是否可以拖动延伸
      const getShowDragBar = computed(() => unref(getCanDrag));

      async function setActive(setChildren = false) {
        const path = currentRoute.value?.path;
        if (!path) return;
        // 设置激活的菜单，为父级路径
        activePath.value = await getCurrentParentPath(path);
        if (unref(getIsMixSidebar)) {
          const activeMenu = unref(menuModules).find((item) => item.path === unref(activePath));
          const p = activeMenu?.path;
          if (p) {
            const children = await getChildrenMenus(p);
            if (setChildren) {
              // 设置子菜单
              childrenMenus.value = children;

              // 固定混合菜单时，有子菜单才会展开
              if (unref(getMixSideFixed)) {
                openMenu.value = children.length > 0;
              }
            }

            if (children.length === 0) {
              childrenMenus.value = [];
            }
          }
        }
      }

      // 首次加载和当前路由变化时触发
      listenerRouteChange((route) => {
        currentRoute.value = route;
        setActive(true);
        if (unref(getCloseMixSidebarOnChange)) {
          closeMenu();
        }
      });

      function getItemEvents(item: Menu) {
        // 悬浮展开菜单时
        if (unref(getMixSideTrigger) === 'hover') {
          return {
            onMouseenter: () => handleModuleClick(item.path, true),
            onClick: async () => {
              const children = await getChildrenMenus(item.path);
              if (item.path && (!children || children.length === 0)) go(item.path);
            },
          };
        }
        // 点击展开菜单时
        return {
          onClick: () => handleModuleClick(item.path),
        };
      }

      async function handleModuleClick(path: string, hover = false) {
        const children = await getChildrenMenus(path);

        if (unref(activePath) === path) {
          //当前激活菜单和选择的菜单相等时
          if (!hover) {
            //点击时
            if (!unref(openMenu)) {
              openMenu.value = true;
            } else {
              closeMenu();
            }
          } else {
            // 悬浮时
            if (!unref(openMenu)) {
              openMenu.value = true;
            }
          }
        } else {
          openMenu.value = true;
          activePath.value = path;
        }

        // 如果子菜单没有时，直接跳转路由
        if (!children || children.length === 0) {
          if (!hover) go(path);
          childrenMenus.value = [];
          closeMenu();
          return;
        }
        childrenMenus.value = children;
      }

      // 固定混合菜单
      function handleFixedMenu() {
        setMenuSetting({
          mixSideFixed: !unref(getIsFixed),
        });
      }

      function handleMenuClick(path: string) {
        go(path);
      }

      function handleClickOutside() {
        setActive(true);
        closeMenu();
      }

      // 关闭菜单
      function closeMenu() {
        if (!unref(getIsFixed)) {
          openMenu.value = false;
        }
      }
      onMounted(async () => {
        menuModules.value = await getShallowMenus();
      });
      return {
        title,
        prefixCls,
        getWrapStyle,
        getMenuStyle,
        getDomStyle,
        getMenuTheme,
        menuModules,
        activePath,
        getCollapsed,
        openMenu,
        getMixSideFixed,
        childrenMenus: childrenMenus,
        getShowDragBar,
        sideRef,
        dragBarRef,
        t,
        getMenuEvents,
        getItemEvents,
        handleFixedMenu,
        handleMenuClick,
        handleClickOutside,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-mix-sider';
  @width: 80px;
  .@{prefix-cls} {
    position: fixed;
    top: 0;
    left: 0;
    z-index: @layout-mix-sider-fixed-z-index;
    height: 100%;
    overflow: hidden;
    background-color: @sider-dark-bg-color;
    transition: all 0.2s ease 0s;

    &-dom {
      height: 100%;
      overflow: hidden;
      transition: all 0.2s ease 0s;
    }

    &-logo {
      display: flex;
      height: @header-height;
      padding-left: 0 !important;
      justify-content: center;

      img {
        width: @logo-width;
        height: @logo-width;
      }
    }

    &-trigger {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      font-size: 14px;
      color: rgb(255 255 255 / 65%);
      text-align: center;
      cursor: pointer;
      background-color: @trigger-dark-bg-color;
      height: 36px;
      line-height: 36px;
    }

    &.light &-trigger {
      color: rgb(0 0 0 / 65%);
      background-color: #fff;
      border-top: 1px solid #eee;
    }

    // 滚动区域的高度
    > .scrollbar {
      height: calc(100% - @header-height - 38px);
    }

    &-module {
      position: relative;
      padding-top: 1px;

      &__item {
        position: relative;
        padding: 12px 0;
        color: rgb(255 255 255 / 65%);
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          color: @white;
        }
        // &:hover,
        &--active {
          font-weight: 700;
          color: @white;
          background-color: @sider-dark-darken-bg-color;

          &::before {
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            background-color: @primary-color;
            content: '';
          }
        }
      }

      &__icon {
        margin-bottom: 8px;
        font-size: 24px;
        transition: all 0.2s;
      }

      &__name {
        margin-bottom: 0;
        padding: 0 6px;
        font-size: 12px;
        transition: all 0.2s;
      }
    }

    &-menu-list {
      position: fixed;
      top: 0;
      width: 200px;
      height: calc(100%);
      background-color: #fff;
      transition: all 0.2s;

      &__title {
        display: flex;
        height: @header-height;
        // margin-left: -6px;
        font-size: 18px;
        color: @primary-color;
        border-bottom: 1px solid rgb(238 238 238);
        opacity: 0%;
        transition: unset;
        align-items: center;
        justify-content: space-between;

        &.show {
          min-width: 130px;
          opacity: 100%;
          transition: all 0.5s ease;
        }

        .pushpin {
          margin-right: 6px;
          color: rgb(255 255 255 / 65%);
          cursor: pointer;

          &:hover {
            color: #fff;
          }
        }
      }

      &__content {
        height: calc(100% - @header-height) !important;

        .scrollbar__wrap {
          height: 100%;
          overflow-x: hidden;
        }

        .scrollbar__bar.is-horizontal {
          display: none;
        }

        .ant-menu {
          height: 100%;
        }

        .ant-menu-inline,
        .ant-menu-vertical,
        .ant-menu-vertical-left {
          border-right: 1px solid transparent;
        }
      }
    }

    // 黑暗模式切换下的样式
    &.light {
      .@{prefix-cls}-logo {
        border-bottom: 1px solid rgb(238 238 238);
      }

      &.open {
        > .scrollbar {
          border-right: 1px solid rgb(238 238 238);
        }
      }

      .@{prefix-cls}-module {
        &__item {
          font-weight: normal;
          color: rgb(0 0 0 / 65%);

          &--active {
            color: @primary-color;
            background-color: unset;
          }
        }
      }
      .@{prefix-cls}-menu-list {
        &__content {
          box-shadow: 0 0 4px 0 rgb(0 0 0 / 10%);
        }

        &__title {
          .pushpin {
            color: rgb(0 0 0 / 35%);

            &:hover {
              color: rgb(0 0 0 / 85%);
            }
          }
        }
      }
    }
    @border-color: @sider-dark-lighten-bg-color;
    &.dark {
      &.open {
        .@{prefix-cls}-logo {
          // border-bottom: 1px solid @border-color;
        }

        > .scrollbar {
          border-right: 1px solid @border-color;
        }
      }
      .@{prefix-cls}-menu-list {
        background-color: @sider-dark-bg-color;

        &__title {
          color: @white;
          border-bottom: none;
          border-bottom: 1px solid @border-color;
        }
      }
    }

    &-drag-bar {
      position: absolute;
      top: 50px;
      right: -1px;
      width: 1px;
      height: calc(100% - 50px);
      cursor: ew-resize;
      background-color: #f8f8f9;
      border-top: none;
      border-bottom: none;
      box-shadow: 0 0 4px 0 rgb(28 36 56 / 15%);
    }
  }
</style>
